"""Ručno izgrađen monogram A za Tapetariju Alekom.

Nije font glif. Svaki potez je zadat nizom tačaka svoje centralne linije, sa
izmerenom debljinom u svakoj tački. Tačke i debljine su izmerene sa originalnog
znaka (skeniranjem siluete po redovima i kolonama), a kontura se dobija
odmicanjem centralne linije u obe strane. Otuda kaligrafski kontrast debelih i
tankih poteza i osećaj rukom povučenog znaka.

Koordinatni sistem: y nadole, 0 je vrh slova.
"""

import math

# vodoravno sabijanje: silueta je uža i viša od originala
SQUEEZE = 0.94

# --- Potezi: (x, y, debljina) po centralnoj liniji ---------------------------

# Debeli desni potez: od vrha do stope. Debljina je skoro konstantna.
STEM = [
    (1046, 4, 18), (1002, 30, 60), (959, 60, 82), (931, 100, 89),
    (910, 140, 96), (892, 180, 100), (876, 220, 105), (863, 260, 105),
    (849, 300, 107), (835, 340, 107), (822, 380, 107), (808, 420, 107),
    (795, 460, 107), (783, 500, 109), (771, 540, 107), (757, 580, 107),
    (746, 620, 107), (733, 660, 107), (719, 700, 107), (708, 740, 107),
    (695, 780, 107), (684, 820, 107), (672, 860, 109), (663, 894, 113),
]

# Tanji levi potez: dug mekši ulazni luk od vrha, pa donja petlja koja se
# vraća ulevo i završava tankim zaobljenim vrhom.
DIAGONAL = [
    (1044, 6, 14), (915, 24, 32), (860, 42, 46), (807, 62, 56),
    (740, 100, 60), (694, 140, 65), (656, 180, 69), (625, 220, 69),
    (597, 260, 71), (573, 300, 73), (551, 340, 73), (531, 380, 73),
    (511, 420, 73), (492, 460, 71), (474, 500, 71), (457, 540, 71),
    (439, 580, 71), (422, 620, 69), (404, 660, 69), (384, 700, 69),
    (365, 740, 67), (344, 780, 65), (321, 820, 62), (294, 860, 62),
    (263, 900, 62), (219, 940, 63), (170, 974, 54), (108, 988, 46),
    (54, 972, 38), (23, 948, 29), (9, 924, 21), (7, 905, 11),
]

# Poprečni potez: iz spiralnog završetka levo, blago se izdiže do sredine,
# pa se spušta i uliva u debeli potez.
CROSSBAR = [
    (238, 618, 11), (204, 612, 19), (184, 594, 24), (179, 566, 26),
    (197, 545, 25), (232, 534, 22), (278, 518, 19), (318, 504, 17),
    (358, 498, 16), (430, 500, 16), (500, 507, 16), (568, 512, 17),
    (648, 517, 20), (724, 521, 26),
]

# Stopa: leva i desna ivica, izmerene po redovima. Donja ivica je ravna.
SERIF_LEFT = [(608, 876), (599, 900), (586, 920), (577, 930),
              (563, 940), (539, 950), (512, 960), (505, 968)]
SERIF_RIGHT = [(724, 876), (722, 900), (726, 920), (730, 930),
               (739, 940), (762, 950), (786, 960), (793, 968)]


def _catmull(points):
    """Kubni Bezier lanac koji prolazi kroz sve zadate tačke."""
    pts = [points[0]] + list(points) + [points[-1]]
    segments = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0)
        segments.append((p1[:2], c1, c2, p2[:2]))
    return segments


def _bezier(p0, c1, c2, p1, t):
    m = 1.0 - t
    a, b = m * m * m, 3 * m * m * t
    c, d = 3 * m * t * t, t * t * t
    return (a * p0[0] + b * c1[0] + c * c2[0] + d * p1[0],
            a * p0[1] + b * c1[1] + c * c2[1] + d * p1[1])


def _smooth(f):
    return f * f * (3.0 - 2.0 * f)


def _centerline(nodes, steps=16):
    """Uzorkuje centralnu liniju i debljinu duž nje."""
    segments = _catmull(nodes)
    out = []
    for i, seg in enumerate(segments):
        w0, w1 = nodes[i][2], nodes[i + 1][2]
        first = 0 if i == 0 else 1
        for k in range(first, steps + 1):
            t = k / steps
            x, y = _bezier(*seg, t)
            out.append((x, y, w0 + (w1 - w0) * _smooth(t)))
    return out


def _num(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def _simplify(pts, tol=0.7):
    """Ramer–Douglas–Peucker: izbacuje tačke koje ne menjaju oblik.
    Tolerancija je u jedinicama slova visine 1000, pa je nevidljiva."""
    if len(pts) < 3:
        return list(pts)
    ax, ay = pts[0]
    bx, by = pts[-1]
    dx, dy = bx - ax, by - ay
    norm = math.hypot(dx, dy)
    worst, index = -1.0, 0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        if norm < 1e-9:
            dist = math.hypot(px - ax, py - ay)
        else:
            dist = abs(dy * (px - ax) - dx * (py - ay)) / norm
        if dist > worst:
            worst, index = dist, i
    if worst <= tol:
        return [pts[0], pts[-1]]
    return _simplify(pts[:index + 1], tol)[:-1] + _simplify(pts[index:], tol)


def _smooth_path(pts, close=True):
    """Zatvorena kontura kao lanac kubnih krivih kroz zadate tačke."""
    d = [f"M{_num(pts[0][0])} {_num(pts[0][1])}"]
    for _, c1, c2, p1 in _catmull(pts):
        d.append(f"C{_num(c1[0])} {_num(c1[1])} {_num(c2[0])} {_num(c2[1])} "
                 f"{_num(p1[0])} {_num(p1[1])}")
    if close:
        d.append("Z")
    return "".join(d)


def _stroke(nodes, steps=16):
    """Kontura poteza: centralna linija odmaknuta u obe strane po debljini."""
    pts = _centerline(nodes, steps)
    n = len(pts)
    left, right = [], []
    for i, (x, y, w) in enumerate(pts):
        ax, ay = pts[max(0, i - 1)][:2]
        bx, by = pts[min(n - 1, i + 1)][:2]
        tx, ty = bx - ax, by - ay
        length = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / length, tx / length
        half = w / 2.0
        left.append((x + nx * half, y + ny * half))
        right.append((x - nx * half, y - ny * half))

    outline = _simplify(left) + _simplify(list(reversed(right)))
    return _smooth_path(outline), outline


def _serif():
    """Stopa kao zatvorena kontura: leva ivica, ravno dno, desna ivica."""
    pts = list(SERIF_LEFT) + list(reversed(SERIF_RIGHT))
    return _smooth_path(pts), pts


def monogram_path():
    """Ceo monogram kao jedna putanja. Svi potezi imaju istu orijentaciju,
    pa se preklapanja sabiraju u uniju pri nonzero punjenju."""
    parts, points = [], []
    for nodes, steps in ((STEM, 16), (DIAGONAL, 18), (CROSSBAR, 20)):
        d, p = _stroke(nodes, steps)
        parts.append(d)
        points += p
    d, p = _serif()
    parts.append(d)
    points += p
    return "".join(parts), points


def bounds():
    """Stvarne granice konture, računate iz generisanih tačaka."""
    _, pts = monogram_path()
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def monogram_svg(cap_height, cx, cy, optical_shift=0.014):
    """Monogram skaliran na zadatu visinu i centriran optički."""
    d, _ = monogram_path()
    x0, y0, x1, y1 = bounds()
    s = cap_height / (y1 - y0)
    sx = s * SQUEEZE
    width = (x1 - x0) * sx
    x = cx - width / 2 - x0 * sx - cap_height * optical_shift
    y = cy - cap_height / 2 - y0 * s
    return (f'<path transform="translate({x:.4g} {y:.4g}) '
            f'scale({sx:.6g} {s:.6g})" d="{d}"/>')


if __name__ == "__main__":
    d, _ = monogram_path()
    x0, y0, x1, y1 = bounds()
    print(f"putanja: {len(d)} znakova, {d.count('M')} poteza")
    print(f"granice: x {x0:.1f}..{x1:.1f}  y {y0:.1f}..{y1:.1f}")
    print(f"odnos širina/visina: {(x1 - x0) / (y1 - y0):.3f} "
          f"(sa sabijanjem {(x1 - x0) * SQUEEZE / (y1 - y0):.3f})")
