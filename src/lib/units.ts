// Metric to imperial conversion for page text. Measurements are written in metric inside the text
// ("about 7 m long", "2–3 tonnes"), so they are found and rewritten as the text is shown.

export type Units = 'metric' | 'imperial';

type Target = { factor: number; unit: string; long: string; longOne: string };

const NUM = String.raw`\d[\d,]*(?:\.\d+)?`;
// A number or range ("7", "3–4", "3 to 4"), an optional space or hyphen ("12-tonne"), then a unit.
const MEASURE = new RegExp(
  String.raw`(−)?(${NUM})(?:(\s?[–-]\s?| to | and | or )(${NUM}))?([\s-]?)` +
    String.raw`(km\/h|square kilometres|kilometres?|centimetres?|millimetres?|metres?|kilograms?|grams?|tonnes?|°C|km²|km|cm|mm|kg|m|g|t)(?![\w²])`,
  'g',
);

const num = (s: string) => Number(s.replace(/,/g, ''));

// Rounds to a sensible precision for the size of the number, as the sources are approximate.
function round(v: number): string {
  let r: number;
  if (v < 1) r = Number(v.toPrecision(1));
  else if (v < 10) r = Math.round(v * 10) / 10;
  else if (v < 100) r = Math.round(v);
  else {
    const p = 10 ** (Math.floor(Math.log10(v)) - 1);
    r = Math.round(v / p) * p;
  }
  return r.toLocaleString('en-US');
}

const FT: Target = { factor: 3.28084, unit: 'ft', long: 'feet', longOne: 'foot' };
const IN: Target = { factor: 1 / 2.54, unit: 'in', long: 'inches', longOne: 'inch' };
const MI: Target = { factor: 0.621371, unit: 'mi', long: 'miles', longOne: 'mile' };
const LB: Target = { factor: 2.20462, unit: 'lb', long: 'pounds', longOne: 'pound' };
const OZ: Target = { factor: 0.035274, unit: 'oz', long: 'ounces', longOne: 'ounce' };
const TON: Target = { factor: 1.10231, unit: 'tons', long: 'tons', longOne: 'ton' };

// The metric unit's value in a base unit (metres, grams), and which imperial unit suits a value.
function pick(unit: string, max: number): { base: number; to: Target; long: boolean } | null {
  const long = unit.length > 2 && unit !== 'km/h';
  switch (unit.replace(/s$/, '')) {
    case 'mm':
    case 'millimetre':
      return max * 0.1 < 30.48 ? { base: 0.1, to: IN, long } : { base: 0.1 / 30.48, to: { ...FT, factor: 1 }, long };
    case 'cm':
    case 'centimetre':
      return max < 92 ? { base: 1, to: IN, long } : { base: 1 / 30.48, to: { ...FT, factor: 1 }, long };
    case 'm':
    case 'metre':
      return { base: 1, to: FT, long };
    case 'km':
    case 'kilometre':
      return { base: 1, to: MI, long };
    case 'g':
    case 'gram':
      return max < 454 ? { base: 1, to: OZ, long } : { base: 0.001, to: LB, long };
    case 'kg':
    case 'kilogram':
      return max < 0.45 ? { base: 1000, to: OZ, long } : { base: 1, to: LB, long };
    case 't':
    case 'tonne':
      return { base: 1, to: TON, long: true };
    default:
      return null;
  }
}

export function toImperial(text: string): string {
  return text.replace(MEASURE, (match, minus: string | undefined, a: string, sep: string | undefined, b: string | undefined, gap: string, unit: string) => {
    const sign = minus ? -1 : 1;
    const x = sign * num(a);
    const y = b !== undefined ? num(b) : undefined;
    const hyphen = gap === '-';
    if (unit === '°C') {
      const f = (c: number) => {
        const v = c * 1.8 + 32;
        return v < 0 ? `−${round(-v)}` : round(v);
      };
      return y === undefined ? `${f(x)}°F` : `${f(x)}${sep}${f(y)}°F`;
    }
    if (unit === 'km/h') {
      const f = (v: number) => round(v * 0.621371);
      return y === undefined ? `${f(x)} mph` : `${f(x)}${sep}${f(y)} mph`;
    }
    if (unit === 'km²' || unit === 'square kilometres') {
      const f = (v: number) => round(v * 0.386102);
      const u = unit === 'km²' ? 'sq mi' : 'square miles';
      return y === undefined ? `${f(x)} ${u}` : `${f(x)}${sep}${f(y)} ${u}`;
    }
    const p = pick(unit, Math.max(Math.abs(x), y ?? 0));
    if (!p) return match;
    const f = (v: number) => round(v * p.base * p.to.factor);
    const fx = (minus ?? '') + f(Math.abs(x));
    const fy = y === undefined ? undefined : f(y);
    // "a 12-tonne animal" → "a 13-ton animal"
    if (hyphen) return `${fx}${fy === undefined ? '' : `${sep}${fy}`}-${p.to.longOne}`;
    const last = fy ?? fx;
    const name = p.long ? (last === '1' ? p.to.longOne : p.to.long) : p.to.unit;
    return `${fx}${fy === undefined ? '' : `${sep}${fy}`} ${name}`;
  });
}
