import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { MiniMetrics, MiniTerminal, MiniGlobe } from "@/components/visuals";
import { btnPrimary } from "@/lib/ui";

// /about (v3 redesign, 2026-07) — the one page in first-person ("I"/Joseph),
// where founder credibility is the asset. Founder copy verbatim from
// content/v2-studio.md (locked 2026-06-27); restyled to the v3 aesthetic.
export const metadata: Metadata = {
  title: "About",
  description:
    "BezaCore Labs is a DevOps and AI studio in Petoskey, Michigan — cloud-native software built, deployed, and kept running, with AI and automation where they help.",
};

const personalLinks = [{ href: "https://linkedin.com/in/joseph-soper-dev", label: "LinkedIn" }];

export default function About() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero
        kicker="About"
        title={
          <>
            A studio built to ship — <span className="text-gradient">and to keep it running.</span>
          </>
        }
      >
        BezaCore Labs is a DevOps and AI studio in Petoskey, Michigan. It builds cloud-native software,
        deploys and runs it, and brings AI and automation in where they actually help — for startups,
        small businesses, and teams that need real software shipped and kept running.
      </PageHero>

      {/* Founder — first-person, editorial two-column */}
      <section className="bz-sec-cool border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">The founder</span>
              <p className="mt-3 text-sm text-paper/50">Petoskey, Michigan</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex flex-col gap-5 text-lg leading-relaxed text-paper/75">
                <p>
                  I&apos;m <strong className="font-semibold text-paper">Joseph Soper</strong>, a software
                  and DevOps engineer in Petoskey, Michigan. I&apos;ve been building software since I was a
                  teenager and never stopped — engineering, infrastructure, and lately AI have been the
                  constant thread through everything else I&apos;ve done. I spent more than a decade in
                  sales along the way, which turned out to be its own kind of asset: it taught me to
                  understand what a business actually needs and to say it plainly. But building is the
                  thing I always came back to.
                </p>
                <p>
                  BezaCore Labs is where all of that comes together. I build cloud-native applications,
                  deploy and run them on solid infrastructure, and bring AI in where it earns its place —
                  and because I&apos;ve lived on the operational side, I care as much about what happens
                  after launch as before it. Durable systems over flashy launches, and one accountable
                  studio from the first commit to production.
                </p>
                <p className="text-paper/90">
                  I try to build the way I&apos;d want someone to build for me: carefully, honestly, and
                  with the long run in mind — using what I&apos;ve been given to make something that lasts,
                  not just to ship and move on.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {personalLinks.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-paper/20 px-4 py-2 text-sm text-paper/80 transition-colors hover:border-azure hover:text-paper"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How I work — elevated glow panel */}
      <section className="border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <Reveal>
            <div
              className="bz-card p-8 sm:p-12 lg:p-16"
              style={{ "--bz-glow": "var(--color-cobalt)" } as CSSProperties}
            >
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">
                The approach
              </span>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight text-paper sm:text-4xl">
                How I <span className="text-gradient">work.</span>
              </h2>
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-paper/80">
                Fixed scope, fixed price, written down. Before any work starts we agree on exactly
                what&apos;s included — and what isn&apos;t — so there are no surprises on either side.
                I&apos;d rather quote honestly and deliver than over-promise and scramble. And when
                something ships, it ships with the boring parts done: deployment, monitoring, a runbook, a
                handover. Durable over flashy, every time.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* The studio's own stack, running — animated proof */}
      <section className="bz-sec-cool border-b border-paper/10 py-16 sm:py-20">
        <Container>
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber">In practice</span>
            <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              The same systems I&rsquo;d <span className="text-gradient">build for you</span> — running
              right now.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Reveal className="h-40">
              <MiniMetrics />
            </Reveal>
            <Reveal delay={80} className="h-40">
              <MiniTerminal />
            </Reveal>
            <Reveal delay={160} className="h-40">
              <MiniGlobe />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start gap-5">
              <h2 className="text-2xl font-bold tracking-tight text-paper sm:text-3xl">
                Have a project in mind?
              </h2>
              <Link href="/contact" className={btnPrimary}>
                Start a project{" "}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
