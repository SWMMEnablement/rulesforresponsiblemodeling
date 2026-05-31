// Tiny tutorial SWMM5 model: 1 rain gage, 1 subcatchment, 1 junction, 1 conduit, 1 outfall.
// Designed to run in <1s and respond visibly to Manning's n and rainfall changes.
export const TUTORIAL_INP = `[TITLE]
Playground Tutorial Model

[OPTIONS]
FLOW_UNITS           CFS
INFILTRATION         HORTON
FLOW_ROUTING         DYNWAVE
LINK_OFFSETS         DEPTH
MIN_SLOPE            0
ALLOW_PONDING        NO
SKIP_STEADY_STATE    NO
START_DATE           01/01/2025
START_TIME           00:00:00
REPORT_START_DATE    01/01/2025
REPORT_START_TIME    00:00:00
END_DATE             01/01/2025
END_TIME             06:00:00
SWEEP_START          01/01
SWEEP_END            12/31
DRY_DAYS             0
REPORT_STEP          00:05:00
WET_STEP             00:01:00
DRY_STEP             00:05:00
ROUTING_STEP         0:00:15
RULE_STEP            00:00:00
INERTIAL_DAMPING     PARTIAL
NORMAL_FLOW_LIMITED  BOTH
FORCE_MAIN_EQUATION  H-W
VARIABLE_STEP        0.75
LENGTHENING_STEP     0
MIN_SURFAREA         12.557
MAX_TRIALS           8
HEAD_TOLERANCE       0.005
SYS_FLOW_TOL         5
LAT_FLOW_TOL         5
MINIMUM_STEP         0.5
THREADS              1

[EVAPORATION]
CONSTANT  0.0
DRY_ONLY  NO

[RAINGAGES]
;;Name      Format    Interval  SCF       Source
RG1         INTENSITY 0:05      1.0       TIMESERIES DesignStorm

[SUBCATCHMENTS]
;;Name      RainGage  Outlet    Area  PctImperv  Width  Slope  CurbLen
S1          RG1       J1        5.0   60         500    0.5    0

[SUBAREAS]
;;Subcat    N-Imperv  N-Perv  S-Imperv  S-Perv  PctZero  RouteTo
S1          0.012     0.10    0.05      0.05    25       OUTLET

[INFILTRATION]
;;Subcat    MaxRate  MinRate  Decay  DryTime  MaxInfil
S1          3.0      0.5      4      7        0

[JUNCTIONS]
;;Name  Elev  MaxDepth  InitDepth  SurDepth  Aponded
J1      96    4         0          0         0

[OUTFALLS]
;;Name  Elev  Type   StageData  Gated
OUT1    90    FREE   .          NO

[CONDUITS]
;;Name  FromNode  ToNode  Length  Roughness  InOffset  OutOffset  InitFlow  MaxFlow
C1      J1        OUT1    400     0.013      0         0          0         0

[XSECTIONS]
;;Link  Shape     Geom1  Geom2  Geom3  Geom4  Barrels
C1      CIRCULAR  1.5    0      0      0      1

[TIMESERIES]
;;Name        Date       Time   Value
DesignStorm   ""         0:00   0.0
DesignStorm   ""         0:30   0.5
DesignStorm   ""         1:00   1.5
DesignStorm   ""         1:30   3.0
DesignStorm   ""         2:00   1.0
DesignStorm   ""         2:30   0.2
DesignStorm   ""         3:00   0.0

[REPORT]
INPUT       NO
CONTROLS    NO
SUBCATCHMENTS ALL
NODES ALL
LINKS ALL
`;

export interface PlaygroundParams {
  manningN: number;        // pipe roughness (0.008 - 0.25)
  pctImperv: number;       // subcatchment imperviousness (0 - 100)
  rainfallMultiplier: number; // multiplies all timeseries values (0.1 - 5)
}

export const DEFAULT_PARAMS: PlaygroundParams = {
  manningN: 0.013,
  pctImperv: 60,
  rainfallMultiplier: 1.0,
};

export function applyParams(inp: string, params: PlaygroundParams): string {
  let out = inp;
  // Conduit C1: Manning's n is column 5 in CONDUITS row
  out = out.replace(
    /(\nC1\s+J1\s+OUT1\s+\S+\s+)\S+/,
    `$1${params.manningN.toFixed(4)}`
  );
  // Subcatchment S1: PctImperv is column 4
  out = out.replace(
    /(\nS1\s+RG1\s+J1\s+\S+\s+)\S+/,
    `$1${params.pctImperv.toFixed(0)}`
  );
  // Scale rainfall timeseries values
  out = out.replace(
    /(DesignStorm\s+""\s+\d+:\d+\s+)([\d.]+)/g,
    (_m, p1, v) => `${p1}${(parseFloat(v) * params.rainfallMultiplier).toFixed(3)}`
  );
  return out;
}

// Quick parser for key numbers from the .rpt text.
export interface ReportSummary {
  continuityErrorRunoff?: number;
  continuityErrorFlow?: number;
  peakLinkFlow?: number;
  peakLinkFlowName?: string;
  peakNodeDepth?: number;
  peakNodeDepthName?: string;
  totalFloodingMG?: number;
}

export function parseReport(rpt: string): ReportSummary {
  const summary: ReportSummary = {};
  const runoffMatch = rpt.match(/Continuity Error[^%]*?\(%\)\s*\.+\s*(-?[\d.]+)[\s\S]{0,400}?Flow Routing Continuity[\s\S]*?Continuity Error[^%]*?\(%\)\s*\.+\s*(-?[\d.]+)/);
  if (runoffMatch) {
    summary.continuityErrorRunoff = parseFloat(runoffMatch[1]);
    summary.continuityErrorFlow = parseFloat(runoffMatch[2]);
  } else {
    const fc = rpt.match(/Flow Routing Continuity[\s\S]*?Continuity Error[^%]*?\(%\)\s*\.+\s*(-?[\d.]+)/);
    if (fc) summary.continuityErrorFlow = parseFloat(fc[1]);
    const rc = rpt.match(/Runoff Quantity Continuity[\s\S]*?Continuity Error[^%]*?\(%\)\s*\.+\s*(-?[\d.]+)/);
    if (rc) summary.continuityErrorRunoff = parseFloat(rc[1]);
  }
  // Link Flow Summary table → first link row: name maxFlow ...
  const linkBlock = rpt.match(/Link Flow Summary[\s\S]*?\n\s*-+\n([\s\S]*?)\n\s*\n/);
  if (linkBlock) {
    const rows = linkBlock[1].trim().split(/\n+/);
    let bestFlow = -Infinity, bestName = '';
    for (const row of rows) {
      const parts = row.trim().split(/\s+/);
      // typical: Name Type MaxFlow MaxDay MaxHour MaxVeloc/Full ...
      if (parts.length >= 3) {
        const f = parseFloat(parts[2]);
        if (!isNaN(f) && f > bestFlow) { bestFlow = f; bestName = parts[0]; }
      }
    }
    if (bestFlow > -Infinity) {
      summary.peakLinkFlow = bestFlow;
      summary.peakLinkFlowName = bestName;
    }
  }
  // Node Depth Summary
  const nodeBlock = rpt.match(/Node Depth Summary[\s\S]*?\n\s*-+\n([\s\S]*?)\n\s*\n/);
  if (nodeBlock) {
    const rows = nodeBlock[1].trim().split(/\n+/);
    let best = -Infinity, name = '';
    for (const row of rows) {
      const parts = row.trim().split(/\s+/);
      if (parts.length >= 4) {
        const d = parseFloat(parts[3]);
        if (!isNaN(d) && d > best) { best = d; name = parts[0]; }
      }
    }
    if (best > -Infinity) {
      summary.peakNodeDepth = best;
      summary.peakNodeDepthName = name;
    }
  }
  const flood = rpt.match(/Flooding Loss[\s\S]*?\.+\s*([\d.]+)/);
  if (flood) summary.totalFloodingMG = parseFloat(flood[1]);
  return summary;
}
