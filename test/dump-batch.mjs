// 배치 설계 자료: 대상 lab 의 현재 미션 + 데모 소스 전문
import fs from 'node:fs';
const TARGETS = process.argv.slice(2).map(Number);
const s = fs.readFileSync('src/40-demos.js', 'utf8');
const li = s.indexOf('const LABS=');
const lm = s.slice(li).match(/^const LABS=\[[\s\S]*?\n\];/);
const dRefs = [...lm[0].matchAll(/d:\s*([A-Za-z_$][\w$]*)/g)].map(x => x[1]);
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
const out = [];
for (const n of TARGETS) {
  const fn = dRefs[n - 1];
  const i = s.indexOf('function ' + fn + '(');
  const j = s.indexOf('\nfunction ', i + 10);
  out.push('════════ LAB ' + n + ' — ' + fn + ' ════════');
  out.push('--- 현재 미션 ---');
  M[n].forEach((x, k) => out.push(`S${k + 1}${x.re ? ' [auto:' + x.re + ']' : ' [manual]'} ${x.t}${x.do ? '\n   do: ' + x.do : ''}${x.hand ? '\n   hand: ' + x.hand : ''}`));
  out.push('--- 데모 소스 ---');
  out.push(s.slice(i, j < 0 ? i + 9000 : j));
}
fs.writeFileSync('batch-dump.txt', out.join('\n'));
console.log('덤프', TARGETS.length, '종 →', 'batch-dump.txt', fs.statSync('batch-dump.txt').size, 'bytes');
