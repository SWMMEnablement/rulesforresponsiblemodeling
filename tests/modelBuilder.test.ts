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
