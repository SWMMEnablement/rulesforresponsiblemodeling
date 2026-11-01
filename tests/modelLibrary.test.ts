import { describe, expect, test } from "bun:test";
import { looksLikeInp, summarizeInp, summarizeRun, uniqueName } from "../src/lib/swmm/modelLibrary";
import { TUTORIAL_INP } from "../src/lib/swmm/tutorialModel";
import { STARTER_MODEL, writeInp } from "../src/lib/swmm/modelBuilder";

describe("model library", () => {
  test("summary counts the starter model's objects", () => {
    const s = summarizeInp(writeInp(STARTER_MODEL));
    expect(s.nodes).toBe(STARTER_MODEL.nodes.length);
    expect(s.links).toBe(STARTER_MODEL.conduits.length);
    expect(s.subcatchments).toBe(STARTER_MODEL.subcatchments.length);
  });
  test("comment and header lines are not counted", () => {
    const s = summarizeInp("[TITLE]\n;;note\nMy Model\n[OPTIONS]\nFLOW_UNITS cms\n[JUNCTIONS]\n;;Name Elev\nJ1 10\nJ2 9\n[CONDUITS]\nC1 J1 J2 100\n");
    expect(s).toEqual({ title: "My Model", flowUnits: "CMS", subcatchments: 0, nodes: 2, links: 1 });
  });
  test("tutorial model is recognised as SWMM input, plain text is not", () => {
    expect(looksLikeInp(TUTORIAL_INP)).toBe(true);
    expect(looksLikeInp("hello world")).toBe(false);
  });
  test("duplicate names get a numbered suffix before the extension", () => {
    expect(uniqueName("site.inp", [])).toBe("site.inp");
    expect(uniqueName("site.inp", ["site.inp"])).toBe("site (2).inp");
    expect(uniqueName("Site.inp", ["site.inp", "site (2).inp"])).toBe("Site (3).inp");
  });
  test("run summary keeps the largest flow and counts flooded nodes", () => {
    const r = summarizeRun(
      { ok: true, durationMs: 40, massBal: { runoffErr: 0.1, flowErr: 0.2 } },
      { links: ["C1", "C2"], linkFlow: [new Float32Array([1, 5]), new Float32Array([2, 3])], nodeFlooding: [new Float32Array([0, 0]), new Float32Array([0, 0.5])], flowUnits: "CFS" },
      1,
    );
    expect(r.peakFlow).toBe(5);
    expect(r.peakFlowLink).toBe("C1");
    expect(r.floodedNodes).toBe(1);
    expect(r.error).toBe("");
  });
  test("failed run records the engine message", () => {
    const r = summarizeRun({ ok: false, durationMs: 1, massBal: { runoffErr: NaN, flowErr: NaN }, errMsg: "ERROR 200", rc: 200 }, null);
    expect(r.ok).toBe(false);
    expect(r.error).toBe("ERROR 200");
  });
});
