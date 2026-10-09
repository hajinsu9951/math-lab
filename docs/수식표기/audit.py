# -*- coding: utf-8 -*-
"""변환해 넣은 수식 $…$ 이 멀쩡한지 센다.

주의 — 이 파일에서 `$` 는 DOM 선택자 별칭이기도 하다 (`const $=s=>document.querySelector(s)`).
그래서 파일 전체를 훑으면 거짓 경보만 쏟아진다. **수업 모형 영역 안**에서,
템플릿 보간 `${…}` 과 `svg:` 구간을 뺀 자리만 본다.

보는 것
  · $ … $ 안에 한글이 들어가지 않았는가 (글이 통째로 수식으로 빨려 들어간 흔적)
  · $ … $ 안에 `('#` 같은 코드가 섞이지 않았는가
  · TeX 명령의 역슬래시가 둘인가 (JS 문자열에서 \\left 가 left 로 삼켜지는 것을 막는다)

사용: python docs/수식표기/audit.py src/40-demos.js
"""
import sys, re

sys.stdout.reconfigure(encoding='utf-8')
BS = chr(92)


def regions(h):
    out = []
    i = h.index('const NOTE_SPECS')
    out.append((i, h.index('function labNo(spec)')))
    i = h.index('LESSON[1]={')
    j = h.index('LESSON[356]={')
    out.append((i, h.index('\n};\n', j) + 4))
    return out


def blanked(seg):
    """손대지 않는 구간(svg:`…` · ${…})을 공백으로 지운 사본."""
    s = list(seg)
    for m in re.finditer(r'svg:`', seg):
        k = seg.find('`', m.end())
        for p in range(m.start(), k + 1):
            s[p] = ' '
    i = 0
    while True:
        i = seg.find('${', i)
        if i < 0:
            break
        d, k = 0, i + 1
        while k < len(seg):
            if seg[k] == '{':
                d += 1
            elif seg[k] == '}':
                d -= 1
                if d == 0:
                    break
            k += 1
        for p in range(i, min(k + 1, len(s))):
            s[p] = ' '
        i = k + 1
    return ''.join(s)


def main(path):
    h = open(path, encoding='utf-8').read()
    spans, bad_h, bad_c, bad_b = 0, [], [], []
    for a, b in regions(h):
        seg = blanked(h[a:b])
        for m in re.finditer(r'\$([^$\n]{1,90})\$', seg):
            t = m.group(1)
            spans += 1
            if re.search(r'[가-힣]', t):
                bad_h.append(t)
            if "('#" in t or '=>' in t:
                bad_c.append(t)
            for c in re.finditer(r'(?<!' + re.escape(BS) + r')' + re.escape(BS) + r'[A-Za-z]', t):
                if t[c.start() - 1:c.start()] != BS:
                    bad_b.append(t)
                    break

    sys.stdout.write('수업 모형 안의 수식 %d개\n' % spans)
    for nm, lst in (('한글이 섞임', bad_h), ('코드가 섞임', bad_c), ('역슬래시가 하나', bad_b)):
        sys.stdout.write('  %s: %d개%s\n' % (nm, len(lst), ('  ← ' + ' / '.join(lst[:4])) if lst else ''))
    sys.stdout.write('문제 없음\n' if not (bad_h or bad_c or bad_b) else '고쳐야 합니다\n')


if __name__ == '__main__':
    main(sys.argv[1])
