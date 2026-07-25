---
vault_canonical: 04_Career/BezaCore-Labs/products/bezacore-marketing/
vault_mirrors: []
---

# CLAUDE.md — bezacore-marketing

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the `bezacore.com` parent marketing site. Scaffolded 2026-05-17 per hub ADR 0007 v1.2 as part of BezaCore Labs Master-Plan Chunk C Phase 1.

> **Vault is canonical for all BezaCore Labs documentation.** The product home for this repo lives at `~/Vaults/Master-Mind/04_Career/BezaCore-Labs/products/bezacore-marketing/` (vault moved out of GoogleDrive 2026-06-06 per hub ADR 0002). Strategy, ROADMAP, content spec, and design decisions live there. This repo holds code + CLAUDE.md + README.md.

## What this repo IS

A Next.js 16 marketing site for `bezacore.com` — the BezaCore Labs LLC parent surface, deployed as a **Next server on Cloud Run** (not static export — the contact/waitlist forms need server API routes; ADR 0007 amended 2026-05-25). **Intelligrace-only public** per Master-Plan Chunk C scope rev (2026-05-16). All four content pages are now built (v1):

- Homepage (`/`) — parent-company framing + Intelligrace product card. Signature **fusion-circuit hero** (`HeroCircuitFusion` — circuit traces + traveling-light pulses + gradient headline).
- `/about` — founder + LLC + middle-path faith posture + structural mission tier commitment.
- `/intelligrace` — 5 sections + waitlist form (`WaitlistForm` → `/api/waitlist` → Resend).
- `/contact` — contact form (`ContactForm` → `/api/contact` → Resend → `joseph@bezacore.com`).

> **The elaborate "living light" scroll experience was descoped 2026-05-25** in favor of shipping v1 with the fusion-circuit hero as the signature branding. The full experience vision is preserved in vault `design/experience-vision.md` for a deliberate future return; the firefly/journey R&D components and `/alive` + `/motion-lab` routes were removed.

## What this repo IS NOT

- Not the Intelligrace product marketing site (separate `intelligrace.com` surface, ships when Intelligrace does)
- Not application code (Intelligrace + BezaPM live in their own repos)
- Not a duplicate of vault planning docs (vault is canonical)
- Not a place for BezaPM mentions (BezaPM is private per operating-model v3.2)

## Stack (pinned)

| | |
|---|---|
| Runtime | Node.js (current LTS) |
| Package manager | **pnpm 11.1.2** (corepack-pinned via `packageManager` field) |
| Framework | **Next.js 16.2.6 LTS** (server build for Cloud Run — NOT static export; API routes power the forms. ADR 0007 amended 2026-05-25) |
| React | **19.2.6** |
| TypeScript | **6.0.3** (strict) |
| CSS | **Tailwind v4.3.0** (no `tailwind.config.js` — uses `@theme` in CSS) |
| Component primitives | shadcn/ui (CLI v4-compatible) |
| Email | **Resend** for `/contact` form per hub ADR 0008 |
| Lint | ESLint 9 + `eslint-config-next` |

**Build-script approvals:** `sharp` + `unrs-resolver` are persisted in `pnpm-workspace.yaml` for clean re-clones.

## Dev workflow

```bash
# from this repo
pnpm install      # uses corepack-pinned pnpm 11.1.2
pnpm dev          # serves on http://localhost:3030 (port pinned to dodge obsidian-mcp-server on 3000)
pnpm build        # production server build (.next; for Cloud Run)
pnpm start        # production serve on 3030
pnpm lint
```

**Dev port pinned to 3030** (`package.json` scripts) because the local `obsidian-mcp-server` holds port 3000. Do not unpin without coordinating — multiple local services depend on the 3000-collision dodge.

## Code architecture

App Router under `src/app/`; shared UI under `src/components/` (imported via the `@/` alias). The big picture spans several files:

- **Layout shell** — `app/layout.tsx` wraps every route with `<Header />` + `<Footer />`, self-hosts Inter via `next/font` (exposed as the `--font-inter` CSS var, fed into the Tailwind `--font-sans` token), and sets the metadata `title.template` `"%s — BezaCore Labs"`. Per-page `metadata.title` only supplies the `%s`.
- **Server-first** — components are React Server Components by default. Only stateful/interactive components carry `"use client"`: `ContactForm`, `WaitlistForm` (form state), and `Reveal` (IntersectionObserver). Everything else (`Header`, `Footer`, `Container`, `Section`, `PageHeader`, `Kicker`, `Button`/`CTALink`, `HeroContent`, `HeroCircuitFusion`) is a static server component.
- **Forms → API routes → Resend** — `ContactForm` POSTs to `app/api/contact/route.ts`; `WaitlistForm` to `app/api/waitlist/route.ts`. Both call `src/lib/email.ts` (`sendEmail`), which hits Resend's REST API via `fetch` (no SDK dependency). Each route validates input + checks a `company` honeypot field. Email config is env-driven: `RESEND_API_KEY` (required to actually send), `RESEND_FROM` (verified sender), `CONTACT_TO` (defaults to `joseph@bezacore.com`). No key set = no-op + generic error state. **No email address is ever surfaced in the UI** (form-only policy, content spec).
- **Navigation is single-source** — `navLinks` lives in `src/lib/nav.ts` (a neutral module, NOT `Header.tsx`, which is `"use client"` for `usePathname`). `Header` + `Footer` both import it. It must stay in a non-client module: client-module exports cross the RSC boundary as client references, so a server component (`Footer`) importing `navLinks` from a `"use client"` file gets a proxy, not an array (`.map` is not a function). Add/rename a route here and both nav surfaces update.
- **Design tokens (Tailwind v4)** — there is **no `tailwind.config.js`**; all tokens live in the `@theme` block of `app/globals.css`. Declaring `--color-foo`/`--font-foo` auto-generates `bg-foo`, `text-foo`, `ring-foo`, etc. **Two palettes coexist:** the original "Ember & Cobalt" set (`ink`, `paper`, `gold`, `fire`, `ember`, `cobalt`) and a newer **true-black direction** (`base` = near-black page surface, `amber`/`azure` = neon-bright accents). Pages use `base` as the page surface and `paper` for text.
- **The signature branding** is the **fusion-circuit hero** (`HeroCircuitFusion` + the `.hero-circuit*` / `.hero-headline-gradient` CSS): orthogonal SVG traces with light pulses traveling along them (animated `stroke-dashoffset`) + a gradient headline. Pure SVG/CSS, no JS. This is the recognizable element carried into v1; the broader "living light" scroll experience is parked (vault `design/experience-vision.md`).
- **Reduced-motion is a hard convention** — animation is gated behind `@media (prefers-reduced-motion: no-preference)` in CSS, and content is never hidden from reduced-motion / no-JS users (e.g. `Reveal` content is forced visible via a CSS fallback). Preserve this when adding motion.

## Multi-remote git

Single `origin` with multi-push URLs (set up 2026-05-17; **migrated to the
`BezaCore-Labs` org per hub ADR 0011** — verified 2026-07-25):

```
origin → git@github.com:BezaCore-Labs/bezacore-marketing.git (fetch + push)
       → git@gitlab.com:bezacore-labs/bezacore-marketing.git (push)
       → ssh://git@git.bezaforge.dev:2222/bezacore-labs/bezacore-marketing.git (push)
```

`git push` lands on all three. Fetch only pulls from the first. Verify with `git remote -v`.

⚠️ `gh pr merge` only updates GitHub — the mirrors drift until you `git push origin main`
and delete the merged branch from each mirror URL. Do it **per merge**, not batched.

## Canonical docs (vault)

Open in this order when working on this repo:

1. Vault `CLAUDE.md` + `AI-MASTER.md` (per global startup sequence)
2. Hub `~/Projects/bezacore-labs/CLAUDE.md` — cross-repo coordination context
3. **Product home:** `04_Career/BezaCore-Labs/products/bezacore-marketing/README.md`
4. **Content spec (locked copy for all 4 pages):** `04_Career/BezaCore-Labs/products/bezacore-marketing/content/v1-locked.md`
5. **Master-Plan Chunk C:** vault `04_Career/BezaCore-Labs/Master-Plan.md` § Chunk C
6. **Marketing-stack ADR:** hub `docs/decisions/0007-marketing-stack-nextjs-static-export.md` (v1.2 — bumped 2026-05-17 for Next 15→16, TS 5→6)
7. **Email ADR:** hub `docs/decisions/0008-transactional-email-resend.md`

## Brand assets

Production assets live at `~/Projects/bezacore-labs/brand-assets/bezacore-labs/exports/` (86 files: mark suite + wordmark + horizontal/stacked lockups × dark + light surfaces × 5 widths).

For embedding in this repo, copy needed exports to `public/brand/` and reference from there. Do not symlink — the standalone server build copies `public/` inline.

## Phase status

- **Phase 1 — scaffold + content + build: ✅ COMPLETE.** scaffold ✅ (2026-05-17), content lock ✅ (2026-05-21), **v1 build + merged ✅ (PR #3, 2026-05-25)** — all 4 pages, contact + waitlist forms → Resend API routes, site-wide signature styling. **Living-light experience descoped** (parked in vault). **Chunk-C local pass ✅ (2026-05-31):** real `/terms` + `/privacy`, brand/OG metadata in `public/brand/`, Dockerized for Cloud Run (`output: 'standalone'`, smoke-tested). `pnpm build` green.
- **Phase 2 — deploy + DNS:** 🔄 next, the go-live push (needs accounts/DNS). Tracked in Plane `MKTG`: Resend account + `bezacore.com` domain verify (MKTG-21, gates the forms) → GCP project + Artifact Registry (MKTG-15) → Cloud Run deploy + Google Cloud DNS (MKTG-17) → end-to-end test (MKTG-18) = Chunk C exit.

## Working style

Inherits from global CLAUDE.md (`~/.claude/CLAUDE.md`):

- Walk-through default for dev work in this repo (Joseph is learning React / Next / TS as a first-class priority per `learning-plan.md`)
- Ask first when there are multiple reasonable approaches
- Stay in scope of what was requested

## Cross-session coordination (with the BezaCore Labs hub)

This session owns: repo code, the vault product-home docs
(`products/bezacore-marketing/{ROADMAP,design/*,content/*}.md`), this repo's
Plane project, and its journal arc. It does **NOT** edit the BezaCore
`CONSOLE.md` (vault-canonical + hub-repo mirror — single-writer = the hub
session, to avoid mirror drift). To report status to the hub, append a
one-line entry to vault `00-INBOX/For-Claude.md` at `/wrap`; the hub folds it
into CONSOLE. See vault `products/bezacore-marketing/design/experience-vision.md`
ownership banner.

## Project memory

`~/.claude/projects/-home-joseph-Projects-bezacore-marketing/memory/` will be created when the first session lands here. Hub-level memories (cross-cutting BezaCore facts that don't belong to one product repo) stay in the hub project memory at `~/.claude/projects/-home-joseph-Projects-bezacore-labs/memory/`.
