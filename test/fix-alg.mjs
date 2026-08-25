// 대수 6종 수리 — 107 목표 완화(0.15시간) · 108·109 초기값을 문제값과 분리
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');

/* ① LAB107 — RMSE 목표 0.12 → 0.15 (최적이 0.0999라 0.12는 여유가 없음) */
{
  const before = s;
  s = s.replace("rmse<0.12?'#0E9384':rmse<0.3?'#B45309':'#BE123C'", "rmse<0.15?'#0E9384':rmse<0.3?'#B45309':'#BE123C'");
  s = s.replace("(rmse<0.12 ? `<b style=\"color:#0E9384\">일출 모형 명중", "(rmse<0.15 ? `<b style=\"color:#0E9384\">일출 모형 명중");
  s = s.replace("return [A.toFixed(2), D.toFixed(2), C.toFixed(2), r.toFixed(3), r<0.12?'명중':'조정 필요'];",
                "return [A.toFixed(2), D.toFixed(2), C.toFixed(2), r.toFixed(3), r<0.15?'명중':'조정 필요'];");
  if (s === before) throw new Error('LAB107 임계값 교체 실패');
  console.log('LAB107 임계값 0.15로 완화');
}

/* ② LAB108 — 초기 슬라이더를 문제값(63·55·50)에서 떼어 놓기 */
{
  const before = s;
  s = s.replace("${slider('lsA','각 A (∠BAC)',20,110,1,63,'°')}", "${slider('lsA','각 A (∠BAC)',20,110,1,45,'°')}");
  s = s.replace("${slider('lsB','각 B (∠ABC)',20,110,1,55,'°')}", "${slider('lsB','각 B (∠ABC)',20,110,1,70,'°')}");
  s = s.replace("${slider('lsC','기선 AB (m)',20,120,1,50,'m')}", "${slider('lsC','기선 AB (m)',20,120,1,80,'m')}");
  if (s === before) throw new Error('LAB108 초기값 교체 실패');
  console.log('LAB108 초기값 45°·70°·80m 로 변경');
}

/* ③ LAB109 — 초기 슬라이더를 문제값(1200·6%·24개월)에서 떼어 놓기 */
{
  const before = s;
  s = s.replace("${slider('loP','대출 원금',100,2000,50,1200,'만원')}", "${slider('loP','대출 원금',100,2000,50,800,'만원')}");
  s = s.replace("${slider('loR','연이자율',1,12,0.5,6,'%')}", "${slider('loR','연이자율',1,12,0.5,4,'%')}");
  s = s.replace("${slider('loN','상환 기간',6,60,6,24,'개월')}", "${slider('loN','상환 기간',6,60,6,36,'개월')}");
  if (s === before) throw new Error('LAB109 초기값 교체 실패');
  console.log('LAB109 초기값 800만원·4%·36개월 로 변경');
}

/* ④ 미션 문구 동기화 */
{
  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
  M['107'][2].t = '모형 완성 — A(진폭)와 C(위상)까지 맞춰 평균 오차를 9분(0.15시간) 아래로 낮추세요.';
  M['107'][2].do = '① A 를 여름·겨울 차이의 절반(약 1.2)으로 ② C 를 좌우로 밀며 RMSE 관찰 ③ 0.15 미만 달성';
  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
  console.log('LAB107 미션 문구 동기화');
}
fs.writeFileSync(P, s);
console.log('수리 완료');
