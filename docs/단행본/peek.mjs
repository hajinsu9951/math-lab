// 만든 책의 한 부분을 그림으로 떠서 눈으로 확인한다 (조판 점검용).
// 사용: node docs/단행본/peek.mjs 손으로만지는중학수학_1권_중1.html ".qrbox" 미리보기1
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');

const SRC = resolve(join(ROOT, 'docs', '단행본', process.argv[2]));
const SEL = process.argv[3] || '.qrbox';
const NAME = process.argv[4] || 'peek';
const NTH = +(process.argv[5] || 0);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 860, height: 1200 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(SRC).href, { waitUntil: 'load' });
await p.waitForTimeout(800);
const els = await p.$$(SEL);
if (!els.length) { console.log('없음: ' + SEL); await b.close(); process.exit(0); }
const el = els[Math.min(NTH, els.length - 1)];
await el.scrollIntoViewIfNeeded();
const out = join(ROOT, 'docs', '단행본', '_' + NAME + '.png');
await el.screenshot({ path: out });
console.log(`${SEL} [${NTH + 1}/${els.length}] → ${out}`);
await b.close();
