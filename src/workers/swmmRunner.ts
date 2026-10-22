// SWMM5 Web Worker. Loads the Emscripten module once and runs simulations on demand.
// Communicates via postMessage with a request id.
import Module from '../lib/swmm/swmm5.js';

// Minimal shape of what the glue actually exports (see swmm5.js: FS, ccall, UTF8ToString,
// _malloc, _free, _swmm_*). NOTE: HEAP* views and getValue are NOT exported by this build.
interface SwmmModule {
  FS: {
    writeFile(path: string, data: string | Uint8Array): void;
    readFile(path: string): Uint8Array;
    readFile(path: string, opts: { encoding: 'utf8' }): string;
    unlink(path: string): void;
  };
  ccall(name: string, ret: string | null, argTypes: string[], args: unknown[]): number;
  UTF8ToString(ptr: number): string;
  _malloc(n: number): number;
  _free(p: number): void;
}

let modulePromise: Promise<SwmmModule> | null = null;
function getModule(): Promise<SwmmModule> {
  if (!modulePromise) {
    modulePromise = Module({
      locateFile: (p: string) => '/wasm/' + p,
      print: () => {},
      printErr: (s: string) => console.warn('[swmm5]', s),
    }).catch((err: unknown) => {
      modulePromise = null; // allow a retry on the next request
      throw err;
    });
  }
  return modulePromise;
}

type RunRequest = { id: number; type: 'run'; inp: string };

/** Pull the continuity errors out of the .rpt text (the glue does not export HEAPF32,
 *  so swmm_getMassBalErr's float* outputs cannot be read from JS without a rebuild). */
function massBalFromReport(rpt: string) {
  const pick = (section: string) => {
    const m = rpt.match(new RegExp(section + '[\\s\\S]*?Continuity Error \\(%\\)\\s*\\.+\\s*(-?[\\d.]+)'));
    return m ? parseFloat(m[1]) : NaN;
  };
  return {
    runoffErr: pick('Runoff Quantity Continuity'),
    flowErr: pick('Flow Routing Continuity'),
    qualErr: pick('Quality Routing Continuity'),
  };
}

self.addEventListener('message', async (e: MessageEvent<RunRequest>) => {
  const { id, type, inp } = e.data;
  if (type !== 'run') return;
  const t0 = performance.now();
  try {
    const M = await getModule();
    for (const p of ['/in.inp', '/out.rpt', '/out.out']) {
      try { M.FS.unlink(p); } catch { /* file may not exist yet */ }
    }
    M.FS.writeFile('/in.inp', inp);
    const rc = M.ccall('swmm_run', 'number', ['string', 'string', 'string'], ['/in.inp', '/out.rpt', '/out.out']);

    let rpt = '';
    try { rpt = M.FS.readFile('/out.rpt', { encoding: 'utf8' }); } catch { /* no report written */ }

    let outBuf: ArrayBuffer | null = null;
    try {
      const bytes = M.FS.readFile('/out.out');
      // Copy into a standalone ArrayBuffer we can transfer.
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      outBuf = copy.buffer;
    } catch { /* no binary output on input errors */ }

    const errPtr = M._malloc(256);
    M.ccall('swmm_getError', 'number', ['number', 'number'], [errPtr, 256]);
    const errMsg = M.UTF8ToString(errPtr);
    M._free(errPtr);

    const payload = {
      id,
      ok: rc === 0,
      rc,
      rpt,
      out: outBuf,
      massBal: massBalFromReport(rpt),
      errMsg,
      durationMs: performance.now() - t0,
    };
    (self as unknown as Worker).postMessage(payload, outBuf ? [outBuf] : []);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // A WebAssembly abort leaves the instance unusable; drop it so the next run re-instantiates.
    if (/abort|RuntimeError|unreachable/i.test(message)) modulePromise = null;
    (self as unknown as Worker).postMessage({ id, ok: false, rc: -1, rpt: '', out: null, massBal: { runoffErr: NaN, flowErr: NaN, qualErr: NaN }, errMsg: message, error: message, durationMs: performance.now() - t0 });
  }
});
