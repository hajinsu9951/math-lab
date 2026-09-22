# -*- coding: utf-8 -*-
"""수학 노트의 「틀린 칸 + 힌트」를 LAB 01 안으로 가둔다.

무엇이 잘못됐나
  2026-09-18 에 LAB 01(GPS) 용으로 만든 검사기가 `wireChecks(document)` 로
  **문서 전체의 「식 확인」 단추**에 물려 있었다. 기대값 WANT 는 편의점(1,1)·도서관(5,9)·학교(9,4) 고정이다.
  그래서 LAB 02·03·04·21 의 수학 노트에서 맞는 답을 넣어도
  칸이 붉게 표시되고 「우변은 반지름이 아니라 반지름의 제곱입니다. 500 m 는 5칸이니…」 힌트가 떴다.
  `hideAnswers` 도 마찬가지로 문서 전체의 탐구 사다리 문구를 GPS 정규식으로 지우고 있었다.

어떻게 고치나
  LAB 01 의 데모만 `.lg1wrap` 을 쓴다 (LAB 02 `.lb2wrap` · 03 `.lg3wrap` · 04 `.lg4wrap` · 21 `.lg21wrap`).
  · checkGroup  — `.lg1wrap` 밖이면 아무것도 하지 않는다
  · wireChecks  — `.lg1wrap` 안의 단추에만 건다
  · hideAnswers — 같은 실험실 안에 `.lg1wrap` 이 있을 때만 문구를 지운다

  「다시 보는 오늘의 문제」(recap)와 답안판 안내(hint)는 모든 실험실에 필요하므로 그대로 둔다.

사용: python docs/힌트누수_수정/patch_hintscope.py src/99-foot.html
"""
import sys

EDITS = [
    ('checkGroup — LAB 01 밖이면 손대지 않는다',
     """  function checkGroup(box){
    var ins = [].slice.call(box.querySelectorAll('.eqi'));
    if(ins.length < 3) return;""",
     """  function checkGroup(box){
    /* 이 검사기는 LAB 01(GPS)의 기대값만 알고 있다. 다른 실험실의 노트는 제 검사기를 따로 갖는다. */
    if(!box.closest || !box.closest('.lg1wrap')) return;
    var ins = [].slice.call(box.querySelectorAll('.eqi'));
    if(ins.length < 3) return;"""),

    ('wireChecks — LAB 01 안의 단추에만 건다',
     """    root.querySelectorAll('.eqk, .lnk, .slk').forEach(function(btn){""",
     """    root.querySelectorAll('.lg1wrap .eqk, .lg1wrap .lnk, .lg1wrap .slk').forEach(function(btn){"""),

    ('hideAnswers — LAB 01 의 사다리에만 적용한다',
     """    root.querySelectorAll('.ldd, .ldw').forEach(function(el){
      if(el.dataset.masked) return;""",
     """    root.querySelectorAll('.ldd, .ldw').forEach(function(el){
      if(el.dataset.masked) return;
      /* 정답을 지우는 정규식이 GPS 전용이라, 같은 실험실에 .lg1wrap 이 있을 때만 쓴다 */
      var lab = el.closest('#lsLab');
      if(!lab || !lab.querySelector('.lg1wrap')) return;"""),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    done, skip = [], []
    for name, old, new in EDITS:
        if new in h:
            skip.append(name)
            continue
        n = h.count(old)
        assert n == 1, '「%s」 자리를 %d 번 찾음' % (name, n)
        h = h.replace(old, new, 1)
        done.append(name)
    open(path, 'w', encoding='utf-8').write(h)
    print('고침 :', ' · '.join(done) if done else '(없음)')
    print('이미  :', ' · '.join(skip) if skip else '(없음)')


if __name__ == '__main__':
    main(sys.argv[1])
