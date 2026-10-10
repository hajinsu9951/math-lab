# -*- coding: utf-8 -*-
"""미션 달성 신호를 «내놓을 수 있는 코드가 아예 없는» 곳을 찾는다 — ① 교실 운영.

왜 이 검사가 필요한가
  사다리는 실험 화면(#lsLab) 의 글에서 신호를 찾는다. 그 자리에 들어가는 글은
  데모 함수와 탐구 노트(NOTE_SPECS) 가 쓴 것뿐이다.
  신호 글자가 그 두 곳의 «코드 어디에도 없으면» 학생이 무엇을 하든 켜질 수 없다.

  라이브 점검(test/ladder-reach.mjs)은 «열렸다» 는 확실히 말해 주지만 «안 열렸다» 는
  기계가 조작을 못 맞힌 탓일 수도 있다(정확한 자리로 끌어야 하는 실험실).
  이 정적 검사는 그 애매함이 없다 — 코드에 글자가 없으면 결함이 맞다.

읽는 방법
  LESSON[n].demo(root){ return xxxDemo(root); } 에서 함수 이름을 캐내 그 함수의 본문과
  NOTE_SPECS[n] 을 합쳐 「신호를 내놓을 수 있는 코드」로 본다.
  신호가 정규식이면 특수 문자를 빼고 «두 글자 이상 이어진 글자 토막» 으로 나눠
  그 가운데 하나라도 코드에 있으면 통과로 본다(느슨하게 본다 — 오탐을 내지 않으려고).

사용: python docs/교차검증/scan_signal_source.py src/40-demos.js
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span                      # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

Q = r"'((?:[^'\\]|\\.)*)'"
# 정규식 특수 문자로 토막을 끊는다
META = re.compile(r'[\\\[\]\(\)\{\}\|\^\$\.\*\+\?]+')


PAIR = {'{': '}', '[': ']', '(': ')'}


def _tolerant(s, i, op='{'):
    """s[i] 가 여는 괄호일 때 짝이 되는 자리 — 따옴표·주석을 건너뛰고, 끝이 안 맞아도 안 터진다."""
    cl = PAIR[op]
    d, n = 0, len(s)
    while i < n:
        c = s[i]
        if c in '\'"`':
            q, i = c, i + 1
            while i < n:
                if s[i] == '\\':
                    i += 2
                    continue
                if s[i] == q:
                    break
                i += 1
        elif c == '/' and i + 1 < n and s[i + 1] == '/':
            i = s.find('\n', i)
            if i < 0:
                return n - 1
        elif c == '/' and i + 1 < n and s[i + 1] == '*':
            i = s.find('*/', i)
            if i < 0:
                return n - 1
            i += 1
        elif c == op:
            d += 1
        elif c == cl:
            d -= 1
            if d == 0:
                return i
        i += 1
    return n - 1


def fn_body(src, name):
    """function name(…){ … } 의 본문을 중괄호 짝으로 떠낸다."""
    m = re.search(r'function\s+%s\s*\(' % re.escape(name), src)
    if not m:
        return ''
    i = src.index('{', m.end() - 1)
    return src[i:_tolerant(src, i) + 1]


def drop_read(body):
    """read:()=>… 의 속을 걷어 낸다.

    수업 모형은 inquiry() 를 «기록·발견» 단계(#lsInq) 에 붙이므로 read() 가 돌려주는 값은
    실험 화면(#lsLab) 에 나오지 않는다. 그래서 read() 안에만 있는 글은 신호가 될 수 없다.
    """
    out, i = [], 0
    while True:
        k = body.find('read:', i)
        if k < 0:
            out.append(body[i:])
            return ''.join(out)
        out.append(body[i:k])
        j = k + 5
        while j < len(body) and body[j] in ' \t\n()=>':
            j += 1
        if j < len(body) and body[j] in '{[':
            i = _tolerant(body, j, body[j]) + 1
        else:
            i = k + 5


def note_visible(note):
    """탐구 노트에서 «화면 글로 읽히는 부분» 만 남긴다.

    labText() 는 label 을 지운다. 노트의 판단 보기(opts) 는 <label> 안에 들어가므로
    신호가 될 수 없다. chk(){…} 는 아예 글이 아니라 판정 코드다.
    남는 것은 칸 제목(t)·식(f)·머리글(h)·판정 뒤에 뜨는 msg 다.
    """
    out, i = [], 0
    while i < len(note):
        k = note.find('opts:', i)
        c = note.find('chk(', i)
        nxt = min(x for x in (k, c, len(note)) if x >= 0)
        if nxt == len(note):
            out.append(note[i:])
            break
        out.append(note[i:nxt])
        j = nxt
        if nxt == k:
            j = note.index('[', j)
            i = _tolerant(note, j, '[') + 1
        else:
            j = note.index('{', j)
            i = _tolerant(note, j, '{') + 1
    return ''.join(out)


def pieces(sig):
    """신호에서 «두 글자 이상 이어진 글자 토막» 들을 뽑는다."""
    out = []
    for part in META.split(sig):
        part = part.strip()
        if len(part) >= 2:
            out.append(part)
    return out or [sig]


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    NOT = blocks(src, r'\n (\d+):\{ h:')
    rows, nofn, only_read = [], [], []
    for no, b in sorted(LES.items()):
        ms = b.find('missions:[')
        if ms < 0:
            continue
        j = b.index('[', ms)
        seg = b[j:_span(b, j) + 1]
        sigs = [(i, m.group(1)) for i, m in
                enumerate(re.finditer(r"re:" + Q, seg))]
        sigs = [(i, s) for i, s in sigs if s != '탐구 노트 통과']
        if not sigs:
            continue

        m = re.search(r'demo\s*\(\s*root\s*\)\s*\{', b)
        raw = ''
        if m:
            k = b.index('{', m.end() - 1)
            body = b[k:_tolerant(b, k) + 1]
            raw += body                        # 데모를 그 자리에 적은 실험실 (LAB 1~23)
            for nm in set(re.findall(r'([A-Za-z_$][\w$]*)\s*\(\s*root', body)):
                raw += fn_body(src, nm)        # 이름 붙은 데모 함수를 부르는 실험실
        else:
            m2 = re.search(r'demo\s*:\s*([A-Za-z_$][\w$]*)', b)
            if m2:
                raw += fn_body(src, m2.group(1))
            else:
                nofn.append((no, 'demo 를 못 찾음'))
        note = NOT.get(no, '')

        # 화면에 나오는 글은 태그와 ${…} 가 섞인 조각으로 적혀 있다 —
        # 「소수 <b>3자리</b>까지 일치」 처럼. 그래서 태그와 끼운 값을 걷어 낸 모양으로도 본다.
        def spread(t):
            return (t + '\n' + re.sub(r'<[^<>]*>', '', t)
                    + '\n' + re.sub(r'\$\{[^{}]*\}|<[^<>]*>', '', t))

        pool = spread(raw + note)                      # 코드 어딘가에 있는 글
        lab = spread(drop_read(raw) + note_visible(note))   # 실험 화면에 실제로 나오는 글

        miss, rd = [], []
        for i, sg in sigs:
            if not pool:
                continue
            if not any(p in pool for p in pieces(sg)):
                miss.append('M%d 「%s」' % (i + 1, sg))
            elif not any(p in lab for p in pieces(sg)):
                rd.append('M%d 「%s」' % (i + 1, sg))
        if miss:
            rows.append((no, miss))
        if rd:
            only_read.append((no, rd))

    sys.stdout.write('신호를 내놓을 코드가 없는 곳 — 실험실 %d종\n' % len(rows))
    for no, miss in rows:
        sys.stdout.write('  LAB %3d  %s\n' % (no, ' · '.join(miss)))
    sys.stdout.write('신호가 read() 안에만 있어 실험 화면에 안 나오는 곳 — 실험실 %d종\n'
                     % len(only_read))
    for no, rd in only_read:
        sys.stdout.write('  LAB %3d  %s\n' % (no, ' · '.join(rd)))
    if nofn:
        sys.stdout.write('데모 함수를 못 찾은 곳 %d종 (검사에서 빠짐)\n' % len(nofn))
        for no, t in nofn[:12]:
            sys.stdout.write('  LAB %3d  %s\n' % (no, t))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
