"""Show the areas tools/frills/trace.py will find in a drawing, to choose its marks.

Prints each enclosed area's size and a point inside it (in the drawing's own pixels, nearest its
centre) and writes a picture with
each area in its own colour.

Usage (from the project root):
    python3 -I tools/frills/areas.py <drawing> <out.png> [close]
"""

import sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd

src, out = sys.argv[1], sys.argv[2]
close = int(sys.argv[3]) if len(sys.argv) > 3 else 0
a = np.asarray(Image.open(src).convert('RGBA')).astype(int)
if a[:, :, 3].min() < 128:
    ink = a[:, :, 3] > 128
else:
    lum = a[:, :, :3].sum(2)
    ink = (a[:, :, 2] > 12) if lum.mean() < 60 else (lum < 384)
closed = nd.binary_dilation(nd.binary_closing(ink, iterations=close) if close else ink, iterations=3)
lab, n = nd.label(~closed)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
rng = np.random.default_rng(1)
img = np.full(a.shape[:2] + (3,), 255, np.uint8)
img[closed] = 0
for i in range(1, n + 1):
    if i in border:
        continue
    m = lab == i
    ys, xs = np.nonzero(m)
    if len(ys) < 10:
        continue
    img[m] = rng.integers(60, 230, 3)
    k = np.argmin((xs - xs.mean()) ** 2 + (ys - ys.mean()) ** 2)
    print(i, len(ys), int(xs[k]), int(ys[k]))
ys, xs = np.nonzero(ink)
Image.fromarray(img[max(ys.min() - 20, 0):ys.max() + 21, max(xs.min() - 20, 0):xs.max() + 21]).save(out)
