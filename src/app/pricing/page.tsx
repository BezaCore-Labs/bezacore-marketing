import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { FlowField } from "@/components/FlowField";
import { MiniMetrics } from "@/components/visuals";
import { btnPrimary } from "@/lib/ui";

// /pricing (v3 redesign, 2026-07) — the productized package menu split out of
// /services into its own page (a stronger "established studio" signal). Prices
// mirror hub consultancy/service-packages.md + content/v2-studio.md. Fixed-scope
// framing; "from" figures anchor a range, real quote after scoping.
export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Productized, fixed-price packages — app builds, AI sprints, cloud deploys, CI/CD, automation, audits, and retainers. Clear starting prices, scoped per project.",
};

type Pkg = { name: string; price: string; gets: string; note?: string; featured?: boolean };

const packages: Pkg[] = [
  { name: "App Build", price: "from $5,000", gets: "A web app or custom software build — built, deployed, and hosted, with handover.", note: "scoped per project" },
  { name: "AI Agent & Integration Sprint", price: "from $2,500", gets: "A custom agent, assistant, LLM feature, or RAG built into your product." },
  { name: "Deploy-to-Cloud", price: "from $2,000", gets: "Your app live on Google Cloud — the right GCP services for the job (Cloud Run, GKE, Compute Engine, Cloud SQL…) — with monitoring and a runbook." },
  { name: "CI/CD Setup", price: "from $1,500", gets: "Pipelines, containerization, automated deploys, and docs." },
  { name: "Automation Build", price: "from $1,000", gets: "One manual workflow, automated and running." },
  { name: "Support Retainer", price: "from $500/mo", gets: "Ongoing build, infra, and AI support — monthly hours and an SLA." },
  { name: "Infrastructure Audit", price: "$500", gets: "A review of your setup with a findings-and-fix report, plus a call.", note: "the easy first step", featured: true },
  { name: "Custom", price: "Let’s talk", gets: "Anything bigger, or a mix of the above." },
];

const howItWorks = [
  { h: "Scoped before we start", p: "We agree exactly what’s included — and what isn’t — in writing, before any work begins. The price is the price." },
  { h: "Starting prices, real quotes", p: "The “from” figures anchor a range; your quote reflects your actual scope after a short conversation." },
  { h: "You own the output", p: "Code, infrastructure config, and docs are yours at handover. No lock-in, no per-seat rent." },
  { h: "Start small if you want", p: "A $500 Infrastructure Audit is a low-risk way to see how the studio works before a bigger build." },
];

const faqs = [
  { q: "Do you charge hourly?", a: "No — everything is fixed-scope and fixed-price, agreed before work starts. The Support Retainer is the one exception: it’s a monthly block of hours." },
  { q: "What if my project doesn’t fit a package?", a: "Most don’t fit perfectly — the packages are starting points. Tell me the problem and I’ll scope a custom quote." },
  { q: "How fast can you start?", a: "Scoping is usually same-day. Build start depends on the current queue, which I’ll tell you honestly up front." },
  { q: "Who owns the code?", a: "You do — code, infrastructure configuration, and documentation, handed over at the end of the engagement." },
  { q: "Do you offer ongoing support?", a: "Yes — the Support Retainer covers ongoing build, infra, and AI help, with a monthly hour allotment and an SLA." },
];

export default function Pricing() {
  return (
    <main className="flex flex-1 flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-paper/10">
        <FlowField count={50} />
        <div aria-hidden="true" className="bz-field-veil" />
        <Container className="relative z-10 py-20 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Pricing</span>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                <span className="hero-headline-gradient">Clear packages.</span> No hourly surprises.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
                Every engagement is fixed-scope and fixed-price — agreed up front, in writing. The prices
                below are starting points; the exact number depends on scope, which we settle before any
                work begins.
              </p>
            </div>
            <div className="hidden h-44 lg:block">
              <MiniMetrics />
            </div>
          </div>
        </Container>
      </section>

      {/* PACKAGE GRID */}
      <section className="border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p, i) => {
              const glow = [
                "var(--color-azure)",
                "var(--color-amber)",
                "var(--color-cobalt)",
                "var(--color-fire)",
              ][i % 4];
              return (
              <Reveal key={p.name} delay={(i % 3) * 70} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-2xl border border-t-2 p-6 transition-all duration-300 hover:-translate-y-1 ${
                    p.featured
                      ? "border-azure/50 bg-azure/[0.05]"
                      : "border-paper/10 bg-paper/[0.02] hover:border-paper/20"
                  }`}
                  style={{ borderTopColor: glow }}
                >
                  {p.featured && p.note ? (
                    <span className="mb-3 w-fit rounded-full bg-azure/15 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-azure">
                      {p.note}
                    </span>
                  ) : null}
                  <h2 className="text-lg font-bold tracking-tight text-paper">{p.name}</h2>
                  <p className="mt-1 font-mono text-xl font-semibold text-gradient">{p.price}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-paper/60">{p.gets}</p>
                  {!p.featured && p.note ? (
                    <p className="mt-2 font-mono text-xs text-paper/35">{p.note}</p>
                  ) : null}
                  <Link
                    href="/contact"
                    className="mt-5 font-mono text-sm text-azure transition-colors hover:text-paper"
                  >
                    Start this →
                  </Link>
                </div>
              </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* HOW PRICING WORKS */}
      <section className="border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">
                How pricing works
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper">
                Honest by <span className="text-gradient">default.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {howItWorks.map((it) => (
                  <div key={it.h}>
                    <h3 className="text-base font-semibold text-paper">{it.h}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/60">{it.p}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ — native details, no client JS */}
      <section className="border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-paper">Questions</h2>
            <div className="mt-8 max-w-3xl border-y border-paper/10">
              {faqs.map((f) => (
                <details key={f.q} className="group border-b border-paper/10 py-4 last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-paper">
                    <span className="font-medium">{f.q}</span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-lg text-azure transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-paper/65">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-start gap-5">
            <h2 className="text-2xl font-bold tracking-tight text-paper">Not sure which fits?</h2>
            <p className="max-w-xl text-paper/65">
              Describe the problem and I’ll point you to the right package and a rough number — usually
              within a day.
            </p>
            <Link href="/contact" className={btnPrimary}>
              Start a project{" "}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
