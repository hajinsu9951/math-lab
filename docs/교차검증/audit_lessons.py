# -*- coding: utf-8 -*-
"""수업 모형 356종을 «짜임» 기준으로 한 번에 훑는다 — 세 사람이 읽기 전에 기계가 먼저 센다.

왜
  356종을 눈으로만 보면 빠뜨린다. 사람이 판단할 것(수학의 정확성·수업의 흐름)과
  기계가 셀 수 있는 것(칸 수·길이·빠진 자리)을 갈라 놓는다. 여기서는 뒤엣것만 센다.

무엇을 세는가
  · predict.q 가 셋인가 · missions 가 셋인가 · 마지막 미션에 do·hand 가 있는가
  · inquiry.q 가 셋인가 · inquiry.cols 길이가 데모의 read() 길이와 같은가
  · apply 에 q·a·tol·why·hint 가 모두 있는가 · why 가 충분히 긴가 (근거를 적었는가)
  · 미션의 달성 신호(re)가 데모 코드 안에 실제로 있는가
  · 그림(svg)에 aria-label 이 있는가 · 「생각 열기」 사진이 붙어 있는가
  · 탐구 노트가 있는가 · 노트의 보기(opts)가 셋인가

사용: python docs/교차검증/audit_lessons.py src/40-demos.js [--all]
"""
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass


def blocks(src, pat):
    """중괄호 짝을 세어 LESSON[n]={ … }; 를 통째로 잘라 낸다."""
    out = {}
    for m in re.finditer(pat, src):
        i = src.index('{', m.start())     # 여는 중괄호에서 시작해야 짝이 맞는다
        depth, j = 0, i
        while j < len(src):
            c = src[j]
            if c == '`':                      # 백틱 문자열은 통째로 건너뛴다
                j = src.index('`', j + 1)
            elif c == "'":
                j += 1
                while src[j] != "'":
                    j += 2 if src[j] == '\\' else 1
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        out[int(m.group(1))] = src[i:j + 1]
    return out


def arr_len(body, key):
    """q:[ … ] 꼴의 길이를 센다 — 중첩 대괄호 없이 한 겹인 것만 다룬다."""
    i = body.find(key)
    if i < 0:
        return None
    i = body.index('[', i)
    depth, j, n = 0, i, 0
    while j < len(body):
        c = body[j]
        if c == "'":
            j += 1
            while body[j] != "'":
                j += 2 if body[j] == '\\' else 1
        elif c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                break
        elif c == ',' and depth == 1:
            n += 1
        j += 1
    return n + 1 if j > i + 1 else 0


def _span(s, i):
    """s[i] 가 여는 괄호일 때 짝이 되는 닫는 괄호의 자리."""
    pair = {'{': '}', '[': ']', '(': ')'}
    depth, j = 0, i
    while j < len(s):
        c = s[j]
        if c == "'":
            j += 1
            while j < len(s) and s[j] != "'":
                j += 2 if s[j] == '\\' else 1
        elif c == '`':
            j = s.index('`', j + 1)
        elif c in '{[(':
            depth += 1
        elif c in '}])':
            depth -= 1
            if depth == 0:
                return j
        j += 1
    return len(s) - 1


def _commas(s, i):
    """s[i] 가 여는 대괄호일 때 한 겹 안의 칸 수."""
    end = _span(s, i)
    depth, j, n = 0, i, 0
    while j <= end:
        c = s[j]
        if c == "'":
            j += 1
            while j <= end and s[j] != "'":
                j += 2 if s[j] == '\\' else 1
        elif c == '`':
            j = s.index('`', j + 1)
        elif c in '{[(':
            depth += 1
        elif c in '}])':
            depth -= 1
        elif c == ',' and depth == 1:
            n += 1
        j += 1
    return n + 1 if end > i + 1 else 0


def read_len(src, fn):
    """데모의 read 가 돌려주는 칸 수 — read 본문 안의 마지막 return 배열을 센다."""
    i = src.find('function %s(' % fn)
    if i < 0:
        return None
    j = src.find('\nfunction ', i + 10)
    body = src[i:j if j > 0 else len(src)]
    k = body.find('read:')
    while k >= 0 and body[k:k + 9].rstrip().startswith('read: INQ'):
        k = body.find('read:', k + 5)
    if k < 0:
        return None
    arrow = body.find('=>', k)
    if arrow < 0:
        return None
    p = arrow + 2
    while p < len(body) and body[p] in ' \n':
        p += 1
    if body[p] == '[':                       # read:()=>[ … ]
        return _commas(body, p)
    if body[p] != '{':
        return None
    end = _span(body, p)
    seg = body[p:end + 1]
    r = seg.rfind('return [')
    if r < 0:
        return None
    return _commas(seg, r + len('return '))


def main(path, show_all=False):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    NOT = blocks(src, r'\n (\d+):\{ h:')
    bad = {}

    def flag(no, msg):
        bad.setdefault(no, []).append(msg)

    for no in sorted(LES):
        b = LES[no]
        if arr_len(b, 'predict:{') != 3:
            flag(no, '예상 질문 %s개' % arr_len(b, 'predict:{'))
        mi = b.find('missions:[')
        if mi < 0:
            flag(no, '미션 없음')
        else:
            seg = b[mi:b.find('inquiry:', mi) if b.find('inquiry:', mi) > 0 else len(b)]
            ms = re.findall(r"\{t:'", seg)
            if len(ms) != 3:
                flag(no, '미션 %d개' % len(ms))
            if "do:'" not in seg or "hand:'" not in seg:
                flag(no, '마지막 미션에 do/hand 없음')
            for sig in re.findall(r"re:'([^']+)'", seg):
                if sig != '탐구 노트 통과' and sig not in src:
                    flag(no, '신호 없음 「%s」' % sig[:18])
        if arr_len(b, 'inquiry:{') != 3:
            flag(no, '탐구 질문 %s개' % arr_len(b, 'inquiry:{'))
        cols = arr_len(b, 'cols:')
        dm = re.search(r'return (\w+)\(root\)', b)
        if dm and cols is not None:
            rl = read_len(src, dm.group(1))
            if rl is not None and rl != cols:
                flag(no, '표 %d칸인데 read() 는 %d칸' % (cols, rl))
        ap = b.find('apply:{')
        if ap < 0:
            flag(no, '적용 없음')
        else:
            seg = b[ap:b.find('demo(root)', ap) if b.find('demo(root)', ap) > 0 else len(b)]
            for k in ('q:', 'a:', 'tol:', 'why:', 'hint:'):
                if k not in seg:
                    flag(no, '적용에 %s 없음' % k)
            w = re.search(r"why:'((?:[^'\\]|\\.)*)'", seg)
            if w and len(w.group(1)) < 80:
                flag(no, '적용 해설이 짧음 (%d자)' % len(w.group(1)))
        if 'aria-label' not in b:
            flag(no, '그림에 aria-label 없음')
        if '<figure' not in b and 'lsnfigs' not in b:
            flag(no, '생각 열기 사진 없음')
        if no in NOT:
            nb = NOT[no]
            cards = len(re.findall(r"\{t:'", nb))
            if cards != 3:
                flag(no, '노트 칸 %d개' % cards)
            op = arr_len(nb, 'opts:')
            if op is not None and op != 3:
                flag(no, '노트 보기 %d개' % op)
            if 'opts:' not in nb:
                flag(no, '노트에 보기 없음')
        else:
            flag(no, '탐구 노트 없음')

    sys.stdout.write('수업 모형 %d종 · 탐구 노트 %d종\n' % (len(LES), len(NOT)))
    if not bad:
        sys.stdout.write('짜임 점검 — 걸린 곳 없음\n')
        return 0
    sys.stdout.write('짜임 점검 — %d종에서 %d건\n' % (len(bad), sum(len(v) for v in bad.values())))
    for no in sorted(bad):
        sys.stdout.write('  LAB %3d  %s\n' % (no, ' | '.join(bad[no])))
    return 0


if __name__ == '__main__':
    main(sys.argv[1], '--all' in sys.argv)
