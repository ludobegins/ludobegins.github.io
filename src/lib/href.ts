const BASE = import.meta.env.BASE_URL; // "/" (or e.g. "/ludoblog/" on a project site)

/**
 * Build an internal URL that respects Astro's configured `base`.
 * Pass a root-absolute path ("/escritos", "/"); external URLs pass through.
 */
export function href(path: string): string {
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rel = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rel}` || '/';
}

/** True when `path` is the current page (ignoring trailing slashes). */
export function isActive(currentPathname: string, path: string): boolean {
  const norm = (s: string) => s.replace(/\/+$/, '') || '/';
  const target = norm(href(path));
  const current = norm(currentPathname);
  if (target === norm(BASE)) return current === target;
  return current === target || current.startsWith(`${target}/`);
}
