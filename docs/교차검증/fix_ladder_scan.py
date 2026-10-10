# -*- coding: utf-8 -*-
"""사다리의 자동 확인이 영원히 켜지지 않던 것을 고친다 — ① 교실 운영.

무엇이 잘못됐나
  stepLadder 는 「붙자마자의 화면 글에 이미 있는 신호」를 증거로 치지 않는다
  (hit = rx.test(t) && !rx.test(first)). 아무것도 하지 않고 통과되는 것을 막는 장치다.
  그런데 신호가 «늘 화면에 있는 값의 이름» 인 실험실이 많다 —
  LAB 33 은 붙자마자 「평균 257.6 · 중앙값 260 · 최빈값 260」 을 보여 주는데
  미션 1 의 신호가 「최빈값」, 미션 2 가 「평균」 이다. 둘 다 first 에 있으므로
  학생이 막대를 어떻게 바꿔도 자동 확인이 켜지지 않는다. 「해냈어요」 를 손으로
  눌러야만 넘어가므로 「자동 확인」 이라는 표시가 거짓이 되고,
  «정말 해 봤는가» 를 확인하던 장치가 사라진다. 356종 가운데 160종이 그랬다.

어떻게 고치나
  신호가 처음부터 있던 곳에서는 신호만으로 판정할 수 없으므로
  «이 단계가 시작된 뒤 학생이 실험 화면을 만졌는가» 를 함께 본다.
  — 「화면 글이 바뀌었는가」로 재면 안 된다. 데모가 붙은 직후 스스로 한 번 더 그리는
    실험실이 있어(LAB 45·47·50·54·57·61·67·73·83·85·119·120 …) 아무도 만지지 않았는데
    단이 열렸다. 실제로 이 방법을 먼저 넣었다가 13종에서 저절로 열리는 것을 보고 바꿨다.
  그래서 실험 화면 안에서 일어난 «사람의 입력»(포인터·키·입력·변경)만 증거로 센다.
  사다리 자신과 탐구 노트에서 일어난 입력은 세지 않는다 — 조작이 아니다.
  신호가 처음에 없던 곳은 지금까지와 한 글자도 다르지 않게 움직인다.

사용: python docs/교차검증/fix_ladder_scan.py src/40-demos.js
"""
import io
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HEAD = """  const first = labText();
"""

FINAL = """  const first = labText();
  /* 신호 낱말이 처음부터 화면에 있는 실험실이 많다 — 「평균·최빈값」처럼 늘 표시되는 값의 이름이다.
     그런 곳에서는 신호만으로 판정할 수 없으므로 «이 단계가 시작된 뒤 학생이 실험 화면을 만졌는가»를
     함께 본다. 「글이 바뀌었는가」로 재면 안 된다 — 붙은 직후 스스로 한 번 더 그리는 데모가 있어
     아무도 만지지 않았는데 단이 열린다. 사람의 입력만 센다.
     사다리와 탐구 노트에서 난 입력은 조작이 아니므로 빼고, 신호가 처음에 없던 곳은 그대로 움직인다.
     (2026-10-10 교차 검증 ① — 이 보강이 없으면 356종 가운데 160종에서 자동 확인이 끝내 안 켜졌다) */
  let acted = false;
  const sawAct = e => {
    const t = e.target;
    if(t && t.closest && (t.closest('.ldr') || t.closest('.lsnnote'))) return;
    acted = true;
  };
  ['pointerdown','keydown','input','change','click'].forEach(t =>
    root.addEventListener(t, sawAct, true));
  function scan(){
    const s=list[cur];
    if(!s || !s.re) return;
    const t=labText();
    /* 정규식이 잘못 만들어졌으면(괄호가 안 닫혔다거나) 글자 그대로 찾는다 —
       자동 확인이 통째로 죽는 것보다 낫다 */
    let hit;
    try { const rx=new RegExp(s.re); hit = rx.test(t) && (!rx.test(first) || acted); }
    catch(e){ hit = t.indexOf(s.re) >= 0 && (first.indexOf(s.re) < 0 || acted); }
    if(hit) doneStep(cur);
  }
  const _adv=doneStep;
  /* 한 단을 넘으면 «만졌다»를 되돌린다 — 다음 단은 또 한 번 조작해야 열린다 */
  doneStep=function(k){ _adv(k); acted=false; setTimeout(scan,0); };"""

TAIL = """
  items.forEach((el,k)=>{ el.querySelector('.ldk').onclick=()=>doneStep(k); });"""

# 지금까지 거쳐 온 모양들 — 어느 것이 있어도 FINAL 로 간다
OLD1 = """  const first = labText();
  function scan(){
    const s=list[cur];
    if(!s || !s.re) return;
    const t=labText();
    /* 정규식이 잘못 만들어졌으면(괄호가 안 닫혔다거나) 글자 그대로 찾는다 —
       자동 확인이 통째로 죽는 것보다 낫다 */
    let hit;
    try { const rx=new RegExp(s.re); hit = rx.test(t) && !rx.test(first); }
    catch(e){ hit = t.indexOf(s.re) >= 0 && first.indexOf(s.re) < 0; }
    if(hit) doneStep(cur);
  }
  const _adv=doneStep;
  doneStep=function(k){ _adv(k); setTimeout(scan,0); };"""

OLD2 = """  const first = labText();
  /* 신호 낱말이 처음부터 화면에 있는 실험실이 많다 — 「평균·최빈값」처럼 늘 표시되는 값의 이름이다.
     그런 곳에서는 신호만으로 판정할 수 없으므로 «이 단계가 시작된 뒤 화면 글이 바뀌었는가» 를
     함께 본다 (조작의 증거다). 신호가 처음에 없던 곳은 지금까지와 똑같이 움직인다.
     이 보강이 없으면 150종 남짓에서 자동 확인이 끝내 켜지지 않는다 (2026-10-10 교차 검증 ①). */
  let base = first;
  function scan(){
    const s=list[cur];
    if(!s || !s.re) return;
    const t=labText();
    /* 정규식이 잘못 만들어졌으면(괄호가 안 닫혔다거나) 글자 그대로 찾는다 —
       자동 확인이 통째로 죽는 것보다 낫다 */
    let hit;
    try { const rx=new RegExp(s.re); hit = rx.test(t) && (!rx.test(first) || t!==base); }
    catch(e){ hit = t.indexOf(s.re) >= 0 && (first.indexOf(s.re) < 0 || t!==base); }
    if(hit) doneStep(cur);
  }
  const _adv=doneStep;
  /* 한 단을 넘으면 그 순간의 글을 새 기준으로 삼는다 — 다음 단은 «또 한 번» 조작해야 열린다 */
  doneStep=function(k){ _adv(k); base=labText(); setTimeout(scan,0); };"""


def main(path):
    s = io.open(path, encoding='utf-8').read()
    if FINAL in s:
        sys.stdout.write('이미 고쳐져 있습니다\n')
        return 0
    for old in (OLD2, OLD1):
        if s.count(old) == 1:
            io.open(path, 'w', encoding='utf-8').write(s.replace(old, FINAL, 1))
            sys.stdout.write('사다리 자동 확인에 «사람이 만졌다» 를 증거로 더했습니다\n')
            return 0
    raise AssertionError('고칠 자리를 못 찾음')


if __name__ == '__main__':
    main(sys.argv[1])
