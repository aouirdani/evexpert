#!/usr/bin/env python3
"""Génère les assets de marque EVExpert (SVG, PNG, ICO) — aucune dépendance npm.

    python3 scripts/build-brand-assets.py

Prérequis (outils de développement, jamais embarqués dans le site) :
    - fontTools + brotli   (pip install fonttools brotli)  : contours de la police
    - Pillow               (pip install pillow)             : optimisation PNG, ICO
    - rsvg-convert         (brew install librsvg)           : rastérisation SVG -> PNG

Source de vérité de la géométrie : les constantes ci-dessous. Le composant
src/components/brand/Logo.tsx reprend les mêmes chemins ; tests/unit/brand.test.ts
vérifie qu'ils restent identiques aux fichiers générés.
"""
from __future__ import annotations

import io
import struct
import subprocess
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "public" / "brand"
FONT = ROOT / "src" / "app" / "fonts" / "SchibstedGrotesk-latin-var.woff2"

# --- Palette (voir docs/design-system.md) ---------------------------------
INK, RAISED, LINE_INK = "#0B1626", "#16263B", "#2A3A52"
PAPER, SIGNAL, DEEP, INK_MUTED = "#F6F5F1", "#B8F13C", "#0F6B4F", "#A8B4C6"

# --- Géométrie du symbole (grille 64 × 64) --------------------------------
# Plaque : coins haut-gauche et bas-droit coupés (10 u).
PLATE = "M10 0H64V54L54 64H0V10Z"
# « E » : montant de 7 u + trois branches de longueurs croissantes (14 / 22 / 30 u)
# = trois niveaux de batterie. Un seul contour, angles vifs.
E_PATH = "M14 15H35V22H21V28.5H43V35.5H21V42H51V49H14Z"
# Point de signal : aligné sur l'extrémité de la branche la plus longue.
DOT = (47.5, 18.5, 3.5)
# Variante favicon : traits plus épais pour rester net à 16 px.
E_PATH_FAV = "M14 14H36V22H22V28H44V36H22V42H52V50H14Z"
DOT_FAV = (47.5, 18, 4.5)


def fmt(n: float) -> str:
    s = f"{n:.2f}".rstrip("0").rstrip(".")
    return s or "0"


def mark_group(tone: str = "light", fav: bool = False) -> str:
    """Éléments SVG du symbole dans la grille 64 × 64."""
    e = E_PATH_FAV if fav else E_PATH
    cx, cy, r = DOT_FAV if fav else DOT
    if tone == "dark":
        plate = f'<path fill="{RAISED}" stroke="{LINE_INK}" stroke-width="1" d="{PLATE}"/>'
        bars, dot = PAPER, SIGNAL
    else:
        plate = f'<path fill="{INK}" d="{PLATE}"/>'
        bars, dot = PAPER, SIGNAL
    return f'{plate}<path fill="{bars}" d="{e}"/><circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(r)}" fill="{dot}"/>'


# --- Texte -> contours (les SVG n'ont besoin d'aucune police) -------------
_fonts: dict[int, TTFont] = {}


def font_at(weight: int) -> TTFont:
    if weight not in _fonts:
        f = TTFont(FONT)
        _fonts[weight] = instantiateVariableFont(f, {"wght": weight}, inplace=False)
    return _fonts[weight]


def kern(font: TTFont, left: str, right: str) -> int:
    gpos = font["GPOS"].table
    for lookup in gpos.LookupList.Lookup:
        for st in lookup.SubTable:
            st = getattr(st, "ExtSubTable", st)
            if getattr(st, "Format", None) != 1 or left not in st.Coverage.glyphs:
                continue
            for rec in st.PairSet[st.Coverage.glyphs.index(left)].PairValueRecord:
                if rec.SecondGlyph == right and rec.Value1 is not None:
                    return getattr(rec.Value1, "XAdvance", 0) or 0
    return 0


def text_path(text: str, weight: int, size: float, x: float, y: float, fill: str,
              tracking: float = 0.0) -> tuple[str, float]:
    """Renvoie (<path>, largeur) pour `text` posé sur la ligne de base (x, y)."""
    f = font_at(weight)
    cmap, glyphs, hmtx = f.getBestCmap(), f.getGlyphSet(), f["hmtx"]
    upm = f["head"].unitsPerEm
    pen = SVGPathPen(glyphs, ntos=lambda v: fmt(v))
    cursor, prev = 0.0, None
    for ch in text:
        g = cmap[ord(ch)]
        if prev:
            cursor += kern(f, prev, g)
        glyphs[g].draw(TransformPen(pen, (1, 0, 0, 1, cursor, 0)))
        cursor += hmtx[g][0] + tracking * upm
        prev = g
    s = size / upm
    d = pen.getCommands()
    width = (cursor - tracking * upm) * s
    return (f'<path fill="{fill}" transform="translate({fmt(x)} {fmt(y)}) scale({s:.5f} {-s:.5f})" d="{d}"/>', width)


def cap_height(weight: int, size: float) -> float:
    f = font_at(weight)
    return f["OS/2"].sCapHeight * size / f["head"].unitsPerEm


# --- Logos ---------------------------------------------------------------
LOGO_H = 64
WORD_SIZE = 44
WORD_GAP = 16


def wordmark(x: float, tone: str, size: float = WORD_SIZE, base: float | None = None) -> tuple[str, float]:
    color = PAPER if tone == "dark" else INK
    cap = cap_height(800, size)
    y = base if base is not None else LOGO_H / 2 + cap / 2
    ev, w_ev = text_path("EV", 800, size, x, y, color, tracking=-0.015)
    ex, w_ex = text_path("Expert", 500, size, x + w_ev + size * 0.015, y, color, tracking=-0.005)
    return ev + ex, w_ev + size * 0.015 + w_ex


def logo_svg(tone: str) -> str:
    word, w = wordmark(LOGO_H + WORD_GAP, tone)
    total = LOGO_H + WORD_GAP + w
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(total)} {LOGO_H}" width="{fmt(total)}" height="{LOGO_H}" '
        f'role="img" aria-label="EVExpert"><title>EVExpert</title>{mark_group(tone)}{word}</svg>\n'
    )


def mark_svg(tone: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" '
        f'aria-label="EVExpert"><title>EVExpert</title>{mark_group(tone)}</svg>\n'
    )


def favicon_svg() -> str:
    cx, cy, r = DOT_FAV
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        "<style>.p{fill:%s}.b{fill:%s}.d{fill:%s}"
        "@media (prefers-color-scheme:dark){.p{fill:%s}.b{fill:%s}.d{fill:%s}}</style>"
        '<path class="p" d="%s"/><path class="b" d="%s"/><circle class="d" cx="%s" cy="%s" r="%s"/></svg>\n'
    ) % (INK, PAPER, SIGNAL, PAPER, INK, DEEP, PLATE, E_PATH_FAV, fmt(cx), fmt(cy), fmt(r))


def app_icon_svg(size: int = 512) -> str:
    """Icône d'application : fond paper plein cadre, symbole à 56 % (zone sûre « maskable »)."""
    scale = size * 0.56 / 64
    off = (size - 64 * scale) / 2
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">'
        f'<rect width="{size}" height="{size}" fill="{PAPER}"/>'
        f'<g transform="translate({fmt(off)} {fmt(off)}) scale({scale:.4f})">{mark_group("light", fav=True)}</g></svg>\n'
    )


# --- Image Open Graph 1200 × 630 -------------------------------------------
def og_svg() -> str:
    W, H = 1200, 630
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
           f'<rect width="{W}" height="{H}" fill="{INK}"/>']
    # Cadre de fiche technique : coins coupés comme la plaque du logo.
    m, c = 28, 40
    out.append(f'<path d="M{m + c} {m}H{W - m}V{H - m - c}L{W - m - c} {H - m}H{m}V{m + c}Z" fill="none" stroke="{LINE_INK}" stroke-width="2"/>')
    # Logo (mark 72 px de haut).
    k = 72 / 64
    word, w = wordmark(LOGO_H + WORD_GAP, "dark")
    out.append(f'<g transform="translate(84 76) scale({k:.4f})">{mark_group("dark")}{word}</g>')
    # Baseline : trois verbes, points en lime (écho du point de signal du logo).
    size, lead, x, y0 = 92, 96, 84, 268
    for i, word_ in enumerate(("Comprendre", "Comparer", "Calculer")):
        p, wd = text_path(word_, 800, size, x, y0 + i * lead, PAPER, tracking=-0.03)
        dot, _ = text_path(".", 800, size, x + wd - size * 0.035, y0 + i * lead, SIGNAL, tracking=-0.03)
        out += [p, dot]
    sub1, _ = text_path("Autonomie, recharge et coût réel", 500, 30, x, 528, INK_MUTED)
    sub2, _ = text_path("des voitures électriques", 500, 30, x, 566, INK_MUTED)
    out += [sub1, sub2]
    # Panneau « fiche technique » : trois jauges qui grandissent, comme les barres du symbole.
    # Illustratif : aucune valeur réelle n'est représentée.
    px, pw = 742, 380
    lab, _ = text_path("FICHE TECHNIQUE", 600, 17, px, 212, INK_MUTED, tracking=0.12)
    out += [lab, f'<path d="M{px} 232H{px + pw}" stroke="{LINE_INK}" stroke-width="2"/>']
    rows = [("AUTONOMIE WLTP", 0.42), ("RECHARGE 10-80 %", 0.68), ("COÛT AUX 100 KM", 0.92)]
    for i, (label, frac) in enumerate(rows):
        top = 282 + i * 92
        t, _ = text_path(label, 600, 17, px, top, INK_MUTED, tracking=0.12)
        by = top + 16
        out.append(f'<rect x="{px}" y="{by}" width="{pw}" height="34" fill="none" stroke="{LINE_INK}" stroke-width="2"/>')
        bw = (pw - 12) * frac
        out.append(f'<rect x="{px + 6}" y="{by + 6}" width="{fmt(bw)}" height="22" fill="{PAPER}"/>')
        out.append(t)
        if i == len(rows) - 1:
            out.append(f'<circle cx="{fmt(px + 6 + bw + 22)}" cy="{by + 17}" r="9" fill="{SIGNAL}"/>')
    # Règle graduée.
    ay = 548
    out.append(f'<path d="M{px} {ay}H{px + pw}" stroke="{LINE_INK}" stroke-width="2"/>')
    for j in range(0, 9):
        tx = px + j * pw / 8
        out.append(f'<path d="M{fmt(tx)} {ay}v{16 if j % 4 == 0 else 9}" stroke="{LINE_INK}" stroke-width="2"/>')
    out.append("</svg>\n")
    return "".join(out)


# --- Rastérisation --------------------------------------------------------
def rasterize(svg: str, width: int) -> Image.Image:
    proc = subprocess.run(["rsvg-convert", "-w", str(width), "-f", "png"], input=svg.encode(), capture_output=True, check=True)
    return Image.open(io.BytesIO(proc.stdout)).convert("RGBA")


def save_png(im: Image.Image, path: Path, colors: int | None) -> None:
    """PNG optimisé : palette réduite (aplats + anti-crénelage), sans tramage."""
    rgb = Image.new("RGB", im.size, PAPER)
    rgb.paste(im, mask=im.split()[3])
    if colors:
        rgb = rgb.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    rgb.save(path, "PNG", optimize=True)


def write_ico(path: Path, sizes: tuple[int, ...]) -> None:
    """ICO multi-tailles (entrées PNG) rendu directement depuis le SVG du favicon."""
    svg = favicon_svg()  # rsvg ignore la media query : rendu « clair », celui de l'ICO
    images = []
    for s in sizes:
        buf = io.BytesIO()
        rasterize(svg, s).save(buf, "PNG", optimize=True)
        images.append((s, buf.getvalue()))
    head = struct.pack("<HHH", 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries, blobs = b"", b""
    for s, data in images:
        entries += struct.pack("<BBBBHHII", s % 256, s % 256, 0, 0, 1, 32, len(data), offset + len(blobs))
        blobs += data
    path.write_bytes(head + entries + blobs)


def main() -> int:
    BRAND.mkdir(parents=True, exist_ok=True)
    files = {
        "logo.svg": logo_svg("light"),
        "logo-dark.svg": logo_svg("dark"),
        "logo-mark.svg": mark_svg("light"),
        "logo-mark-dark.svg": mark_svg("dark"),
        "favicon.svg": favicon_svg(),
    }
    for name, content in files.items():
        (BRAND / name).write_text(content, encoding="utf-8")
    write_ico(BRAND / "favicon.ico", (16, 32, 48))
    icon = app_icon_svg()
    for name, px in (("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)):
        save_png(rasterize(icon, px), BRAND / name, colors=16)
    og = og_svg()
    if "--keep-og-svg" in sys.argv:  # utile pour relire la composition ; non versionné
        (BRAND / "og-image.svg").write_text(og, encoding="utf-8")
    save_png(rasterize(og, 1200), BRAND / "og-image.png", colors=48)
    for p in sorted(BRAND.iterdir()):
        print(f"{p.stat().st_size:>7}  {p.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
