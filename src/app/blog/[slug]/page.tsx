import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { btnGhost } from "@/lib/ui";
import { getPost, posts } from "@/content/blog/posts";

// /blog/[slug] — renders a post's MDX body (compiled via @next/mdx) inside a
// readable article layout. Static params + metadata come from the registry.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const { meta, cover } = post;
  const url = `/blog/${meta.slug}`;
  // Per-post card. `cover.src` is a root-relative fingerprinted path, which
  // Next resolves to absolute against the root layout's metadataBase — social
  // scrapers reject relative image URLs.
  const images = [
    { url: cover.src, width: cover.width, height: cover.height, alt: meta.title },
  ];

  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.excerpt,
      url,
      publishedTime: meta.date,
      siteName: "BezaCore Labs",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.excerpt,
      images,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Content } = await post.load();
  const { meta } = post;

  return (
    <main className="flex flex-1 flex-col">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-paper/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 90% at 18% 0%, color-mix(in oklab, var(--color-cobalt) 13%, transparent), transparent 60%)",
          }}
        />
        <Container className="relative z-10 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-[0.16em] text-paper/40 transition-colors hover:text-paper"
            >
              ← Blog
            </Link>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-amber">
              {formatDate(meta.date)} · {meta.readingTime}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-paper sm:text-4xl">
              {meta.title}
            </h1>
            <div className="mt-6 h-1 w-16 rounded-full bg-linear-to-r from-gold via-fire to-cobalt" />
          </div>
        </Container>
      </section>

      {/* Body */}
      <article className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Content />
            <div className="mt-14 border-t border-paper/10 pt-10">
              <p className="text-lg font-semibold text-paper">Have something you need built or run?</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className={btnGhost}>
                  Start a project
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-2 py-3 font-mono text-sm text-azure transition-colors hover:text-paper"
                >
                  ← More posts
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </main>
  );
}
