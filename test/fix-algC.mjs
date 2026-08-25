// 대수 C 수리 — 123 초기값/신호, 124 신호(innerText)·증가자료, 126 초기값
import fs from 'node:fs';

/* 데모 수정: src 와 원본 txt 모두 */
const EDITS = [
  // 123 초기값을 문제값과 분리
  ["slider('agA','시작 금액',10,200,10,100,'만원')", "slider('agA','시작 금액',10,200,10,50,'만원')"],
  ["slider('agD','등차 — 매달 더하는 돈',1,20,1,10,'만원')", "slider('agD','등차 — 매달 더하는 돈',1,20,1,5,'만원')"],
  ["slider('agR','등비 — 매달 늘어나는 비율',1,20,1,5,'%')", "slider('agR','등비 — 매달 늘어나는 비율',1,20,1,3,'%')"],
  ["slider('agN','개월 수',6,60,6,24,'개월')", "slider('agN','개월 수',6,60,6,12,'개월')"],
  // 124 증가 자료가 등차가 되도록(캡 제거)
  ["$('#sdUp').onclick=()=>{ S.v=S.v.map((_,i)=>1+2*i>9?9:1+2*i); draw(); };",
   "$('#sdUp').onclick=()=>{ S.v=S.v.map((_,i)=>i+1); draw(); };"],
  // 126 초기값을 문제값과 분리
  ["slider('svM','매달 넣는 돈',5,50,5,20,'만원')", "slider('svM','매달 넣는 돈',5,50,5,10,'만원')"],
  ["slider('svR','연이자율',1,8,0.5,3,'%')", "slider('svR','연이자율',1,8,0.5,2,'%')"],
  ["slider('svN','기간',6,36,6,12,'개월')", "slider('svN','기간',6,36,6,6,'개월')"],
];
for (const f of ['src/40-demos.js', 'algC-demos.txt']) {
  let s = fs.readFileSync(f, 'utf8'); let n = 0;
  for (const [a, b] of EDITS) if (s.includes(a)) { s = s.replace(a, b); n++; }
  fs.writeFileSync(f, s);
  console.log(f, '교체', n, '건');
}

/* PROBLEMS 123 — 기간을 36개월로 (역전이 실제로 일어나는 범위) */
{
  const P = 'src/40-demos.js';
  let s = fs.readFileSync(P, 'utf8');
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  const PR = JSON.parse(m[1]);
  PR['123'] = { sit: '저축 방식 둘 — A는 매달 10만원씩 더하고, B는 매달 5%씩 불립니다. 시작은 둘 다 100만원이고, 3년(36개월)을 봅니다.',
    ask: '지금은 A가 앞서는데, 3년 안에 B가 이길까? 이긴다면 몇 개월째일까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  /* MISSIONS 수리 */
  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
  M['123'][1] = {
    t: '오늘의 문제 — 시작 100만원, 등차 10만원, 등비 5%, 36개월로 맞추세요. 역전은 몇 개월째에 일어나나요?',
    re: '개월째에 등비가 등차를',
    do: '① 네 슬라이더를 문제 값으로 ② 붉은 점선의 위치 확인 ③ 36개월 뒤 두 금액 비교',
    hand: '100×1.05ⁿ 와 100+10n 을 n=25, 27 에서 각각 계산해 역전 구간 확인'
  };
  M['123'][2] = {
    t: '비율을 낮추면 — 등비 비율을 1%로 내려 보세요. 36개월 안에도 역전이 일어나나요?',
    re: '×1\\.01ⁿ',
    do: '① r = 1% ② 화면 판정 확인 ③ 개월 수를 늘려 언제 역전되는지 탐색',
    hand: '역전 조건 a(1+r)ⁿ ≥ a + dn 을 부등식으로 쓰기'
  };
  M['124'][1].re = '누적합이 직선이 되었습니다';
  M['124'][2].re = '이차 곡선이 됩니다';
  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
  fs.writeFileSync(P, s);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  let bad = 0;
  for (const k of ['123', '124', '126']) {
    const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n')
      + '\n' + PR2[k].sit + '\n' + PR2[k].ask;
    M[k].forEach((x, ix) => {
      if (x.re && new RegExp(x.re).test(texts)) { console.log(`자기일치! LAB ${k} S${ix + 1}`); bad++; }
    });
  }
  if (bad) throw new Error('자기일치 ' + bad);
  console.log('MISSIONS 수리 완료 (123 S2·S3, 124 S2·S3), 자기일치 0');
}
