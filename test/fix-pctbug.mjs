// 퍼센트를 100 으로 나눈 변수를 정수와 비교하는 실수를 찾아 고친다 (LAB 204·220 유형)
import fs from 'node:fs';
const FILES = ['src/40-demos.js', 'algV-demos.txt'];
const FIX = [['(loss>=35 ?', '(loss>=0.35 ?']];
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8'); let n = 0;
  FIX.forEach(([a, b]) => { if (s.includes(a)) { s = s.replace(a, b); n++; } });
  fs.writeFileSync(f, s);
  console.log(f, '교체', n, '건');
}
/* 전체 훑기 — /100 으로 만든 변수를 1 이상의 수와 비교하는 곳 */
const src = fs.readFileSync('src/40-demos.js', 'utf8');
const lines = src.split('\n');
const suspects = [];
for (let i = 0; i < lines.length; i++) {
  const decl = lines[i].match(/const\s+(\w+)\s*=\s*\+\$\('#\w+'\)\.value\/100/g) || [];
  const names = decl.map(d => d.match(/const\s+(\w+)/)[1]);
  if (!names.length) continue;
  // 같은 함수 안(뒤 80줄)에서 그 변수를 1 이상 수와 비교하는지
  for (const nm of names) {
    const re = new RegExp('\\b' + nm + '\\s*(>=|<=|>|<|===)\\s*([1-9]\\d*)(?![.\\d])', 'g');
    for (let j = i; j < Math.min(lines.length, i + 90); j++) {
      let m; while ((m = re.exec(lines[j]))) suspects.push((j + 1) + ': ' + lines[j].trim().slice(0, 110));
    }
  }
}
console.log('의심 줄', suspects.length);
suspects.slice(0, 20).forEach(x => console.log('  ', x));
