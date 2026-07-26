#!/usr/bin/env python3
"""One-off: the build-in-public pipeline diagram for post #1."""
import base64, pathlib, subprocess, tempfile

REPO = pathlib.Path.home() / "Projects/bezacore-marketing"
FONTS = REPO / "scripts/fonts"
OUT = REPO / "public/blog/blog-with-no-pipeline/pipeline.png"
W, H = 1240, 560


def b64(p): return base64.b64encode(p.read_bytes()).decode()


STAGES = [
    ("01", "DAILY CAPTURE", "#f59e0b", "1–3 raw bullets<br>at the end of a session",
     "build-log.md<br>one per project", "~1 min"),
    ("02", "WEEKLY DISTILL", "#fbbf24", "Read the week's seeds,<br>pick one angle",
     "One post,<br>one idea", "~60–90 min"),
    ("03", "PUBLISH CANONICAL", "#3b82f6", "The owned surface<br>where SEO accrues",
     "bezacore.com<br>/blog", "source of truth"),
    ("04", "SYNDICATE", "#1d4ed8", "Full copies, each with<br>a canonical tag home",
     "LinkedIn · dev.to<br>Medium", "~10 min"),
]

cards = []
for i, (num, title, accent, desc, artifact, cost) in enumerate(STAGES):
    cards.append(f"""
    <div class="card" style="--a:{accent}">
      <div class="num">{num}</div>
      <div class="ct">{title}</div>
      <div class="cd">{desc}</div>
      <div class="art">{artifact}</div>
      <div class="cost">{cost}</div>
    </div>""")
    if i < len(STAGES) - 1:
        cards.append('<div class="arrow"><svg viewBox="0 0 40 12"><path d="M0 6 H30 M24 1.5 L30 6 L24 10.5"/></svg></div>')

HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family:'Plex Mono'; font-weight:500; src:url(data:font/woff2;base64,{b64(FONTS/'plex-mono-500.woff2')}) format('woff2'); }}
@font-face {{ font-family:'Plex Mono'; font-weight:600; src:url(data:font/woff2;base64,{b64(FONTS/'plex-mono-600.woff2')}) format('woff2'); }}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{W}px;height:{H}px}}
body{{position:relative;overflow:hidden;background:#050609;color:#fafafa;
  font-family:'Inter',system-ui,sans-serif}}
.glow{{position:absolute;inset:0;background:
  radial-gradient(50% 70% at 15% 20%, #f59e0b18 0%, transparent 62%),
  radial-gradient(50% 70% at 85% 80%, #1d4ed816 0%, transparent 62%)}}
.rule{{position:absolute;top:0;left:0;height:4px;width:100%;
  background:linear-gradient(90deg,#f59e0b 0%,#fbbf24 38%,#1d4ed8 100%)}}
.wrap{{position:relative;padding:44px 48px;height:100%;display:flex;flex-direction:column}}
.eyebrow{{font-family:'Plex Mono';font-weight:600;font-size:15px;letter-spacing:.26em;
  text-transform:uppercase;color:#f59e0b}}
.h{{margin-top:10px;font-size:34px;font-weight:800;letter-spacing:-.02em}}
.sub{{margin-top:8px;font-size:17px;color:#9aa0ae}}
.row{{margin-top:34px;flex:1;display:flex;align-items:stretch;gap:10px}}
.card{{flex:1;border:1.5px solid color-mix(in oklab, var(--a) 38%, transparent);
  border-radius:14px;background:linear-gradient(160deg,#0d1120 0%,#070a13 100%);
  padding:20px 18px;display:flex;flex-direction:column;
  box-shadow:0 20px 50px -28px var(--a), inset 0 1px 0 #ffffff0a}}
.num{{font-family:'Plex Mono';font-weight:600;font-size:12px;letter-spacing:.2em;color:var(--a);opacity:.85}}
.ct{{margin-top:9px;font-size:18.5px;font-weight:700;letter-spacing:-.01em;line-height:1.2}}
.cd{{margin-top:11px;font-size:15px;line-height:1.5;color:#aeb4c2;flex:1}}
.art{{margin-top:12px;font-family:'Plex Mono';font-weight:500;font-size:13.5px;line-height:1.6;
  color:var(--a);border-top:1px solid #ffffff14;padding-top:11px}}
.cost{{margin-top:9px;font-family:'Plex Mono';font-weight:500;font-size:12px;
  letter-spacing:.12em;text-transform:uppercase;color:#6f7484}}
.arrow{{display:flex;align-items:center;width:34px;flex:0 0 34px}}
.arrow svg{{width:34px;fill:none;stroke:#f59e0b;stroke-opacity:.5;stroke-width:1.4;
  stroke-linecap:round;stroke-linejoin:round}}
.foot{{margin-top:26px;font-family:'Plex Mono';font-weight:500;font-size:12px;
  letter-spacing:.14em;text-transform:uppercase;color:#6f7484}}
.foot b{{color:#f59e0b;font-weight:500}}
</style></head><body>
<div class="glow"></div><div class="rule"></div>
<div class="wrap">
  <div class="eyebrow">The pipeline</div>
  <div class="h">Capture daily. Publish weekly.</div>
  <div class="sub">The expensive step runs on a schedule. The cheap step runs where the memory is.</div>
  <div class="row">{''.join(cards)}</div>
  <div class="foot">BezaCore Labs <b>&middot;</b> bezacore.com</div>
</div>
</body></html>"""

with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
    f.write(HTML)
    tmp = f.name
OUT.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(["chromium", "--headless", "--disable-gpu", "--hide-scrollbars",
                "--force-device-scale-factor=2", f"--screenshot={OUT}",
                f"--window-size={W},{H}", tmp], check=True,
               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print("diagram ->", OUT)
