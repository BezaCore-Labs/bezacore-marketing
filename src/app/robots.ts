import type { MetadataRoute } from "next";

const SITE = "https://bezacore.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The form endpoints have nothing to index and shouldn't be crawled.
      disallow: "/api/",
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
