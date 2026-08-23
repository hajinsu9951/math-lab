// 무조작 감사 결함 6종 수리 — 신호를 초기 화면과 절연
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');

/* ① LAB 39 — 초기 상자를 정육면체(최소 상태)에서 30×30으로 */
{
  const from = `const S={ a:20, b:20, best:Infinity };`;
  if (!s.includes(from)) throw new Error('L39 초기값 미발견');
  s = s.replace(from, `const S={ a:30, b:30, best:Infinity };`);
}

/* ② LAB 80 — 초기 사각형을 평행사변형이 아닌 일반 사각형으로 */
{
  const from = `const S={ P:[{x:90,y:230},{x:290,y:230},{x:330,y:90},{x:130,y:90}] };`;
  if (!s.includes(from)) throw new Error('L80 초기값 미발견');
  s = s.replace(from, `const S={ P:[{x:90,y:230},{x:290,y:230},{x:320,y:110},{x:150,y:70}] };`);
}

/* ③ LAB 86 — 두 상황 모두 방문 시에만 뜨는 비교 신호 추가 */
{
  const from = `const S={ mode:'and', picked:[] };`;
  if (!s.includes(from)) throw new Error('L86 상태 미발견');
  s = s.replace(from, `const S={ mode:'and', picked:[], seenOr:false };`);
  const fromOut = `「그리고」는 곱.</span>\`;`;
  if (!s.includes(fromOut)) throw new Error('L86 출력 미발견');
  s = s.replace(fromOut, `「그리고」는 곱.</span>\` + (S.seenOr ? '<br><b style="color:#7C3AED">두 상황을 모두 확인했습니다</b> — 이제 두 법칙을 비교할 수 있습니다.' : '');`);
  const fromOr = `$('#ctOr').onclick=()=>{ S.mode='or'; draw(); };`;
  if (!s.includes(fromOr)) throw new Error('L86 or 핸들러 미발견');
  s = s.replace(fromOr, `$('#ctOr').onclick=()=>{ S.mode='or'; S.seenOr=true; draw(); };`);
}

/* ④ 미션 수리 — 33 S3 · 44 S2 · 65 S3 · 80 S2/S5 · 86 S3 */
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

M['33'][2] = {
  t: '평균의 거짓말 — 230과 280을 같은 수만큼 팔아 양극화 가게를 만들어 보세요. 중앙값은 어디에 서나요? 평균 치수의 신발은 진열대에 있나요?',
  re: '중앙값 255',
  do: '① 230 몇 켤레 ② 280 같은 수만큼 ③ 평균·중앙값의 자리와 진열대 대조',
  hand: '(230×k + 280×k)÷2k 를 계산해 평균이 「없는 치수」가 됨을 확인'
};
M['44'][1].re = '평균 어긋남: \\d';
M['65'][2] = {
  t: '기준 늘리기 — A·B 를 끌어 AB 를 200 이상으로 벌려 보세요. 선을 살리려면 r 도 함께 벌려야 하나요? P 를 끌어 PA = PB 가 여전한지 확인하세요.',
  re: 'AB = 2\\d\\d',
  do: '① B 를 오른쪽으로 끌어 AB ≥ 200 ② r 을 AB/2 이상으로 ③ P 세 곳에서 PA·PB 대조',
  hand: 'AB 가 커지면 경계 반지름(AB/2)이 어떻게 변하는지 표로'
};
M['80'][1] = {
  t: '조립 실험 — 꼭짓점을 끌어(또는 버튼으로) 다섯 판정 등을 모두 켜 보세요. 어떤 순간 다섯이 한꺼번에 켜지나요?',
  re: '평행사변형입니다',
  do: '① 두 대각선 중점(파랑·주황)이 겹치도록 조정 ② 다섯 등 동시 점등 관찰',
  hand: '다섯 조건을 표로 쓰고 함께 켜진 순간의 좌표 기록'
};
M['80'][4] = {
  t: '심화 — 전파괴와 증명: 꼭짓점을 끌어 다섯 판정을 모두 꺼 보세요. 그리고 「대각선이 서로를 이등분하면 평행사변형」을 SAS 합동으로 증명해 마무리하세요.',
  re: '아직 아무 조건도',
  do: '① 한 꼭짓점을 크게 끌어 전부 끄기 ② 일부만 켜진 중간 상태도 탐색',
  hand: '대각선 교점의 두 삼각형 SAS 증명 쓰기'
};
M['86'][2] = {
  t: '다시 세트로 — 「그리고」로 돌아와 나무의 가지 끝을 직접 세어 보세요. 두 법칙을 모두 여행했다면 비교 준비 완료!',
  re: '모두 확인했습니다',
  do: '① 세트 버튼으로 복귀 ② 가지 끝 6개 세기 ③ 두 구조(나란히 vs 다시 뻗음) 비교',
  hand: '김밥 4종·음료 3종 세트가 몇 가지인지 나무 스케치로 검산'
};
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);

/* 자기일치 재감사 (수리 대상만) */
let bad = 0;
for (const k of ['33', '44', '65', '80', '86']) {
  const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
  M[k].forEach((x, ix) => {
    if (x.re && new RegExp(x.re).test(texts)) { console.log(`자기일치! LAB ${k} S${ix + 1}`); bad++; }
  });
}
if (bad) throw new Error('자기일치 ' + bad);
console.log('결함 6종 수리 완료 (데모 3건 + 미션 6건), 자기일치 0');
