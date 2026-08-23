// 차단형 게이트 → 비차단 예상 메모판 (라인 스플라이스)
import fs from 'node:fs';
const P = 'src/40-demos.js';
let lines = fs.readFileSync(P, 'utf8').split(/\r?\n/);
const a = lines.findIndex(l => l.includes('// 예상 먼저 쓰기 — 오늘의 문제에 대한'));
const b = lines.findIndex(l => l.includes("if(PRS) predictGate($('#mBody'), PRS);"));
if (a < 0 || b < 0 || b < a) throw new Error('경계 실패 ' + a + ' ' + b);
const NEW = `  // 예상 메모판 — 실험을 막지 않는다. 실험하면서 적는다.
  const PBX = typeof PROBLEMS!=='undefined' && PROBLEMS[i+1];
  const PRq = (typeof PREDICT!=='undefined' && PREDICT[i+1] && PREDICT[i+1].q) ||
    ['이 문제의 답을 예상해 적어 두세요 (수·식·그림 무엇이든).','실험 중 확인할 것 한 가지를 정해 적으세요.'];
  { const memo=document.createElement('details'); memo.className='pgmemo';
    memo.innerHTML='<summary>✍ 내 예상 메모판 — 실험하면서 적어 두세요 (펼치기)</summary>'
      +'<ol>'+PRq.map(q=>'<li>'+q+'</li>').join('')+'</ol><div class="pgmpad" id="pgmPad"></div>';
    $('#mBody').prepend(memo);
    memo.addEventListener('toggle',()=>{ if(memo.open && !memo.dataset.init){ memo.dataset.init='1';
      try{ writePad($('#pgmPad'), L.t+' — 내 예상'); }catch(e){} } });
  }`;
lines.splice(a, b - a + 1, NEW);
fs.writeFileSync(P, lines.join('\n'));
console.log('게이트 제거, 메모판 삽입 (라인', a + 1, '~', b + 1, ')');

let c = fs.readFileSync('src/styles.css', 'utf8');
if (!c.includes('.pgmemo')) {
  c += `\n/* 비차단 예상 메모판 */
.pgmemo{margin:0 0 12px;padding:10px 14px;background:var(--card,#fff);border:1.5px dashed #7C3AED;border-radius:10px}
.pgmemo summary{cursor:pointer;font-weight:800;color:#6D28D9;font-size:13px}
.pgmemo ol{margin:8px 0 6px;padding-left:20px;font-size:12.5px;color:#374151;line-height:1.6}
.pgmpad{min-height:120px}\n`;
  fs.writeFileSync('src/styles.css', c);
  console.log('CSS 추가');
}
