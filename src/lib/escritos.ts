import { getCollection, type CollectionEntry } from 'astro:content';
import { ui, type Locale } from '../i18n/ui';

export type Escrito = CollectionEntry<'escritos'>;

export const TIPOS = ['poesia', 'pensamentos'] as const;
export type Tipo = (typeof TIPOS)[number];

/** Localised label for a tipo, e.g. "Poesia" / "Poetry". */
export function tipoLabel(tipo: Tipo, locale: Locale): string {
  return ui[locale].escritos.tipos[tipo];
}

const MESES: Record<Locale, string[]> = {
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

// Dates come from YAML as plain "YYYY-MM-DD" — parsed as UTC midnight. Read them
// back in UTC so a date never slips to the previous day in negative timezones.

/** e.g. "set 2025" / "Sep 2025" */
export function formatMonthYear(date: Date, locale: Locale): string {
  return `${MESES[locale][date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** e.g. "20 set 2025" / "Sep 20, 2025" */
export function formatFullDate(date: Date, locale: Locale): string {
  const m = MESES[locale][date.getUTCMonth()];
  const d = date.getUTCDate();
  const y = date.getUTCFullYear();
  return locale === 'en' ? `${m} ${d}, ${y}` : `${d} ${m} ${y}`;
}

export function getSlug(entry: Escrito): string {
  return entry.data.slug ?? entry.id;
}

/** First non-empty line of the raw markdown body, stripped of heading/quote marks. */
export function firstLine(entry: Escrito): string {
  const raw = entry.body ?? '';
  for (const line of raw.split('\n')) {
    const t = line
      .trim()
      .replace(/^#+\s*/, '')
      .replace(/^>\s*/, '');
    if (t) return t;
  }
  return getSlug(entry);
}

/** What to show as the text's name in listings and as its heading. */
export function displayTitle(entry: Escrito): string {
  return entry.data.title?.trim() || firstLine(entry);
}

/** Short teaser for cards and RSS. */
export function excerpt(entry: Escrito, maxLen = 140): string {
  if (entry.data.resumo) return entry.data.resumo;
  const raw = (entry.body ?? '')
    .split('\n')
    .map((l) =>
      l
        .trim()
        .replace(/^#+\s*/, '')
        .replace(/^>\s*/, ''),
    )
    .filter(Boolean)
    .join(' · ');
  return raw.length > maxLen ? `${raw.slice(0, maxLen).trimEnd()}…` : raw;
}

function byDateDesc(a: Escrito, b: Escrito): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

/** All non-draft escritos (drafts also show in `astro dev`), newest first. */
export async function getEscritos(): Promise<Escrito[]> {
  const all = await getCollection('escritos', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort(byDateDesc);
}

/** Unique tags across published escritos, sorted by frequency then name. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const escritos = await getEscritos();
  const counts = new Map<string, number>();
  for (const e of escritos) {
    for (const tag of e.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'pt-BR'));
}
