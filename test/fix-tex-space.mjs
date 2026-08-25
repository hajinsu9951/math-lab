// \text{역행렬 없음} 이 「역행렬없음」으로 붙어 나온다.
// 토크나이저가 공백을 통째로 버려서 \text 안의 띄어쓰기까지 사라진 탓이다.
import fs from 'node:fs';
const P = 'src/35-tex.js';
let s = fs.readFileSync(P, 'utf8');

const A1 = "    if(/\\s/.test(c)){i++;continue;}";
const B1 = "    if(/\\s/.test(c)){T.push({t:'sp',v:' '});i++;continue;}   // \\text 안의 띄어쓰기를 살린다";
if (!s.includes(A1)) throw new Error('토크나이저 앵커 실패');
s = s.replace(A1, B1);

const A2 = "    if(t.t==='}'){ p++; return ''; }";
const B2 = "    if(t.t==='}'){ p++; return ''; }\n    if(t.t==='sp'){ p++; return ''; }";
if (!s.includes(A2)) throw new Error('atom 앵커 실패');
s = s.replace(A2, B2);

// seq — 공백 토큰은 첨자 처리 전에 건너뛴다 (건너뛰지 않으면 빈 문자열이 밑줄의 밑이 된다)
const A3 = "      const t=T[p];\n      if(stop==='}' && t.t==='}') break;";
const B3 = "      const t=T[p];\n      if(stop==='}' && t.t==='}') break;\n      if(t.t==='sp'){ p++; continue; }";
if (!s.includes(A3)) throw new Error('seq 앵커 실패');
s = s.replace(A3, B3);

// begin 환경 안에서도 같은 이유로 건너뛴다
const A4 = "        if(q.t==='op'&&q.v==='&'){ p++; endCell(); continue; }";
const B4 = "        if(q.t==='sp'){ p++; continue; }\n        if(q.t==='op'&&q.v==='&'){ p++; endCell(); continue; }";
if (!s.includes(A4)) throw new Error('begin 앵커 실패');
s = s.replace(A4, B4);

new Function(s);
fs.writeFileSync(P, s, 'utf8');
console.log('35-tex.js — \\text 안의 띄어쓰기 복구');
