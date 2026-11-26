"""Trace the owner's line drawing of a horned dinosaur's skull (or other armour) into the shapes
Bone War draws when that animal's armour turns an attack.

The drawing is split into the areas its lines enclose. Each area is filled by what it is:
  bone   the skull and frill (anything not listed)
  hole   an opening right through the bone (the frill's fenestrae)
  horn   horns, and the small knobs and bumps (any area smaller than KNOB of the picture)
  ridge  a raised bar, like the frill's midline
A small area can be marked bone to keep it from being filled as a knob. "close": n bridges gaps of
up to about 2n pixels where the drawing's lines don't quite meet, when finding the areas, and
"add": [[x1, y1, x2, y2], ...] draws in short lines the owner asked to have closed.
and the owner's own lines are drawn on top, so the result matches the drawing.

Needs numpy, scipy, Pillow and potracer (pip install numpy scipy pillow potracer).

Usage (from the project root):
    python3 -I tools/frills/trace.py <drawing> <species-id> '<json: {"hole": [[x, y], ...], ...}>'
Points are pixel positions in the drawing, one inside each area of that kind. The traced shapes are
written into src/lib/bone-war-traced.ts.
"""

import json, re, sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd
import potrace

KNOB = 0.0025
OUT = 'src/lib/bone-war-traced.ts'
W, H = 100, 140

src, sid, marks = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
close = marks.pop('close', 0)
add = marks.pop('add', [])
img = Image.open(src)
a = np.asarray(img.convert('RGBA')).astype(int)
# Dark lines on a transparent or light background (or, once flattened, on black).
if a[:, :, 3].min() < 128:
    ink = a[:, :, 3] > 128
else:
    lum = a[:, :, :3].sum(2)
    ink = (a[:, :, 2] > 12) if lum.mean() < 60 else (lum < 384)
if add:
    from PIL import ImageDraw
    m = Image.fromarray(ink.astype(np.uint8) * 255)
    for x1, y1, x2, y2 in add:
        ImageDraw.Draw(m).line([(x1, y1), (x2, y2)], fill=255, width=5)
    ink = np.asarray(m) > 0
# Crop to the drawing, with a margin, so blank canvas doesn't shrink it. Marks stay in the
# original drawing's pixels.
ys, xs = np.nonzero(ink)
x0, y0 = max(xs.min() - 20, 0), max(ys.min() - 20, 0)
ink = ink[y0:ys.max() + 21, x0:xs.max() + 21]
closed = nd.binary_dilation(nd.binary_closing(ink, iterations=close) if close else ink, iterations=3)
lab, n = nd.label(~closed)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
h, w = ink.shape
s = min(W / w, H / h)
ox, oy = (W - w * s) / 2, (H - h * s) / 2

kind = {}
for k, pts in marks.items():
    for x, y in pts:
        x, y = x - x0, y - y0
        r = lab[int(y), int(x)]
        if not r:
            # On a line: take the area most of the nearby pixels belong to.
            win = lab[max(0, int(y) - 15):int(y) + 16, max(0, int(x) - 15):int(x) + 16].ravel()
            win = win[win > 0]
            r = np.bincount(win).argmax() if len(win) else 0
        assert r and r not in border, f'{k} point {x},{y} is not inside an area'
        kind[r] = k
sizes = nd.sum(np.ones_like(lab), lab, range(n + 1))
silhouette = ~np.isin(lab, list(border)) & (lab >= 0)
silhouette[np.isin(lab, list(border))] = False

# What's truly outside the drawing, up to the outer edge of its lines (bridged gaps aside), so no
# fill strays past an outline.
loose = nd.binary_dilation(ink, iterations=1)
llab, _ = nd.label(~loose)
lborder = np.unique(np.concatenate([llab[0], llab[-1], llab[:, 0], llab[:, -1]]))
outside = np.isin(llab, lborder[lborder > 0]) & nd.binary_dilation(~silhouette, iterations=8)
inside = ~nd.binary_dilation(outside, iterations=1)

def trace(mask, grow: int | None = 4, speck: int = 6, cut: int = 100):
    # Grow each area under its neighbouring lines, so the fills meet with no gaps. (The lines
    # themselves are kept close to as drawn, so close hatching stays readable.)
    if grow is not None:
        # Fills (not the lines themselves) are kept inside the outline.
        mask = (nd.binary_dilation(mask, iterations=grow) if grow else mask) & inside
    # Trace at a third of the size: the drawing only ever shows a few hundred pixels across. (The
    # tracer outlines the False pixels, hence the inversion.)
    small = np.asarray(Image.fromarray(mask.astype(np.uint8) * 255).resize((w // 3, h // 3), Image.BILINEAR)) > cut
    paths = potrace.Bitmap(~small).trace(turdsize=speck, alphamax=1.1, opttolerance=1.0)
    f = lambda p: f'{p.x * 3 * s + ox:.1f} {p.y * 3 * s + oy:.1f}'
    out = []
    for c in paths:
        d = f'M{f(c.start_point)}'
        for seg in c.segments:
            d += f'L{f(seg.c)}L{f(seg.end_point)}' if seg.is_corner else f'C{f(seg.c1)} {f(seg.c2)} {f(seg.end_point)}'
        out.append(d + 'Z')
    return ''.join(out)

# The skull's fill, clipped to the outline like every other fill.
layers = [('bone', trace(silhouette, grow=0))]
groups = {'ridge': [], 'hole': [], 'horn': []}
for r in range(1, n + 1):
    if r in border:
        continue
    k = kind.get(r) or ('horn' if sizes[r] < KNOB * h * w else None)
    if k and k != 'bone':
        groups[k].append(r)
# Knobs too small and thin to survive the line thickening above: closed areas between the lines
# as drawn that no other area reaches into.
reached = np.unique(llab[(lab > 0) & ~np.isin(lab, list(border))])
tiny = (llab > 0) & ~np.isin(llab, reached) & ~np.isin(llab, lborder)
for k in ('ridge', 'hole', 'horn'):
    if k == 'horn' and tiny.any() and not groups[k]:
        layers.append((k, trace(tiny, grow=2, speck=1)))
        continue
    if groups[k]:
        # Spread each fill out to the drawn lines (bridging gaps also fills narrow corners, like
        # the tips of spikes), without crossing any line.
        region = nd.binary_dilation(np.isin(lab, groups[k]), iterations=close + 4, mask=~loose & closed)
        if k == 'horn':
            region |= tiny
        # Keep the tiniest knobs, which would otherwise be dropped as specks.
        layers.append((k, trace(region, speck=1 if k == 'horn' else 6)))
# The lines, kept whole but not swollen, so small knobs' colour still shows inside them.
# The outline round the outside is drawn a little fuller, so it covers the fills' edges.
rim = nd.binary_dilation(ink, iterations=3) & nd.binary_dilation(outside, iterations=3)
layers.append(('line', trace(nd.binary_dilation(ink, iterations=1) | rim, grow=None, cut=150)))

entry = f"  '{sid}': [\n" + ''.join(f"    {{ fill: '{k}', d: '{d}' }},\n" for k, d in layers) + '  ],\n'
try:
    text = open(OUT).read()
except FileNotFoundError:
    text = None
if not text:
    text = (
        "// Bone War: armour traced from the owner's own drawings by tools/frills/trace.py. Do not edit by hand:\n"
        "// change the drawing and trace it again.\n\n"
        "export type TracedLayer = { fill: 'bone' | 'ridge' | 'hole' | 'horn' | 'line'; d: string };\n\n"
        'export const TRACED: Record<string, TracedLayer[]> = {\n};\n'
    )
text = re.sub(rf"  '{re.escape(sid)}': \[\n(?:    .*\n)*?  \],\n", '', text)
text = text.replace('\n};\n', '\n' + entry + '};\n', 1) if '\n};\n' in text else text
open(OUT, 'w').write(text)
print(f'{sid}: ' + ', '.join(f'{k} {len(d) // 1000}k' for k, d in layers))
