// Shared bits for the Viagem section — used by the server-rendered legend/stats
// and by the client map island. Keep framework-free so the island can import it.

import type { Locale } from '../i18n/ui';
import stats from '../data/viagem-stats.json';

export type TripStats = typeof stats;
export type TripChapter = TripStats['chapters'][number];

export { stats as tripStats };

/** Chapter slug → line colour. Tuned to read on the kraft ground, light and dark. */
export const CHAPTER_COLORS: Record<string, string> = {
  nordeste: '#bf4a24', // sienna
  amazonia: '#4e7a3c', // forest green
  'gran-sabana-leste': '#1f8a7a', // teal
  'costa-caribenha': '#2f74b0', // caribbean blue
  oeste: '#6b57a6', // indigo
  'caribe-colombiano': '#d8a72f', // gold
  'eje-cafetero': '#b0466a', // berry
};

export const chapterColor = (slug: string): string => CHAPTER_COLORS[slug] ?? '#8a7a63';

export const chapterTitle = (c: TripChapter, locale: Locale): string =>
  locale === 'en' ? c.title_en : c.title_pt;

export const intlLocale = (locale: Locale): string => (locale === 'en' ? 'en' : 'pt-BR');

/** Round to whole thousands with a thin space, e.g. 53730 → "53 730". */
export const fmtInt = (n: number, locale: Locale): string =>
  new Intl.NumberFormat(intlLocale(locale)).format(Math.round(n));

export const fmtDate = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${iso}T12:00:00`));
