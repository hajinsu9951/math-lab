# -*- coding: utf-8 -*-
"""미션 자동 확인이 「제 문구」를 읽고 저절로 통과되는 것을 막는다.

지적 (교차 검증)
  stepLadder 의 scan 은 root.innerText **전체** 를 본다.
  그런데 사다리(미션 문구) 자체가 root 안에 들어 있다.
  그래서 미션 문구에 든 낱말을 달성 신호로 쓰면 — 예를 들어
  「오차가 어떻게 줄어드는지 보세요」 에 re:'오차' —
  학생이 아무것도 만지지 않아도 켜자마자 통과된다.
  LAB 1~130 에서 이런 미션이 138개였다.

반영
  사다리 자신(box)을 뺀 **실험 화면만** 읽도록 고친다.
  신호는 이제 데모가 실제로 내놓은 문장에만 걸린다.
  한 줄 고치면 138개가 한꺼번에 제자리를 찾는다 — 신호를 하나씩 바꾸는 것보다
  옳은 자리의 수정이다 (사다리는 「실험」을 보아야지 「제 지시문」을 보면 안 된다).

사용: python docs/미션신호_점검/fix_scan_scope.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OLD = """  function scan(){
    const s=list[cur];
    if(!s || !s.re) return;
    const t=root.innerText;
    /* 정규식이 잘못 만들어졌으면(괄호가 안 닫혔다거나) 글자 그대로 찾는다 —
       자동 확인이 통째로 죽는 것보다 낫다 */
    let hit;
    try { hit = new RegExp(s.re).test(t); } catch(e){ hit = t.indexOf(s.re) >= 0; }
    if(hit) doneStep(cur);
  }"""

NEW = """  /* 사다리 자신은 빼고 **실험 화면만** 읽는다 —
     미션 문구에 든 낱말이 제 신호에 걸려 저절로 통과되는 것을 막는다 */
  function labText(){
    let s='';
    for(const n of root.children){
      if(n===box) continue;
      /* 조작 패널·선택지·고정 안내문은 늘 같은 글이라 신호가 될 수 없다 —
         데모가 «지금 상태» 때문에 내놓은 글만 읽는다 */
      const c=n.cloneNode(true);
      /* 고정 안내문은 id 가 없다 — id 가 붙은 .note 는 상태에 따라 내용이 바뀌므로 남긴다 */
      c.querySelectorAll('label,.ctl,select,.note:not([id])').forEach(e=>e.remove());
      s += (c.textContent || '');
    }
    return s;
  }
  /* 붙자마자의 화면 글 — 학생이 아무것도 하지 않은 상태다.
     이때 이미 참인 신호는 「해냈다」의 증거가 될 수 없으므로 통과시키지 않는다. */
  const first = labText();
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
  }"""


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'function labText()' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    assert h.count(OLD) == 1, 'stepLadder 의 scan 을 못 찾음'
    open(path, 'w', encoding='utf-8').write(h.replace(OLD, NEW, 1))
    sys.stdout.write('scan 이 실험 화면만 읽도록 고침\n')


if __name__ == '__main__':
    main(sys.argv[1])
