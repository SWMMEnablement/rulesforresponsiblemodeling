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

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, (r: SwmmRunResult) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../../workers/swmmRunner.ts', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (e: MessageEvent<SwmmRunResult & { id: number }>) => {
      const { id, ...rest } = e.data;
      const resolver = pending.get(id);
      if (resolver) {
        pending.delete(id);
        resolver(rest as SwmmRunResult);
      }
    });
  }
  return worker;
}

export function runSwmm(inp: string): Promise<SwmmRunResult> {
  const w = getWorker();
  const id = ++seq;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    w.postMessage({ id, type: 'run', inp });
  });
}
