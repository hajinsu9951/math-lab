// 설치 전 조정 — 열자마자 신호가 켜지는 초기값 4건, 닿을 수 없는 임계 1건,
// 그리고 한 조작에 두 신호가 함께 켜지는 자리 1건
import fs from 'node:fs';
const F = 'algAI-demos.txt';
let s = fs.readFileSync(F, 'utf8');
let n = 0;
const one = (a, b, tag) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패:', tag); };
const all = (a, b, tag) => { const c = s.split(a).length - 1; if (c) { s = s.split(a).join(b); n++; } else console.log('실패:', tag); };

/* 282 — 처음부터 두 원이 만나지 않아 3단계 문구가 열자마자 뜬다 */
one("slider('rxD','두 원 사이의 거리',0.6,4,0.1,2.4,'')",
    "slider('rxD','두 원 사이의 거리',0.6,4,0.1,1.8,'')", '282 초기 거리');
/* 282 — 근축 판정을 0.05 로 두면 0.1 눈금으로는 닿을 수 없다 */
all("Math.abs(gap)<0.05", "Math.abs(gap)<0.15", '282 근축 판정');

/* 283 — 처음부터 c 가 0.6 이상이라 2단계 문구가 열자마자 뜬다 */
one("slider('inC','직선이 중심에서 떨어진 거리',0,2.4,0.1,1.2,'')",
    "slider('inC','직선이 중심에서 떨어진 거리',0,2.4,0.1,0.3,'')", '283 초기 거리');

/* 284 — 처음부터 중심이 접점에서 멀어 3단계 문구가 열자마자 뜬다 */
one("slider('isC','반전 중심의 위치',-1.5,1.5,0.1,-1.5,'')",
    "slider('isC','반전 중심의 위치',-1.5,1.5,0.1,-0.4,'')", '284 초기 중심');

/* 285 — 기울이는 한 번의 조작으로 두 신호가 함께 켜진다.
   3단계는 「시점을 낮춘 뒤」에만 켜지도록 조건을 나눈다 */
one("      + (Math.abs(r1-r2)>0.25 ?",
    "      + (Math.abs(ang)>=20 && hh<=1.5 && Math.abs(r1-r2)>0.5 ?", '285 3단계 조건');

/* 286 — 처음부터 d 가 0 이라 2단계 문구가 열자마자 뜬다 */
one("slider('pnd','상수항 d',-6,6,1,0,'')",
    "slider('pnd','상수항 d',-6,6,1,2,'')", '286 초기 d');

fs.writeFileSync(F, s, 'utf8');
console.log('조정', n, '/ 6 건');
