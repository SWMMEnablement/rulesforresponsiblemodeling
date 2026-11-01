// Picks the app's own chapter summaries that best match a question, so Ask James can
// cite them. These passages are APP-WRITTEN summaries, not quotations from the 2005 text.
import Fuse from "fuse.js";
import { chapterSearchData, type ChapterSearchEntry } from "@/data/chapterSearchData";

export const ORIGINAL_PUBLICATION_URL =
  "https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html";

export const SOURCE_LIMITS = { maxSources: 4, maxCharsPerSource: 1000 } as const;

export interface ChatSource {
  n: number;
  id: string;
  chapter: number;
  section: string;
  text: string;
  url: string;
  kind: "app-summary";
}

let fuse: Fuse<ChapterSearchEntry> | null = null;
const index = () =>
  (fuse ??= new Fuse(chapterSearchData, {
    keys: [{ name: "section", weight: 0.4 }, { name: "content", weight: 0.45 }, { name: "title", weight: 0.15 }],
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 3,
    includeScore: true,
  }));

const STOP = new Set("what when where which how does do is are the a an and or of to in on for with my i you can should why about explain tell me".split(" "));

/** Top matching chapter summaries for a question, numbered from 1. */
export function findSources(question: string, k: number = SOURCE_LIMITS.maxSources): ChatSource[] {
  const words = question.toLowerCase().replace(/[^a-z0-9' -]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (words.length === 0) return [];
  const scores = new Map<string, { entry: ChapterSearchEntry; score: number }>();
  // Search the whole question and each keyword; keep each entry's best score.
  for (const q of [words.join(" "), ...words]) {
    for (const r of index().search(q, { limit: 8 })) {
      const prev = scores.get(r.item.id);
      const s = r.score ?? 1;
      if (!prev || s < prev.score) scores.set(r.item.id, { entry: r.item, score: s });
    }
  }
  return [...scores.values()]
    .sort((a, b) => a.score - b.score)
    .slice(0, k)
    .map(({ entry }, i) => ({
      n: i + 1,
      id: entry.id,
      chapter: entry.chapter,
      section: entry.section,
      text: entry.content.slice(0, SOURCE_LIMITS.maxCharsPerSource),
      url: `/chapter/${entry.chapter}`,
      kind: "app-summary" as const,
    }));
}

/** Sources whose [n] marker appears in the answer, in source order. */
export function citedSources(answer: string, sources: ChatSource[]): ChatSource[] {
  const cited = new Set([...answer.matchAll(/\[(\d{1,2})\]/g)].map((m) => +m[1]));
  return sources.filter((s) => cited.has(s.n));
}

/** Payload shape the chat server accepts. */
export const toPayloadSources = (sources: ChatSource[]) =>
  sources.map(({ n, chapter, section, text }) => ({ n, chapter, section, text }));
