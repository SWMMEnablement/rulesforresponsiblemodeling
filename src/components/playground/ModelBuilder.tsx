import { useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Play, Upload, Download, MousePointer2, Circle, Triangle, Square, Spline, Trash2, FileCode, RotateCcw } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { runSwmm, type SwmmRunResult } from "@/lib/swmm/runner";
import { parseSwmmOut, type SwmmOutSeries } from "@/lib/swmm/outParser";
import { STARTER_MODEL, validateModel, writeInp, nextId, type BuilderModel } from "@/lib/swmm/modelBuilder";
import { TUTORIAL_INP } from "@/lib/swmm/tutorialModel";

type Tool = "select" | "junction" | "outfall" | "subcatchment" | "conduit" | "delete";
type Sel = { type: "node" | "conduit" | "sub"; id: string } | null;

const W = 680, H = 380;

export function ModelBuilder() {
  const [model, setModel] = useState<BuilderModel>(STARTER_MODEL);
  const [tool, setTool] = useState<Tool>("select");
  const [sel, setSel] = useState<Sel>(null);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [inpText, setInpText] = useState<string>(() => writeInp(STARTER_MODEL));
  const [source, setSource] = useState<"builder" | "file" | "tutorial">("builder");
  const [fileName, setFileName] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SwmmRunResult | null>(null);
  const [series, setSeries] = useState<SwmmOutSeries | null>(null);
  const [runError, setRunError] = useState<string>("");
  const [plotLink, setPlotLink] = useState<string>("");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ type: "node" | "sub"; id: string } | null>(null);

  const issues = useMemo(() => validateModel(model), [model]);
  const allIds = [...model.nodes, ...model.conduits, ...model.subcatchments].map((o) => o.id);
  const nodeById = (id: string) => model.nodes.find((n) => n.id === id);

  const update = (fn: (m: BuilderModel) => BuilderModel) => {
    setModel((m) => { const n = fn(m); if (source === "builder") setInpText(writeInp(n)); return n; });
  };

  const svgPoint = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: Math.round(((e.clientX - r.left) / r.width) * W), y: Math.round(((e.clientY - r.top) / r.height) * H) };
  };

  const onCanvasClick = (e: React.PointerEvent) => {
    if (e.target !== svgRef.current) return;
    const p = svgPoint(e);
    if (tool === "junction" || tool === "outfall") {
      const id = nextId(tool === "junction" ? "J" : "OUT", allIds);
      update((m) => ({ ...m, nodes: [...m.nodes, { id, kind: tool, ...p, invert: 95, maxDepth: tool === "junction" ? 5 : 0 }] }));
      setSel({ type: "node", id });
    } else if (tool === "subcatchment") {
      const id = nextId("S", allIds);
      const nearest = [...model.nodes].sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
      update((m) => ({ ...m, subcatchments: [...m.subcatchments, { id, x: p.x - 30, y: p.y - 20, outlet: nearest?.id ?? "", area: 3, pctImperv: 50, width: 400, slope: 0.5 }] }));
      setSel({ type: "sub", id });
    } else { setSel(null); setPendingFrom(null); }
  };

  const remove = (s: NonNullable<Sel>) => update((m) => ({
    ...m,
    nodes: s.type === "node" ? m.nodes.filter((n) => n.id !== s.id) : m.nodes,
    conduits: s.type === "conduit" ? m.conduits.filter((c) => c.id !== s.id)
      : s.type === "node" ? m.conduits.filter((c) => c.from !== s.id && c.to !== s.id) : m.conduits,
    subcatchments: s.type === "sub" ? m.subcatchments.filter((x) => x.id !== s.id) : m.subcatchments,
  }));

  const onNodeDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (tool === "delete") { remove({ type: "node", id }); setSel(null); return; }
    if (tool === "conduit") {
      if (!pendingFrom) { setPendingFrom(id); return; }
      if (pendingFrom !== id) {
        const a = nodeById(pendingFrom)!, b = nodeById(id)!;
        const cid = nextId("C", allIds);
        // Canvas units ≈ 2 ft each; keep at least 50 ft so short links stay numerically stable.
        const length = Math.max(50, Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 2));
        update((m) => ({ ...m, conduits: [...m.conduits, { id: cid, from: pendingFrom, to: id, length, roughness: 0.013, diameter: 1.5 }] }));
        setSel({ type: "conduit", id: cid });
      }
      setPendingFrom(null);
      return;
    }
    setSel({ type: "node", id });
    drag.current = { type: "node", id };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onSubDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (tool === "delete") { remove({ type: "sub", id }); setSel(null); return; }
    setSel({ type: "sub", id });
    if (tool === "select") { drag.current = { type: "sub", id }; (e.target as Element).setPointerCapture?.(e.pointerId); }
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return;
    const p = svgPoint(e);
    const x = Math.max(0, Math.min(W, p.x)), y = Math.max(0, Math.min(H, p.y));
    setModel((m) => d.type === "node"
      ? { ...m, nodes: m.nodes.map((n) => (n.id === d.id ? { ...n, x, y } : n)) }
      : { ...m, subcatchments: m.subcatchments.map((s) => (s.id === d.id ? { ...s, x: x - 30, y: y - 20 } : s)) });
  };
  const onUp = () => { if (drag.current) { drag.current = null; if (source === "builder") setInpText(writeInp(model)); } };

  const loadFile = async (f: File) => {
    const text = await f.text();
    setInpText(text); setSource("file"); setFileName(f.name); setResult(null); setSeries(null);
  };

  const run = async () => {
    setRunning(true); setRunError(""); setResult(null); setSeries(null);
    try {
      const r = await runSwmm(inpText);
      setResult(r);
      if (r.out) {
        const s = parseSwmmOut(r.out);
        if (s.ok) { setSeries(s); setPlotLink((p) => (s.links.includes(p) ? p : s.links[0] ?? "")); }
      }
      if (!r.ok) setRunError(r.errMsg || r.error || `SWMM returned code ${r.rc}`);
    } catch (e) {
      setRunError(e instanceof Error ? e.message : String(e));
    } finally { setRunning(false); }
  };

  const download = () => {
    const blob = new Blob([inpText], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = fileName || "playground-model.inp"; a.click();
    URL.revokeObjectURL(a.href);
  };

  const peaks = useMemo(() => {
    if (!series) return null;
    const max = (a: Float32Array) => a.reduce((m, v) => Math.max(m, v), 0);
    return {
      links: series.links.map((id, i) => ({ id, flow: max(series.linkFlow[i]), depth: max(series.linkDepth[i]) })),
      nodes: series.nodes.map((id, i) => ({ id, depth: max(series.nodeDepth[i]), flood: max(series.nodeFlooding[i]) })),
    };
  }, [series]);

  const chartData = useMemo(() => {
    if (!series || !plotLink) return [];
    const li = series.links.indexOf(plotLink);
    const conduit = model.conduits.find((c) => c.id === plotLink);
    const ni = conduit ? series.nodes.indexOf(conduit.to) : -1;
    return Array.from(series.times, (t, k) => ({
      hr: +(t / 3600).toFixed(3),
      flow: li >= 0 ? +series.linkFlow[li][k].toFixed(3) : null,
      depth: ni >= 0 ? +series.nodeDepth[ni][k].toFixed(3) : null,
    }));
  }, [series, plotLink, model.conduits]);

  const selNode = sel?.type === "node" ? nodeById(sel.id) : undefined;
  const selConduit = sel?.type === "conduit" ? model.conduits.find((c) => c.id === sel.id) : undefined;
  const selSub = sel?.type === "sub" ? model.subcatchments.find((s) => s.id === sel.id) : undefined;

  const num = (v: string) => (v === "" || isNaN(+v) ? 0 : +v);
  const field = (label: string, value: number | string, onChange: (v: string) => void, type = "number") => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={value} step="any" onChange={(e) => onChange(e.target.value)} className="h-8" />
    </div>
  );

  const tools: { t: Tool; icon: typeof Circle; label: string }[] = [
    { t: "select", icon: MousePointer2, label: "Select / drag" },
    { t: "junction", icon: Circle, label: "Add junction" },
    { t: "outfall", icon: Triangle, label: "Add outfall" },
    { t: "subcatchment", icon: Square, label: "Add subcatchment" },
    { t: "conduit", icon: Spline, label: "Add conduit" },
    { t: "delete", icon: Trash2, label: "Delete" },
  ];

  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Model Builder & Your Own .inp</h2>
          <p className="text-sm text-muted-foreground">Draw a network or upload an existing SWMM5 file, then run it on the same real SWMM 5.2 engine.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-1" /> Upload .inp
              <input type="file" accept=".inp,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
            </label>
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setInpText(TUTORIAL_INP); setSource("tutorial"); setFileName(""); }}>
            <FileCode className="h-4 w-4 mr-1" /> Tutorial model
          </Button>
          <Button variant="outline" size="sm" onClick={download}><Download className="h-4 w-4 mr-1" /> Download .inp</Button>
          <Button size="sm" onClick={run} disabled={running || !inpText.trim() || (source === "builder" && issues.length > 0)}>
            {running ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />} Run SWMM
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Running:</span>
        <Badge variant={source === "builder" ? "default" : "secondary"}>
          {source === "builder" ? "Built model" : source === "file" ? `Uploaded: ${fileName}` : "Tutorial model"}
        </Badge>
        {source !== "builder" && (
          <Button variant="ghost" size="sm" onClick={() => { setSource("builder"); setFileName(""); setInpText(writeInp(model)); }}>
            <RotateCcw className="h-3 w-3 mr-1" /> Back to built model
          </Button>
        )}
      </div>

      <Tabs defaultValue="canvas">
        <TabsList>
          <TabsTrigger value="canvas">Network</TabsTrigger>
          <TabsTrigger value="inp">INP text</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="canvas" className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {tools.map(({ t, icon: Icon, label }) => (
              <Button key={t} size="sm" variant={tool === t ? "default" : "outline"} onClick={() => { setTool(t); setPendingFrom(null); }} title={label}>
                <Icon className="h-4 w-4 mr-1" />{label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {tool === "conduit" ? (pendingFrom ? `Now click the downstream node (from ${pendingFrom}).` : "Click the upstream node, then the downstream node.")
              : tool === "select" ? "Drag nodes and subcatchments; click anything to edit it."
              : tool === "delete" ? "Click an item to delete it." : "Click empty canvas to place it."}
          </p>
          <div className="grid lg:grid-cols-[1fr_280px] gap-4">
            <svg
              ref={svgRef} viewBox={`0 0 ${W} ${H}`}
              className="w-full rounded-md border bg-muted/30 touch-none select-none"
              onPointerDown={onCanvasClick} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
            >
              <defs>
                <marker id="mb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" className="fill-primary" />
                </marker>
              </defs>
              {model.subcatchments.map((s) => {
                const o = nodeById(s.outlet);
                const on = sel?.type === "sub" && sel.id === s.id;
                return (
                  <g key={s.id}>
                    {o && <line x1={s.x + 30} y1={s.y + 20} x2={o.x} y2={o.y} className="stroke-muted-foreground" strokeDasharray="4 3" />}
                    <rect x={s.x} y={s.y} width={60} height={40} rx={4} onPointerDown={(e) => onSubDown(e, s.id)}
                      className={`fill-accent/30 ${on ? "stroke-primary" : "stroke-accent"} cursor-pointer`} strokeWidth={on ? 3 : 1.5} />
                    <text x={s.x + 30} y={s.y + 24} textAnchor="middle" className="fill-foreground text-[11px] pointer-events-none">{s.id}</text>
                  </g>
                );
              })}
              {model.conduits.map((c) => {
                const a = nodeById(c.from), b = nodeById(c.to);
                if (!a || !b) return null;
                const on = sel?.type === "conduit" && sel.id === c.id;
                return (
                  <g key={c.id} onPointerDown={(e) => { e.stopPropagation(); if (tool === "delete") { remove({ type: "conduit", id: c.id }); setSel(null); } else setSel({ type: "conduit", id: c.id }); }} className="cursor-pointer">
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={14} />
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-primary" strokeWidth={on ? 5 : 3} markerEnd="url(#mb-arrow)" />
                    <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" className="fill-muted-foreground text-[10px] pointer-events-none">{c.id}</text>
                  </g>
                );
              })}
              {model.nodes.map((n) => {
                const on = (sel?.type === "node" && sel.id === n.id) || pendingFrom === n.id;
                return (
                  <g key={n.id} onPointerDown={(e) => onNodeDown(e, n.id)} className="cursor-pointer">
                    {n.kind === "junction"
                      ? <circle cx={n.x} cy={n.y} r={9} className={`fill-background ${on ? "stroke-primary" : "stroke-foreground"}`} strokeWidth={on ? 4 : 2} />
                      : <polygon points={`${n.x},${n.y - 11} ${n.x + 11},${n.y + 8} ${n.x - 11},${n.y + 8}`} className={`fill-secondary ${on ? "stroke-primary" : "stroke-foreground"}`} strokeWidth={on ? 4 : 2} />}
                    <text x={n.x + 13} y={n.y - 10} className="fill-foreground text-[11px] font-semibold pointer-events-none">{n.id}</text>
                  </g>
                );
              })}
            </svg>

            <div className="space-y-3">
              {selNode && (
                <div className="space-y-2">
                  <h3 className="font-semibold">{selNode.kind === "junction" ? "Junction" : "Outfall"}</h3>
                  {field("ID", selNode.id, (v) => {
                    const id = v.replace(/\s/g, ""); const old = selNode.id;
                    update((m) => ({ ...m,
                      nodes: m.nodes.map((n) => (n.id === old ? { ...n, id } : n)),
                      conduits: m.conduits.map((c) => ({ ...c, from: c.from === old ? id : c.from, to: c.to === old ? id : c.to })),
                      subcatchments: m.subcatchments.map((s) => (s.outlet === old ? { ...s, outlet: id } : s)) }));
                    setSel({ type: "node", id });
                  }, "text")}
                  {field("Invert elevation (ft)", selNode.invert, (v) => update((m) => ({ ...m, nodes: m.nodes.map((n) => (n.id === selNode.id ? { ...n, invert: num(v) } : n)) })))}
                  {selNode.kind === "junction" && field("Max depth (ft)", selNode.maxDepth, (v) => update((m) => ({ ...m, nodes: m.nodes.map((n) => (n.id === selNode.id ? { ...n, maxDepth: num(v) } : n)) })))}
                </div>
              )}
              {selConduit && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Conduit {selConduit.id}</h3>
                  <p className="text-xs text-muted-foreground">{selConduit.from} → {selConduit.to}</p>
                  {(["length", "roughness", "diameter"] as const).map((k) => field(
                    k === "length" ? "Length (ft)" : k === "roughness" ? "Manning's n" : "Diameter (ft)",
                    selConduit[k], (v) => update((m) => ({ ...m, conduits: m.conduits.map((c) => (c.id === selConduit.id ? { ...c, [k]: num(v) } : c)) }))))}
                </div>
              )}
              {selSub && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Subcatchment {selSub.id}</h3>
                  <div className="space-y-1">
                    <Label className="text-xs">Outlet node</Label>
                    <select className="w-full h-8 rounded-md border bg-background px-2 text-sm" value={selSub.outlet}
                      onChange={(e) => update((m) => ({ ...m, subcatchments: m.subcatchments.map((s) => (s.id === selSub.id ? { ...s, outlet: e.target.value } : s)) }))}>
                      {model.nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
                    </select>
                  </div>
                  {([["area", "Area (acres)"], ["pctImperv", "Impervious (%)"], ["width", "Width (ft)"], ["slope", "Slope (%)"]] as const).map(([k, l]) => field(
                    l, selSub[k], (v) => update((m) => ({ ...m, subcatchments: m.subcatchments.map((s) => (s.id === selSub.id ? { ...s, [k]: num(v) } : s)) }))))}
                </div>
              )}
              {!sel && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Storm & run settings</h3>
                  {field("Rain interval (min)", model.rainIntervalMin, (v) => update((m) => ({ ...m, rainIntervalMin: Math.max(1, num(v)) })))}
                  <div className="space-y-1">
                    <Label className="text-xs">Rainfall intensities (in/hr, comma separated)</Label>
                    <Input className="h-8" defaultValue={model.rainfall.join(", ")}
                      onBlur={(e) => update((m) => ({ ...m, rainfall: e.target.value.split(/[,\s]+/).map(Number).filter((x) => !isNaN(x) && x >= 0) }))} />
                  </div>
                  {field("Duration (hours)", model.durationHrs, (v) => update((m) => ({ ...m, durationHrs: Math.min(23, num(v)) })))}
                  <div className="space-y-1">
                    <Label className="text-xs">Routing</Label>
                    <select className="w-full h-8 rounded-md border bg-background px-2 text-sm" value={model.routing}
                      onChange={(e) => update((m) => ({ ...m, routing: e.target.value as BuilderModel["routing"] }))}>
                      <option value="DYNWAVE">Dynamic wave</option>
                      <option value="KINWAVE">Kinematic wave</option>
                    </select>
                  </div>
                </div>
              )}
              {issues.length > 0 && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs space-y-1">
                  <p className="font-semibold text-destructive">Fix before running:</p>
                  {issues.map((i) => <p key={i}>• {i}</p>)}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inp" className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Edit freely — your edits are what gets run. Editing here switches to "uploaded/edited" mode so canvas changes won't overwrite it.
          </p>
          <Textarea value={inpText} spellCheck={false} className="font-mono text-xs h-96"
            onChange={(e) => { setInpText(e.target.value); if (source === "builder") { setSource("file"); setFileName("edited-model.inp"); } }} />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {runError && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm"><strong>SWMM error:</strong> {runError}</div>}
          {result && (
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="outline">Run time {result.durationMs.toFixed(0)} ms</Badge>
              <Badge variant={Math.abs(result.massBal.runoffErr) > 10 ? "destructive" : "outline"}>Runoff continuity {isNaN(result.massBal.runoffErr) ? "–" : result.massBal.runoffErr.toFixed(2) + "%"}</Badge>
              <Badge variant={Math.abs(result.massBal.flowErr) > 10 ? "destructive" : "outline"}>Flow continuity {isNaN(result.massBal.flowErr) ? "–" : result.massBal.flowErr.toFixed(2) + "%"}</Badge>
              {series && <Badge variant="outline">Flow units {series.flowUnits}</Badge>}
            </div>
          )}
          {series && series.links.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Label>Hydrograph for link</Label>
                <select className="h-8 rounded-md border bg-background px-2" value={plotLink} onChange={(e) => setPlotLink(e.target.value)}>
                  {series.links.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="hr" unit=" h" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="flow" name={`${plotLink} flow (${series.flowUnits})`} stroke="hsl(var(--primary))" dot={false} />
                    {chartData.some((d) => d.depth !== null) && <Line type="monotone" dataKey="depth" name="Downstream node depth" stroke="hsl(var(--accent))" dot={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {peaks && (
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <table className="w-full">
                <thead><tr className="text-left text-muted-foreground"><th>Link</th><th>Peak flow</th><th>Peak depth</th></tr></thead>
                <tbody>{peaks.links.map((l) => <tr key={l.id} className="border-t"><td>{l.id}</td><td>{l.flow.toFixed(2)}</td><td>{l.depth.toFixed(2)}</td></tr>)}</tbody>
              </table>
              <table className="w-full">
                <thead><tr className="text-left text-muted-foreground"><th>Node</th><th>Peak depth</th><th>Peak flooding</th></tr></thead>
                <tbody>{peaks.nodes.map((n) => <tr key={n.id} className="border-t"><td>{n.id}</td><td>{n.depth.toFixed(2)}</td><td className={n.flood > 0 ? "text-destructive font-semibold" : ""}>{n.flood.toFixed(2)}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          {result?.rpt && (
            <details>
              <summary className="cursor-pointer text-sm font-medium">Full SWMM report</summary>
              <pre className="mt-2 max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs">{result.rpt}</pre>
            </details>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
