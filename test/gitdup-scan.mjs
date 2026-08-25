// 구글 드라이브가 .git 안에 만들어 놓은 「이름 (1)」 사본을 찾는다.
// 지우기 전에 원본이 실제로 있는지, 내용이 같은지 먼저 확인만 한다.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.argv[2];
if (!ROOT) throw new Error('저장소 경로를 인자로 주세요');
const GIT = path.join(ROOT, '.git');
const dups = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    const m = /^(.*) \(\d+\)$/.exec(e.name);
    if (m) dups.push({ dup: p, orig: path.join(d, m[1]) });
  }
})(GIT);

let same = 0, missing = 0, differ = 0;
for (const d of dups) {
  if (!fs.existsSync(d.orig)) { missing++; console.log('원본 없음:', path.relative(ROOT, d.dup)); continue; }
  const a = fs.readFileSync(d.dup), b = fs.readFileSync(d.orig);
  if (a.equals(b)) same++; else { differ++; console.log('내용 다름:', path.relative(ROOT, d.dup)); }
}
console.log(`사본 ${dups.length} 개 — 원본과 같음 ${same} · 내용 다름 ${differ} · 원본 없음 ${missing}`);
