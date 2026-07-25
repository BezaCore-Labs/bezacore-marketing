import type { MetadataRoute } from "next";
import { sortedPosts } from "@/content/blog/posts";

const SITE = "https://bezacore.com";

// Static routes worth indexing. /intelligrace and /work are deliberately absent
// — both are redirects (next.config.ts), and listing a redirect in a sitemap is
// a soft error in Search Console.
const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Newest post date doubles as the blog index's lastModified.
  const newestPost = sortedPosts[0]?.meta.date;

  const pages = staticRoutes.map((route) => ({
    url: `${SITE}${route.path}`,
    lastModified: route.path === "/blog" && newestPost ? new Date(newestPost) : new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const posts = sortedPosts.map((post) => ({
    url: `${SITE}/blog/${post.meta.slug}`,
    lastModified: new Date(post.meta.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
