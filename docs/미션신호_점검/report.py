# -*- coding: utf-8 -*-
"""자동 확인이 저절로 통과되는 미션을 모아, 대신 쓸 수 있는 화면 문구 후보를 뽑는다.

왜
  stepLadder 는 root.innerText 전체를 본다. 그래서 미션 문구 자신에 든 낱말을
  달성 신호로 쓰면 아무것도 조작하지 않아도 통과된다.
  고치려면 그 실험실의 화면이 **어떤 상태에서만** 내놓는 문장을 알아야 한다.

무엇을 내놓나
  LAB 번호 · 지금 신호 · 미션 문구 · 그 데모의 상태 의존 문구 후보

사용: python docs/미션신호_점검/report.py src/40-demos.js [시작] [끝]
"""
import io
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

TAG = re.compile('<[^>]+>')
# 조건이 붙어 있을 때만 화면에 나오는 줄 — 색 표시가 붙은 강조 문장이 대부분이다
COND = re.compile(r"\?\s*`([^`]{6,140})`")


def demo_of(h, lab):
    m = re.search(r'LESSON\[%d\]=[\s\S]*?demo\(root\)\{\s*return (\w+)\(' % lab, h)
    return m.group(1) if m else None


def candidates(h, fn):
    i = h.find('function %s(' % fn)
    if i < 0:
        return []
    j = h.find('\nfunction ', i + 10)
    seg = h[i:j if j > 0 else len(h)]
    out = []
    for m in COND.finditer(seg):
        t = TAG.sub('', m.group(1))
        t = re.sub(r'\$\{[^}]*\}', '…', t).strip()
        if len(t) >= 6 and not t.startswith('<'):
            out.append(t)
    seen, uniq = set(), []
    for t in out:
        if t not in seen:
            seen.add(t); uniq.append(t)
    return uniq


def main(path, lo, hi):
    h = io.open(path, encoding='utf-8').read()
    body = h[h.index('LESSON[1]='):]
    base = h.index('LESSON[1]=')
    starts = [(int(m.group(1)), m.start()) for m in re.finditer(r'LESSON\[(\d+)\]=', body)]
    cur = {}
    for m in re.finditer(r"re:'([^']*)'", body):
        s = m.group(1)
        if not s or s == '탐구 노트 통과':
            continue
        k = body.rfind("{t:'", 0, m.start())
        if k < 0:
            continue
        t = TAG.sub('', body[k + 4:m.start()])
        if s not in t:
            continue
        lab = 0
        for n, p in starts:
            if p < m.start():
                lab = n
            else:
                break
        cur.setdefault(lab, []).append((s, t.split("',")[0].strip()))
    for lab in sorted(cur):
        if not (lo <= lab <= hi):
            continue
        fn = demo_of(h, lab)
        print('── LAB %d   (%s)' % (lab, fn))
        for s, t in cur[lab]:
            print("   지금 re:'%s'   ←   %s" % (s, t[:70]))
        for c in candidates(h, fn or '')[:8]:
            print('      후보: ' + c[:92])
    print()
    print('대상 LAB %d개 · 미션 %d개' % (len([l for l in cur if lo <= l <= hi]),
                                      sum(len(v) for l, v in cur.items() if lo <= l <= hi)))


if __name__ == '__main__':
    lo = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    hi = int(sys.argv[3]) if len(sys.argv) > 3 else 999
    main(sys.argv[1], lo, hi)
