import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The books render verbatim from their own repos (the site never copies or
 * rewrites content): astrid-book and astrid-handbook live as siblings of
 * astrid-web in the workspace. SUMMARY.md is nav metadata, not a page.
 */
const book = defineCollection({
  loader: glob({ base: '../../astrid-book/src', pattern: ['**/*.md', '!SUMMARY.md'] }),
});

const handbook = defineCollection({
  loader: glob({ base: '../../astrid-handbook/src', pattern: ['**/*.md', '!SUMMARY.md'] }),
});

export const collections = { book, handbook };
