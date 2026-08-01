import { sendEmail, isValidEmail, escapeHtml } from "@/lib/email";
import { consumeSendBudget, tooManyRequests } from "@/lib/rate-limit";

// POST /api/contact — contact form submissions → Resend → joseph@bezacore.com.
// Runs on the server (Cloud Run / Node), so this needs the Next server runtime
// (not static export). See ADR 0007 (amended for server deploy).
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.company ?? "").trim();

  // honeypot filled → almost certainly a bot. Pretend success, send nothing.
  if (honeypot) return Response.json({ ok: true });

  if (!name || !subject || !message || !isValidEmail(email)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Throttle only what would actually reach Resend (#525). Deliberately AFTER
  // the honeypot and validation: charging bot traffic and malformed posts to
  // the budget would let junk requests lock real visitors out of the form.
  const budget = consumeSendBudget(req);
  if (!budget.allowed) return tooManyRequests(budget.retryAfterSeconds);

  const html = `
    <h2>New contact message — bezacore.com</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  const sent = await sendEmail({
    subject: `Contact: ${subject}`,
    html,
    replyTo: email,
  });

  return Response.json({ ok: sent }, { status: sent ? 200 : 500 });
}
