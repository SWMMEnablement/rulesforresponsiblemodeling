import { describe, expect, test } from "bun:test";
import { STARTER_MODEL, validateModel, writeInp } from "../src/lib/swmm/modelBuilder";

describe("model builder", () => {
  test("starter model is valid", () => {
    expect(validateModel(STARTER_MODEL)).toEqual([]);
  });
  test("a model without an outfall is rejected", () => {
    const m = { ...STARTER_MODEL, nodes: STARTER_MODEL.nodes.filter((n) => n.kind !== "outfall") };
    expect(validateModel(m)).toContain("Add at least one outfall");
  });
  test("rain gage interval matches the time series spacing", () => {
    const inp = writeInp({ ...STARTER_MODEL, rainIntervalMin: 15 });
    expect(inp).toContain("RG1 INTENSITY 0:15");
    expect(inp).toContain("Storm 0:15 0.5");
  });
});

describe("node renaming", () => {
  test("renaming J2 through 'J1' toward 'J12' never merges nodes", async () => {
    const { renameNode } = await import("../src/lib/swmm/modelBuilder");
    const base = {
      ...STARTER_MODEL,
      nodes: [
        { id: "J1", kind: "junction" as const, x: 0, y: 0, invert: 10, maxDepth: 5 },
        { id: "J2", kind: "junction" as const, x: 50, y: 0, invert: 9, maxDepth: 5 },
        { id: "O1", kind: "outfall" as const, x: 100, y: 0, invert: 8, maxDepth: 0 },
      ],
      conduits: [
        { id: "C1", from: "J1", to: "J2", length: 300, roughness: 0.013, diameter: 1.5 },
        { id: "C2", from: "J2", to: "O1", length: 300, roughness: 0.013, diameter: 1.5 },
      ],
    };
    const clash = renameNode(base, "J2", "J1");
    expect(clash.ok).toBe(false);
    const done = renameNode(base, "J2", "J12");
    expect(done.ok).toBe(true);
    if (!done.ok) return;
    expect(done.model.nodes.map((n) => n.id)).toEqual(["J1", "J12", "O1"]);
    expect(done.model.conduits.map((c) => [c.from, c.to])).toEqual([["J1", "J12"], ["J12", "O1"]]);
  });
  test("a blank ID is refused", async () => {
    const { renameNode } = await import("../src/lib/swmm/modelBuilder");
    expect(renameNode(STARTER_MODEL, STARTER_MODEL.nodes[0].id, "  ").ok).toBe(false);
  });
});
