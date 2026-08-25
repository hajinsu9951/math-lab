// 이름 충돌 수리 — 새로 만든 solidDemo → diskVolDemo, indepDemo → exclIndepDemo
import fs from 'node:fs';

/* 1) 원본 데모 txt (새로 만든 쪽만 들어 있음) */
for (const [f, pairs] of [
  ['algF-demos.txt', [['function solidDemo(root)', 'function diskVolDemo(root)']]],
  ['algG-demos.txt', [['function indepDemo(root)', 'function exclIndepDemo(root)']]],
]) {
  let s = fs.readFileSync(f, 'utf8');
  pairs.forEach(([a, b]) => { if (!s.includes(a)) throw new Error(f + ' 앵커 실패: ' + a); s = s.replace(a, b); });
  fs.writeFileSync(f, s);
  console.log(f, '개명 완료');
}

/* 2) src — 정의는 뒤쪽(새로 넣은 것)만, build 참조는 LAB 141 / 145 만 */
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');

function renameLast(src, decl, next) {
  const i = src.lastIndexOf(decl);
  if (i < 0) throw new Error('정의 없음: ' + decl);
  if (src.indexOf(decl) === i) throw new Error('중복이 아님: ' + decl);
  return src.slice(0, i) + next + src.slice(i + decl.length);
}
// solidDemo: 새 정의는 두 정의 중 뒤쪽이 아니라 앞쪽일 수 있으므로 위치로 판단
{
  const a = s.indexOf('function solidDemo(root){');
  const b = s.lastIndexOf('function solidDemo(root){');
  // 새 정의는 「원판」이라는 낱말을 쓰는 쪽
  const isNew = i => s.slice(i, i + 1200).includes('원판 개수');
  const target = isNew(a) ? a : (isNew(b) ? b : -1);
  if (target < 0) throw new Error('새 solidDemo 판별 실패');
  s = s.slice(0, target) + 'function diskVolDemo(root){' + s.slice(target + 'function solidDemo(root){'.length);
  console.log('solidDemo 새 정의 개명 (위치', target, ')');
}
{
  const a = s.indexOf('function indepDemo(root){');
  const b = s.lastIndexOf('function indepDemo(root){');
  const isNew = i => s.slice(i, i + 1200).includes('P(A ∩ B)');
  const target = isNew(a) ? a : (isNew(b) ? b : -1);
  if (target < 0) throw new Error('새 indepDemo 판별 실패');
  s = s.slice(0, target) + 'function exclIndepDemo(root){' + s.slice(target + 'function indepDemo(root){'.length);
  console.log('indepDemo 새 정의 개명 (위치', target, ')');
}

/* build 참조 — n:141, n:145 의 것만 */
const fixBuild = (labNo, from, to) => {
  const i = s.indexOf('{n:' + labNo + ',core:');
  if (i < 0) throw new Error('LAB ' + labNo + ' 없음');
  const j = s.indexOf(from, i);
  if (j < 0 || j > i + 700) throw new Error('LAB ' + labNo + ' build 참조 실패');
  s = s.slice(0, j) + to + s.slice(j + from.length);
};
fixBuild(141, 'build:solidDemo', 'build:diskVolDemo');
fixBuild(145, 'build:indepDemo', 'build:exclIndepDemo');
fs.writeFileSync(P, s);
console.log('src 수리 완료');
