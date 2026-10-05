// Build a light country-outline layer for the trip map.
//
//   npm run paises
//
// Source: Natural Earth 1:50m Admin 0 – Countries (public domain), fetched from
// the natural-earth-vector mirror and cached in the OS temp dir. Output is
// committed, so this only needs re-running to change the country list or detail.
//
// Writes: public/viagem/paises.geojson — the neighbouring countries, clipped to
// the area the route touches, rings simplified (Douglas–Peucker) and rounded to
// 3 decimals. Sea is the page background; these are just land + borders.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';
const CACHE = join(tmpdir(), 'ne_50m_admin_0_countries.geojson');

// Countries to draw (route + immediate neighbours for context).
const KEEP = new Set([
  'Brazil',
  'Venezuela',
  'Colombia',
  'Guyana',
  'Suriname',
  'France', // France -> French Guiana ring only
  'Ecuador',
  'Peru',
  'Bolivia',
  'Panama',
  'Trinidad and Tobago',
]);

// Area of interest [minLon, minLat, maxLon, maxLat]. Rings outside are dropped
// (this is how mainland France / southern Brazil / etc. get trimmed).
const AOI = [-84, -24, -33, 14];

const SIMPLIFY_TOLERANCE = 0.02; // degrees (~2 km) — country outlines only
const COORD_DECIMALS = 3;

// --- fetch / cache -------------------------------------------------------------

async function loadSource() {
  if (existsSync(CACHE)) return JSON.parse(readFileSync(CACHE, 'utf8'));
  console.log(`fetching ${SRC_URL}`);
  const res = await fetch(SRC_URL);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const text = await res.text();
  writeFileSync(CACHE, text);
  return JSON.parse(text);
}

// --- geometry ----------------------------------------------------------------

const ringBbox = (ring) => {
  let a = Infinity,
    b = Infinity,
    c = -Infinity,
    d = -Infinity;
  for (const [x, y] of ring) {
    if (x < a) a = x;
    if (y < b) b = y;
    if (x > c) c = x;
    if (y > d) d = y;
  }
  return [a, b, c, d];
};

const bboxHits = (bb, aoi) =>
  bb[0] <= aoi[2] && bb[2] >= aoi[0] && bb[1] <= aoi[3] && bb[3] >= aoi[1];

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
        d2 = (px - (ax + t * dx)) ** 2 + (py - (ay + t * dy)) ** 2;
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

const round = ([x, y]) => [Number(x.toFixed(COORD_DECIMALS)), Number(y.toFixed(COORD_DECIMALS))];

/** Clean one polygon (array of rings) -> polygon or null. */
function cleanPolygon(rings) {
  const out = [];
  for (const ring of rings) {
    if (!bboxHits(ringBbox(ring), AOI)) continue;
    let s = simplify(ring, SIMPLIFY_TOLERANCE).map(round);
    if (s.length >= 4) {
      // close the ring
      const [f, l] = [s[0], s[s.length - 1]];
      if (f[0] !== l[0] || f[1] !== l[1]) s.push(f);
      out.push(s);
    }
  }
  return out.length ? out : null;
}

function cleanGeometry(geom) {
  if (geom.type === 'Polygon') {
    const p = cleanPolygon(geom.coordinates);
    return p && { type: 'Polygon', coordinates: p };
  }
  if (geom.type === 'MultiPolygon') {
    const polys = geom.coordinates.map(cleanPolygon).filter(Boolean);
    return polys.length && { type: 'MultiPolygon', coordinates: polys };
  }
  return null;
}

// --- build -----------------------------------------------------------------

const src = await loadSource();
const features = [];
let pts = 0;

for (const f of src.features) {
  if (!KEEP.has(f.properties.NAME)) continue;
  const geometry = cleanGeometry(f.geometry);
  if (!geometry) continue;
  const count = JSON.stringify(geometry.coordinates).match(/,/g)?.length ?? 0;
  pts += count;
  features.push({
    type: 'Feature',
    geometry,
    properties: {
      name: f.properties.NAME,
      name_pt: f.properties.NAME_PT || f.properties.NAME,
      iso: f.properties.ISO_A2,
    },
  });
}

mkdirSync(join(ROOT, 'public/viagem'), { recursive: true });
const out = { type: 'FeatureCollection', features };
const path = join(ROOT, 'public/viagem/paises.geojson');
writeFileSync(path, JSON.stringify(out) + '\n');

console.log(
  `paises.geojson  ${features.length} countries · ~${pts} coords · ` +
    `${(JSON.stringify(out).length / 1024).toFixed(0)} kB`,
);
console.log(features.map((f) => f.properties.name).join(', '));
