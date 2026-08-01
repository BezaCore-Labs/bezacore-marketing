Time for the weekly distill. Canonical procedure: vault `content/build-in-public-system.md` (v1.4).

### 0. Reconcile FIRST — do not start in the build-logs

```bash
cd ~/Vaults/Master-Mind
find . -name build-log.md -not -path '*TEMPLATES*' -exec awk '/^## Unpublished seeds/,/^## Published/' {} + | grep -c '^- \*\*'
awk '/^## Seeds by project/,0' 05_Projects/BezaCore-Labs/bezacore-marketing/content/post-pipeline.md | grep -c '^| `'
```

Both numbers must match. A gap means new seeds landed since the last distill and must be added to the register as ⏳ Pending **before** triaging.

### 1–6. The pass

1. **Triage every ⏳ Pending seed** — ✅ Approved · 🔗 Fragment · ⛔ Passed (**reason required**) · 🔒 Embargoed · 🚧 Blocked. A seed still Pending after the distill that reviewed it is a bug, not a state.
2. **Group approved seeds into topics — as many as the material supports.** By project by default; cross-project only where spanning genuinely makes the topic stronger. *A good seed is never dropped because a better one existed the same week.*
3. **Write.** Batching is fine — MDX in `src/content/blog/`, register in `posts.ts`, PR → merge → **deploy**. Deploys are manual on this repo: merged is not shipped.
4. **Syndicate, staggered** — the full round per post, **at most one post per account per 24h**. Shapes are locked in `content/social-post-patterns.md`; don't improvise a thread. LinkedIn is first person with the link in the first comment; X and Bluesky are studio voice, never "I".
5. **Update `content/syndication.json`** — a cell per channel for each new post, with not-yet-posted channels as `scheduled: <when>`. The channel-health check fails on any blog post missing from this file.
6. **Prune** — Published and Passed seeds get deleted from their build-log in the same action.

### 7. Verify

```bash
pnpm check:channels
```

Close this issue when at least one post is **published and verified live**.
