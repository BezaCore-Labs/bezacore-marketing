// Rate limiting for the public form endpoints (#525).
//
// THREAT: /api/contact and /api/waitlist each call Resend on every accepted
// POST. Unthrottled, anyone can burn the Resend quota and flood the inbox.
// The `company` honeypot only deters naive bots — it is a single field a
// deliberate abuser simply leaves blank.
//
// TWO LAYERS, because they defend different things:
//
//   GLOBAL — a ceiling on total sends per window, regardless of caller. This
//            is the layer that actually protects the quota: it never looks at
//            who is calling, so it cannot be sidestepped by rotating IPs or
//            forging headers.
//   PER-IP — a smaller per-caller budget, so a single abuser cannot eat the
//            whole global allowance and lock out real visitors.
//
// A per-IP limit ALONE would not satisfy this ticket: anyone with a proxy pool
// walks straight through it. The global cap is the guarantee; the per-IP cap
// is the courtesy.
//
// STATE LIVES IN MODULE MEMORY, so it is per container instance: the true
// ceiling is (limit x running instances) and it resets on cold start. That is
// an accepted trade — Upstash/Firestore would put an external dependency in
// the request path of the page whose entire job is letting clients reach us,
// and Cloud Armor would require fronting the service with an external HTTPS
// load balancer this service does not have.
//
// ⚠️ BE HONEST ABOUT WHAT THIS DOES NOT DO. The service runs maxScale=20 at
// concurrency 80, so an attacker who sustains ~1,600 concurrent requests can
// force scale-out and multiply the global ceiling by up to 20. In-memory
// limiting fundamentally cannot bound sends ACROSS instances — only shared
// state or an edge policy can. What this does guarantee:
//
//   * a single-source flood is stopped dead (the overwhelmingly likely case)
//   * per-instance damage is bounded and predictable
//   * worst-case total is bounded and known, rather than unlimited
//
// GLOBAL_MAX is therefore set well below what the site's real traffic needs,
// so that even the 20x amplified worst case stays survivable. Lowering the
// service's --max-instances instead would be the wrong trade: it would
// throttle the whole site during a legitimate traffic spike, which is exactly
// what the build-in-public strategy exists to cause. If sustained distributed
// abuse ever actually happens, the answer is Cloud Armor, not a smaller
// number here.

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const PER_IP_MAX = 5;

// 12 per 10 min from the ENTIRE internet. The site takes a handful of contact
// submissions a week, so this is heavy headroom for real traffic while
// capping the amplified worst case at 12 x 20 = 240 per window instead of 600.
const GLOBAL_MAX = 12;

// Hard cap on tracked IPs. Without this, a flood of unique addresses would
// itself become the attack: unbounded Map growth until the instance OOMs.
const MAX_TRACKED_IPS = 10_000;

const ipBuckets = new Map<string, Bucket>();
let globalBucket: Bucket = { count: 0, resetAt: 0 };

// Google Front End / load balancer source ranges — 35.191.0.0/16 and
// 130.211.0.0/22. These are the addresses Google's own infrastructure adds to
// X-Forwarded-For, and so the only entries we are entitled to discard from the
// right-hand end of the chain.
function isGoogleInfra(ip: string): boolean {
  if (ip.startsWith("35.191.")) return true;
  if (!ip.startsWith("130.211.")) return false;
  // 130.211.0.0/22 == 130.211.0.* through 130.211.3.*
  const third = Number(ip.split(".")[2]);
  return Number.isInteger(third) && third >= 0 && third <= 3;
}

/**
 * Resolve the caller's IP from X-Forwarded-For.
 *
 * ⚠️ The near-universal `xff.split(",")[0]` is WRONG here and silently defeats
 * the whole limiter. X-Forwarded-For is a client-supplied list, and Google's
 * frontend APPENDS to whatever the caller sent rather than replacing it, so
 * the header arrives as:
 *
 *     <anything the attacker typed>, <real client ip>, <lb ip>
 *      ^ taking [0] reads the attacker's own string, handing them a fresh
 *        bucket per request by incrementing a fake address
 *
 * The trustworthy end is the RIGHT — only entries Google appended. We discard
 * trailing Google-infrastructure addresses and take the rightmost thing left,
 * which yields the real client IP whether or not an external load balancer is
 * in front (with an LB the chain ends `..., client, lb`; on a direct domain
 * mapping it ends `..., client`). Nothing to the left is ever trusted.
 */
export function clientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return null;

  const chain = xff
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (let i = chain.length - 1; i >= 0; i--) {
    if (!isGoogleInfra(chain[i])) return chain[i];
  }
  return null;
}

// Roll an elapsed window over before it is read or written. Kept separate from
// the allowance check so a bucket can be inspected without being charged.
function roll(bucket: Bucket, now: number): void {
  if (now >= bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }
}

function hasRoom(bucket: Bucket, max: number): boolean {
  return bucket.count < max;
}

// Drop buckets whose window has already elapsed. Called on each check, which
// is cheap at this traffic level and keeps the Map from accreting.
function sweep(now: number): void {
  for (const [key, bucket] of ipBuckets) {
    if (now >= bucket.resetAt) ipBuckets.delete(key);
  }
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

/**
 * Consume one unit of send budget. Call this immediately before sending —
 * AFTER the honeypot and validation checks — so that requests which would
 * never have reached Resend do not spend a real visitor's allowance.
 *
 * Fails closed: a request whose IP cannot be resolved still counts against
 * the global ceiling, so an unparseable header buys nothing.
 */
export function consumeSendBudget(req: Request): RateLimitResult {
  const now = Date.now();

  // TWO-PHASE ON PURPOSE: check every applicable limit first, and only charge
  // them once ALL of them pass. Charging the global counter before the per-IP
  // check would let one blocked abuser drain the global allowance while being
  // refused — the exact lockout the per-IP layer exists to prevent. A rejected
  // request must cost nothing.
  roll(globalBucket, now);
  if (!hasRoom(globalBucket, GLOBAL_MAX)) {
    return { allowed: false, retryAfterSeconds: retryAfter(globalBucket, now) };
  }

  const ip = clientIp(req);

  // Unknown IP: the global ceiling is the only applicable limit, so a stripped
  // or unparseable header buys nothing.
  if (!ip) {
    globalBucket.count++;
    return { allowed: true };
  }

  sweep(now);

  let bucket = ipBuckets.get(ip);
  if (!bucket) {
    // At capacity with every bucket still live: refuse rather than grow, and
    // charge nothing.
    if (ipBuckets.size >= MAX_TRACKED_IPS) {
      return { allowed: false, retryAfterSeconds: WINDOW_MS / 1000 };
    }
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    ipBuckets.set(ip, bucket);
  }

  roll(bucket, now);
  if (!hasRoom(bucket, PER_IP_MAX)) {
    return { allowed: false, retryAfterSeconds: retryAfter(bucket, now) };
  }

  // Both limits have room — commit to both together.
  globalBucket.count++;
  bucket.count++;
  return { allowed: true };
}

function retryAfter(bucket: Bucket, now: number): number {
  return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
}

/** 429 with a Retry-After header, so clients can back off honestly. */
export function tooManyRequests(retryAfterSeconds: number): Response {
  return Response.json(
    { ok: false, error: "rate_limited" },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

// Test seam: reset all counters. Not used by the running server.
export function __resetRateLimitState(): void {
  ipBuckets.clear();
  globalBucket = { count: 0, resetAt: 0 };
}

export const __limits = { WINDOW_MS, PER_IP_MAX, GLOBAL_MAX, MAX_TRACKED_IPS };
