// LAB 01~04 시범 4종 — 정직 완주 (학생 조작 그대로) + 무조작 감사
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function cvClick(cvId, cx, cy) {
  await p.evaluate(i => { const e = document.getElementById(i); if (e) e.scrollIntoView({ block: 'center' }); }, cvId);
  await p.waitForTimeout(140);
  const f = await p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, cvId);
  await p.mouse.click(f.l + cx * f.sx, f.t + cy * f.sy);
  await p.waitForTimeout(200);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(320); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

// 좌표: X(v)=26+32.8v, Y(v)=304-32.8v  (g1: 380x330, P=26)
const gx = v => 26 + 32.8 * v, gy = v => 304 - 32.8 * v;

/* 01 구조 상황실 — A만 → A·C 교점 → B까지 세 원 명중 → 오차 띠 → 보고서 */
await run(1, 'GPS 수색', [
  async () => { await clk('gcA'); await clickManual(); },              // S1
  async () => { await clk('gcC'); await cvClick('g1', gx(1.48), gy(6.19)); },  // S2 후보 지점
  async () => { await clk('gcB'); await cvClick('g1', gx(4.82), gy(4.50)); },  // S3 조난자 발견
  async () => { await set('gn', 0.5); await clickManual(); },          // S4
  clickManual,                                                          // S5
]);

/* 02 스팸 분류 — 사전 단어 → 문자① 스팸 → 문자② 정상 → 규칙 → 설계 */
await run(2, '스팸 판별', [
  async () => { await p.evaluate(() => { const e = document.getElementById('bt'); e.value = '무료 광고'; }); await clk('bgo'); await clickManual(); }, // S1
  () => clk('bq1'),   // S2 문자① 스팸함으로 이동
  () => clk('bq2'),   // S3 문자② 정상 수신함
  clickManual, clickManual,
]);

/* 03 확산 모형 — 자유 → 실측점 관통(r=1) → K=30 → 규칙 → 판결 */
await run(3, '확산 판정', [
  async () => { await set('sr', 0.5); await clickManual(); },  // S1
  async () => { await set('sn', 0.5); await set('sr', 1.0); }, // S2 실측점 관통
  () => set('sk', 30),                                          // S3 풀 30만의 진실
  clickManual, clickManual,
]);

/* 04 요금제 — 자유 → 문제 요금제 375분 → B 반격 → 규칙 → 최종 답 */
await run(4, '손익분기', [
  async () => { await set('pa', 12000); await clickManual(); }, // S1
  () => clk('plq'),                                             // S2 375.0분
  () => set('pc', 28000),                                       // S3 B가 이득
  clickManual, clickManual,
]);

/* 무조작 감사 — 다시 열어 데모를 안 만지고 해냈어요만 */
for (const lab of [1, 2, 3, 4]) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(380);
  for (let k = 0; k < 6; k++) { await clickManual(); }
  const pr = await prog();
  const doneAuto = await p.evaluate(() => [...document.querySelectorAll('.ldi.done')].filter(e => !e.querySelector('.ldk')).length);
  console.log(`무조작 LAB ${lab}: ${pr} 자동단계 완료 ${doneAuto}건 ${doneAuto ? '★결함' : 'OK'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(90);
}
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
