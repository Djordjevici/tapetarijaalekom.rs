"""Rekonstrukcija logotipa Tapetarije Alekom kao pravi vektor.

Slova nisu trasirana iz PNG-a — krive su izvučene iz Fraunces fonta
(fontTools), pa je svaki glif ručno pozicioniran i rotiran po luku kruga.
Rezultat ne zavisi od prisustva fonta na sistemu.
"""

import json
import math
import os

G = json.load(open(os.environ.get("GLYPHS", "/tmp/logo/glyphs.json")))
UPEM = G["upem"]

CX = CY = 100.0
R_RING = 95.0
RING_W = 1.8
CAP = 12.0           # visina verzala u kružnom tekstu
BAND_OUTER = 89.0    # spoljna ivica tekstualnog pojasa
R_TOP = BAND_OUTER - CAP
R_BOT = BAND_OUTER
R_STITCH = 84.0      # radijus bakarnog šava i tačaka
TRACK = 0.14         # dodatni razmak između slova, u em

CAP_RATIO = 0.72     # visina verzala Fraunces-a u odnosu na upem
FS_ARC = CAP / CAP_RATIO

INK_DARK = "#1C2F2A"
INK_LIGHT = "#E7E6E0"
COPPER = "#BE7242"

MONO_VARIANT = "italic_wonk1"


def fmt(v: float) -> str:
    # 6 značajnih cifara: koordinate ostaju kratke, a sitni scale faktori
    # (npr. 0.0055) ne izgube preciznost pri zaokruživanju
    s = f"{v:.6g}"
    if "e" in s or "E" in s:
        s = f"{v:.8f}".rstrip("0").rstrip(".")
    return s if s not in ("", "-0", "0.0") else "0"


def line_text(text: str, font_size: float, track_em: float):
    """Vodoravni tekst kao krive. Vraća (putanje, ukupna širina)."""
    scale = font_size / UPEM
    track = track_em * font_size
    parts, x = [], 0.0
    for ch in text:
        if ch == " ":
            x += font_size * 0.32 + track
            continue
        g = G["roman"][ch]
        parts.append(
            f'<path transform="translate({fmt(x)} 0) '
            f'scale({fmt(scale)} {fmt(-scale)})" d="{g["d"]}"/>'
        )
        x += g["adv"] * scale + track
    return "".join(parts), max(0.0, x - track)


def arc_text(text: str, radius: float, font_size: float, bottom: bool):
    """Postavi tekst po luku, glif po glif, sa pravim širinama iz fonta."""
    glyphs = [G["roman"][c] for c in text]
    scale = font_size / UPEM
    track = TRACK * font_size

    widths = [g["adv"] * scale for g in glyphs]
    total = sum(widths) + track * (len(glyphs) - 1)
    total_angle = math.degrees(total / radius)

    parts, walked = [], 0.0
    for ch, g, w in zip(text, glyphs, widths):
        offset = math.degrees((walked + w / 2 - total / 2) / radius)
        theta = (180 - offset) if bottom else offset

        chain = [f"translate({fmt(CX)} {fmt(CY)})", f"rotate({fmt(theta)})",
                 f"translate(0 {fmt(-radius)})"]
        if bottom:
            chain.append("rotate(180)")
        chain += [f"scale({fmt(scale)} {fmt(-scale)})",
                  f"translate({fmt(-g['adv'] / 2)} 0)"]

        parts.append(f'    <path transform="{" ".join(chain)}" '
                     f'd="{g["d"]}"/><!-- {ch} -->')
        walked += w + track

    return "\n".join(parts), total_angle


def monogram(cap_height: float, cx: float = CX, cy: float = CY) -> str:
    g = G[MONO_VARIANT]["A"]
    scale = cap_height / (CAP_RATIO * UPEM)
    w = g["adv"] * scale
    # kurzivni A je optički desno od svoje širine, pa ga blago vraćamo ulevo
    x = cx - w / 2 - cap_height * 0.055
    return (f'<path transform="translate({fmt(x)} {fmt(cy + cap_height / 2)}) '
            f'scale({fmt(scale)} {fmt(-scale)})" d="{g["d"]}"/>')


def polar(angle_deg: float, radius: float):
    a = math.radians(angle_deg)
    return CX + radius * math.sin(a), CY - radius * math.cos(a)


def stitch_arc(start: float, end: float, radius: float) -> str:
    x1, y1 = polar(start, radius)
    x2, y2 = polar(end, radius)
    large = 1 if abs(end - start) > 180 else 0
    sweep = 1 if end > start else 0
    return (f'M{fmt(x1)} {fmt(y1)} A{fmt(radius)} {fmt(radius)} 0 '
            f'{large} {sweep} {fmt(x2)} {fmt(y2)}')


def build_seal(ink: str, copper: str, mono: bool = False) -> str:
    """Puni pečat sa kružnim tekstom. Za veličine od oko 64 px i više."""
    top, angle_top = arc_text("ALEKOM", R_TOP, FS_ARC, bottom=False)
    bottom, angle_bot = arc_text("TAPETARIJA", R_BOT, FS_ARC, bottom=True)

    ink_c = "currentColor" if mono else ink
    copper_c = "currentColor" if mono else copper

    pad, gap, dot = 7.0, 7.5, 2.05
    right_a = angle_top / 2 + pad
    right_b = 180 - angle_bot / 2 - pad
    seg = [stitch_arc(right_a, 90 - gap, R_STITCH),
           stitch_arc(90 + gap, right_b, R_STITCH),
           stitch_arc(-right_a, -(90 - gap), R_STITCH),
           stitch_arc(-(90 + gap), -right_b, R_STITCH)]

    dxr, dyr = polar(90, R_STITCH)
    dxl, dyl = polar(-90, R_STITCH)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="t">
  <title id="t">Tapetarija Alekom</title>
  <circle cx="{fmt(CX)}" cy="{fmt(CY)}" r="{fmt(R_RING)}" fill="none"
          stroke="{ink_c}" stroke-width="{fmt(RING_W)}"/>
  <g fill="none" stroke="{copper_c}" stroke-width="1.3" stroke-linecap="round"
     stroke-dasharray="1.3 5.2">
    <path d="{seg[0]}"/>
    <path d="{seg[1]}"/>
    <path d="{seg[2]}"/>
    <path d="{seg[3]}"/>
  </g>
  <g fill="{ink_c}">
    <circle cx="{fmt(dxr)}" cy="{fmt(dyr)}" r="{fmt(dot)}"/>
    <circle cx="{fmt(dxl)}" cy="{fmt(dyl)}" r="{fmt(dot)}"/>
  </g>
  <g fill="{ink_c}" aria-hidden="true">
{top}
{bottom}
  </g>
  <g fill="{ink_c}" aria-hidden="true">
    {monogram(70.0)}
  </g>
</svg>
'''


def build_mark(ink: str, copper: str, mono: bool = False) -> str:
    """Uprošćen znak: prsten, monogram, tačkasti šav. Za 24 px i više."""
    ink_c = "currentColor" if mono else ink
    copper_c = "currentColor" if mono else copper
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="m">
  <title id="m">Alekom</title>
  <circle cx="100" cy="100" r="91" fill="none" stroke="{ink_c}" stroke-width="7"/>
  <g fill="none" stroke="{copper_c}" stroke-width="8" stroke-linecap="round"
     stroke-dasharray="0.1 27">
    <path d="{stitch_arc(40, 140, 73)}"/>
    <path d="{stitch_arc(-40, -140, 73)}"/>
  </g>
  <g fill="{ink_c}" aria-hidden="true">
    {monogram(84.0)}
  </g>
</svg>
'''


def build_mark_tiny(ink: str, mono: bool = False) -> str:
    """Najprostija verzija za 16 px: samo debeo prsten i monogram."""
    ink_c = "currentColor" if mono else ink
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-labelledby="s">
  <title id="s">Alekom</title>
  <circle cx="100" cy="100" r="89" fill="none" stroke="{ink_c}" stroke-width="13"/>
  <g fill="{ink_c}" aria-hidden="true">
    {monogram(104.0)}
  </g>
</svg>
'''


def build_lockup(ink: str, copper: str, mono: bool = False) -> str:
    """Vodoravni lockup za header: znak + naziv u dva reda."""
    ink_c = "currentColor" if mono else ink
    copper_c = "currentColor" if mono else copper

    name, name_w = line_text("ALEKOM", 25.0, 0.10)
    # podnaslov se razvlači tako da se poravna sa desnom ivicom naziva
    sub_size = 11.0
    sub_raw, _ = line_text("TAPETARIJA", sub_size, 0.0)
    letters = len("TAPETARIJA")
    plain_w = sum(G["roman"][c]["adv"] for c in "TAPETARIJA") * sub_size / UPEM
    sub_track = (name_w - plain_w) / (letters - 1) / sub_size
    sub, sub_w = line_text("TAPETARIJA", sub_size, max(0.06, sub_track))

    mark = 58.0
    gap = 15.0
    text_x = mark + gap
    width = text_x + max(name_w, sub_w) + 1
    height = 62.0
    ms = mark / 200.0

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(width)} {fmt(height)}" role="img" aria-labelledby="l">
  <title id="l">Tapetarija Alekom</title>
  <g transform="translate(0 {fmt((height - mark) / 2)}) scale({fmt(ms)})">
    <circle cx="100" cy="100" r="91" fill="none" stroke="{ink_c}" stroke-width="7"/>
    <g fill="none" stroke="{copper_c}" stroke-width="8" stroke-linecap="round"
       stroke-dasharray="0.1 27">
      <path d="{stitch_arc(40, 140, 73)}"/>
      <path d="{stitch_arc(-40, -140, 73)}"/>
    </g>
    <g fill="{ink_c}">{monogram(84.0)}</g>
  </g>
  <g fill="{ink_c}" aria-hidden="true" transform="translate({fmt(text_x)} 29)">
    {name}
  </g>
  <path d="M{fmt(text_x)} 36.5 h{fmt(max(name_w, sub_w))}" stroke="{copper_c}"
        stroke-width="1.1" stroke-linecap="round" stroke-dasharray="1.1 4.4"/>
  <g fill="{ink_c}" aria-hidden="true" transform="translate({fmt(text_x)} 52)">
    {sub}
  </g>
</svg>
'''


OUT = "/workspace/public/logo"
os.makedirs(OUT, exist_ok=True)

files = {
    "alekom-seal.svg": build_seal(INK_DARK, COPPER),
    "alekom-seal-dark.svg": build_seal(INK_LIGHT, COPPER),
    "alekom-seal-mono.svg": build_seal(INK_DARK, COPPER, mono=True),
    "alekom-mark.svg": build_mark(INK_DARK, COPPER),
    "alekom-mark-dark.svg": build_mark(INK_LIGHT, COPPER),
    "alekom-mark-mono.svg": build_mark(INK_DARK, COPPER, mono=True),
    "alekom-lockup.svg": build_lockup(INK_DARK, COPPER),
    "alekom-lockup-dark.svg": build_lockup(INK_LIGHT, COPPER),
    "alekom-lockup-mono.svg": build_lockup(INK_DARK, COPPER, mono=True),
    "favicon.svg": build_mark(INK_DARK, COPPER),
    "favicon-tiny.svg": build_mark_tiny(INK_DARK),
    "favicon-tiny-dark.svg": build_mark_tiny(INK_LIGHT),
}

# druga opcija monograma, za poređenje pre finalizacije
MONO_VARIANT = "italic_wonk0"
files["alekom-seal-alt-a.svg"] = build_seal(INK_DARK, COPPER)
MONO_VARIANT = "italic_wonk1"

for name, svg in files.items():
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(svg)
    print(f"{name:26} {len(svg):6} B")
