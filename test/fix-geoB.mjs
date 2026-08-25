// 166 PRINS 한 줄의 따옴표가 깨진 것을 수리 (템플릿 리터럴에서 \' 가 ' 로 풀림)
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const BAD = "   {t:'\\\\theta=60^\\\\circ \\\\Rightarrow S'=\\\\tfrac{S}{2}', s:'각이 60°면 그림자 넓이가 <b>정확히 절반</b>입니다.'}";
const GOOD = '   {t:"\\\\theta=60^\\\\circ \\\\Rightarrow S\'=\\\\tfrac{S}{2}", s:\'각이 60°면 그림자 넓이가 <b>정확히 절반</b>입니다.\'}';
if (!s.includes(BAD)) throw new Error('앵커 실패');
s = s.replace(BAD, GOOD);
fs.writeFileSync(P, s);
new Function(fs.readFileSync(P, 'utf8'));
console.log('수리 완료 — 구문 검사 통과');
