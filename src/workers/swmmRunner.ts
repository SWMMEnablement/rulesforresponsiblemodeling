// SWMM5 Web Worker. Loads the Emscripten module once and runs simulations on demand.
// Communicates via postMessage with a request id.
// @ts-ignore - emitted glue, no types
import Module from '../lib/swmm/swmm5.js';

let modulePromise: Promise<any> | null = null;
function getModule() {
  if (!modulePromise) {
    modulePromise = Module({
      locateFile: (p: string) => '/wasm/' + p,
      print: () => {},
      printErr: () => {},
    });
  }
  return modulePromise;
}

type RunRequest = { id: number; type: 'run'; inp: string };

self.addEventListener('message', async (e: MessageEvent<RunRequest>) => {
  const { id, type, inp } = e.data;
  if (type !== 'run') return;
  const t0 = performance.now();
  try {
    const M = await getModule();
    for (const p of ['/in.inp', '/out.rpt', '/out.out']) {
      try { M.FS.unlink(p); } catch {}
    }
    M.FS.writeFile('/in.inp', inp);
    const rc: number = M.ccall(
      'swmm_run',
      'number',
      ['string', 'string', 'string'],
      ['/in.inp', '/out.rpt', '/out.out']
    );
    let rpt = '';
    try { rpt = M.FS.readFile('/out.rpt', { encoding: 'utf8' }); } catch {}
    let outBuf: ArrayBuffer | null = null;
    try {
      const bytes: Uint8Array = M.FS.readFile('/out.out');
      // Copy into a standalone ArrayBuffer we can transfer.
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      outBuf = copy.buffer;
    } catch {}

    const massPtr: number = M._malloc(12);
    M.ccall('swmm_getMassBalErr', 'number', ['number', 'number', 'number'], [massPtr, massPtr + 4, massPtr + 8]);
    const runoffErr = M.HEAPF32[massPtr >> 2];
    const flowErr = M.HEAPF32[(massPtr + 4) >> 2];
    const qualErr = M.HEAPF32[(massPtr + 8) >> 2];
    M._free(massPtr);

    const errPtr: number = M._malloc(256);
    M.ccall('swmm_getError', 'number', ['number', 'number'], [errPtr, 256]);
    const errMsg: string = M.UTF8ToString(errPtr);
    M._free(errPtr);

    const payload = {
      id,
      ok: rc === 0,
      rc,
      rpt,
      out: outBuf,
      massBal: { runoffErr, flowErr, qualErr },
      errMsg,
      durationMs: performance.now() - t0,
    };
    (self as any).postMessage(payload, outBuf ? [outBuf] : []);
  } catch (err: any) {
    (self as any).postMessage({ id, ok: false, error: err?.message || String(err), durationMs: performance.now() - t0 });
  }
});
