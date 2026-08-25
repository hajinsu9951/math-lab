// 184 PRINS tex 한 줄에 이중 프라임(''), 이 따옴표가 문자열을 끊어 구문 오류 → 큰따옴표 문자열로 교체
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const lines = s.split('\n');
const idx = lines.findIndex(l => l.includes('속도와 가속도는 <b>벡터</b>입니다'));
if (idx < 0) throw new Error('대상 줄 없음');
lines[idx] = '   {t:"\\\\vec{v}=(x\'(t),\\\\ y\'(t)),\\\\qquad \\\\vec{a}=(x\'\'(t),\\\\ y\'\'(t))", '
  + "s:'속도와 가속도는 <b>벡터</b>입니다 — 크기와 방향을 함께 가집니다.'},";
/* 같은 방식으로 다른 프라임 줄들도 단순화 */
const fixPrime = l => l.includes("+\"'\"+") ? l.split("\\\\!\\\\;'+\"'\"+'").join("'").split("\\!\\;'+\"'\"+'").join("'") : l;
for (let i = 0; i < lines.length; i++) if (i !== idx) lines[i] = fixPrime(lines[i]);
s = lines.join('\n');
fs.writeFileSync(P, s);
new Function(s);
console.log('수리 완료 — 구문 검사 통과 (대상 줄', idx + 1, ')');
