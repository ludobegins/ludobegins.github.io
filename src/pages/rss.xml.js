import rss from '@astrojs/rss';
import { getEscritos, getSlug, displayTitle, excerpt } from '../lib/escritos';
import { href } from '../lib/href';
import { site } from '../site.config';

export async function GET(context) {
  const escritos = await getEscritos();
  return rss({
    title: `${site.name} — Escritos`,
    description: 'Poemas e pensamentos de Ludovic Beghin.',
    site: new URL(href('/'), context.site).href,
    items: escritos.map((entry) => ({
      title: displayTitle(entry),
      description: excerpt(entry, 300),
      pubDate: entry.data.date,
      link: href(`/escritos/${getSlug(entry)}`),
      categories: [entry.data.tipo, ...entry.data.tags],
    })),
    customData: `<language>pt-BR</language>`,
  });
}
