# -*- coding: utf-8 -*-
"""미션 달성 신호(re) 전수 점검 — 묶음마다 빌드 전에 돌린다.

보는 것
  ① 정규식 특수문자가 섞였는가 (앵커 $ ^ · 괄호 · + * ? 등)
     — 괄호가 안 닫히면 new RegExp 가 예외를 던져 자동 확인이 죽는다
     — $ 가 섞이면 앵커가 되어 영영 매칭되지 않는다
  ② 그 신호가 데모의 **늘 보이는 글**(화면 뼈대·안내문·선택지)에 들어 있지 않은가
     — 들어 있으면 조작하지 않아도 켜자마자 통과된다
     (미션 문구 자신은 scan 이 더 이상 읽지 않으므로 여기서 보지 않는다)

사용: python docs/미션신호_점검/audit_signals.py src/40-demos.js
"""
import io
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BS = chr(92)
META = set("()[]{}+*?^$|") | {BS}
OK_ALT = '|'
TAG = re.compile('<[^>]+>')
INTERP = re.compile(r'\$\{[^{}]*\}')


def static_text(h, fn):
    """데모가 켜자마자 늘 보여 주는 글 — root.innerHTML 템플릿."""
    i = h.find('function %s(' % fn)
    if i < 0:
        return ''
    j = h.find('root.innerHTML=`', i)
    if j < 0:
        return ''
    k = h.find('`;', j + 16)
    seg = h[j + 16:k if k > 0 else j + 4000]
    seg = INTERP.sub(' ', seg)
    # 조작 패널(label.ctl)과 고정 안내문(div.note)은 scan 이 읽지 않으므로 빼고 본다
    for pat in (r'<label[^>]*>[\s\S]*?</label>',
                r'<div class="note"(?![^>]*id=)[^>]*>[\s\S]*?</div>',
                r'<div class="ctl"[^>]*>[\s\S]*?</div>'):
        seg = re.sub(pat, ' ', seg)
    return TAG.sub(' ', seg)


def main(path):
    h = io.open(path, encoding='utf-8').read()
    base = h.index('LESSON[1]=')
    body = h[base:]
    starts = [(int(m.group(1)), m.start()) for m in re.finditer(r'LESSON\[(\d+)\]=', body)]
    demo = {}
    for m in re.finditer(r'LESSON\[(\d+)\]=[\s\S]*?demo\(root\)\{\s*return (\w+)\(', body):
        demo[int(m.group(1))] = m.group(2)
    meta, always = [], []
    for m in re.finditer("re:'([^']*)'", body):
        s = m.group(1)
        if not s or s == '탐구 노트 통과':
            continue
        if any(ch in META for ch in s) and OK_ALT not in s:
            meta.append(s)
        lab = 0
        for n, p in starts:
            if p < m.start():
                lab = n
            else:
                break
        fn = demo.get(lab)
        if fn and s in static_text(h, fn):
            always.append((lab, s))
    w = sys.stdout.write
    w('미션 달성 신호 점검\n')
    w('  정규식 특수문자: %d개\n' % len(meta))
    for s in sorted(set(meta)):
        w('     ' + s + '\n')
    w('  데모의 늘 보이는 글에 든 신호(켜자마자 통과): %d개\n' % len(always))
    for lab, s in always:
        w('     LAB %-4d %s\n' % (lab, s))
    ok = not meta and not always
    w('문제 없음\n' if ok else '위 항목을 고치세요\n')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
