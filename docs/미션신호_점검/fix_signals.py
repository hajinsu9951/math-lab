# -*- coding: utf-8 -*-
"""미션 달성 신호(re) 가 정규식으로 해석되어 깨진 것을 고친다.

지적 (교차 검증)
  stepLadder 는 `new RegExp(s.re).test(root.innerText)` 로 달성을 판정한다.
  그런데 texify 가 LESSON 본문의 a 제곱을 TeX 로 바꾸면서 **re 값까지 함께** 바꾸었다.
  · 달러 기호가 붙은 신호 → 「문자열 끝」 앵커가 되어 **영영 매칭되지 않는다**
  · 'P(A' 처럼 닫히지 않은 괄호 → new RegExp 가 **예외를 던진다**
    (MutationObserver 안에서 터져 그 실험실의 자동 확인이 아예 죽는다)
  · '(a+b)' → a 한 개 이상으로 읽혀 엉뚱한 곳을 찾는다

반영
  ① texify 가 re 와 id 를 건드리지 않도록 막았다 (docs/수식표기/texify.py)
  ② 이미 깨진 여섯 줄을 **화면이 실제로 내놓는 문장** 으로 되돌린다
  ③ stepLadder 에 try/catch 를 둬, 잘못된 정규식이면 글자 그대로 찾게 한다 (안전망)

사용: python docs/미션신호_점검/fix_signals.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# 바꿀 줄은 「지금 들어 있는 re 값」으로 찾는다 — 줄 전체를 새로 쓴다
LINES = [
    ("re:'$a^{2}$'",
     "  {t:'a 와 b 를 <b>같게</b> 맞춰 보세요. 네 조각이 어떻게 되나요?', re:'네 조각이 같아졌습니다'},"),
    ("re:'(a+b)'",
     "  {t:'다시 <b>다르게</b> 해 보세요. 가운데 두 조각이 왜 둘일까요?', re:'2ab 의 정체입니다'},"),
    ("re:'$p^{2}$'",
     "  {t:'더 눌러도 <b>아무것도 지워지지 않는</b> 순간까지 가 보세요.', re:'남은 수는 전부 소수입니다'},"),
    ("re:'P(A'",
     "  {t:'두 원을 <b>떼어 놓아</b> 보세요. 두 값이 어떻게 되나요?', re:'지금은 배반'},"),
    ("re:'f(k)'",
     "  {t:'<b>나머지 R</b> 와 직접 대입한 값을 견주어 보세요.', re:'조립 완료'},"),
    ("re:'f(a'",
     "  {t:'점 a 를 끌어 곡선이 x축을 <b>지나는 자리</b> 를 찾아보세요.', re:'근 발견'},"),
    ("re:'에서 $x^{2}$ 의 계수'",
     "  {t:'n = 5, c = 2, r = 3 으로 맞춰 보세요.', re:'의 계수는'},"),
    # 조작 패널 글자라 켜자마자 통과되던 둘
    ("re:'나누'",
     "  {t:'<b>「양변을 2로 나누기」</b> 를 눌러 x 를 혼자 남기세요.', re:'를 찾았습니다'},"),
    ("re:'R, G, B'",
     "  {t:'<b>「도전③ 무채색 합성」</b> 으로 세 값을 같게 만들어 보세요.', re:'곧 회색입니다'},"),
]

GUARD_OLD = """  function scan(){
    const s=list[cur];
    if(s && s.re && new RegExp(s.re).test(root.innerText)) doneStep(cur);
  }"""
GUARD_NEW = """  function scan(){
    const s=list[cur];
    if(!s || !s.re) return;
    const t=root.innerText;
    /* 정규식이 잘못 만들어졌으면(괄호가 안 닫혔다거나) 글자 그대로 찾는다 —
       자동 확인이 통째로 죽는 것보다 낫다 */
    let hit;
    try { hit = new RegExp(s.re).test(t); } catch(e){ hit = t.indexOf(s.re) >= 0; }
    if(hit) doneStep(cur);
  }"""


def main(path):
    src = open(path, encoding='utf-8').read()
    if '를 찾았습니다' in src:
        sys.stdout.write('이미 반영됨\n')
        return
    lines = src.split('\n')
    done = 0
    for token, new in LINES:
        hit = [i for i, ln in enumerate(lines) if token in ln]
        assert len(hit) == 1, '못 찾음(%d개): %s' % (len(hit), token)
        lines[hit[0]] = new
        done += 1
    src = '\n'.join(lines)
    assert src.count(GUARD_OLD) == 1, 'stepLadder 의 scan 을 못 찾음'
    src = src.replace(GUARD_OLD, GUARD_NEW, 1)
    open(path, 'w', encoding='utf-8').write(src)
    sys.stdout.write('미션 달성 신호 교정 ok — 깨진 신호 %d개 + 안전망\n' % done)


if __name__ == '__main__':
    main(sys.argv[1])
