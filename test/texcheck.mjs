// PRINS 의 모든 tex 문자열에서 변환기가 모르는 명령을 찾아낸다.
// 모르는 명령은 화면에 글자 그대로 나오므로 반드시 0 건이어야 한다.
import fs from 'node:fs';
const tex = fs.readFileSync('src/35-tex.js', 'utf8');
const known = new Set();
for (const blk of ['TEX_GREEK', 'TEX_OPS']) {
  const i = tex.indexOf('const ' + blk + ' =');
  const body = tex.slice(i, tex.indexOf('};', i));
  for (const m of body.matchAll(/([A-Za-z]+)\s*:/g)) known.add(m[1]);
}
for (const m of tex.matchAll(/TEX_FUNCS\s*=\s*\[([^\]]*)\]/g))
  for (const f of m[1].matchAll(/'([a-z]+)'/g)) known.add(f[1]);
for (const m of tex.matchAll(/v\s*===\s*'([a-zA-Z\\]+)'/g)) known.add(m[1]);
['\\', '{', '}', '%', '&', '#'].forEach(v => known.add(v));

const s = fs.readFileSync('src/40-demos.js', 'utf8');
const i0 = s.indexOf('const PRINS = ['), i1 = s.indexOf('\nconst LABS=[');
const body = s.slice(i0, i1 < 0 ? s.length : i1);
const rows = [...body.matchAll(/\{t:'((?:[^'\\]|\\.)*)'/g), ...body.matchAll(/\{t:"((?:[^"\\]|\\.)*)"/g)];
const miss = new Map();
for (const r of rows) {
  const t = r[1];
  for (const m of t.matchAll(/\\([a-zA-Z]+|[\s\S])/g))
    if (m[1].length > 1 && !known.has(m[1])) {
      if (!miss.has(m[1])) miss.set(m[1], []);
      if (miss.get(m[1]).length < 2) miss.get(m[1]).push(t.slice(0, 70));
    }
}
if (!miss.size) console.log('tex 명령 점검 — 모르는 명령 0 건 (' + rows.length + ' 줄 검사)');
else {
  for (const [k, ex] of miss) console.log('모르는 명령 \\' + k + '  예: ' + ex.join(' | '));
  console.log('총 ' + miss.size + ' 종');
  process.exitCode = 1;
}
