import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { FlowField } from "@/components/FlowField";
import { DeployConsole } from "@/components/DeployConsole";
import { BentoShowcase } from "@/components/visuals";
import { btnPrimary, btnGhost } from "@/lib/ui";

// Homepage (v3 redesign, 2026-07) — blend of the "living-circuit" atmosphere
// (FlowField) and the developer-native machinery (DeployConsole) on elevated
// Material surfaces. Copy stays anchored to content/v2-studio.md. Sections:
// hero → tech strip → services → why-one-studio (honest commitments) → built
// in-house → process → CTA.

type Pillar = { title: string; body: string; glow: string; icon: ReactNode };

const pillars: Pillar[] = [
  {
    title: "App & Software Development",
    body: "Cloud-native web apps, APIs, and backends — designed, built, deployed, and handed over.",
    glow: "var(--color-azure)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </svg>
    ),
  },
  {
    title: "DevOps & Cloud Infrastructure",
    body: "CI/CD, containerization, and deployment across Google Cloud, plus hosting and observability — so problems surface before your users find them.",
    glow: "var(--color-cobalt)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <circle cx="12" cy="12" r="3.4" />
      </svg>
    ),
  },
  {
    title: "AI & Agent Development",
    body: "LLM features, retrieval (RAG), custom agents and assistants, and MCP tooling — built into your product, not bolted on as a demo.",
    glow: "var(--color-amber)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 3a4 4 0 0 1 4 4c0 1.5 1 2 1 3.5M12 3a4 4 0 0 0-4 4c0 1.5-1 2-1 3.5M7 14h10l-1 6H8z" />
      </svg>
    ),
  },
  {
    title: "Automation",
    body: "The manual workflow eating your week, automated — internal tooling, integrations, the glue between systems.",
    glow: "var(--color-fire)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M4 12h5l2-5 3 10 2-5h4" />
      </svg>
    ),
  },
];

const commitments = [
  "Fixed scope, fixed price — no hourly surprises",
  "Running software, not slideware",
  "Deployed and observable — not just handed off",
  "The code and docs are yours to keep",
];

const inhouse = [
  {
    name: "BezaForge",
    tag: "infrastructure we run",
    body: "A homelab run like production — virtualized on Proxmox, provisioned with Terraform, configured with Ansible, monitored, backed up, and recoverable. Infrastructure as code, end to end.",
    stack: "Proxmox · Terraform · Ansible · Docker · Prometheus / Grafana",
  },
  {
    name: "Brizza",
    tag: "an AI system we shipped",
    body: "An agent on a live bridge — scheduled jobs, a Discord and dashboard interface, provider fallback, and full tracing so every run is inspectable. AI built and operated, not demoed.",
    stack: "Python · agent runtime · Discord · APScheduler · LangFuse",
  },
];

const steps = [
  { n: 1, h: "Scope", p: "Tell me the problem. I’ll tell you which package fits and a rough cost — usually within a day." },
  { n: 2, h: "Build", p: "Fixed-scope, fixed-price. You get the running thing — the app, the pipeline, the agent — not a deck." },
  { n: 3, h: "Ship & run", p: "Deployed, observable, and kept healthy — or handed over clean with docs. Your call." },
];

const SectionHead = ({ kicker, children }: { kicker: string; children: ReactNode }) => (
  <>
    <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">{kicker}</span>
    {children}
  </>
);

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* HERO — generative field + headline/CTAs + live console */}
      <section className="relative overflow-hidden border-b border-paper/10">
        <FlowField count={80} />
        <div aria-hidden="true" className="bz-field-veil" />
        <Container className="relative z-10 py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p
                className="rise font-mono text-xs font-semibold uppercase tracking-[0.28em] text-amber"
                style={{ animationDelay: "0ms" }}
              >
                Build Better. Build Beyond.
              </p>
              <h1
                className="rise mt-5 max-w-[15ch] text-5xl font-bold leading-[1.02] tracking-tight text-paper [overflow-wrap:anywhere] sm:text-6xl lg:text-[4.1rem]"
                style={{ animationDelay: "120ms" }}
              >
                Software, AI, and the{" "}
                <span className="hero-headline-gradient">infrastructure</span> to run it.
              </h1>
              <p
                className="rise mt-6 max-w-xl text-lg leading-relaxed text-paper/70"
                style={{ animationDelay: "320ms" }}
              >
                A studio that builds and runs cloud-native software — apps, AI and AI agents, and the
                infrastructure behind them.
              </p>
              <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "520ms" }}>
                <Link href="/services" className={btnPrimary}>
                  See services{" "}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link href="/pricing" className={btnGhost}>
                  See pricing
                </Link>
              </div>
              <div className="rise mt-9 flex flex-wrap gap-2" style={{ animationDelay: "680ms" }}>
                <span className="bz-chip">infra · live</span>
                <span className="bz-chip">agents · running</span>
                <span className="bz-chip">pipelines · green</span>
              </div>
            </div>
            <div className="relative z-10">
              <DeployConsole />
            </div>
          </div>
        </Container>
      </section>

      {/* TECH STRIP */}
      <div className="border-b border-paper/10 bg-paper/[0.015]">
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-paper/40">
            Built with
          </span>
          <span className="font-mono text-sm text-paper/60">
            Next.js · Django · Google Cloud · Terraform · LangGraph · Prometheus
          </span>
          <span className="font-mono text-xs text-paper/35">
            Google Cloud ACE · IBM Backend Developer
          </span>
        </Container>
      </div>

      {/* SERVICES */}
      <section id="services" className="bz-sec-cool border-b border-paper/10 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHead kicker="What the studio does">
              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                Four capabilities, <span className="text-gradient">one accountable studio.</span>
              </h2>
            </SectionHead>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/65">
              Most small teams otherwise hire a developer, and a DevOps person, and someone for AI.
              Here it’s one studio, accountable end to end.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => {
              const slug = p.title
                .toLowerCase()
                .replace(/[^a-z]+/g, "-")
                .replace(/^-|-$/g, "");
              return (
                <Reveal key={p.title} delay={i * 80} className="h-full">
                  <Link
                    href={`/services#${slug}`}
                    className="bz-card group/card block h-full p-6"
                    style={{ "--bz-glow": p.glow } as CSSProperties}
                  >
                    <div className="bz-card-ic mb-4" style={{ color: p.glow }}>
                      {p.icon}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-paper">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/60">{p.body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-paper/45 transition-colors group-hover/card:text-azure">
                      Learn more <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-8">
            <Link
              href="/services"
              className="font-mono text-sm text-azure transition-colors hover:text-paper"
            >
              Explore services →
            </Link>
          </div>
        </Container>
      </section>

      {/* SHOWCASE — bento visuals */}
      <section className="bz-sec-dual border-b border-paper/10 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHead kicker="Under the hood">
              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                What building and running <span className="text-gradient">actually looks like.</span>
              </h2>
            </SectionHead>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/65">
              Not a slide deck — the real machinery: pipelines, observability, agents, and
              infrastructure as code.
            </p>
          </Reveal>
          <div className="mt-10">
            <Reveal>
              <BentoShowcase />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* WHY ONE STUDIO — honest commitments */}
      <section className="bz-sec-warm border-b border-paper/10 py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <SectionHead kicker="Why one studio">
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                  Build, ship, and <span className="text-gradient">run it</span> — one studio.
                </h2>
              </SectionHead>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/65">
                Most teams hire a developer, a DevOps person, and someone for AI — then coordinate the
                gaps between them. Here it’s one studio, accountable from first commit to live traffic.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {commitments.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-paper/70">
                    <svg
                      className="h-[18px] w-[18px] flex-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth={2.2}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="text-[0.95rem]">{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="bz-metrics">
                <div className="bz-metric">
                  <div className="k">Accountable studio</div>
                  <div className="v" style={{ color: "var(--color-azure)" }}>1</div>
                </div>
                <div className="bz-metric">
                  <div className="k">Capabilities</div>
                  <div className="v" style={{ color: "var(--color-amber)" }}>4</div>
                </div>
                <div className="bz-metric">
                  <div className="k">Yours to keep</div>
                  <div className="v" style={{ color: "var(--color-azure)" }}>
                    100<span className="u">%</span>
                  </div>
                </div>
                <div className="bz-metric">
                  <div className="k">Pricing</div>
                  <div className="v" style={{ color: "var(--color-amber)" }}>Fixed</div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* BUILT IN-HOUSE — honest proof, not client case studies */}
      <section id="inhouse" className="bz-sec-cool border-b border-paper/10 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHead kicker="What we've built">
              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                Real systems, <span className="text-gradient">built and run.</span>
              </h2>
            </SectionHead>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/65">
              The studio designs, builds, deploys, and operates real systems end to end. Here’s a look
              across the stack — from bare production infrastructure to shipped AI.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {inhouse.map((w, i) => (
              <Reveal key={w.name} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-paper/10 bg-paper/[0.02] p-6">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="text-xl font-bold tracking-tight text-paper">{w.name}</h3>
                    <span className="font-mono text-xs tracking-wide text-amber">{w.tag}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-paper/60">{w.body}</p>
                  <p className="mt-4 font-mono text-xs text-paper/35">{w.stack}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* PROCESS — a real sequence, so numbers earn their place */}
      <section className="bz-sec-warm border-b border-paper/10 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHead kicker="How it works">
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                Three steps, <span className="text-gradient">no mystery.</span>
              </h2>
            </SectionHead>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-paper/10 bg-paper/[0.015] p-6">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-linear-to-br from-gold to-fire font-mono text-xs font-bold text-ink">
                    {s.n}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-paper">{s.h}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{s.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <FlowField count={55} />
        <div aria-hidden="true" className="bz-field-veil-c" />
        <Container className="relative z-10 text-center">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-paper/40">
              Start a project
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-paper sm:text-4xl">
              Tell me what you’re building.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-paper/65">
              Describe the problem — I’ll tell you which package fits and a rough cost. No sales call
              required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className={btnPrimary}>
                Start a project{" "}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link href="/pricing" className={btnGhost}>
                See pricing
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
