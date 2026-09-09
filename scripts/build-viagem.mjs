// Build the trip map data from a full Strava account export.
//
//   npm run viagem
//
// Reads (all gitignored, extract the ZIP here first):
//   strava-export/activities.csv          — summaries, columns in Portuguese
//   strava-export/activities/<id>.gpx     — one GPS track per activity
//
// Writes:
//   public/viagem/rota.geojson            — real trace, one LineString per leg
//   src/data/viagem-stats.json            — the numbers, computed once
//
// The export is the WHOLE account (since 2018). We keep only rides inside the
// trip window and only `Pedalada` (Ride) — foot side-trips stay out of the trace.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'strava-export');
const CSV = join(SRC, 'activities.csv');
const GPX_DIR = join(SRC, 'activities');

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

// Trip window (inclusive). Activities outside are ignored.
const WINDOW = { start: '2025-09-17', end: '2026-05-23' };

// Strava activity types kept in the trace ("Pedalada" = Ride).
const RIDE_TYPES = new Set(['Pedalada']);

// Douglas–Peucker tolerance in degrees (~0.00012 deg ≈ 13 m near the equator).
const SIMPLIFY_TOLERANCE = 0.00012;

// Coordinate precision in the output (5 decimals ≈ 1 m).
const COORD_DECIMALS = 5;

// Chapters, by date. Each activity falls in the last chapter whose `from` is
// <= its date. Country borders are firm; the rest was set from the author's
// recollection + activity names (see PLAN.md):
//   BR 2025-09-17 (start) · into Pará 2025-10-28 · VE 2026-01-14 ·
//   VE coast 2026-02-22 · VE west 2026-03-23 · CO 2026-04-13 · CO Andes 2026-05-07
const CHAPTERS = [
  {
    n: 1,
    slug: 'nordeste',
    country: 'BR',
    from: '2025-09-17',
    title_pt: 'Nordeste',
    title_en: 'Northeast',
  },
  {
    n: 2,
    slug: 'amazonia',
    country: 'BR',
    from: '2025-10-28',
    title_pt: 'Amazônia',
    title_en: 'Amazon',
  },
  {
    n: 3,
    slug: 'gran-sabana-leste',
    country: 'VE',
    from: '2026-01-14',
    title_pt: 'Gran Sabana e Leste',
    title_en: 'Gran Sabana & the East',
  },
  {
    n: 4,
    slug: 'costa-caribenha',
    country: 'VE',
    from: '2026-02-22',
    title_pt: 'Costa caribenha',
    title_en: 'Caribbean coast',
  },
  {
    n: 5,
    slug: 'oeste',
    country: 'VE',
    from: '2026-03-23',
    title_pt: 'Oeste',
    title_en: 'The West',
  },
  {
    n: 6,
    slug: 'caribe-colombiano',
    country: 'CO',
    from: '2026-04-13',
    title_pt: 'Caribe colombiano',
    title_en: 'Colombian Caribbean',
  },
  {
    n: 7,
    slug: 'eje-cafetero',
    country: 'CO',
    from: '2026-05-07',
    title_pt: 'Eje cafetero',
    title_en: 'Coffee region',
  },
];

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

/** Minimal RFC-4180-ish parser: handles quoted fields, escaped quotes, newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const MONTHS = {
  jan: 1,
  fev: 2,
  mar: 3,
  abr: 4,
  mai: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  set: 9,
  out: 10,
  nov: 11,
  dez: 12,
};

/** "8 de set. de 2026, 06:47:55" -> "2026-09-08" */
function parseDate(s) {
  const datePart = s.split(',')[0].trim().replace(/\./g, '');
  const m = datePart.match(/^(\d{1,2}) de (\w+) de (\d{4})$/);
  if (!m) return null;
  const mon = MONTHS[m[2].slice(0, 3).toLowerCase()];
  if (!mon) return null;
  return `${m[3]}-${String(mon).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

const num = (s) => {
  const v = parseFloat(String(s ?? '').replace(',', '.'));
  return Number.isFinite(v) ? v : 0;
};

function chapterFor(date) {
  let hit = null;
  for (const ch of CHAPTERS) if (ch.from <= date) hit = ch;
  return hit;
}

// ---------------------------------------------------------------------------
// GPX
// ---------------------------------------------------------------------------

const TRKPT_RE =
  /<trkpt\s+lat="(-?\d+(?:\.\d+)?)"\s+lon="(-?\d+(?:\.\d+)?)"\s*>([\s\S]*?)<\/trkpt>/g;
const ELE_RE = /<ele>(-?\d+(?:\.\d+)?)<\/ele>/;

/** -> { coords: [[lon,lat],...], eleMax: number|null } */
function readGpx(path) {
  const xml = readFileSync(path, 'utf8');
  const coords = [];
  let eleMax = null;
  let m;
  while ((m = TRKPT_RE.exec(xml))) {
    const lat = parseFloat(m[1]);
    const lon = parseFloat(m[2]);
    const last = coords[coords.length - 1];
    if (!last || last[0] !== lon || last[1] !== lat) coords.push([lon, lat]);
    const em = ELE_RE.exec(m[3]);
    if (em) {
      const e = parseFloat(em[1]);
      if (eleMax === null || e > eleMax) eleMax = e;
    }
  }
  return { coords, eleMax };
}

/** Iterative Douglas–Peucker on [lon,lat] pairs (planar approx). */
function simplify(points, tolerance) {
  if (points.length < 3) return points.slice();
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  const tol2 = tolerance * tolerance;

  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let maxD = -1;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      let d2;
      if (len2 === 0) {
        d2 = (px - ax) ** 2 + (py - ay) ** 2;
      } else {
        let t = ((px - ax) * dx + (py - ay) * dy) / len2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const cx = ax + t * dx;
        const cy = ay + t * dy;
        d2 = (px - cx) ** 2 + (py - cy) ** 2;
      }
      if (d2 > maxD) {
        maxD = d2;
        idx = i;
      }
    }
    if (maxD > tol2 && idx !== -1) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  const out = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  return out;
}

const roundCoord = ([lon, lat]) => [
  Number(lon.toFixed(COORD_DECIMALS)),
  Number(lat.toFixed(COORD_DECIMALS)),
];

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

if (!existsSync(CSV)) {
  console.error(`Missing ${CSV}\nExtract export_*.zip into strava-export/ first.`);
  process.exit(1);
}

const rows = parseCsv(readFileSync(CSV, 'utf8'));
const header = rows.shift();
const col = (name, from = 0) => header.indexOf(name, from);
const IDX = {
  id: col('ID da atividade'),
  date: col('Data da atividade'),
  name: col('Nome da atividade'),
  type: col('Tipo de atividade'),
  file: col('Nome do arquivo'),
  moving: col('Tempo de movimentação'),
  dist: col('Distância', col('Distância') + 1), // second one, in metres
  climb: col('Ganho de elevação'),
  eleMax: col('Elevação máxima'),
};

const activities = rows
  .map((r) => ({
    id: r[IDX.id],
    date: parseDate(r[IDX.date] || ''),
    name: (r[IDX.name] || '').trim(),
    type: r[IDX.type] || '',
    file: r[IDX.file] || '',
    moving_s: Math.round(num(r[IDX.moving])),
    distance_km: num(r[IDX.dist]) / 1000,
    elev_gain_m: Math.round(num(r[IDX.climb])),
    ele_max_m: num(r[IDX.eleMax]),
  }))
  .filter((a) => a.date && a.date >= WINDOW.start && a.date <= WINDOW.end && RIDE_TYPES.has(a.type))
  .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id.localeCompare(b.id)));

console.log(`${activities.length} rides in window ${WINDOW.start}..${WINDOW.end}`);

const gpxIndex = new Set(
  existsSync(GPX_DIR) ? readdirSync(GPX_DIR).filter((f) => f.endsWith('.gpx')) : [],
);

const features = [];
let rawPts = 0;
let keptPts = 0;
let noTrack = 0;
let highest = { m: -Infinity, date: null };
const biggestDay = new Map(); // date -> km
const biggestClimb = new Map(); // date -> m

for (const a of activities) {
  const ch = chapterFor(a.date);
  biggestDay.set(a.date, (biggestDay.get(a.date) || 0) + a.distance_km);
  biggestClimb.set(a.date, (biggestClimb.get(a.date) || 0) + a.elev_gain_m);
  if (a.ele_max_m > highest.m) highest = { m: a.ele_max_m, date: a.date };

  const base = a.file.split('/').pop();
  if (!base || !base.endsWith('.gpx') || !gpxIndex.has(base)) {
    noTrack++;
    console.warn(`  no gpx track: ${a.date} ${a.name} (${a.file || '—'})`);
    continue;
  }
  const { coords } = readGpx(join(GPX_DIR, base));
  if (coords.length < 2) {
    noTrack++;
    continue;
  }
  const simplified = simplify(coords, SIMPLIFY_TOLERANCE).map(roundCoord);
  rawPts += coords.length;
  keptPts += simplified.length;

  features.push({
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: simplified },
    properties: {
      id: a.id,
      date: a.date,
      name: a.name,
      chapter: ch?.n ?? null,
      chapter_slug: ch?.slug ?? null,
      country: ch?.country ?? null,
      transport: 'bicycle',
      distance_km: Number(a.distance_km.toFixed(1)),
      elev_gain_m: a.elev_gain_m,
      moving_time_s: a.moving_s,
      points: simplified.length,
    },
  });
}

// --- stats -----------------------------------------------------------------

const dates = activities.map((a) => a.date).sort();
const dateStart = dates[0];
const dateEnd = dates[dates.length - 1];
const daysTotal = Math.round((Date.parse(dateEnd) - Date.parse(dateStart)) / 86400000) + 1;
const ridingDays = new Set(dates).size;
const distanceKm = activities.reduce((s, a) => s + a.distance_km, 0);
const elevGainM = activities.reduce((s, a) => s + a.elev_gain_m, 0);
const movingS = activities.reduce((s, a) => s + a.moving_s, 0);

const topDay = [...biggestDay.entries()].sort((x, y) => y[1] - x[1])[0];
const topClimb = [...biggestClimb.entries()].sort((x, y) => y[1] - x[1])[0];

const chapterStats = CHAPTERS.map((ch) => {
  const acts = activities.filter((a) => chapterFor(a.date)?.n === ch.n);
  const ds = acts.map((a) => a.date).sort();
  return {
    n: ch.n,
    slug: ch.slug,
    title_pt: ch.title_pt,
    title_en: ch.title_en,
    country: ch.country,
    date_start: ds[0] ?? null,
    date_end: ds[ds.length - 1] ?? null,
    days_riding: new Set(ds).size,
    activities: acts.length,
    distance_km: Number(acts.reduce((s, a) => s + a.distance_km, 0).toFixed(1)),
    elev_gain_m: acts.reduce((s, a) => s + a.elev_gain_m, 0),
  };
});

const stats = {
  generated: new Date().toISOString().slice(0, 10),
  source: 'Strava account export',
  window: WINDOW,
  date_start: dateStart,
  date_end: dateEnd,
  days_total: daysTotal,
  days_riding: ridingDays,
  days_rest: daysTotal - ridingDays,
  countries: new Set(CHAPTERS.map((c) => c.country)).size,
  activities: activities.length,
  activities_without_track: noTrack,
  distance_km: Math.round(distanceKm),
  elev_gain_m: elevGainM,
  highest_point_m: Number.isFinite(highest.m) ? Math.round(highest.m) : null,
  highest_point_date: highest.date,
  moving_time_s: movingS,
  moving_time_h: Number((movingS / 3600).toFixed(1)),
  avg_km_per_riding_day: Number((distanceKm / ridingDays).toFixed(1)),
  biggest_day: { date: topDay[0], distance_km: Number(topDay[1].toFixed(1)) },
  biggest_climb: { date: topClimb[0], elev_gain_m: Math.round(topClimb[1]) },
  chapters: chapterStats,
};

// --- write ---------------------------------------------------------------

mkdirSync(join(ROOT, 'public/viagem'), { recursive: true });
mkdirSync(join(ROOT, 'src/data'), { recursive: true });

const geojson = { type: 'FeatureCollection', features };
writeFileSync(join(ROOT, 'public/viagem/rota.geojson'), JSON.stringify(geojson) + '\n');
writeFileSync(join(ROOT, 'src/data/viagem-stats.json'), JSON.stringify(stats, null, 2) + '\n');

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;
console.log(
  `\nrota.geojson   ${features.length} legs · ${rawPts} → ${keptPts} pts · ` +
    `${kb(JSON.stringify(geojson).length)}` +
    (noTrack ? ` · ${noTrack} without track` : ''),
);
console.log(
  `viagem-stats.json  ${stats.distance_km} km · ${stats.days_riding}/${stats.days_total} days · ` +
    `${stats.elev_gain_m} m climb · high ${stats.highest_point_m} m`,
);
console.table(
  chapterStats.map((c) => ({
    ch: c.n,
    slug: c.slug,
    country: c.country,
    from: c.date_start,
    to: c.date_end,
    days: c.days_riding,
    km: c.distance_km,
    'climb m': c.elev_gain_m,
  })),
);
