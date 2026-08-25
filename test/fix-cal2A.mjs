// 미적분Ⅱ A 수리 — 초기 상태가 신호를 켜던 4건 + 172 도달 불가 목표
import fs from 'node:fs';
const EDITS = [
  // 172 — (2n+1)/(n+3) 은 수렴이 느려 0.005 에 못 닿는다 → 문턱을 0.03 으로
  ["      + (gap!==null && gap<0.005 ? `<b style=\"color:#B45309\">차이가 0.005 아래 — 붉은 선에 사실상 붙었습니다. 수렴합니다.</b><br>` : '')",
   "      + (gap!==null && gap<0.03 ? `<b style=\"color:#B45309\">차이가 0.03 아래 — 붉은 선에 사실상 붙었습니다. 수렴합니다.</b><br>` : '')"],
  // 173 — 초기 r 이 작아 열자마자 0 판정
  ["slider('gcR','공비 r',-1.5,1.5,0.05,0.5,'')", "slider('gcR','공비 r',-1.5,1.5,0.05,0.95,'')"],
  // 174 — 초기 항 수가 많아 열자마자 1 에 붙음
  ["slider('spN','더하는 항의 수',1,300,1,8,'항')", "slider('spN','더하는 항의 수',1,300,1,3,'항')"],
  // 175 — 초기 선택이 0.333… 이라 열자마자 판정
  ["        <option value=\"p3\">① 0.333… (첫 항 0.3, 공비 0.1)</option>\n        <option value=\"p9\">② 0.999… (첫 항 0.9, 공비 0.1)</option>",
   "        <option value=\"p9\">① 0.999… (첫 항 0.9, 공비 0.1)</option>\n        <option value=\"p3\">② 0.333… (첫 항 0.3, 공비 0.1)</option>"],
  // 176 — 초기 각이 너무 작아 열자마자 비가 1
  ["slider('snX','각 x (라디안)',1,80,1,40,'')", "slider('snX','각 x (라디안)',1,80,1,10,'')"],
];
for (const f of ['src/40-demos.js', 'algM-demos.txt']) {
  let s = fs.readFileSync(f, 'utf8');
  let n = 0;
  EDITS.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log(f, '실패', i + 1); });
  fs.writeFileSync(f, s);
  console.log(f, '교체', n, '/', EDITS.length, '건');
}
/* 미션 문구도 함께 조정 (문턱과 선택지 번호) */
{
  const P = 'src/40-demos.js';
  let s = fs.readFileSync(P, 'utf8');
  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
  M['175'][1].t = '오늘의 문제 — ①(0.999…)를 고르고 자릿수를 16 까지 올리세요. 남은 틈이 얼마인가요?';
  M['175'][1].do = '① 순환소수 ① 선택 ② 자릿수를 16 으로 ③ 남은 틈 값 읽기';
  M['175'][2].t = '분수로 바꾸기 — ②(0.333…)를 고르세요. 어떤 분수와 같은가요?';
  M['175'][2].do = '① 순환소수 ② 선택 ② 참값 표시 확인 ③ 첫 항과 공비 찾기';
  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
  fs.writeFileSync(P, s);
  console.log('175 미션 문구 조정 완료');
}
