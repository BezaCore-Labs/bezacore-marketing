"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Field } from "./Field";

// Contact form — 4 fields → POST /api/contact → Resend. Holds its own state
// (why it's a client component). Success replaces the form inline; submit
// errors show above it; field errors show inline. No email is ever surfaced
// (form-only policy, content spec decision 2026-05-21).
type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "rate-limited"
  >("idle");
  const [honeypot, setHoneypot] = useState(""); // bots fill this; humans never see it

  const update =
    (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((f) => ({ ...f, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!fields.name.trim()) next.name = "Required.";
    if (!fields.email.trim()) next.email = "Required.";
    else if (!EMAIL_RE.test(fields.email)) next.email = "Please enter a valid email address.";
    if (!fields.subject.trim()) next.subject = "Required.";
    if (!fields.message.trim()) next.message = "Required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, company: honeypot }),
      });
      // 429 is not a failure — the message simply wasn't sent yet. Saying
      // "something went wrong" there would be untrue and would push someone
      // into retrying immediately, which is exactly the wrong advice.
      if (res.status === 429) setStatus("rate-limited");
      else setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-xl font-medium text-paper" role="status">
        Thanks — we&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {status === "error" ? (
        <p className="rounded-lg border border-red-400/40 bg-red-400/5 px-4 py-3 text-sm text-red-400" role="alert">
          Something went wrong sending your message. Please try again in a few minutes.
        </p>
      ) : null}

      {status === "rate-limited" ? (
        <p className="rounded-lg border border-amber/40 bg-amber/5 px-4 py-3 text-sm text-amber" role="alert">
          That&apos;s a few messages in a short window — your message wasn&apos;t sent. Please wait
          about ten minutes and try again.
        </p>
      ) : null}

      <Field label="Name" name="name" value={fields.name} onChange={update("name")} error={errors.name} autoComplete="name" />
      <Field
        label="Email"
        name="email"
        type="email"
        value={fields.email}
        onChange={update("email")}
        error={errors.email}
        autoComplete="email"
      />
      <Field label="Subject" name="subject" value={fields.subject} onChange={update("subject")} error={errors.subject} />
      <Field
        label="Message"
        name="message"
        textarea
        value={fields.message}
        onChange={update("message")}
        error={errors.message}
        placeholder="What are you trying to build, and any timeline or budget you have in mind?"
      />

      {/* honeypot — hidden from humans, off the tab order */}
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex w-fit items-center gap-2 rounded-full bg-linear-to-r from-gold to-fire px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:ring-2 hover:ring-cobalt hover:ring-offset-2 hover:ring-offset-base focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send"}
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      </button>
    </form>
  );
}
