/* PPTX 슬라이드를 그림으로 확인하는 도구 (넘침·겹침 점검용)
   1) LibreOffice 로 pptx → pdf   2) 이 스크립트로 pdf → 페이지별 png
     node docs/render-check.mjs <pdf> <outdir> [from] [to]                    */
import { chromium } from 'playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const req = createRequire(import.meta.url);
const pdfjsPath = req.resolve('pdfjs-dist/build/pdf.min.mjs');

const [, , PDF, OUT, FROM = '1', TO = '999'] = process.argv;
await mkdir(OUT, { recursive: true });
const pdfBytes = await readFile(PDF);
const pdfjsSrc = await readFile(pdfjsPath, 'utf8');
const workerSrc = await readFile(req.resolve('pdfjs-dist/build/pdf.worker.min.mjs'), 'utf8');

const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1400, height: 800 } });
await pg.setContent('<body style="margin:0"><canvas id="c"></canvas></body>');
await pg.addScriptTag({ content: pdfjsSrc, type: 'module' });
await pg.evaluate(() => new Promise(r => setTimeout(r, 300)));

const n = await pg.evaluate(async ({b64, wsrc}) => {
  const url = URL.createObjectURL(new Blob([wsrc], {type:'text/javascript'}));
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = url;
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  window.__doc = await window.pdfjsLib.getDocument({ data: bin }).promise;
  return window.__doc.numPages;
}, {b64: pdfBytes.toString('base64'), wsrc: workerSrc});

console.log('pages:', n);
for (let i = +FROM; i <= Math.min(n, +TO); i++) {
  await pg.evaluate(async (i) => {
    const p = await window.__doc.getPage(i);
    const vp = p.getViewport({ scale: 1.35 });
    const c = document.getElementById('c');
    c.width = vp.width; c.height = vp.height;
    await p.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
  }, i);
  const el = await pg.$('#c');
  await el.screenshot({ path: path.join(OUT, String(i).padStart(2, '0') + '.png') });
}
await b.close();
console.log('done →', OUT);
