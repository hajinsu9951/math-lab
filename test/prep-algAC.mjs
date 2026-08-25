// 설치 전 조정 — 열자마자 신호가 켜지는 초기값 3건과, 닿을 수 없는 신호 1건
import fs from 'node:fs';
const F = 'algAC-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  // 253 — 처음부터 두 계수가 모두 0 이 아니면 3단계 문구가 열자마자 뜬다
  ["slider('spt','v 에 곱할 수',-2,2,0.5,1,'')",
   "slider('spt','v 에 곱할 수',-2,2,0.5,0,'')"],
  // 254 — 처음부터 실수배가 직선 밖으로 나가면 3단계 문구가 열자마자 뜬다
  ["slider('sbC','그 점에 곱할 수',-2,3,0.5,2,'')",
   "slider('sbC','그 점에 곱할 수',-2,3,0.5,1,'')"],
  // 255 — 평면에서 차원 1 은 이 벡터 구성으로 닿을 수 없다. 「넷을 넣어도 2」로 바꾼다
  ["      + (r===1 && V.length>=2 ? `<b style=\"color:#7C3AED\">모두 한 직선 위에 있어 아무리 모아도 평면을 못 만듭니다.</b><br>` : '')",
   "      + (V.length>=4 && r===2 ? `<b style=\"color:#7C3AED\">넷을 넣어도 여전히 2 입니다 — 평면에서는 차원이 2 를 넘지 못합니다.</b><br>` : '')"],
  // 256 — 처음 기저를 표준으로 두어 좌표가 그대로이게 한다
  ["      ${slider('b2ax','새 기저 e₁ 의 x',-3,3,1,1,'')}\n      ${slider('b2ay','새 기저 e₁ 의 y',-3,3,1,1,'')}\n      ${slider('b2bx','새 기저 e₂ 의 x',-3,3,1,-1,'')}\n      ${slider('b2by','새 기저 e₂ 의 y',-3,3,1,1,'')}",
   "      ${slider('b2ax','새 기저 e₁ 의 x',-3,3,1,1,'')}\n      ${slider('b2ay','새 기저 e₁ 의 y',-3,3,1,0,'')}\n      ${slider('b2bx','새 기저 e₂ 의 x',-3,3,1,0,'')}\n      ${slider('b2by','새 기저 e₂ 의 y',-3,3,1,1,'')}"],
];
let n = 0;
E.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패', i + 1, a.slice(0, 60)); });
fs.writeFileSync(F, s, 'utf8');
console.log('조정', n, '/', E.length, '건');
