import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

// Global MDX element styling for blog posts — matches the v3 aesthetic and the
// site's readable-column measure. App Router auto-applies this via @next/mdx.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2 className="text-gradient mt-12 text-2xl font-bold tracking-tight sm:text-3xl" {...props} />
    ),
    h3: (props: ComponentPropsWithoutRef<"h3">) => (
      <h3 className="mt-8 text-xl font-bold text-paper" {...props} />
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => (
      <p className="mt-5 text-lg leading-relaxed text-paper/75" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<"ul">) => (
      <ul
        className="mt-5 list-disc space-y-2 pl-6 text-lg leading-relaxed text-paper/75 marker:text-azure"
        {...props}
      />
    ),
    ol: (props: ComponentPropsWithoutRef<"ol">) => (
      <ol
        className="mt-5 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-paper/75 marker:text-azure"
        {...props}
      />
    ),
    a: (props: ComponentPropsWithoutRef<"a">) => (
      <a
        className="text-azure underline underline-offset-4 transition-colors hover:text-paper"
        {...props}
      />
    ),
    strong: (props: ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-semibold text-paper" {...props} />
    ),
    // Pull quote. Deliberately a plain markdown blockquote so the same source
    // renders acceptably on dev.to and Medium — the richness lives here, not in
    // platform-specific syntax that would fork the cross-posts.
    blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote
        className="relative my-10 rounded-r-lg border-l-[3px] border-amber bg-linear-to-r from-amber/[0.07] to-transparent py-5 pl-6 pr-4 text-xl font-medium leading-relaxed text-paper/90 sm:text-2xl"
        {...props}
      />
    ),
    code: (props: ComponentPropsWithoutRef<"code">) => (
      <code className="rounded bg-paper/10 px-1.5 py-0.5 font-mono text-[0.85em] text-amber" {...props} />
    ),
    // Fenced code blocks. `code` above styles inline spans, so reset those
    // rules inside a <pre> or every block would inherit the amber pill.
    pre: (props: ComponentPropsWithoutRef<"pre">) => (
      <pre
        className="mt-6 overflow-x-auto rounded-lg border border-paper/12 bg-black/40 p-5 font-mono text-sm leading-relaxed text-paper/85 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
        {...props}
      />
    ),
    // Body images (diagrams, screenshots). Referenced as plain markdown from
    // /public so the syntax stays portable to the cross-post channels.
    //
    // Breaks out wider than the 2xl prose column on large viewports — a
    // diagram rendered at reading width is unreadable. Measured widths:
    // 672px (base) → 800px at lg → 928px at xl, each comfortably inside its
    // breakpoint's viewport, so this can't reintroduce horizontal page scroll
    // (verified: documentElement.scrollWidth stays under window.innerWidth).
    img: (props: ComponentPropsWithoutRef<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="my-9 w-full rounded-lg border border-paper/12 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] lg:-mx-16 lg:w-[calc(100%+8rem)] lg:max-w-none xl:-mx-32 xl:w-[calc(100%+16rem)]"
        alt={props.alt ?? ""}
        {...props}
      />
    ),
    // Gradient divider rather than a flat hairline — used sparingly to mark a
    // real turn in the argument, not between every section.
    hr: () => (
      <hr className="my-12 h-px border-0 bg-linear-to-r from-transparent via-amber/45 to-transparent" />
    ),
    ...components,
  };
}
