// 163 S2 신호가 LAB note·탐구 질문과 겹쳐 열자마자 켜졌다 → 고유한 문구로 교체
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
if (M['163'][1].re !== '가위곱이 0') throw new Error('현재 신호가 예상과 다름: ' + M['163'][1].re);
M['163'][1].re = '두 벡터가 평행합니다';
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);

/* 넓힌 자기일치 감사 — LAB note·q·m·a·PROBLEMS·탐구 질문까지 함께 본다 */
const src = fs.readFileSync(P, 'utf8');
const labsBlock = src.slice(src.indexOf('const LABS=['), src.indexOf('const PRINS='));
const PR = JSON.parse(src.match(/const PROBLEMS=(\{.*?\});/)[1]);
let bad = 0;
Object.entries(M).forEach(([k, steps]) => {
  const n = +k;
  const li = labsBlock.indexOf('{n:' + n + ',core:');
  const lab = li < 0 ? '' : labsBlock.slice(li, li + 900);
  const own = steps.map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
  const prob = PR[k] ? PR[k].sit + '\n' + PR[k].ask : '';
  const hay = own + '\n' + prob + '\n' + lab;
  steps.forEach((x, ix) => {
    if (x.re && new RegExp(x.re).test(hay)) { console.log(`겹침! LAB ${k} S${ix + 1} — ${x.re}`); bad++; }
  });
});
console.log('넓힌 자기일치 감사 —', bad ? bad + '건 겹침' : '겹침 0');
