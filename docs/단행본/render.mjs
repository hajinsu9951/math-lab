// 단행본 HTML → 인쇄용 PDF.
// 편집 표준의 @page 규칙(A4·여백·쪽번호)을 그대로 쓰므로 preferCSSPageSize 로 넘긴다.
// 사용: node docs/단행본/render.mjs docs/단행본/손으로만지는중학수학_1권_중1.html
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { statSync } from 'node:fs';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');

const SRC = resolve(process.argv[2]);
const OUT = SRC.replace(/\.html$/, '.pdf');

const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
await p.goto(pathToFileURL(SRC).href, { waitUntil: 'load' });
await p.waitForTimeout(900);
await p.emulateMedia({ media: 'print' });
await p.pdf({
  path: OUT,
  preferCSSPageSize: true,
  printBackground: true,
  displayHeaderFooter: false,
});
const mb = (statSync(OUT).size / 1048576).toFixed(2);
console.log(`${basename(OUT)}  ${mb} MB`);
if (errs.length) console.log('pageerrors ' + errs.length);
await b.close();
