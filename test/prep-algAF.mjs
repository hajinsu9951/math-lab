// 설치 전 조정 — LAB 271 의 3단계 문구가 열자마자 켜진다(처음 위치에서 이미 크게 어긋남).
// 「접하는 자리는 최댓값과 최솟값 둘」을 3단계로 삼는다.
import fs from 'node:fs';
const F = 'algAF-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const A = `      + (Math.abs(cross)>1.5 ? \`<b style="color:#7C3AED">두 화살표가 크게 어긋나 있습니다 — 조건 곡선을 따라 더 가면 값이 커집니다.</b><br>\` : '')`;
const B = `      + (Math.abs(cross)<0.05 && v<0 ? \`<b style="color:#7C3AED">여기서도 두 화살표가 나란합니다 — 접하는 자리는 가장 큰 곳과 가장 작은 곳, 둘입니다.</b><br>\` : '')`;
if (!s.includes(A)) throw new Error('앵커 실패');
fs.writeFileSync(F, s.replace(A, B), 'utf8');
console.log('LAB 271 3단계 신호 교체');
