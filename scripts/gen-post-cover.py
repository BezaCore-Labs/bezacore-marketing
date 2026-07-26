#!/usr/bin/env python3
"""Generate a blog post cover image (1000x420 — the 100:42 ratio dev.to renders).

Covers live beside the post they belong to:
    src/content/blog/<YYYY>/<MM>/<slug>/cover.png

Each cover is deterministically varied by slug — the accent colour rotates
through the brand palette and the circuit geometry shifts — so covers read as
one system without being identical week to week. Same slug always produces the
same cover (no randomness), so regenerating never churns the file.

    pnpm cover --slug blog-with-no-pipeline \
        --title "I had a blog with no pipeline feeding it" \
        --date 2026-07-25

Requires `chromium` on PATH. Fonts + brand mark are vendored in-repo.
"""
import argparse
import base64
import hashlib
import pathlib
import subprocess
import tempfile

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent
CONTENT = REPO / "src" / "content" / "blog"
MARK = REPO / "public" / "brand" / "bezacore-mark.png"
FONTS = HERE / "fonts"

W, H = 1000, 420

# Brand accent pairs (hot, cool), rotated per-post by slug hash so the series
# reads as one system with visual variety. Deliberately only three, each a
# clearly distinct hue — an earlier four-entry palette included gold #fbbf24
# alongside amber #f59e0b, which are indistinguishable at cover size and made
# the rotation look broken rather than varied.
PALETTE = [
    ("#f59e0b", "#1d4ed8"),  # amber / cobalt — the default studio pairing
    ("#ea580c", "#3b82f6"),  # fire  / azure  — warmer, for war-story posts
    ("#3b82f6", "#f59e0b"),  # azure / amber  — cool lead, inverted
]


def b64(p: pathlib.Path) -> str:
    return base64.b64encode(p.read_bytes()).decode()


def seed_of(slug: str) -> int:
    """Stable per-slug seed. hash() is salted per process, so use sha1."""
    return int(hashlib.sha1(slug.encode()).hexdigest()[:8], 16)


def geometry(seed: int) -> str:
    """Three circuit traces + nodes, positions derived from the seed.

    Everything stays right of x=470 so it can never collide with the title,
    which is clamped to a 620px column on the left.
    """
    def clamp(y: int) -> int:
        # Keep every trace fully on-canvas — an unclamped step could push the
        # bottom row past 420 and read as an accidental crop.
        return max(46, min(376, y))

    rows = []
    nodes = []
    for i in range(3):
        s = seed >> (i * 5)
        y_start = clamp(70 + ((s % 5) * 26) + i * 108)   # 70..370 band, spread by row
        y_end = clamp(y_start + (-56 if (s >> 3) % 2 else 56))
        x_in = 470 + ((s >> 1) % 4) * 34                 # where the trace enters
        x_turn = x_in + 90 + ((s >> 2) % 3) * 40         # where it steps
        hot = i == (seed % 3)                            # exactly one hot trace
        cls = "tr-hot" if hot else "tr-base"
        x_out = W if (s >> 4) % 2 else 930
        rows.append(
            f'<path class="{cls}" d="M{x_in} {y_start} H{x_turn} '
            f'L{x_turn + 58} {y_end} H{x_out}"/>'
        )
        nodes.append(f'<circle class="node" cx="{x_turn + 58}" cy="{y_end}" r="4"/>')
        if hot:
            nodes.append(f'<circle class="node" cx="{x_out}" cy="{y_end}" r="6"/>')
    return "\n  ".join(rows + nodes)


TEMPLATE = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family:'Plex Mono'; font-weight:500; src:url(data:font/woff2;base64,{mono500}) format('woff2'); }}
@font-face {{ font-family:'Plex Mono'; font-weight:600; src:url(data:font/woff2;base64,{mono600}) format('woff2'); }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ width:{w}px; height:{h}px; }}
body {{ position:relative; overflow:hidden; background:#050609;
        font-family:'Inter',system-ui,sans-serif; color:#fafafa; }}
.glow {{ position:absolute; inset:0; z-index:0; background:
    radial-gradient(52% 110% at 84% 34%, {accent}22 0%, transparent 64%),
    radial-gradient(44% 120% at 18% 92%, {accent2}1a 0%, transparent 62%); }}
.circuit {{ position:absolute; inset:0; z-index:0; opacity:.55;
  -webkit-mask-image:linear-gradient(90deg, transparent 0%, transparent 56%, #000 72%, #000 100%); }}
.tr-base {{ fill:none; stroke:{accent2}; stroke-opacity:.22; stroke-width:1.5; }}
.tr-hot  {{ fill:none; stroke:{accent}; stroke-opacity:.36; stroke-width:2; stroke-linecap:round; }}
.node    {{ fill:{accent}; fill-opacity:.55; }}
.grain {{ position:absolute; inset:0; z-index:1; opacity:.05; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }}
.rule {{ position:absolute; top:0; left:0; height:5px; width:100%; z-index:3;
  background:linear-gradient(90deg, {accent} 0%, #fbbf24 38%, {accent2} 100%); }}
.wrap {{ position:relative; z-index:2; width:100%; height:100%; padding:46px 54px;
  display:flex; flex-direction:column; justify-content:space-between; }}
.eyebrow {{ font-family:'Plex Mono'; font-weight:600; font-size:15px; letter-spacing:.26em;
  text-transform:uppercase; color:{accent}; }}
.title {{ font-size:{title_size}px; font-weight:800; line-height:1.1; letter-spacing:-.02em;
  max-width:620px; color:#fafafa; }}
.foot {{ display:flex; align-items:center; gap:13px; }}
.foot img {{ width:30px; height:30px; display:block; }}
.foot .name {{ font-family:'Plex Mono'; font-weight:600; font-size:14px; letter-spacing:.17em;
  text-transform:uppercase; color:#c7cad3; }}
.foot .dot {{ color:{accent}; }}
.foot .site {{ font-family:'Plex Mono'; font-weight:500; font-size:14px; letter-spacing:.1em; color:#7f8494; }}
</style></head><body>
<div class="glow"></div>
<svg class="circuit" viewBox="0 0 {w} {h}" preserveAspectRatio="none">
  {geometry}
</svg>
<div class="grain"></div>
<div class="rule"></div>
<div class="wrap">
  <div class="eyebrow">{eyebrow}</div>
  <div class="title">{title}</div>
  <div class="foot">
    <img src="data:image/png;base64,{logo}">
    <span class="name">BezaCore Labs</span>
    <span class="dot">&middot;</span>
    <span class="site">bezacore.com</span>
  </div>
</div>
</body></html>"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True, help="post slug (also the folder name)")
    ap.add_argument("--title", required=True)
    ap.add_argument("--date", required=True, help="post date, YYYY-MM-DD — sets the output folder")
    ap.add_argument("--eyebrow", default="BUILD IN PUBLIC")
    ap.add_argument("--accent", help="override the rotated accent, e.g. #ea580c")
    args = ap.parse_args()

    year, month, _ = args.date.split("-")
    out_dir = CONTENT / year / month / args.slug
    if not out_dir.is_dir():
        raise SystemExit(
            f"post folder not found: {out_dir}\n"
            "Create the post first (index.mdx), then generate its cover."
        )

    seed = seed_of(args.slug)
    accent, accent2 = PALETTE[seed % len(PALETTE)]
    if args.accent:
        accent = args.accent

    # Long titles step down so they stay within three lines of the 620px column.
    n = len(args.title)
    title_size = 58 if n <= 34 else 50 if n <= 52 else 43 if n <= 74 else 37

    html = TEMPLATE.format(
        w=W, h=H, accent=accent, accent2=accent2,
        mono500=b64(FONTS / "plex-mono-500.woff2"),
        mono600=b64(FONTS / "plex-mono-600.woff2"),
        logo=b64(MARK), eyebrow=args.eyebrow, title=args.title,
        title_size=title_size, geometry=geometry(seed),
    )
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        f.write(html)
        tmp = f.name

    out = out_dir / "cover.png"
    subprocess.run(
        ["chromium", "--headless", "--disable-gpu", "--hide-scrollbars",
         "--force-device-scale-factor=1", f"--screenshot={out}",
         f"--window-size={W},{H}", tmp],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    rel = out.relative_to(REPO)
    print(f"cover -> {rel}  ({W}x{H}, accent {accent}, title {title_size}px)")


if __name__ == "__main__":
    main()
