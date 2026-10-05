import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Escritos — poemas e pensamentos, um arquivo Markdown por texto em
 * src/content/escritos/. O nome do arquivo é o slug (a última parte da URL),
 * a menos que `slug` seja definido no frontmatter.
 */
const escritos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/escritos' }),
  schema: z.object({
    /** Opcional: muitos poemas não têm título. Sem título, usa-se o primeiro verso. */
    title: z.string().optional(),
    date: z.coerce.date(),
    tipo: z.enum(['poesia', 'pensamentos']).default('poesia'),
    tags: z.array(z.string()).default([]),
    /** Resumo para a listagem. Sem isso, usa-se o começo do texto. */
    resumo: z.string().optional(),
    draft: z.boolean().default(false),
    /** Sobrescreve o slug derivado do nome do arquivo. */
    slug: z.string().optional(),
    /** Lugar associado ao texto (liga com a viagem, opcional). */
    local: z.string().optional(),
  }),
});

export const collections = { escritos };
