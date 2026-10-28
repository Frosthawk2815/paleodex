// Screen-space decluttering for map markers: markers that would overlap are merged into one group
// (drawn as the highest-priority marker with a count), and labels that would overlap a label
// already placed are hidden.

export type Group<T> = {
  lead: T;
  members: T[];
  xy: [number, number];
  // Where the label goes, if it fits anywhere: its text anchor point and alignment.
  label?: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
  showLabel: boolean;
};

type Options<T> = {
  xy: (item: T) => [number, number];
  // Lower numbers win: they lead their group and get their label placed first.
  priority: (item: T) => number;
  label: (group: { lead: T; members: T[] }) => string;
  // Markers closer than this (in pixels) are grouped.
  radius?: number;
  // The area a group's icon covers, relative to its spot; labels are kept clear of every icon.
  icon?: (group: { lead: T; members: T[] }) => Rect;
  // Labels must fit inside this box (the visible map), if given.
  bounds?: Rect;
  // Groups that always get a label (e.g. the one the camera is following), even if it overlaps.
  mustLabel?: (group: { lead: T; members: T[] }) => boolean;
  // How far to the side of the spot a label beside the icon starts (default 22 px).
  sideGap?: (group: { lead: T; members: T[] }) => number;
  // Approximate width of one label character, and the label's height and offset below the spot.
  charWidth?: number;
  labelHeight?: number;
  labelOffset?: number;
};

export type Rect = { x0: number; y0: number; x1: number; y1: number };
const overlaps = (a: Rect, b: Rect) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

export function declutter<T>(items: T[], o: Options<T>): Group<T>[] {
  const radius = o.radius ?? 38;
  const ordered = items.map((item, i) => ({ item, i, p: o.priority(item) })).sort((a, b) => a.p - b.p || a.i - b.i);
  const groups: Group<T>[] = [];
  for (const { item } of ordered) {
    const [x, y] = o.xy(item);
    const near = groups.find((g) => Math.hypot(g.xy[0] - x, g.xy[1] - y) < radius);
    if (near) near.members.push(item);
    else groups.push({ lead: item, members: [item], xy: [x, y], showLabel: false });
  }
  // Labels in priority order (groups are already in that order); skip any that would collide.
  const charWidth = o.charWidth ?? 7.4;
  const labelHeight = o.labelHeight ?? 17;
  const labelOffset = o.labelOffset ?? 6;
  const icons = groups.map((g) => {
    const r = o.icon?.(g);
    return r ? { x0: g.xy[0] + r.x0, y0: g.xy[1] + r.y0, x1: g.xy[0] + r.x1, y1: g.xy[1] + r.y1 } : undefined;
  });
  const placed: Rect[] = [];
  for (const [k, g] of groups.entries()) {
    const text = o.label(g);
    const w = text.length * charWidth + 6;
    const [x, y] = g.xy;
    const gap = o.sideGap?.(g) ?? 22;
    // Try below the spot, then beside the icon on the right, then on the left.
    const options = [
      { r: { x0: x - w / 2, y0: y + labelOffset, x1: x + w / 2, y1: y + labelOffset + labelHeight }, at: { x, y: y + labelOffset + 12, anchor: 'middle' as const } },
      { r: { x0: x + gap, y0: y - 28, x1: x + gap + w, y1: y - 28 + labelHeight }, at: { x: x + gap + 3, y: y - 16, anchor: 'start' as const } },
      { r: { x0: x - gap - w, y0: y - 28, x1: x - gap, y1: y - 28 + labelHeight }, at: { x: x - gap - 3, y: y - 16, anchor: 'end' as const } },
    ];
    const b = o.bounds;
    const inside = (r: Rect) => !b || (r.x0 >= b.x0 && r.x1 <= b.x1 && r.y0 >= b.y0 && r.y1 <= b.y1);
    const fits = options.filter((opt) => inside(opt.r));
    const free = fits.find(
      (opt) => !icons.some((ic, j) => j !== k && ic !== undefined && overlaps(ic, opt.r)) && !placed.some((p) => overlaps(p, opt.r)),
    );
    const chosen = free ?? (o.mustLabel?.(g) ? (fits[0] ?? options[0]) : undefined);
    if (chosen) {
      placed.push(chosen.r);
      g.label = chosen.at;
      g.showLabel = true;
    }
  }
  return groups;
}
