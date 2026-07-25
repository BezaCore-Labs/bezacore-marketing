import { sortedPosts } from "@/content/blog/posts";

const SITE = "https://bezacore.com";
const TITLE = "BezaCore Labs";
const DESCRIPTION =
  "Building in public from BezaCore Labs — software, AI, and the infrastructure to run it.";

// Prerendered at build time. The post registry is static, so there is nothing
// per-request to compute and the standalone server can serve this from cache.
export const dynamic = "force-static";

// RSS is XML: these five characters must be escaped or a single ampersand in a
// title silently breaks the whole feed for every reader parsing it.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// RSS 2.0 requires RFC-822 dates. Post dates are plain yyyy-mm-dd, so anchor
// them at noon UTC — that way no reader's timezone can shift a post to the
// previous day.
function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

export function GET(): Response {
  const items = sortedPosts
    .map(({ meta }) => {
      const url = `${SITE}/blog/${meta.slug}`;
      return `    <item>
      <title>${escapeXml(meta.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(meta.date)}</pubDate>
      <description>${escapeXml(meta.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const lastBuild = sortedPosts[0] ? rfc822(sortedPosts[0].meta.date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${SITE}/blog</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
