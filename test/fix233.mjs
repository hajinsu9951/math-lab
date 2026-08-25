// LAB 233 — 데모의 상시 설명문이 신호 문구와 겹쳐 열자마자 켜졌다. 설명문을 다시 쓴다.
import fs from 'node:fs';
const OLD = `<div class="note" style="margin-top:8px">한 꼭짓점에 모인 각의 합이 <b>정확히 360°</b> 여야
      빈틈도 겹침도 없이 채워집니다.</div>`;
const NEW = `<div class="note" style="margin-top:8px">한 꼭짓점에 모인 각의 합이 <b>정확히 360°</b> 여야
      평면이 고르게 이어집니다. 모자라면 빈 곳이, 넘치면 포개진 곳이 생깁니다.</div>`;
for (const P of ['src/40-demos.js', 'algY-demos.txt']) {
  let s = fs.readFileSync(P, 'utf8');
  if (!s.includes(OLD)) { console.log('건너뜀(문구 없음):', P); continue; }
  fs.writeFileSync(P, s.replace(OLD, NEW), 'utf8');
  console.log('수정:', P);
}
// 재검사 — 233 화면에 남아 있는 신호 문구가 없어야 한다
const s = fs.readFileSync('src/40-demos.js', 'utf8');
const i = s.indexOf('function tessellationDemo'), j = s.indexOf('function fractalDemo');
const body = s.slice(i, j);
for (const sig of ['빈틈도 겹침도 없이', '한 종류로는 채울 수 없습니다']) {
  const c = body.split(sig).length - 1;
  console.log(sig, '→ 데모 안 등장', c, '회', c === 1 ? '(신호 한 곳뿐 — OK)' : '★확인 필요');
}
