import type { ComponentType } from "react";

// Blog post registry. Each entry pairs metadata with a static import of its MDX
// body (compiled to a component by @next/mdx). Adding a post = drop a .mdx file
// here + add one entry. Kept explicit (no fs globbing) so it stays type-safe and
// works identically in dev, build, and the standalone Cloud Run server.
export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  readingTime: string;
};

type PostEntry = {
  meta: PostMeta;
  load: () => Promise<{ default: ComponentType }>;
};

export const posts: PostEntry[] = [
  {
    meta: {
      slug: "blog-with-no-pipeline",
      title: "I had a blog with no pipeline feeding it",
      date: "2026-07-25",
      excerpt:
        "Building in public is central to how this studio works — and I'd built the publishing surface without anything feeding it. Here's the system that fixed it: capture daily, publish weekly, and make the habit structural instead of willed.",
      readingTime: "5 min read",
    },
    load: () => import("./blog-with-no-pipeline.mdx"),
  },
  {
    meta: {
      slug: "build-and-run-not-just-ship",
      title: "Shipping is the easy part. Running it is the job.",
      date: "2026-07-09",
      excerpt:
        "Most software relationships end at the handoff. Here’s why BezaCore Labs owns the whole lifecycle — build, deploy, and keep it healthy — instead of handing you a repo and walking away.",
      readingTime: "4 min read",
    },
    load: () => import("./build-and-run-not-just-ship.mdx"),
  },
  {
    meta: {
      slug: "fixed-price-over-hourly",
      title: "Why every engagement is fixed-price",
      date: "2026-07-07",
      excerpt:
        "Hourly billing rewards the slow version of the work and leaves you unable to budget. Here’s how fixed scope keeps both sides honest.",
      readingTime: "3 min read",
    },
    load: () => import("./fixed-price-over-hourly.mdx"),
  },
];

export const sortedPosts = [...posts].sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

export const getPost = (slug: string): PostEntry | undefined =>
  posts.find((p) => p.meta.slug === slug);
