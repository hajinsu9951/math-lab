// 프라임(')이 들어간 tex 줄을 모두 큰따옴표 문자열로 바꿔 복구
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const lines = s.split('\n');
let n = 0;
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\s*)\{t:'(.*)',\s*s:(.*)$/);
  if (!m) continue;
  const body = m[2];
  if (!body.includes("'")) continue;          // 프라임이 없으면 건드리지 않는다
  if (body.includes('"')) { console.log('건너뜀(큰따옴표 포함) 줄', i + 1); continue; }
  lines[i] = m[1] + '{t:"' + body + '", s:' + m[3];
  n++;
}
s = lines.join('\n');
new Function(s);          // 구문 검사
fs.writeFileSync(P, s);
console.log('큰따옴표로 교체', n, '줄 — 구문 검사 통과');
