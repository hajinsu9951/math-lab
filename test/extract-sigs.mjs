// 57종 데모의 조건부 출력 문구 후보 추출 → 설계 자료
import fs from 'node:fs';
const s = fs.readFileSync('src/40-demos.js', 'utf8');
const li = s.indexOf('const LABS=');
const lm = s.slice(li).match(/^const LABS=\[[\s\S]*?\n\];/);
const dRefs = [...lm[0].matchAll(/d:\s*([A-Za-z_$][\w$]*)/g)].map(x => x[1]);
console.log('LABS 수:', dRefs.length);
const TARGETS = [5,8,9,11,12,13,15,16,17,18,19,20,21,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,61,62,63,64,65,66,67,68,70,72,73,76,77,78,79,80,81,82,83,86,87,89];
const out = [];
for (const n of TARGETS) {
  const fn = dRefs[n - 1];
  const i = s.indexOf('function ' + fn + '(');
  const j = s.indexOf('\nfunction ', i + 10);
  const src = s.slice(i, j < 0 ? i + 9000 : j);
  const strs = [...src.matchAll(/'((?:[^'\\]|\\.){2,90})'|`((?:[^`\\]|\\.){2,240})`/g)]
    .map(x => x[1] || x[2]).filter(t => /[가-힣]/.test(t));
  out.push('## LAB ' + n + ' (' + fn + ', ' + src.length + '자)');
  out.push(strs.join(' ⟂ ').slice(0, 1600));
}
fs.writeFileSync('sig-candidates.txt', out.join('\n'));
console.log('추출 완료', TARGETS.length, '종');
