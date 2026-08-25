// PRINS tex 문자열의 백슬래시가 한 겹으로 들어간 항목을 찾아 두 겹으로 되돌린다
import fs from 'node:fs';
const P = 'src/40-demos.js';
const L = fs.readFileSync(P, 'utf8').split('\n');
const BS = String.fromCharCode(92);
const single = [], dbl = [];
L.forEach((ln, i) => {
  const m = ln.match(/\{t:'([^']*)'/);
  if (!m) return;
  if (ln.includes(BS + String.fromCharCode(39))) return; // 이스케이프된 따옴표가 있는 줄은 제외
  const t = m[1];
  if (t.includes(BS + BS)) dbl.push(i + 1);
  else if (t.includes(BS)) single.push(i + 1);
});
console.log('두 겹(정상):', dbl.length, '줄 / 한 겹(깨짐):', single.length, '줄');
console.log('깨진 줄:', single.join(', '));

if (process.argv[2] === '--fix') {
  single.forEach(n => {
    const ln = L[n - 1];
    L[n - 1] = ln.replace(/\{t:'([^']*)'/, (whole, t) =>
      "{t:'" + t.split(BS).join(BS + BS) + "'");
  });
  fs.writeFileSync(P, L.join('\n'));
  console.log('수리 완료 —', single.length, '줄');
}
