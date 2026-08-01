/**
 * Assert that every post we expect to be live on a syndication channel is STILL live.
 *
 * WHY THIS EXISTS (#568): on 2026-07-26 post #1 was published to Hashnode and its
 * canonical was verified in the editor. Some time later Hashnode's AutoMod flagged and
 * REMOVED it, with no notification of any kind. Nobody noticed for four days, and every
 * doc and memory recorded the channel as healthy the entire time.
 *
 * The lesson is narrow and worth stating exactly: a publish-time green light is not
 * durable. Channels retract content silently, after the fact. Only a repeated check
 * catches that, and only if it is still trusted when it fires.
 *
 * WHICH IS WHY IT DIFFS AGAINST AN INTENDED BASELINE, NOT PARITY. Backfill was cancelled
 * permanently on 2026-07-30, so several posts are absent from several channels on
 * purpose. A checker assuming every post belongs everywhere would report four standing
 * false alarms forever, get ignored within a month, and then hide the next real removal
 * in its own noise. Expectations live in content/syndication.json, one cell per
 * post x channel, every absence carrying its reason.
 *
 * FAILURE IS NOT THE ONLY WAY THIS GOES WRONG. The check also fails when a blog post is
 * missing from the manifest, because a manifest that silently stops covering new posts
 * reports "all clear" about a shrinking fraction of reality.
 *
 *   pnpm check:channels
 *
 * Exits non-zero if anything needs attention. No credentials required -- every endpoint
 * is public.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_FEED = "https://bezacore.com/feed.xml";
const SITE = "bezacore.com";

const problems = [];
const notes = [];

const fail = (msg) => problems.push(msg);
const note = (msg) => notes.push(msg);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * A channel we cannot reach is a channel we cannot vouch for, so an unreachable endpoint
 * FAILS -- "the check didn't run" must never look like "fine".
 *
 * But it retries transient errors first, and that is not politeness. A checker that goes
 * red on one network hiccup gets muted, and a muted checker is how the next real removal
 * goes unnoticed for four days. Alert fatigue is the specific failure this whole script
 * exists to prevent, so flakiness is a correctness bug here, not an annoyance.
 *
 * Network errors, 5xx and 429 are retried. A definitive 4xx is NOT -- a 404 on a
 * publication feed is a real signal about that channel, not a blip to paper over.
 */
async function fetchText(url, label, maxAttempts = 3) {
  let last = "";
  let tried = 0;
  for (let i = 1; i <= maxAttempts; i++) {
    tried = i;
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "bezacore-channel-check/1.0 (+https://bezacore.com)" },
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) return await res.text();

      last = `HTTP ${res.status}`;
      // A definitive 4xx is a real signal about the channel, not a blip to paper over.
      if (!(res.status >= 500 || res.status === 429)) break;
    } catch (err) {
      last = err.message;
    }
    if (i < maxAttempts) await sleep(i * 1500);
  }
  // Report the attempts actually made. An alert that misstates what it did is an alert
  // nobody can reason from.
  const detail = tried === 1 ? last : `${last}, ${tried} attempts`;
  fail(`${label}: could not verify this channel (${detail})`);
  return null;
}

/** Slugs of posts currently published on the canonical blog. */
function blogSlugs(xml) {
  return [...xml.matchAll(new RegExp(`${SITE}/blog/([a-z0-9-]+)`, "g"))].map((m) => m[1]);
}

/**
 * Did this post make it onto this channel?
 *
 * Preferred evidence is our own canonical URL appearing in the channel's payload —
 * unambiguous, and immune to a title being edited on the far side. Title matching is
 * the fallback, and is reported as weaker so a channel quietly losing its canonicals
 * shows up as a change in evidence quality rather than passing silently.
 */
function findPost(body, post) {
  if (body.includes(`${SITE}/blog/${post.slug}`)) return "canonical";
  if (post.title && body.includes(post.title)) return "title-only";
  return null;
}

// CHANNEL_MANIFEST overrides the expectations file. Used to prove this checker can go
// RED — a green run against reality is worthless until you have watched it fail.
const manifestPath = process.env.CHANNEL_MANIFEST ?? join(ROOT, "content/syndication.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const { channels, posts } = manifest;
const channelKeys = Object.keys(channels);

// --- Canonical source of truth: what is actually on the blog right now. -------------
const feedXml = await fetchText(BLOG_FEED, "bezacore.com/feed.xml");
if (feedXml) {
  const live = new Set(blogSlugs(feedXml));
  const tracked = new Set(posts.map((p) => p.slug));

  for (const slug of live) {
    if (!tracked.has(slug)) {
      fail(
        `manifest: blog post "${slug}" is live but absent from content/syndication.json — ` +
          `add it with a cell per channel, or this checker silently stops covering it`,
      );
    }
  }
  for (const slug of tracked) {
    if (!live.has(slug)) {
      note(`manifest lists "${slug}" but it is not in the blog feed — post unpublished or renamed?`);
    }
  }
}

// --- Fetch every channel once. ------------------------------------------------------
const bodies = {};
await Promise.all(
  channelKeys.map(async (key) => {
    bodies[key] = await fetchText(channels[key].endpoint, channels[key].label);
  }),
);

// --- Build the grid: rows are posts, columns are channels. --------------------------
// A list has no empty slots, so a missing cell is invisible in one. A grid on the two
// generating axes makes every gap a hole you can see.
const rows = [];
for (const post of posts) {
  const row = { post, cells: {} };
  for (const key of channelKeys) {
    const expectation = post.channels?.[key];
    const body = bodies[key];

    if (expectation === undefined) {
      fail(`manifest: "${post.slug}" has no cell for channel "${key}"`);
      row.cells[key] = { mark: "?", state: "unspecified" };
      continue;
    }
    if (body === null) {
      row.cells[key] = { mark: "!", state: "unverified" };
      continue;
    }

    const found = findPost(body, post);
    const shouldBePresent = expectation === "present";

    if (shouldBePresent && !found) {
      fail(
        `${channels[key].label}: "${post.title}" is EXPECTED LIVE but was not found. ` +
          `This is the Hashnode failure mode — check whether it was removed.`,
      );
      row.cells[key] = { mark: "X", state: "missing" };
    } else if (shouldBePresent && found) {
      if (found === "title-only") {
        note(
          `${channels[key].label}: "${post.title}" matched on TITLE only — the canonical ` +
            `URL no longer appears in this channel's payload. Worth checking the canonical survived.`,
        );
      }
      row.cells[key] = { mark: found === "canonical" ? "o" : "~", state: "present" };
    } else if (!shouldBePresent && found) {
      note(
        `${channels[key].label}: "${post.title}" is present but the manifest records it as ` +
          `absent (${expectation.replace(/^absent:\s*/, "")}). Update the manifest if this was deliberate.`,
      );
      row.cells[key] = { mark: "+", state: "unexpected" };
    } else {
      row.cells[key] = { mark: ".", state: "intentionally-absent" };
    }
  }
  rows.push(row);
}

// --- dev.to additionally exposes canonical_url per article; assert it points home. ---
if (bodies.devto) {
  try {
    const articles = JSON.parse(bodies.devto);
    for (const a of articles) {
      const canonical = a.canonical_url ?? "";
      if (!canonical.includes(`${SITE}/blog/`)) {
        fail(
          `dev.to: "${a.title}" has canonical_url "${canonical || "(none)"}" — it must point ` +
            `at ${SITE}/blog/, or we are handing dev.to the SEO credit for our own post`,
        );
      }
    }
  } catch {
    fail("dev.to: response was not valid JSON — endpoint shape may have changed");
  }
}

// --- Report -------------------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n);
const slugWidth = Math.max(14, ...posts.map((p) => p.slug.length));
const colWidth = Math.max(9, ...channelKeys.map((k) => channels[k].label.length));

console.log("\nSyndication grid — is every post we expect still live?\n");
console.log(`  ${pad("post", slugWidth)}  ${channelKeys.map((k) => pad(channels[k].label, colWidth)).join("")}`);
console.log(`  ${"-".repeat(slugWidth)}  ${"-".repeat(colWidth * channelKeys.length)}`);
for (const { post, cells } of rows) {
  const line = channelKeys.map((k) => pad(cells[k].mark, colWidth)).join("");
  console.log(`  ${pad(post.slug, slugWidth)}  ${line}`);
}
console.log(`\n  o live (canonical matched)   ~ live (title only)   . absent on purpose`);
console.log(`  X MISSING — expected live    + unexpected          ! could not verify\n`);

for (const key of Object.keys(manifest.untracked ?? {})) {
  console.log(`  not checkable: ${key} — ${manifest.untracked[key]}`);
}

if (notes.length) {
  console.log("\nWorth a look:");
  for (const n of notes) console.log(`  - ${n}`);
}

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM${problems.length > 1 ? "S" : ""}:`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  console.log("");
  process.exit(1);
}

console.log("\nAll expected posts are live. No channel has silently dropped anything.\n");
