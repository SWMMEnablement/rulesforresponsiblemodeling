// Pure model-builder data + INP writer for the Playground's drag-and-drop editor.
// Units: US customary (CFS, ft, acres, in/hr).

export type NodeKind = "junction" | "outfall";

export interface BNode { id: string; kind: NodeKind; x: number; y: number; invert: number; maxDepth: number }
export interface BConduit { id: string; from: string; to: string; length: number; roughness: number; diameter: number }
export interface BSubcatch {
  id: string; x: number; y: number; outlet: string;
  area: number; pctImperv: number; width: number; slope: number;
}
export interface BuilderModel {
  nodes: BNode[];
  conduits: BConduit[];
  subcatchments: BSubcatch[];
  rainIntervalMin: number;
  rainfall: number[]; // in/hr per interval
  durationHrs: number;
  routing: "DYNWAVE" | "KINWAVE";
}

export const STARTER_MODEL: BuilderModel = {
  nodes: [
    { id: "J1", kind: "junction", x: 160, y: 120, invert: 100, maxDepth: 5 },
    { id: "J2", kind: "junction", x: 360, y: 200, invert: 97, maxDepth: 5 },
    { id: "OUT1", kind: "outfall", x: 560, y: 280, invert: 94, maxDepth: 0 },
  ],
  conduits: [
    { id: "C1", from: "J1", to: "J2", length: 400, roughness: 0.013, diameter: 1.5 },
    { id: "C2", from: "J2", to: "OUT1", length: 400, roughness: 0.013, diameter: 2 },
  ],
  subcatchments: [
    { id: "S1", x: 80, y: 40, outlet: "J1", area: 5, pctImperv: 60, width: 500, slope: 0.5 },
    { id: "S2", x: 300, y: 80, outlet: "J2", area: 4, pctImperv: 40, width: 400, slope: 0.5 },
  ],
  rainIntervalMin: 30,
  rainfall: [0.5, 1.5, 3.0, 1.0, 0.2],
  durationHrs: 6,
  routing: "DYNWAVE",
};

const hhmm = (min: number) => `${Math.floor(min / 60)}:${String(Math.round(min % 60)).padStart(2, "0")}`;

/** Structural problems that would make SWMM reject the model. Empty = OK to run. */
export function validateModel(m: BuilderModel): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  for (const o of [...m.nodes, ...m.conduits, ...m.subcatchments]) {
    if (!/^\S+$/.test(o.id)) errs.push(`"${o.id}" has spaces or is empty`);
    if (ids.has(o.id)) errs.push(`Duplicate ID "${o.id}"`);
    ids.add(o.id);
  }
  const nodeIds = new Set(m.nodes.map((n) => n.id));
  if (!m.nodes.some((n) => n.kind === "outfall")) errs.push("Add at least one outfall");
  for (const c of m.conduits) {
    if (!nodeIds.has(c.from) || !nodeIds.has(c.to)) errs.push(`Conduit ${c.id} is not connected to two nodes`);
    if (c.from === c.to) errs.push(`Conduit ${c.id} loops to itself`);
    if (c.length <= 0 || c.diameter <= 0 || c.roughness <= 0) errs.push(`Conduit ${c.id} needs positive length, diameter and roughness`);
  }
  for (const s of m.subcatchments) {
    if (!nodeIds.has(s.outlet)) errs.push(`Subcatchment ${s.id} outlet "${s.outlet}" does not exist`);
    if (s.area <= 0 || s.width <= 0) errs.push(`Subcatchment ${s.id} needs positive area and width`);
  }
  for (const n of m.nodes) {
    if (n.kind === "junction" && !m.conduits.some((c) => c.from === n.id || c.to === n.id))
      errs.push(`Junction ${n.id} has no connected conduit`);
  }
  if (m.durationHrs <= 0) errs.push("Duration must be positive");
  return errs;
}

export function writeInp(m: BuilderModel): string {
  const end = Math.max(1, m.durationHrs);
  const endH = Math.floor(end), endM = Math.round((end - endH) * 60);
  const L: string[] = [];
  L.push("[TITLE]", "Playground Model Builder", "");
  L.push("[OPTIONS]",
    "FLOW_UNITS CFS", "INFILTRATION HORTON", `FLOW_ROUTING ${m.routing}`, "LINK_OFFSETS DEPTH",
    "START_DATE 01/01/2025", "START_TIME 00:00:00", "REPORT_START_DATE 01/01/2025", "REPORT_START_TIME 00:00:00",
    "END_DATE 01/01/2025", `END_TIME ${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`,
    "REPORT_STEP 00:05:00", "WET_STEP 00:01:00", "DRY_STEP 00:05:00", "ROUTING_STEP 0:00:15",
    "ALLOW_PONDING NO", "VARIABLE_STEP 0.75", "MIN_SURFAREA 12.557", "THREADS 1", "");
  L.push("[RAINGAGES]", `RG1 INTENSITY ${hhmm(m.rainIntervalMin)} 1.0 TIMESERIES Storm`, "");
  if (m.subcatchments.length) {
    L.push("[SUBCATCHMENTS]", ...m.subcatchments.map((s) => `${s.id} RG1 ${s.outlet} ${s.area} ${s.pctImperv} ${s.width} ${s.slope} 0`), "");
    L.push("[SUBAREAS]", ...m.subcatchments.map((s) => `${s.id} 0.012 0.10 0.05 0.05 25 OUTLET`), "");
    L.push("[INFILTRATION]", ...m.subcatchments.map((s) => `${s.id} 3.0 0.5 4 7 0`), "");
  }
  const j = m.nodes.filter((n) => n.kind === "junction");
  const o = m.nodes.filter((n) => n.kind === "outfall");
  if (j.length) L.push("[JUNCTIONS]", ...j.map((n) => `${n.id} ${n.invert} ${n.maxDepth} 0 0 0`), "");
  L.push("[OUTFALLS]", ...o.map((n) => `${n.id} ${n.invert} FREE NO`), "");
  if (m.conduits.length) {
    L.push("[CONDUITS]", ...m.conduits.map((c) => `${c.id} ${c.from} ${c.to} ${c.length} ${c.roughness} 0 0 0 0`), "");
    L.push("[XSECTIONS]", ...m.conduits.map((c) => `${c.id} CIRCULAR ${c.diameter} 0 0 0 1`), "");
  }
  const series = [0, ...m.rainfall, 0];
  L.push("[TIMESERIES]", ...series.map((v, i) => `Storm ${hhmm(i * m.rainIntervalMin)} ${v}`), "");
  L.push("[REPORT]", "INPUT NO", "CONTROLS NO", "SUBCATCHMENTS ALL", "NODES ALL", "LINKS ALL", "");
  L.push("[COORDINATES]", ...m.nodes.map((n) => `${n.id} ${n.x} ${-n.y}`), "");
  if (m.subcatchments.length)
    L.push("[Polygons]", ...m.subcatchments.flatMap((s) => [
      `${s.id} ${s.x} ${-s.y}`, `${s.id} ${s.x + 60} ${-s.y}`, `${s.id} ${s.x + 60} ${-(s.y + 40)}`, `${s.id} ${s.x} ${-(s.y + 40)}`,
    ]), "");
  return L.join("\n");
}

export function nextId(prefix: string, taken: string[]): string {
  let i = 1;
  while (taken.includes(`${prefix}${i}`)) i++;
  return `${prefix}${i}`;
}
