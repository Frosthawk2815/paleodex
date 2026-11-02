// Prints every page's English text as JSON, keyed by page ("species:tyrannosaurus-rex") and field,
// for tools/i18n/content/en.json. The translation build checks each language against it.
//   npx -y esbuild@0.24.0 tools/i18n/export_content.ts --bundle --platform=node --tsconfig=tsconfig.json \
//     --outfile=tools/i18n/export_content.js --log-level=error && node tools/i18n/export_content.js > tools/i18n/content/en.json

import { EVENTS } from '@/data/events';
import { EXTINCTION_DETAILS } from '@/data/extinction-details';
import { CLADES, SPECIES } from '@/data/life';
import { PERIODS } from '@/data/periods';

type Fields = Record<string, unknown>;
const out: Record<string, Fields> = {};
const put = (key: string, fields: Fields) => {
  const clean = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)));
  if (Object.keys(clean).length) out[key] = clean;
};

for (const p of PERIODS) put(`period:${p.id}`, { tagline: p.tagline, summary: p.summary, highlights: p.highlights, ending: p.ending });
for (const [id, d] of Object.entries(EXTINCTION_DETAILS))
  put(`extinction:${id}`, {
    loss: d.loss,
    summary: d.summary,
    lost: d.lost.map((g) => ({ name: g.name, note: g.note })),
    survived: d.survived.map((g) => ({ name: g.name, note: g.note })),
    facts: d.facts.map((f) => ({ label: f.label, value: f.value })),
  });
for (const c of CLADES) put(`clade:${c.id}`, { common: c.common, description: c.description, akaNote: c.akaNote });
for (const s of SPECIES)
  put(`species:${s.id}`, {
    common: s.common && s.common !== s.name ? s.common : undefined,
    ageText: s.ageText,
    placeText: s.placeText,
    summary: s.summary,
    facts: s.facts?.map((f) => ({ label: f.label, value: f.value })),
    akaNote: s.akaNote,
    related: s.related?.map((r) => ({ note: r.note })),
  });
for (const e of EVENTS)
  put(`event:${e.id}`, {
    title: e.title,
    dateText: e.dateText,
    placeText: e.placeText,
    summary: e.summary,
    facts: e.facts?.map((f) => ({ label: f.label, value: f.value })),
    points: e.points.map((p) => ({ label: p.label, jumpLabel: p.jumpLabel })),
    invertebrates: e.invertebrates?.map((n) => ({ title: n.title, text: n.text })),
    groupNotes: e.groupNotes?.map((n) => ({ title: n.title, text: n.text })),
    trackmakers: e.trackmakers?.map((t) => ({ note: t.note })),
    image: e.image?.caption ? { caption: e.image.caption } : undefined,
  });

console.log(JSON.stringify(out, null, 1));
