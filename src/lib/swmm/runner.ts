// Thin client wrapper around the SWMM5 Web Worker. Singleton + promise-per-request.

export interface SwmmRunResult {
  ok: boolean;
  rc: number;
  rpt: string;
  out: ArrayBuffer | null;
  massBal: { runoffErr: number; flowErr: number; qualErr: number };
  errMsg: string;
  durationMs: number;
  error?: string;
}

const RUN_TIMEOUT_MS = 60_000;

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { resolve: (r: SwmmRunResult) => void; reject: (e: Error) => void; timer: number }>();

function failAll(reason: string) {
  for (const [id, p] of pending) {
    clearTimeout(p.timer);
    p.reject(new Error(reason));
    pending.delete(id);
  }
}

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../../workers/swmmRunner.ts', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (e: MessageEvent<SwmmRunResult & { id: number }>) => {
      const { id, ...rest } = e.data;
      const p = pending.get(id);
      if (p) {
        clearTimeout(p.timer);
        pending.delete(id);
        p.resolve(rest as SwmmRunResult);
      }
    });
    // If the worker itself dies (failed to load the glue/wasm, uncaught error), every
    // in-flight promise would otherwise hang forever.
    worker.addEventListener('error', (ev) => {
      failAll(`SWMM worker error: ${ev.message || 'unknown'}`);
      worker?.terminate();
      worker = null;
    });
  }
  return worker;
}

export function runSwmm(inp: string): Promise<SwmmRunResult> {
  const w = getWorker();
  const id = ++seq;
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending.delete(id);
      reject(new Error(`SWMM run timed out after ${RUN_TIMEOUT_MS / 1000}s`));
    }, RUN_TIMEOUT_MS);
    pending.set(id, { resolve, reject, timer });
    w.postMessage({ id, type: 'run', inp });
  });
}
