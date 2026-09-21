#!/usr/bin/env python3
"""Génère les schémas éditoriaux EVExpert (SVG originaux, 1200 × 675) dans public/editorial/.

    python3 scripts/build-editorial-figures.py            # écrit les SVG
    python3 scripts/build-editorial-figures.py --preview  # + planche PNG de contrôle (scratch)

Même style que l'identité de marque : fond paper, traits ink, accent lime, plaques aux coins
coupés. Tout le texte est converti en contours (police de marque) : les SVG n'ont besoin
d'aucune police ni ressource externe. Les schémas sont conceptuels : aucun ne représente
un modèle précis, et les exemples chiffrés sont signalés « exemple » ou « illustratif ».
Prérequis : ceux de scripts/build-brand-assets.py (fontTools, brotli, Pillow, rsvg-convert).
"""
from __future__ import annotations

import importlib.util
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "editorial"

_spec = importlib.util.spec_from_file_location("brand", ROOT / "scripts" / "build-brand-assets.py")
brand = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(brand)  # type: ignore[union-attr]

INK, PAPER, DEEP, SIGNAL, TINT = brand.INK, brand.PAPER, "#EDEBE4", brand.SIGNAL, "#E3F3B5"
MUTED, GREEN = "#556174", brand.DEEP
W, H = 1200, 675
fmt = brand.fmt


# --- Primitives -------------------------------------------------------------
_SPECIAL = {"→": 0.95, "≈": 0.72}  # signes absents de la police : dessinés à la main


def _glyph(ch: str, x: float, y: float, size: float, fill: str) -> str:
    w = _SPECIAL[ch] * size
    if ch == "→":
        my, l, r, a = y - size * 0.3, x + size * 0.06, x + w - size * 0.06, size * 0.17
        d = f"M{fmt(l)} {fmt(my)}H{fmt(r)}M{fmt(r - a)} {fmt(my - a)}L{fmt(r)} {fmt(my)}L{fmt(r - a)} {fmt(my + a)}"
    else:
        my, l, r, a = y - size * 0.3, x + size * 0.08, x + w - size * 0.08, size * 0.06
        d = "".join(f"M{fmt(l)} {fmt(my + k)}Q{fmt(l + (r - l) / 4)} {fmt(my + k - 2 * a)} {fmt((l + r) / 2)} {fmt(my + k)}T{fmt(r)} {fmt(my + k)}" for k in (-size * 0.09, size * 0.09))
    return f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{fmt(max(1.6, size * 0.075))}" stroke-linecap="round" stroke-linejoin="round"/>'


def _segments(s: str):
    buf = ""
    for ch in s:
        if ch in _SPECIAL:
            if buf:
                yield buf
            yield ch
            buf = ""
        else:
            buf += ch
    if buf:
        yield buf


DEFS: dict[tuple[int, str], tuple[str, str]] = {}  # (graisse, glyphe) -> (id, tracé) ; vidé à chaque schéma


def _w(weight: int) -> int:
    """Deux graisses seulement (courant 500, gras 800) : chaque glyphe n'est défini que deux fois au plus."""
    return 500 if weight < 650 else 800


HALF = 2  # coordonnées de glyphes divisées par 2 (1024 upm) : invisible à ces tailles, ~25 % plus léger


def _place(s: str, weight: int, tracking: float):
    """Positions (unités de police) des glyphes d'une chaîne, avec approche (kerning) et interlettrage."""
    weight = _w(weight)
    f = brand.font_at(weight)
    cmap, hm, upm = f.getBestCmap(), f["hmtx"], f["head"].unitsPerEm
    items, cur, prev = [], 0.0, None
    for ch in s:
        g = cmap[ord(ch)]
        if prev:
            cur += brand.kern(f, prev, g)
        items.append((g, cur / HALF))
        cur += hm[g][0] + tracking * upm
        prev = g
    return items, cur - tracking * upm, upm


def _def(weight: int, glyph: str) -> str:
    weight = _w(weight)
    key = (weight, glyph)
    if key not in DEFS:
        f = brand.font_at(weight)
        pen = brand.SVGPathPen(f.getGlyphSet(), ntos=lambda v: str(int(round(v / HALF))))
        f.getGlyphSet()[glyph].draw(pen)
        DEFS[key] = (f"g{len(DEFS)}", pen.getCommands())
    return DEFS[key][0]


def _measure(s: str, size: float, weight: int, tracking: float) -> float:
    total = 0.0
    for seg in _segments(s):
        if seg in _SPECIAL:
            total += _SPECIAL[seg] * size
        else:
            _, w, upm = _place(seg, weight, tracking)
            total += w * size / upm
    return total


def text(s: str, x: float, y: float, size: float = 24, weight: int = 500, fill: str = INK,
         anchor: str = "start", tracking: float = 0.0) -> str:
    """Texte en contours : un <g> par segment, glyphes partagés via <use> (fichiers ~5x plus légers)."""
    w = _measure(s, size, weight, tracking)
    cur = x + {"start": 0, "middle": -w / 2, "end": -w}[anchor]
    out = ""
    for seg in _segments(s):
        if seg in _SPECIAL:
            out += _glyph(seg, cur, y, size, fill)
            cur += _SPECIAL[seg] * size
        else:
            items, sw, upm = _place(seg, weight, tracking)
            k = size / upm * HALF
            uses = "".join(f'<use href="#{_def(weight, g)}" x="{int(round(px))}"/>' for g, px in items if g != "space")
            out += f'<g fill="{fill}" transform="translate({fmt(cur)} {fmt(y)}) scale({k:.5f} {-k:.5f})">{uses}</g>'
            cur += sw * size / upm
    return out


def width(s: str, size: float, weight: int = 500, tracking: float = 0.0) -> float:
    return _measure(s, size, weight, tracking)


def wrap(s: str, size: float, maxw: float, weight: int = 500) -> list[str]:
    lines, cur = [], ""
    for word in s.split():
        t = f"{cur} {word}".strip()
        if width(t, size, weight) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = word
    return lines + [cur]


def para(s: str, x: float, y: float, size: float, maxw: float, weight: int = 500, fill: str = INK,
         anchor: str = "start", lead: float = 1.3) -> str:
    return "".join(text(l, x, y + i * size * lead, size, weight, fill, anchor) for i, l in enumerate(wrap(s, size, maxw, weight)))


def rect(x, y, w, h, fill="none", stroke=INK, sw=3, rx=8, dash=None) -> str:
    d = f' stroke-dasharray="{dash}"' if dash else ""
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(w)}" height="{fmt(h)}" rx="{rx}" fill="{fill}"{st}{d}/>'


def plate(x, y, w, h, cut=18, fill="none", stroke=INK, sw=3, dash=None) -> str:
    d = f' stroke-dasharray="{dash}"' if dash else ""
    pts = f"M{x + cut} {y}H{x + w}V{y + h - cut}L{x + w - cut} {y + h}H{x}V{y + cut}Z"
    return f'<path d="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"{d}/>'


def line(x1, y1, x2, y2, color=INK, sw=3, dash=None, arrow=False) -> str:
    d = f' stroke-dasharray="{dash}"' if dash else ""
    out = f'<path d="M{fmt(x1)} {fmt(y1)}L{fmt(x2)} {fmt(y2)}" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" fill="none"{d}/>'
    if arrow:
        a = math.atan2(y2 - y1, x2 - x1)
        s = 14
        p1 = (x2 - s * math.cos(a - 0.45), y2 - s * math.sin(a - 0.45))
        p2 = (x2 - s * math.cos(a + 0.45), y2 - s * math.sin(a + 0.45))
        out += f'<path d="M{fmt(p1[0])} {fmt(p1[1])}L{fmt(x2)} {fmt(y2)}L{fmt(p2[0])} {fmt(p2[1])}" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    return out


def frame(title: str, body: str, note: str = "") -> str:
    """Cadre commun : surtitre, titre, corps, note d'exemple, signature de marque."""
    tl = wrap(title, 38, 1080, 800)
    head = text("SCHÉMA", 60, 52, 15, 700, GREEN, tracking=0.14)
    head += "".join(text(l, 60, 96 + i * 46, 38, 800, INK, tracking=-0.02) for i, l in enumerate(tl))
    foot = ""
    if note:
        foot += text(note, 60, 640, 18, 500, MUTED)
    mark = f'<g transform="translate(1072 622) scale(0.375)">{brand.mark_group("light")}</g>'
    foot += mark + text("evexpert.fr", 1064, 640, 18, 600, MUTED, "end")
    defs = "".join(f'<path id="{i}" d="{d}"/>' for i, d in DEFS.values())
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
            f'<defs>{defs}</defs><rect width="{W}" height="{H}" fill="{PAPER}"/>{head}{body}{foot}</svg>\n')


def curve(points: list[tuple[float, float]], color=INK, sw=5) -> str:
    """Courbe lissée (Catmull-Rom → Bézier) passant par les points."""
    d = f"M{fmt(points[0][0])} {fmt(points[0][1])}"
    for i in range(len(points) - 1):
        p0 = points[max(i - 1, 0)]; p1 = points[i]; p2 = points[i + 1]; p3 = points[min(i + 2, len(points) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f"C{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(p2[0])} {fmt(p2[1])}"
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'


# --- Schémas ----------------------------------------------------------------
def fig_ac_dc() -> str:
    b = ""
    for y, kind in ((215, "AC"), (435, "DC")):
        lab = "RECHARGE AC — courant alternatif" if kind == "AC" else "RECHARGE DC — courant continu"
        b += text(lab, 60, y - 26, 17, 700, GREEN, tracking=0.08)
        b += rect(60, y, 170, 96, DEEP) + text("Réseau", 145, y + 46, 25, 700, INK, "middle") + text("courant AC", 145, y + 76, 19, 500, MUTED, "middle")
        b += line(230, y + 48, 330, y + 48, INK, 3, arrow=True) + text("AC", 280, y + 34, 20, 700, INK, "middle")
        conv_in_car = kind == "AC"
        b += rect(330, y, 240, 96, DEEP if conv_in_car else SIGNAL, INK)
        b += text("Borne AC" if conv_in_car else "Borne DC", 450, y + 44, 25, 700, INK, "middle")
        b += text("relais de sécurité" if conv_in_car else "convertit AC → DC", 450, y + 74, 19, 500, INK if not conv_in_car else MUTED, "middle")
        b += line(570, y + 48, 700, y + 48, INK, 3, arrow=True) + text("AC" if conv_in_car else "DC", 635, y + 34, 20, 700, INK, "middle")
        b += plate(700, y - 30, 440, 156, 16, "none", INK, 3)
        b += text("VOITURE", 722, y - 6, 15, 700, MUTED, tracking=0.12)
        if conv_in_car:
            b += rect(722, y + 12, 190, 92, SIGNAL, INK) + text("Chargeur", 817, y + 50, 22, 700, INK, "middle") + text("embarqué : AC → DC", 817, y + 78, 17, 600, INK, "middle")
            b += line(912, y + 58, 960, y + 58, INK, 3, arrow=True) + text("DC", 936, y + 44, 17, 700, INK, "middle")
        else:
            b += rect(722, y + 12, 190, 92, "none", MUTED, 2, dash="8 7") + text("Chargeur embarqué", 817, y + 50, 17, 600, MUTED, "middle") + text("non utilisé", 817, y + 78, 17, 500, MUTED, "middle")
        b += rect(962, y + 12, 158, 92, DEEP, INK) + text("Batterie", 1041, y + 66, 25, 700, INK, "middle")
    b += rect(60, 596, 26, 26, SIGNAL, INK, 3, 4) + text("là où le courant alternatif est converti en continu", 100, 616, 20, 600, INK)
    return frame("Recharge AC ou DC : où le courant est-il converti ?", b)


def fig_weakest_link() -> str:
    b = text("Exemple illustratif : une borne de 22 kW et une voiture limitée à 11 kW en AC", 60, 150, 21, 600, MUTED)
    px, x0 = 27, 400
    for y, lab, sub, kw in ((190, "Borne", "puissance disponible", 22), (300, "Chargeur embarqué", "limite de la voiture en AC", 11)):
        b += text(lab, 60, y + 40, 26, 700, INK) + text(sub, 60, y + 70, 20, 500, MUTED)
        b += rect(x0, y, kw * px, 78, DEEP, INK) + text(f"{kw} kW", x0 + kw * px + 18, y + 50, 28, 800, INK)
    b += line(x0 + 11 * px / 2, 388, x0 + 11 * px / 2, 448, INK, 3, arrow=True)
    b += text("Puissance utilisée", 60, 500, 26, 700, INK) + text("la plus petite des deux", 60, 530, 20, 500, MUTED)
    b += rect(x0, 462, 11 * px, 92, SIGNAL, INK) + text("11 kW", x0 + 11 * px + 18, 520, 32, 800, INK)
    return frame("Puissance de recharge : le maillon le plus faible décide", b)


def fig_battery() -> str:
    x, y, w, h = 110, 250, 940, 150
    b = plate(x, y, w, h, 20, DEEP, INK, 4) + rect(x + w, y + 45, 26, 60, DEEP, INK, 4, 6)
    seg = w * 0.06
    b += rect(x + 4, y + 4, seg, h - 8, "none", MUTED, 2, 4, "7 6") + rect(x + w - 4 - seg, y + 4, seg, h - 8, "none", MUTED, 2, 4, "7 6")
    b += rect(x + 4 + seg, y + 4, w - 8 - 2 * seg, h - 8, SIGNAL, INK, 3, 4)
    b += text("capacité utile", x + w / 2, y + 88, 34, 800, INK, "middle")
    # accolades
    def brace(x1, x2, yy, up):
        d = 1 if up else -1
        return line(x1, yy, x1, yy - 14 * d, INK, 3) + line(x1, yy, x2, yy, INK, 3) + line(x2, yy, x2, yy - 14 * d, INK, 3)
    b += brace(x, x + w, y - 24, True) + text("CAPACITÉ BRUTE", x + w / 2, y - 48, 17, 700, GREEN, "middle", 0.1)
    b += brace(x + 4 + seg, x + w - 4 - seg, y + h + 24, False) + text("CAPACITÉ UTILE", x + w / 2, y + h + 62, 17, 700, GREEN, "middle", 0.1)
    b += para("La partie que la voiture laisse utiliser : c'est elle qui sert à calculer l'autonomie et le temps de charge.", x + w / 2, y + h + 96, 22, 760, 500, INK, "middle")
    b += text("réserve", x + 4 + seg / 2, y - 6, 15, 700, MUTED, "middle", 0.04) + text("réserve", x + w - 4 - seg / 2, y - 6, 15, 700, MUTED, "middle", 0.04)
    return frame("Batterie brute et batterie utile : deux capacités différentes", b, "Illustratif : la part de réserve varie selon les modèles.")


CURVE = [(0, 0.52), (10, 0.93), (20, 1.0), (35, 0.9), (50, 0.72), (65, 0.55), (80, 0.36), (90, 0.18), (100, 0.05)]
AX0, AX1, AY0, AY1 = 130, 1090, 540, 200  # origine x, fin x, base y, haut y


def cx(soc): return AX0 + soc / 100 * (AX1 - AX0)
def cy(rel): return AY0 - rel * (AY0 - AY1 - 40)


def axes() -> str:
    b = line(AX0, AY0, AX1 + 10, AY0, INK, 3, arrow=True) + line(AX0, AY0, AX0, AY1, INK, 3, arrow=True)
    b += text("niveau de la batterie (%)", AX1, AY0 + 70, 20, 600, MUTED, "end") + text("puissance de charge", AX0 + 12, AY1 + 6, 20, 600, MUTED)
    for t in (0, 10, 50, 80, 100):
        b += line(cx(t), AY0, cx(t), AY0 + 10, INK, 3) + text(str(t), cx(t), AY0 + 34, 19, 600, INK, "middle")
    return b


def fig_curve() -> str:
    band = rect(cx(10), AY1 + 20, cx(80) - cx(10), AY0 - AY1 - 20, TINT, None, 0, 0)
    pts = [(cx(s), cy(r)) for s, r in CURVE]
    b = band + axes() + curve(pts)
    b += text("fenêtre 10–80 %", (cx(10) + cx(80)) / 2, AY1 + 52, 26, 800, INK, "middle")
    b += line(cx(10), AY1 + 20, cx(10), AY0, GREEN, 2, "6 6") + line(cx(80), AY1 + 20, cx(80), AY0, GREEN, 2, "6 6")
    b += para("Au-delà de 80 %, la puissance diminue nettement.", cx(83), cy(0.36) - 70, 22, 300, 600, INK)
    return frame("Recharge rapide : pourquoi on s'arrête souvent à 80 %", b, "Schéma illustratif : la courbe réelle dépend de chaque modèle.")


def fig_peak_avg() -> str:
    pts = [(cx(s_), cy(r)) for s_, r in CURVE]
    seg = [(s_, r) for s_, r in CURVE if 10 <= s_ <= 80]
    area = sum((seg[i + 1][0] - seg[i][0]) * (seg[i][1] + seg[i + 1][1]) / 2 for i in range(len(seg) - 1)) / (seg[-1][0] - seg[0][0])
    b = axes() + curve(pts)
    peak = cy(1.0)
    b += line(AX0, peak, cx(20), peak, GREEN, 2, "6 6") + f'<circle cx="{fmt(cx(20))}" cy="{fmt(peak)}" r="11" fill="{SIGNAL}" stroke="{INK}" stroke-width="3"/>'
    b += text("pic annoncé", cx(20) + 26, peak - 42, 26, 800, INK) + text("la puissance maximale, atteinte brièvement", cx(20) + 26, peak - 16, 20, 500, MUTED)
    ya = cy(area)
    b += line(cx(10), ya, cx(80), ya, INK, 3, "10 7")
    b += text("puissance moyenne sur 10–80 %", cx(11), ya + 40, 22, 800, INK) + text("celle qui détermine la durée de charge", cx(11), ya + 66, 19, 500, MUTED)
    return frame("Puissance de charge DC : le pic n'est pas la moyenne", b, "Schéma illustratif : la courbe réelle dépend de chaque modèle.")


def fig_kw_kwh() -> str:
    b = plate(60, 190, 480, 300, 22, DEEP, INK, 3) + text("kWh", 300, 262, 54, 800, INK, "middle")
    b += text("l'ÉNERGIE stockée", 300, 302, 20, 700, GREEN, "middle", 0.1)
    b += rect(150, 335, 300, 96, "none", INK, 4, 8) + rect(452, 362, 18, 42, "none", INK, 4, 4) + rect(158, 343, 214, 80, SIGNAL, None, 0, 4)
    b += text("le réservoir", 300, 470, 22, 600, MUTED, "middle")
    b += plate(660, 190, 480, 300, 22, DEEP, INK, 3) + text("kW", 900, 262, 54, 800, INK, "middle")
    b += text("la PUISSANCE", 900, 302, 20, 700, GREEN, "middle", 0.1)
    for i, yy in enumerate((350, 383, 416)):
        b += line(730, yy, 1010, yy, INK, 4, arrow=True)
    b += text("le débit", 900, 470, 22, 600, MUTED, "middle")
    b += rect(60, 520, 1080, 96, SIGNAL, INK, 3, 8)
    b += text("durée ≈ énergie (kWh) ÷ puissance (kW)", 600, 566, 32, 800, INK, "middle")
    b += text("exemple : 60 kWh ÷ 11 kW ≈ 5 h 30, hors pertes de charge et limites de la voiture", 600, 600, 20, 600, INK, "middle")
    return frame("kW et kWh : le réservoir et le débit", b)


def fig_borne() -> str:
    steps = [
        ("1", "Branchement", "La borne détecte le câble et la voiture."),
        ("2", "Dialogue", "Elles échangent : courant maximal disponible, demande de charge."),
        ("3", "Autorisation", "Badge, appli ou reconnaissance automatique ; le connecteur est verrouillé."),
        ("4", "Charge", "AC : la voiture règle la charge. DC : la borne suit les besoins de la batterie."),
    ]
    b = ""
    cw, gap = 246, 32
    for i, (n, t, d) in enumerate(steps):
        x = 60 + i * (cw + gap)
        b += plate(x, 200, cw, 330, 18, SIGNAL if i == 3 else DEEP, INK, 3)
        b += f'<circle cx="{x + 46}" cy="252" r="24" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>' + text(n, x + 46, 262, 28, 800, INK, "middle")
        b += text(t, x + 22, 326, 28, 800, INK) + para(d, x + 22, 366, 21, cw - 44, 500, INK)
        if i < 3:
            b += line(x + cw + 4, 365, x + cw + gap - 4, 365, INK, 3, arrow=True)
    return frame("Une recharge, étape par étape : ce que fait une borne", b, "Schéma simplifié : le déroulé exact dépend du type de borne et du réseau.")


def fig_cost() -> str:
    boxes = [
        (60, "1 · Énergie à stocker", "capacité utile × part rechargée", "60 kWh × 70 % = 42 kWh", DEEP),
        (440, "2 · Énergie tirée du réseau", "÷ rendement de charge (environ 90 %)", "42 ÷ 0,90 ≈ 46,7 kWh", DEEP),
        (820, "3 · Coût de la recharge", "× prix du kWh", "46,7 × 0,25 € ≈ 11,67 €", SIGNAL),
    ]
    b = ""
    for x, t, f, ex, fill in boxes:
        b += plate(x, 190, 320, 340, 20, fill, INK, 3)
        b += para(t, x + 24, 240, 26, 272, 800, INK) + para(f, x + 24, 340, 21, 272, 500, MUTED)
        b += line(x + 24, 425, x + 296, 425, INK, 2, "5 6") + text("exemple", x + 24, 460, 17, 700, GREEN, tracking=0.1) + para(ex, x + 24, 495, 21, 272, 700, INK)
    b += line(384, 360, 436, 360, INK, 3, arrow=True) + line(764, 360, 816, 360, INK, 3, arrow=True)
    b += text("Les chiffres de l'exemple sont des hypothèses : remplacez-les par les vôtres dans le calculateur.", 60, 575, 21, 600, INK)
    return frame("Combien coûte une recharge : le calcul en trois étapes", b, "Exemple : 60 kWh utiles, recharge de 10 à 80 %, rendement 90 %, 0,25 €/kWh.")


def fig_tco() -> str:
    b = text("À ADDITIONNER", 60, 172, 16, 700, GREEN, tracking=0.12)
    items = ["Dépréciation : prix d'achat − valeur de revente", "Énergie (domicile, borne publique)", "Assurance", "Entretien et pneus", "Taxes"]
    for i, it in enumerate(items):
        y = 190 + i * 66
        b += rect(60, y, 560, 54, DEEP, INK, 3, 8) + text(it, 80, y + 35, 22, 600, INK)
    b += text("À DÉDUIRE", 60, 545, 16, 700, GREEN, tracking=0.12) + rect(60, 560, 560, 54, "none", INK, 3, 8, "9 7") + text("Aides applicables (selon votre situation)", 80, 595, 22, 600, INK)
    b += line(640, 400, 730, 400, INK, 3, arrow=True)
    b += plate(740, 250, 400, 300, 22, SIGNAL, INK, 3) + text("TCO", 940, 360, 64, 800, INK, "middle") + para("coût total sur toute la durée de détention", 940, 405, 23, 330, 700, INK, "middle")
    b += text("÷ mois ou km → coût comparable", 940, 590, 21, 700, INK, "middle")
    return frame("Le coût total de possession (TCO) : ce qui s'additionne", b)


def fig_wltc() -> str:
    phases = [("Basse", 589, 56.5), ("Moyenne", 433, 76.6), ("Haute", 455, 97.4), ("Très haute", 323, 131.3)]
    total = sum(p[1] for p in phases)
    x = 90
    sx = 1020 / total
    sy = 2.35
    base = 560
    b = line(60, base, 1130, base, INK, 3, arrow=True)
    for name, dur, vmax in phases:
        w = dur * sx
        b += rect(x, base - vmax * sy, w - 6, vmax * sy, SIGNAL if name == "Très haute" else DEEP, INK, 3, 6)
        b += text(name, x + (w - 6) / 2, base - vmax * sy + 40, 24, 800, INK, "middle")
        b += text(f"{dur} s", x + (w - 6) / 2, base - vmax * sy + 72, 21, 600, INK, "middle")
        b += text(f"jusqu'à {str(vmax).replace('.', ',')} km/h", x + (w - 6) / 2, base + 34, 19, 600, INK, "middle")
        x += w
    b += text("largeur des blocs = durée de la phase · hauteur = vitesse maximale", 60, 196, 19, 600, MUTED)
    return frame("Le cycle WLTC : quatre phases, environ 30 minutes", b, "WLTC classe 3 : 1 800 s au total, 23,25 km, vitesse moyenne ≈ 46,5 km/h.")


def fig_drag() -> str:
    pts_v = [40, 60, 80, 90, 100, 110, 120, 130, 140, 150]
    def px(v): return AX0 + (v - 40) / 110 * (AX1 - AX0)
    def py(i): return AY0 - i / 300 * (AY0 - AY1 - 30)
    pts = [(px(v), py((v / 90) ** 2 * 100)) for v in pts_v]
    b = line(AX0, AY0, AX1 + 10, AY0, INK, 3, arrow=True) + line(AX0, AY0, AX0, AY1, INK, 3, arrow=True)
    b += text("vitesse (km/h)", AX1, AY0 + 70, 20, 600, MUTED, "end") + text("résistance de l'air (indice, 100 à 90 km/h)", AX0 + 12, AY1 + 6, 20, 600, MUTED)
    for v in (50, 90, 110, 130, 150):
        b += line(px(v), AY0, px(v), AY0 + 10, INK, 3) + text(str(v), px(v), AY0 + 34, 19, 600, INK, "middle")
    b += curve(pts)
    for v, lab in ((90, "100"), (110, "≈ 149"), (130, "≈ 209")):
        i = (v / 90) ** 2 * 100
        b += f'<circle cx="{fmt(px(v))}" cy="{fmt(py(i))}" r="10" fill="{SIGNAL}" stroke="{INK}" stroke-width="3"/>'
        b += text(lab, px(v) - 20, py(i) - 20, 26, 800, INK, "end")
    b += text("×2 entre 90 et 130 km/h", px(96), py(260), 26, 800, INK)
    return frame("Pourquoi l'autoroute consomme davantage : la résistance de l'air", b, "Force de traînée croissant avec le carré de la vitesse ; résistance au roulement non représentée.")


FIGURES = {
    "recharge-ac-dc-conversion.svg": fig_ac_dc,
    "puissance-recharge-maillon-faible.svg": fig_weakest_link,
    "batterie-brute-batterie-utile.svg": fig_battery,
    "courbe-de-charge-10-80.svg": fig_curve,
    "puissance-dc-pic-et-moyenne.svg": fig_peak_avg,
    "kw-kwh-reservoir-debit.svg": fig_kw_kwh,
    "fonctionnement-borne-de-recharge.svg": fig_borne,
    "cout-recharge-trois-etapes.svg": fig_cost,
    "tco-postes-de-cout.svg": fig_tco,
    "cycle-wltc-quatre-phases.svg": fig_wltc,
    "resistance-air-vitesse.svg": fig_drag,
}


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in FIGURES.items():
        DEFS.clear()
        svg = fn()
        (OUT / name).write_text(svg, encoding="utf-8")
        # Copie PNG 1200 × 675 : les réseaux sociaux et Google Discover n'acceptent pas le SVG en og:image.
        png = OUT / name.replace(".svg", ".png")
        brand.save_png(brand.rasterize(svg, W), png, colors=48)
        print(f"{(OUT / name).stat().st_size:>7} svg  {png.stat().st_size:>6} png  public/editorial/{name}")
    if "--preview" in sys.argv:
        from PIL import Image
        import io
        sheet = Image.new("RGB", (2 * 600, ((len(FIGURES) + 1) // 2) * 338), "#888")
        for i, name in enumerate(FIGURES):
            im = brand.rasterize((OUT / name).read_text(), 600).convert("RGB")
            sheet.paste(im, ((i % 2) * 600, (i // 2) * 338))
        target = Path(sys.argv[sys.argv.index("--preview") + 1]) if len(sys.argv) > sys.argv.index("--preview") + 1 else Path("figures-preview.png")
        sheet.save(target)
        print("aperçu :", target)
    return 0


if __name__ == "__main__":
    sys.exit(main())
