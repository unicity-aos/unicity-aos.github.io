import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Raw-markdown mirror of every book chapter at /book/<slug>.md — the
 * machine-readable twin of the rendered /book/<slug>/ page. llms.txt links
 * here so AI assistants read the canonical text with zero site chrome.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection('book');
  return entries.map((e) => ({
    params: { slug: e.id },
    props: { body: e.body ?? '' },
  }));
};

export const GET: APIRoute = ({ props }) => {
  return new Response((props as { body: string }).body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
