import fs from 'node:fs';
const SRC = 'G:/내 드라이브/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/test/probe-noop.mjs';
const DST = 'probe-noop.mjs';
let s = fs.readFileSync(SRC, 'utf8');
if (!s.includes('i < 126')) throw new Error('원본에 i < 126 없음');
s = s.replace('i < 126', 'i < 141');
fs.writeFileSync(DST, s);
console.log('복원 + 범위 141 로 갱신 —', s.length, '자');
console.log(s.split('\n').find(l => l.includes('i < 141')));
