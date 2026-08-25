import fs from 'node:fs';
const s = fs.readFileSync('src/40-demos.js', 'utf8');
const names = [...s.matchAll(/^function ([A-Za-z0-9_]+)\(/gm)].map(m => m[1]);
const seen = {}, dup = [];
names.forEach(n => { seen[n] = (seen[n] || 0) + 1; });
Object.entries(seen).forEach(([n, c]) => { if (c > 1) dup.push(n + ' ×' + c); });
console.log('함수 정의', names.length, '개 / 중복', dup.length ? dup.join(', ') : '없음');
process.exit(dup.length ? 1 : 0);
