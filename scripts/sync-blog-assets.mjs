/**
 * Mirror blog post images from their post folder into public/ so markdown can reach them.
 *
 * Authors keep ONE folder per post — the post and everything it needs:
 *
 *   src/content/blog/<YYYY>/<MM>/<slug>/
 *     index.mdx
 *     cover.png
 *     any-diagram.png
 *
 * Next only serves files from public/, and a post body written in portable
 * markdown (`![alt](/blog/<slug>/diagram.png)`) needs a real URL — it cannot
 * reference anything under src/. Rather than make the author split each post's
 * assets across two directories by hand, this mirrors them at build time to:
 *
 *   public/blog/<slug>/<image>
 *
 * public/blog/ is generated and gitignored; the post folder is the source of
 * truth. Runs automatically at the front of `pnpm dev` and `pnpm build`.
 *
 * Written in Node, not Python, deliberately: this runs inside `pnpm build`,
 * which happens in a node:alpine container with no python3. A build step must
 * only depend on tooling the image is guaranteed to have.
 */
import { readdir, mkdir, copyFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(REPO, "src", "content", "blog");
const PUBLIC = path.join(REPO, "public", "blog");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"]);

/** Every directory containing an index.mdx is a post. */
async function findPostDirs(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await findPostDirs(full)));
    else if (entry.name === "index.mdx") found.push(dir);
  }
  return [...new Set(found)];
}

async function main() {
  if (!existsSync(CONTENT)) {
    console.log("no blog content directory; nothing to sync");
    return;
  }

  // Rebuild from scratch so a renamed or deleted image can't linger in public/
  // and keep resolving after its source is gone.
  await rm(PUBLIC, { recursive: true, force: true });

  let copied = 0;
  for (const postDir of await findPostDirs(CONTENT)) {
    const slug = path.basename(postDir);
    for (const entry of await readdir(postDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      if (!IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) continue;
      const destDir = path.join(PUBLIC, slug);
      await mkdir(destDir, { recursive: true });
      await copyFile(path.join(postDir, entry.name), path.join(destDir, entry.name));
      copied += 1;
    }
  }

  console.log(`blog assets synced: ${copied} image(s) -> public/blog/`);
}

await main();
