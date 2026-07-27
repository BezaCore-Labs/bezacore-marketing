import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import {
  MiniTerminal,
  MiniMetrics,
  MiniAgentFlow,
  MiniPipeline,
  ArchitectureDiagram,
} from "@/components/visuals";
import { btnPrimary, btnGhost } from "@/lib/ui";

// /services (v3 redesign, 2026-07) — the four capabilities in depth, each an
// anchored section (#slug) the homepage service cards link into. Pricing lives
// on /pricing now; this page links to it. Copy anchored to content/v2-studio.md.
export const metadata: Metadata = {
  title: "Services",
  description:
    "A DevOps and AI studio that builds and runs cloud-native software — apps, AI features and agents, and the infrastructure and automation behind them.",
};

type Pillar = {
  slug: string;
  title: string;
  glow: string;
  icon: ReactNode;
  what: string;
  who: string;
};

const pillars: Pillar[] = [
  {
    slug: "app-software-development",
    title: "App & Software Development",
    glow: "var(--color-azure)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </svg>
    ),
    what: "Cloud-native web apps, APIs, and backends — designed, built, deployed, and handed over. A typical engagement is a fixed-scope build: agree on what it does, the studio builds and ships it, you get the running app plus handover.",
    who: "For founders and small businesses who need real software built, not just advised on.",
  },
  {
    slug: "devops-cloud-infrastructure",
    title: "DevOps & Cloud Infrastructure",
    glow: "var(--color-cobalt)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <circle cx="12" cy="12" r="3.4" />
      </svg>
    ),
    what: "The “run” half: CI/CD pipelines, containerization, and deployment across the full Google Cloud Platform — Compute Engine, GKE, Cloud Run, Cloud Functions, Cloud SQL, BigQuery, networking, and IAM, whatever the workload needs — plus hosting and observability so problems surface before your users find them. Engagements range from a one-time deploy to a standing infrastructure setup.",
    who: "For teams who have an app but no one who owns getting it live and keeping it healthy.",
  },
  {
    slug: "ai-agent-development",
    title: "AI & Agent Development",
    glow: "var(--color-amber)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <path d="M12 3a4 4 0 0 1 4 4c0 1.5 1 2 1 3.5M12 3a4 4 0 0 0-4 4c0 1.5-1 2-1 3.5M7 14h10l-1 6H8z" />
      </svg>
    ),
    what: "LLM features, retrieval (RAG), custom agents and assistants, and MCP tooling — built into your product, not bolted on as a demo. A focused sprint: one shipped AI capability, integrated and running.",
    who: "For teams adding AI who want it done right rather than prototyped and abandoned.",
  },
  {
    slug: "automation",
    title: "Automation",
    glow: "var(--color-fire)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <path d="M4 12h5l2-5 3 10 2-5h4" />
      </svg>
    ),
    what: "The manual workflow eating your week, automated — internal tooling, integrations, the glue between systems. Usually one specific, well-defined automation per engagement.",
    who: "For anyone losing hours to work a script should be doing.",
  },
];

const technologies = [
  { group: "Languages & frameworks", items: "Python · TypeScript · Next.js · React · Django · FastAPI · Node" },
  { group: "Cloud & infrastructure", items: "Google Cloud (Compute Engine, GKE, Cloud Run, Cloud Functions, Cloud SQL, BigQuery) · Docker · Terraform · Ansible · Proxmox · Linux" },
  { group: "AI & agents", items: "LangChain · LangGraph · LangFuse · Vertex AI · Ollama · MCP · RAG · agent runtimes" },
  { group: "DevOps & automation", items: "CI/CD · Prometheus · Grafana · observability · workflow automation" },
];

// A relevant code-drawn mockup per capability (the "product screenshot" feel).
const PILLAR_VISUAL: Record<string, ReactNode> = {
  "app-software-development": <MiniTerminal />,
  "devops-cloud-infrastructure": <MiniMetrics />,
  "ai-agent-development": <MiniAgentFlow />,
  automation: <MiniPipeline />,
};

export default function Services() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        kicker="Services"
        title={
          <>
            What the studio <span className="text-gradient">builds — and runs.</span>
          </>
        }
      >
        BezaCore Labs handles the whole lifecycle: building cloud-native software, deploying it,
        keeping it running, and wiring in AI and automation where they earn their place. Most small
        teams otherwise hire a developer <em>and</em> a DevOps person <em>and</em> someone for AI.
        Here it&apos;s one studio, accountable end to end.
      </PageHero>

      {/* Per-capability anchored sections (home cards link to #slug) */}
      {pillars.map((p, i) => (
        <section
          key={p.slug}
          id={p.slug}
          className={`scroll-mt-24 ${i % 2 ? "bz-sec-warm" : "bz-sec-cool"} border-b border-paper/10 py-16 sm:py-20`}
        >
          <Container>
            <div className="grid gap-8 lg:grid-cols-[19rem_1fr]">
              <Reveal>
                <div
                  className="bz-card-ic h-12 w-12"
                  style={{ color: p.glow, "--bz-glow": p.glow } as CSSProperties}
                >
                  {p.icon}
                </div>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
                  Capability {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                  {p.title}
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lg leading-relaxed text-paper/75">{p.what}</p>
                <p className="mt-6 flex items-start gap-3 text-sm text-paper/55">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                    style={{ background: p.glow }}
                  />
                  {p.who}
                </p>
                <div className="mt-8 h-40 max-w-md">{PILLAR_VISUAL[p.slug]}</div>
              </Reveal>
            </div>
          </Container>
        </section>
      ))}

      {/* How it fits together — architecture diagram */}
      <section className="bz-sec-dual border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">
              How it fits together
            </span>
            <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              One studio, <span className="text-gradient">the whole path to production.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/65">
              From your code to a running, observable service — built, deployed, and kept healthy end to
              end.
            </p>
          </Reveal>
          <div className="mt-10 rounded-2xl border border-paper/10 bg-paper/[0.02] p-6 sm:p-8">
            <Reveal>
              <ArchitectureDiagram />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Pricing pointer */}
      <section className="border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <div className="bz-card flex flex-col items-start gap-5 p-8 sm:p-10" style={{ "--bz-glow": "var(--color-azure)" } as CSSProperties}>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Pricing</span>
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              Fixed scope, fixed price — <span className="text-gradient">written down.</span>
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-paper/65">
              Every capability above maps to a productized package with a clear starting price. No
              hourly surprises; the number is agreed before any work begins.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pricing" className={btnPrimary}>
                See pricing{" "}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link href="/contact" className={btnGhost}>
                Start a project
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Technologies + certs */}
      <section className="border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Technologies</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              The stack behind the work.
            </h2>
          </Reveal>
          <dl className="mt-8 max-w-4xl space-y-6">
            {technologies.map(({ group, items }) => (
              <Reveal key={group}>
                <div className="grid gap-1 border-t border-paper/10 pt-6 sm:grid-cols-[220px_1fr] sm:gap-6">
                  <dt className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-paper/40">
                    {group}
                  </dt>
                  <dd className="leading-relaxed text-paper/75">{items}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <p className="mt-8 font-mono text-xs text-paper/40">
            Google Cloud Associate Cloud Engineer · IBM Backend Developer Professional
          </p>
        </Container>
      </section>

      {/* Who the studio works with */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[19rem_1fr]">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">
                  Who it&apos;s for
                </span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                  Built for teams <span className="text-gradient">without an engineering department.</span>
                </h2>
              </div>
              <div className="flex flex-col gap-5 text-lg leading-relaxed text-paper/75">
                <p>
                  BezaCore Labs works with startups, small businesses, and teams adding AI — people who
                  need working software built and kept running without standing up a whole engineering
                  department. A clear problem and a budget is usually all it takes to find a package that
                  fits.
                </p>
                <p className="text-paper/60">
                  Not sure which package fits?{" "}
                  <span className="text-paper">Tell us the problem</span> and we&apos;ll point you to the
                  right one.
                </p>
                <div>
                  <Link href="/contact" className={btnPrimary}>
                    Start a project{" "}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
