/* 공개본 전체 모습을 몇 장으로 찍는다. 사용: node shot_page.mjs <index.html> <출력폴더> */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const idx = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1050 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(idx)).href, { waitUntil: 'load' });
await p.waitForTimeout(2000);

// ① 맨 위 — 머리글과 탭
await p.screenshot({ path: out + '/pg_top.png' });

// ② 카드 격자 — 조금 내려서
await p.evaluate(() => window.scrollTo(0, 900));
await p.waitForTimeout(500);
await p.screenshot({ path: out + '/pg_cards.png' });

// ③ 과목별 썸네일 벽 — 첫 번째 벽으로
const wall = await p.evaluate(() => {
  const w = document.querySelector('.cwall, .cwx');
  if (!w) return false;
  (w.closest('section') || w).scrollIntoView({ block: 'start' });
  return true;
});
await p.waitForTimeout(600);
await p.screenshot({ path: out + '/pg_wall.png' });

const info = await p.evaluate(() => ({
  labs: LABS.length, cat: typeof CATALOG !== 'undefined' ? CATALOG.length : -1,
  cards: document.querySelectorAll('#cards .card').length,
  tiles: document.querySelectorAll('.cwx').length,
  imgs: document.querySelectorAll('img.thumb.hf').length,
  svgThumbs: document.querySelectorAll('svg.thumb').length,
}));
console.log('벽 찾음', wall, JSON.stringify(info), 'errors', errs.slice(0, 3));
await b.close();
