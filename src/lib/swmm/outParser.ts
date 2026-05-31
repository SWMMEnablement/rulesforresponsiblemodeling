// SWMM5 binary .out file parser.
//
// Format reference: EPA SWMM 5 Programmer's Manual, "Binary Output File".
// All integers and floats are 4-byte little-endian; dates are 8-byte LE doubles.
// Layout:
//   [opening records]
//     int  magic = 516114522
//     int  version
//     int  flow units code (0=CFS,1=GPM,2=MGD,3=CMS,4=LPS,5=MLD)
//     int  Nsubc, Nnode, Nlink, Npoll
//   [object IDs]   for each subc/node/link/poll: int len, then len bytes name
//   [object properties]  (skipped here — we don't need it for time series)
//   [reporting variables]  pollutant concentration units, then for each object class:
//        int numVars, then numVars int codes
//     finally int numSysVars (=15) and that many int codes
//   [reporting interval] double startDateTime (days since 1899-12-30), int reportStep (sec)
//   [computed results]   for each period:
//        double dateTime
//        Nsubc * Nsubcvars floats
//        Nnode * Nnodevars floats
//        Nlink * Nlinkvars floats
//        Nsysvars      floats
//   [closing records] (last 6 ints, 24 bytes):
//        int idOffset, propOffset, resultsOffset, numPeriods, errorCode, magic

export interface SwmmOutSeries {
  /** Seconds from start for each reporting period. */
  times: Float64Array;
  /** Reporting step (seconds). */
  reportStep: number;
  /** Object id lists. */
  subcatchments: string[];
  nodes: string[];
  links: string[];
  pollutants: string[];
  /** Per-variable time series, indexed [objectIndex][periodIndex]. */
  nodeDepth: Float32Array[];        // ft or m
  nodeTotalInflow: Float32Array[];  // cfs / cms
  nodeFlooding: Float32Array[];     // cfs / cms (overflow rate)
  linkFlow: Float32Array[];         // cfs / cms
  linkDepth: Float32Array[];        // ft or m
  /** True if file looked structurally valid. */
  ok: boolean;
  flowUnits: string;
  numPeriods: number;
}

const FLOW_UNITS = ["CFS", "GPM", "MGD", "CMS", "LPS", "MLD"];
const MAGIC = 516114522;

// Number of base (non-pollutant) variables per object class in SWMM5.
const N_SUBC_BASE = 8;   // rainfall, snow depth, evap loss, infil loss, runoff, gw flow, gw elev, soil moist
const N_NODE_BASE = 6;   // depth, head, stored vol, lateral inflow, total inflow, flooding
const N_LINK_BASE = 5;   // flow, depth, velocity, froude, capacity
const N_SYS_VARS = 15;

// Indices into node/link variable arrays:
const NODE_DEPTH_IDX = 0;
const NODE_TOTAL_INFLOW_IDX = 4;
const NODE_FLOOD_IDX = 5;
const LINK_FLOW_IDX = 0;
const LINK_DEPTH_IDX = 1;

export function parseSwmmOut(buf: ArrayBuffer): SwmmOutSeries {
  const empty: SwmmOutSeries = {
    times: new Float64Array(0),
    reportStep: 0,
    subcatchments: [], nodes: [], links: [], pollutants: [],
    nodeDepth: [], nodeTotalInflow: [], nodeFlooding: [],
    linkFlow: [], linkDepth: [],
    ok: false, flowUnits: "CFS", numPeriods: 0,
  };
  if (buf.byteLength < 56) return empty;
  const dv = new DataView(buf);

  // Closing records (last 24 bytes)
  const closeOff = buf.byteLength - 24;
  const idOffset = dv.getInt32(closeOff, true);
  // const propOffset = dv.getInt32(closeOff + 4, true);
  const resultsOffset = dv.getInt32(closeOff + 8, true);
  const numPeriods = dv.getInt32(closeOff + 12, true);
  // const errorCode = dv.getInt32(closeOff + 16, true);
  const trailMagic = dv.getInt32(closeOff + 20, true);

  // Opening
  const openMagic = dv.getInt32(0, true);
  if (openMagic !== MAGIC || trailMagic !== MAGIC) return empty;
  const flowUnitCode = dv.getInt32(8, true);
  const Nsubc = dv.getInt32(12, true);
  const Nnode = dv.getInt32(16, true);
  const Nlink = dv.getInt32(20, true);
  const Npoll = dv.getInt32(24, true);

  // Read object IDs starting at idOffset
  let p = idOffset;
  const readName = (): string => {
    const len = dv.getInt32(p, true); p += 4;
    let s = "";
    for (let i = 0; i < len; i++) s += String.fromCharCode(dv.getUint8(p + i));
    p += len;
    return s;
  };
  const subcatchments: string[] = [];
  for (let i = 0; i < Nsubc; i++) subcatchments.push(readName());
  const nodes: string[] = [];
  for (let i = 0; i < Nnode; i++) nodes.push(readName());
  const links: string[] = [];
  for (let i = 0; i < Nlink; i++) links.push(readName());
  const pollutants: string[] = [];
  for (let i = 0; i < Npoll; i++) pollutants.push(readName());

  // Per-period sizes
  const nSubcVars = N_SUBC_BASE + Npoll;
  const nNodeVars = N_NODE_BASE + Npoll;
  const nLinkVars = N_LINK_BASE + Npoll;
  const perPeriodBytes = 8 + (Nsubc * nSubcVars + Nnode * nNodeVars + Nlink * nLinkVars + N_SYS_VARS) * 4;

  // Reporting interval: it lives just before resultsOffset. We need reportStep.
  // Structure right before results: double startDate(8) + int reportStep(4) = 12 bytes.
  const intervalOff = resultsOffset - 12;
  // const startDateTime = intervalOff >= 0 ? dv.getFloat64(intervalOff, true) : 0;
  const reportStep = intervalOff >= 0 ? dv.getInt32(intervalOff + 8, true) : 0;

  // Allocate time series
  const times = new Float64Array(numPeriods);
  const mk = (n: number) => Array.from({ length: n }, () => new Float32Array(numPeriods));
  const nodeDepth = mk(Nnode);
  const nodeTotalInflow = mk(Nnode);
  const nodeFlooding = mk(Nnode);
  const linkFlow = mk(Nlink);
  const linkDepth = mk(Nlink);

  for (let t = 0; t < numPeriods; t++) {
    const base = resultsOffset + t * perPeriodBytes;
    if (base + perPeriodBytes > buf.byteLength) { return { ...empty, ok: false }; }
    const date = dv.getFloat64(base, true);
    times[t] = t === 0 ? 0 : (date - dv.getFloat64(resultsOffset, true)) * 86400;
    let o = base + 8;
    // Skip subcatchments
    o += Nsubc * nSubcVars * 4;
    // Nodes
    for (let n = 0; n < Nnode; n++) {
      const nb = o + n * nNodeVars * 4;
      nodeDepth[n][t] = dv.getFloat32(nb + NODE_DEPTH_IDX * 4, true);
      nodeTotalInflow[n][t] = dv.getFloat32(nb + NODE_TOTAL_INFLOW_IDX * 4, true);
      nodeFlooding[n][t] = dv.getFloat32(nb + NODE_FLOOD_IDX * 4, true);
    }
    o += Nnode * nNodeVars * 4;
    // Links
    for (let l = 0; l < Nlink; l++) {
      const lb = o + l * nLinkVars * 4;
      linkFlow[l][t] = dv.getFloat32(lb + LINK_FLOW_IDX * 4, true);
      linkDepth[l][t] = dv.getFloat32(lb + LINK_DEPTH_IDX * 4, true);
    }
    // (sys vars left unread)
  }

  return {
    times, reportStep,
    subcatchments, nodes, links, pollutants,
    nodeDepth, nodeTotalInflow, nodeFlooding,
    linkFlow, linkDepth,
    ok: true,
    flowUnits: FLOW_UNITS[flowUnitCode] ?? "CFS",
    numPeriods,
  };
}

/** Integrate a flow series (cfs or cms) over time → total volume in same units * seconds. */
export function integrateFlow(flow: Float32Array, dtSec: number): number {
  let v = 0;
  for (let i = 0; i < flow.length; i++) v += flow[i] * dtSec;
  return v;
}

/** Compute per-timestep percentiles across an ensemble of equal-length series. */
export function percentileBands(
  runs: Float32Array[],
  qs: number[] = [0.0, 0.1, 0.5, 0.9, 1.0],
): number[][] {
  if (runs.length === 0) return qs.map(() => []);
  const n = runs[0].length;
  const out = qs.map(() => new Array<number>(n).fill(0));
  const scratch = new Float64Array(runs.length);
  for (let t = 0; t < n; t++) {
    for (let r = 0; r < runs.length; r++) scratch[r] = runs[r][t] ?? 0;
    const sorted = Array.from(scratch).sort((a, b) => a - b);
    qs.forEach((q, qi) => {
      const idx = Math.min(sorted.length - 1, Math.max(0, Math.round(q * (sorted.length - 1))));
      out[qi][t] = sorted[idx];
    });
  }
  return out;
}
