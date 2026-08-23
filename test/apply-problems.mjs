// 오늘의 문제 카드 + 전 실험실 예상 게이트 + 단계별 절차·손계산 적용
import fs from 'node:fs';
import { PA } from './problems-a.mjs';
import { PB } from './problems-b.mjs';
const ALL = { ...PA, ...PB };
console.log('문제 정의', Object.keys(ALL).length, '종');

const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');

/* ① PROBLEMS 상수 주입 (openLab 앞) */
{ s = s.replace(/const PROBLEMS=\{.*?\};\r?\n\r?\n/s, '');
  const lit = {};
  for (const [k, v] of Object.entries(ALL)) lit[k] = { sit: v.sit, ask: v.ask };
  s = s.replace('function openLab(', 'const PROBLEMS=' + JSON.stringify(lit) + ';\n\nfunction openLab(');
}

/* ② open() — 게이트를 전 실험실로, 오늘의 문제 카드를 게이트 밖(항상 보임)에 */
const wireRe = /  \/\/ 실험 사다리[^\n]*\r?\n  if\(typeof MISSIONS[^\n]*\r?\n  \/\/ 예상 먼저 쓰기[^\n]*\r?\n  if\(typeof PREDICT!=='undefined' && PREDICT\[i\+1\]\) predictGate\(\$\('#mBody'\), PREDICT\[i\+1\]\);/;
if (wireRe.test(s)) s = s.replace(wireRe, `  // 탐구 사다리 — 단계마다 절차·손계산 과제가 붙는다
  if(typeof MISSIONS!=='undefined' && MISSIONS[i+1]) stepLadder($('#mBody'), MISSIONS[i+1]);
  // 예상 먼저 쓰기 — 오늘의 문제에 대한 예상을 쓰기 전에는 실험 화면을 열지 않는다
  const PBX = typeof PROBLEMS!=='undefined' && PROBLEMS[i+1];
  const PRS = (typeof PREDICT!=='undefined' && PREDICT[i+1]) || (PBX && {
    id:'g'+(i+1), title:L.t,
    lead:'위의 「오늘의 문제」에 대하여 —',
    q:['답을 예상해 쓰세요. 수·식·그림 무엇이든 좋습니다.',
       '왜 그렇게 생각하나요? 근거를 한 줄로.',
       '실험에서 무엇을 확인하면 내 예상을 판정할 수 있을까요?'],
    hint:'' });
  if(PRS) predictGate($('#mBody'), PRS);
  // 오늘의 문제 — 게이트가 덮어도 항상 보이는 맨 위 카드
  if(PBX){ const pd=document.createElement('div'); pd.className='probx';
    pd.innerHTML='<div class="probh">📌 오늘의 문제</div><p class="probs">'+PBX.sit+'</p><p class="probq">'+PBX.ask+'</p>';
    $('#mBody').prepend(pd); }`);

fs.writeFileSync(P, s);

/* ③ MISSIONS 에 do/hand 부착 */
{
  let t = fs.readFileSync(P, 'utf8');
  const i0 = t.indexOf('const MISSIONS=');
  const m = t.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + m[0].slice('const MISSIONS='.length, -1))();
  let n = 0;
  for (const [k, v] of Object.entries(ALL)) {
    if (!M[k]) continue;
    if (v.d2) { M[k][1].do = v.d2; n++; }
    if (v.h2) { M[k][1].hand = v.h2; }
    if (v.d3) { M[k][2].do = v.d3; n++; }
    if (v.h3) { M[k][2].hand = v.h3; }
  }
  /* 자기일치 확장 검사 — 정규식 vs (미션 t+do+hand + 오늘의 문제 sit+ask) */
  let bad = 0;
  for (const k of Object.keys(M)) {
    const pb = ALL[k] || {};
    const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n')
      + '\n' + (pb.sit || '') + '\n' + (pb.ask || '');
    M[k].forEach((x, ix) => {
      if (x.re && new RegExp(x.re).test(texts)) { console.log(`자기일치! LAB ${k} S${ix + 1} /${x.re}/`); bad++; }
    });
  }
  if (bad) throw new Error('자기일치 ' + bad);
  t = t.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + t.slice(i0 + m[0].length);
  fs.writeFileSync(P, t);
  console.log('do/hand 부착', n, '단계');
}

/* ④ CSS */
let c = fs.readFileSync('src/styles.css', 'utf8');
if (!c.includes('.probx')) {
  c += `\n/* 오늘의 문제 카드 */
.probx{margin:0 0 14px;padding:14px 16px;background:#FFFBEB;border:2px solid #F59E0B;border-radius:12px}
.probh{font-weight:900;color:#92400E;font-size:13px;margin-bottom:6px}
.probs{margin:0 0 6px;font-size:13.5px;line-height:1.65;color:#374151}
.probq{margin:0;font-size:14.5px;line-height:1.6;font-weight:800;color:#111827}\n`;
  fs.writeFileSync('src/styles.css', c);
}
console.log('오늘의 문제 적용 완료');
