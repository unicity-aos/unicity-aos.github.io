/**
 * Build-time parser for mdBook SUMMARY.md files: parts (`# Part ...`) group
 * chapter links; prefix chapters (before the first part) get a null part.
 * Used by the docs pages for the sidebar and prev/next ordering.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface NavItem {
  title: string;
  slug: string;
}

export interface NavGroup {
  part: string | null;
  items: NavItem[];
}

const LINK = /\[([^\]]+)\]\(\.?\/?(.+?)\.md\)/;

export function loadNav(bookDirFromSiteRoot: string): NavGroup[] {
  const path = resolve(process.cwd(), bookDirFromSiteRoot, 'src/SUMMARY.md');
  const groups: NavGroup[] = [];
  let current: NavGroup = { part: null, items: [] };

  for (const raw of readFileSync(path, 'utf8').split('\n')) {
    const line = raw.trim();
    if (line.startsWith('# ') && !/^# summary$/i.test(line)) {
      if (current.items.length) groups.push(current);
      current = { part: line.slice(2).trim(), items: [] };
      continue;
    }
    const m = LINK.exec(line);
    if (m?.[1] && m[2]) {
      current.items.push({ title: m[1], slug: m[2] });
    }
  }
  if (current.items.length) groups.push(current);
  return groups;
}

export function flatNav(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((g) => g.items);
}

export function titleFor(groups: NavGroup[], slug: string): string | undefined {
  return flatNav(groups).find((i) => i.slug === slug)?.title;
}
