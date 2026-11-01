// Model Library: pure helpers (testable) + a small IndexedDB store.
// Models are kept in the visitor's browser so no sign-in is needed and large
// .inp files are not limited by localStorage quotas.

export interface InpSummary {
  title: string;
  flowUnits: string;
  subcatchments: number;
  nodes: number;
  links: number;
}

export interface LastRun {
  at: number;
  ok: boolean;
  durationMs: number;
  runoffErr: number;
  flowErr: number;
  peakFlow: number | null;
  peakFlowLink: string;
  floodedNodes: number;
  flowUnits: string;
  error: string;
}

export interface LibraryModel {
  id: string;
  name: string;
  inp: string;
  size: number;
  savedAt: number;
  summary: InpSummary;
  lastRun?: LastRun;
}

const NODE_SECTIONS = new Set(["JUNCTIONS", "OUTFALLS", "STORAGE", "DIVIDERS"]);
const LINK_SECTIONS = new Set(["CONDUITS", "PUMPS", "ORIFICES", "WEIRS", "OUTLETS"]);

export function summarizeInp(text: string): InpSummary {
  const s: InpSummary = { title: "", flowUnits: "", subcatchments: 0, nodes: 0, links: 0 };
  let section = "";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(";")) continue;
    const head = line.match(/^\[([A-Za-z_]+)\]/);
    if (head) { section = head[1].toUpperCase(); continue; }
    if (section === "TITLE") { if (!s.title) s.title = line; continue; }
    if (section === "OPTIONS") {
      const [k, v] = line.split(/\s+/);
      if (k?.toUpperCase() === "FLOW_UNITS" && v) s.flowUnits = v.toUpperCase();
      continue;
    }
    if (section === "SUBCATCHMENTS") s.subcatchments++;
    else if (NODE_SECTIONS.has(section)) s.nodes++;
    else if (LINK_SECTIONS.has(section)) s.links++;
  }
  return s;
}

/** Returns a name not already in `taken`, adding " (2)", " (3)"... before the extension. */
export function uniqueName(name: string, taken: string[]): string {
  const set = new Set(taken.map((t) => t.toLowerCase()));
  if (!set.has(name.toLowerCase())) return name;
  const m = name.match(/^(.*?)(\.[^.]*)?$/);
  const base = m?.[1] ?? name, ext = m?.[2] ?? "";
  for (let i = 2; ; i++) {
    const candidate = `${base} (${i})${ext}`;
    if (!set.has(candidate.toLowerCase())) return candidate;
  }
}

/** A file is treated as SWMM input if it has at least one [SECTION] header SWMM requires. */
export function looksLikeInp(text: string): boolean {
  return /^\s*\[(OPTIONS|JUNCTIONS|OUTFALLS|CONDUITS|SUBCATCHMENTS|TITLE)\]/im.test(text);
}

/** Flow extremes for one link. Reverse (negative) flows are kept, not clipped at zero. */
export interface FlowStats { max: number; min: number; absMax: number }
export function flowStats(series: ArrayLike<number>): FlowStats {
  if (series.length === 0) return { max: NaN, min: NaN, absMax: NaN };
  let max = -Infinity, min = Infinity;
  for (let i = 0; i < series.length; i++) { const v = series[i]; if (v > max) max = v; if (v < min) min = v; }
  return { max, min, absMax: Math.max(Math.abs(max), Math.abs(min)) };
}
/** Largest value of a non-negative quantity (depth, flooding). */
export const maxOf = (series: ArrayLike<number>) => {
  let m = 0;
  for (let i = 0; i < series.length; i++) if (series[i] > m) m = series[i];
  return m;
};

export function summarizeRun(
  r: { ok: boolean; durationMs: number; massBal: { runoffErr: number; flowErr: number }; errMsg?: string; error?: string; rc?: number },
  series: { links: string[]; linkFlow: Float32Array[]; nodeFlooding: Float32Array[]; flowUnits: string } | null,
  at = Date.now(),
): LastRun {
  let peakFlow: number | null = null, peakFlowLink = "", floodedNodes = 0;
  if (series) {
    series.linkFlow.forEach((arr, i) => {
      for (const v of arr) if (peakFlow === null || Math.abs(v) > Math.abs(peakFlow)) { peakFlow = v; peakFlowLink = series.links[i]; }
    });
    floodedNodes = series.nodeFlooding.filter((arr) => arr.some((v) => v > 0)).length;
  }
  return {
    at, ok: r.ok, durationMs: r.durationMs,
    runoffErr: r.massBal.runoffErr, flowErr: r.massBal.flowErr,
    peakFlow, peakFlowLink, floodedNodes, flowUnits: series?.flowUnits ?? "",
    error: r.ok ? "" : r.errMsg || r.error || `SWMM returned code ${r.rc ?? "?"}`,
  };
}

// ---------- IndexedDB store ----------
const DB_NAME = "rrm-model-library";
const STORE = "models";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("This browser cannot store files (IndexedDB unavailable)."));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE, { keyPath: "id" }); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Could not open model library storage."));
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => { db.close(); resolve(req.result); };
    t.onerror = () => { db.close(); reject(t.error ?? new Error("Model library storage failed.")); };
    t.onabort = () => { db.close(); reject(t.error ?? new Error("Model library storage was aborted (storage may be full).")); };
  });
}

export async function listModels(): Promise<LibraryModel[]> {
  const all = await tx<LibraryModel[]>("readonly", (s) => s.getAll() as IDBRequest<LibraryModel[]>);
  return all.sort((a, b) => b.savedAt - a.savedAt);
}

export const putModel = (m: LibraryModel) => tx("readwrite", (s) => s.put(m)).then(() => m);
export const deleteModel = (id: string) => tx("readwrite", (s) => s.delete(id)).then(() => undefined);

export function newModel(name: string, inp: string, taken: string[]): LibraryModel {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${taken.length}`,
    name: uniqueName(name, taken),
    inp,
    size: new Blob([inp]).size,
    savedAt: Date.now(),
    summary: summarizeInp(inp),
  };
}

/** Save an .inp text into the library (used by the Playground's "Save to library"). */
export async function saveToLibrary(name: string, inp: string): Promise<LibraryModel> {
  const existing = await listModels();
  return putModel(newModel(name, inp, existing.map((m) => m.name)));
}
