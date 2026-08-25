// 원리 카드의 수식이 글자 그대로 새어 나오는지 전 실험실에서 확인한다.
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1200 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));

// PRINS 를 직접 MathML 로 바꿔 결과 문자열을 훑는다 (실험실을 하나씩 열 필요가 없다)
const bad = await p.evaluate(() => {
  const out = [];
  const LEAK = /pmatrix|bmatrix|vmatrix|cases|aligned|varphi|lfloor|rfloor|lceil|rceil|bmod|Longrightarrow|nRightarrow|iff|dots|begin|end|&amp;/;
  PRINS.forEach((pr, i) => {
    (pr.tex || []).forEach((x, j) => {
      const ml = texToMathML(x.t, true);
      const txt = ml.replace(/<[^>]*>/g, '');
      if (LEAK.test(txt)) out.push({ lab: i + 1, step: j + 1, txt: txt.slice(0, 90), src: x.t.slice(0, 70) });
    });
  });
  return out;
});
bad.forEach(x => console.log(`★ LAB ${x.lab} 수식 ${x.step} — 화면: ${x.txt}`));
console.log(bad.length ? '새어 나온 수식 ' + bad.length + ' 건' : '전 수식 정상 — 새어 나온 명령 0 건');

// 실제 화면 렌더 확인 — 행렬을 쓰는 LAB 하나를 열어 본다
await p.evaluate(() => openLab(194));
await p.waitForTimeout(500);
const has = await p.evaluate(() => {
  const t = document.querySelectorAll('math mtable').length;
  return { mtable: t, mathCount: document.querySelectorAll('math').length };
});
console.log('LAB 195 화면 — math ' + has.mathCount + ' 개 / mtable ' + has.mtable + ' 개');
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
