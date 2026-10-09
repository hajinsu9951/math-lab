# -*- coding: utf-8 -*-
"""LAB 131~140 교차 검증 지적 반영 — evtDemo(LAB 131) 의 수학 오류 수정.

지적
  「닫힌구간 + 끊긴 함수」에서 화면은 "최댓값이 없습니다" 라고 말하는데
  실제로는 x = 4 에서 4.0 을 가져 **최댓값이 존재한다.**
  내려오는 폭이 2.6 뿐이어서 오른쪽 조각(최대 4.0)이
  왼쪽 조각의 도달 못하는 상한(3.8)을 넘어섰기 때문이다.

반영
  ① 내려오는 폭 2.6 → 3.4 (오른쪽 조각 최대 3.2 < 3.8) — 그래야 최댓값이 진짜 없다
  ② 최솟값은 x = 2 에서 0.4 로 **있다** — read() 와 화면 문구가 그대로 말하게 한다
  ③ 쓰이지 않는 hasMax 줄 제거, 네 조합별 문구를 각각 맞게 고친다
  ④ x = 2 의 오른쪽 조각 시작점을 속 찬 점으로 찍어 「이 값은 갖는다」를 보이게 한다

사용: python docs/LAB131_140_수업모형/fix_review.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

JOBS = [
 # ① 내려오는 폭
 ("""  function g(x,kind){ return kind==='jump' ? (x<2 ? 1+1.4*x : 1+1.4*x-2.6) : 1+1.4*x; }""",
  """  /* 끊긴 함수 — 오른쪽 조각의 최대 3.2 가 왼쪽 조각의 상한 3.8 보다 낮아야
     「최댓값이 없다」가 참이 된다. 내려오는 폭을 3.4 로 잡은 까닭이다. */
  function g(x,kind){ return kind==='jump' ? (x<2 ? 1+1.4*x : 1+1.4*x-3.4) : 1+1.4*x; }"""),

 # ④ x=2 속 찬 점
 ("""    if(kind==='jump'){ ctx.fillStyle='#fff'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(X(2),Y(g(1.999,'jump')),4.2,0,7); ctx.fill(); ctx.stroke(); }""",
  """    if(kind==='jump'){ ctx.fillStyle='#fff'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(X(2),Y(g(1.999,'jump')),4.2,0,7); ctx.fill(); ctx.stroke();
      /* 오른쪽 조각은 x = 2 를 포함한다 — 이 값(최솟값)은 실제로 갖는다 */
      ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(X(2),Y(g(2,'jump')),4.2,0,7); ctx.fill(); }"""),

 # ③ 문구
 ("""    const sup=g(4,kind), inf=g(0,kind);
    const hasMax = iv==='cl' && kind==='cont' ? true : (iv==='cl' && kind==='jump' ? true : false);
    let msg;
    if(iv==='cl' && kind==='cont') msg = `닫힌구간 + 연속 — 최댓값 ${sup.toFixed(1)}, 최솟값 ${inf.toFixed(1)} 이 <b>반드시</b> 있습니다.`;
    else if(iv==='op') msg = `<b style="color:#B45309">열린구간이라 — 최댓값이 없습니다 (${sup.toFixed(1)} 에 다가가지만 도달하지 못함).</b>`;
    else msg = `<b style="color:#7C3AED">끊긴 함수라 — 왼쪽 조각의 최댓값이 없습니다 (x = 2 직전에 다가가지만 그 값을 갖지 못함).</b>`;""",
  """    const sup=g(4,kind), inf=g(0,kind), lim=g(1.999,'jump');
    let msg;
    if(iv==='cl' && kind==='cont') msg = `닫힌구간 + 연속 — 최댓값 ${sup.toFixed(1)}, 최솟값 ${inf.toFixed(1)} 이 <b>반드시</b> 있습니다.`;
    else if(kind==='jump') msg = `<b style="color:#7C3AED">끊긴 함수라 — 최댓값이 없습니다 (x = 2 직전에 ${lim.toFixed(1)} 에 다가가지만 그 값을 갖지 못하고, 오른쪽 조각의 가장 큰 값은 ${sup.toFixed(1)} 입니다).</b><br><span style="color:#6B7280">최솟값은 x = 2 에서 ${g(2,'jump').toFixed(1)} 로 <b>있습니다</b> — 두 조건 중 하나만 깨져도 「반드시」가 사라질 뿐입니다.</span>`;
    else msg = `<b style="color:#B45309">열린구간이라 — 최댓값도 최솟값도 없습니다 (${sup.toFixed(1)} 과 ${inf.toFixed(1)} 에 다가가지만 도달하지 못함).</b>`;"""),

 # ② read()
 ("""      const ok = iv==='cl' && kind==='cont';
      return [iv==='cl'?'닫힘':'열림', kind==='cont'?'연속':'끊김',
        ok?g(4,kind).toFixed(1):'없음', ok?g(0,kind).toFixed(1):'없음', ok?'보장':'보장 안 됨']; } };""",
  """      const ok = iv==='cl' && kind==='cont';
      /* 최댓값 — 닫힘 + 연속일 때만 있다 (끊김은 x=2 직전 상한에 도달하지 못한다)
         최솟값 — 끊김이면 x=2 에서 실제로 갖는다. 「보장되나」는 정리의 보장 여부다 */
      const mn = kind==='jump' ? g(2,'jump').toFixed(1) : (iv==='cl' ? g(0,kind).toFixed(1) : '없음');
      return [iv==='cl'?'닫힘':'열림', kind==='cont'?'연속':'끊김',
        ok?g(4,kind).toFixed(1):'없음', mn, ok?'보장':'보장 안 됨']; } };"""),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    if '1+1.4*x-3.4' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    for a, b in JOBS:
        assert h.count(a) == 1, '못 찾음: ' + a[:60]
        h = h.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('evtDemo 교차 검증 반영 ok\n')


if __name__ == '__main__':
    main(sys.argv[1])
