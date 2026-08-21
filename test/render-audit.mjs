// PRINS 의 모든 LaTeX 문자열을 실제 변환기로 렌더해 미지원 명령 누출을 잡는다
import fs from 'node:fs';
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(join(ROOT, 'src', '40-demos.js'), 'utf8');
const texes = [...src.matchAll(/\{t:'((?:[^'\\]|\\.)*)'/g)].map(m => m[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'"))
  .filter(t => /\\|[\^_]/.test(t));
console.log('수식 후보:', texes.length);
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
let bad = 0;
for (const t of texes) {
  const r = await p.evaluate(x => {
    try { return texToMathML(x, false); } catch (e) { return 'ERR ' + e.message; }
  }, t);
  const leak = r.startsWith('ERR') ? r
    : (r.match(/<mi>[A-Za-z]{3,}<\/mi>/g) || []).filter(w => !/<mi>(sin|cos|tan|log|exp|lim|gcd|lcm|max|min)<\/mi>/.test(w));
  if (leak && leak.length) { console.log('누출:', JSON.stringify(t.slice(0, 60)), '→', leak.slice(0, 3)); bad++; }
}
console.log(bad ? '문제 ' + bad + '건' : '전부 정상 — 누출 0');
await b.close();
