import { ui, locales, defaultLocale, type Locale } from './ui';

const BASE = import.meta.env.BASE_URL; // "/ludoblog/" or "/"

function stripBase(pathname: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  return base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}

function withBase(path: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rel = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rel}` || '/';
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Locale of the current route (falls back to the default). */
export function getLocale(current: string | undefined): Locale {
  return isLocale(current) ? current : defaultLocale;
}

/** Strings for a locale. */
export function t(locale: Locale) {
  return ui[locale];
}

/** Locale-less, base-less route key for the current pathname: "/", "/sobre", "/escritos/foo". */
export function routeKey(pathname: string): string {
  const path = stripBase(pathname).replace(/\/+$/, '') || '/';
  return path.replace(/^\/(pt|en)(?=\/|$)/, '') || '/';
}

/** Is `path` (e.g. "sobre") the section of the current route? */
export function isActive(pathname: string, path: string): boolean {
  const key = routeKey(pathname);
  const target = `/${path.replace(/^\/+/, '')}`.replace(/\/+$/, '') || '/';
  if (target === '/') return key === '/';
  return key === target || key.startsWith(`${target}/`);
}

/**
 * Build an internal URL for `path` in `locale`, respecting Astro's `base`.
 * `path` is a locale-less route like "sobre" or "/escritos/foo".
 */
export function localeUrl(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  const prefix = locale === defaultLocale ? '' : `${locale}/`;
  return withBase(`/${prefix}${clean}`);
}

/**
 * Given the current pathname, return the equivalent page in the other locale.
 * Assumes routes are mirrored (pt at root, en under /en/).
 */
export function alternateUrl(pathname: string, current: Locale): { locale: Locale; url: string } {
  const path = stripBase(pathname).replace(/\/+$/, '') || '/';
  const other: Locale = current === 'pt' ? 'en' : 'pt';

  if (current === 'pt') {
    return { locale: other, url: withBase(path === '/' ? '/en' : `/en${path}`) };
  }
  // strip leading /en
  const stripped = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return { locale: other, url: withBase(stripped) };
}
