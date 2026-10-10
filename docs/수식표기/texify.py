# -*- coding: utf-8 -*-
"""수업 모형의 대수식을 LaTeX(→ MathML) 로 바꾼다.

왜
  본문 글꼴(Freesentation · 맑은 고딕)에 위첨자 글리프가 없다. 그래서 2⁵ · aᵐ⁺ⁿ 같은 식이
  네모(□)로 깨지거나, 브라우저가 엉뚱한 글꼴로 대체해 글줄이 들쭉날쭉해진다.
  MathML 은 브라우저가 수식으로 제대로 그리므로 글꼴에 기대지 않는다.

무엇을 하나
  LESSON[n] 과 NOTE_SPECS[n] 의 **HTML 로 들어가는 글**에서만 식을 찾아 `$…$` 로 감싼다.
  화면에서는 texify() 가 그 자리를 texToMathML() 로 바꾼다.
  **SVG 안(svg:`…`)은 건드리지 않는다** — MathML 은 <svg> 안에 들어갈 수 없다.
  (SVG 쪽은 docs/수식표기/sup_tspan.py 가 <tspan> 으로 따로 처리한다)

사용
  python docs/수식표기/texify.py src/40-demos.js --dry   # 바뀔 것만 보여 준다
  python docs/수식표기/texify.py src/40-demos.js         # 실제로 고친다
"""
import sys, re

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐᵏ⁺⁻'
S2T = dict(zip('⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐᵏ⁺⁻', '0123456789nmk+-'))
GREEK = {'α': r'\alpha', 'β': r'\beta', 'γ': r'\gamma', 'θ': r'\theta', 'λ': r'\lambda',
         'μ': r'\mu', 'π': r'\pi', 'σ': r'\sigma', 'ρ': r'\rho', 'φ': r'\varphi',
         'ω': r'\omega', 'Σ': r'\Sigma', 'Δ': r'\Delta'}
OPS = {'−': '-', '×': r'\times', '·': r'\cdot', '÷': r'\div', '≤': r'\le', '≥': r'\ge',
       '≠': r'\ne', '≒': r'\approx', '≈': r'\approx', '∠': r'\angle', '∥': r'\parallel',
       }
FRAC = {'½': r'\frac{1}{2}', '⅓': r'\frac{1}{3}', '¼': r'\frac{1}{4}',
        '⅔': r'\frac{2}{3}', '¾': r'\frac{3}{4}'}
UNITS = ('cm', 'km', 'mm', 'kg')
HANGUL = re.compile(r'[가-힣]')


def sup(s):
    return ''.join(S2T.get(c, c) for c in s)


def tex_of(s):
    """보통 글자로 된 짧은 식을 TeX 로. 한글이 섞이면 None."""
    if HANGUL.search(s):
        return None
    out = []
    for c in s:
        if c in GREEK:
            out.append(GREEK[c])
        elif c in OPS:
            out.append(OPS[c])
        elif c in FRAC:
            out.append(FRAC[c])
        else:
            out.append(c)
    return ''.join(out)


# ── 하나씩 바꾸는 규칙 (위에서부터 먼저 적용) ────────────────────────────
def bare(s):
    """$ 로 감싸지 않고 TeX 조각만 만든다 (\sqrt·괄호 안쪽에서 쓴다)."""
    t = tex_of(s)
    if t is None:
        return None
    import re as _re
    return _re.sub(r'([A-Za-zα-ω0-9)])([' + SUP + r']+)',
                   lambda m: '%s^{%s}' % (m.group(1), sup(m.group(2))), t)


def r_sqrt(s):
    """√(x² + y²) → $\sqrt{x^{2} + y^{2}}$"""
    def f(m):
        inner = bare(m.group(1))
        return m.group(0) if inner is None else '$\sqrt{%s}$' % inner
    return re.sub(r'√\(([^()]{1,44})\)', f, s)


def r_func(s):
    """sin²θ · cos²θ → $\\sin^{2}\\theta$"""
    def f(m):
        fn, e, tail = m.group(1), sup(m.group(2)), m.group(3) or ''
        t = '\\%s^{%s}' % (fn, e)
        if tail:
            t += GREEK.get(tail, tail)
        return '$%s$' % t
    return re.sub(r'\b(sin|cos|tan)([' + SUP + r']+)\s?([θxA-C])?', f, s)


def r_unit(s):
    """cm² · km² → $\\text{cm}^{2}$"""
    return re.sub(r'(?<![A-Za-z])(' + '|'.join(UNITS) + r')([' + SUP + r']+)',
                  lambda m: '$\\text{%s}^{%s}$' % (m.group(1), sup(m.group(2))), s)


def r_paren(s):
    """(a + b)² · (x − 2)² → $(a+b)^{2}$"""
    def f(m):
        inner = tex_of(m.group(1))
        if inner is None:
            return m.group(0)
        return '$\\left(%s\\right)^{%s}$' % (inner, sup(m.group(2)))
    return re.sub(r'\(([^()]{1,48})\)([' + SUP + r']+)', f, s)


def r_atom(s):
    """b² · PA² · 2ⁿ · 995²⁰⁰ · f⁻¹ → $b^{2}$ …"""
    def f(m):
        base, e = m.group(1), sup(m.group(2))
        b = tex_of(base)
        if b is None:
            return m.group(0)
        if len(base) > 1 and base.isalpha():
            b = '\\mathrm{%s}' % base          # PA · OP 처럼 두 글자 이름은 세워서
        return '$%s^{%s}$' % (b, e)
    return re.sub(r'(?<![A-Za-z0-9가-힣$.,])([A-Za-zα-ωΑ-Ωπ]{1,3}|\d+(?:\.\d+)?)'
                  r'([' + SUP + r']+)(?![A-Za-z0-9])', f, s)


def r_frac(s):
    """½ → $\\frac{1}{2}$  (앞뒤에 이미 수식이 있으면 묶음 단계에서 합쳐진다)"""
    return re.sub('[' + ''.join(FRAC) + ']', lambda m: '$%s$' % FRAC[m.group(0)], s)


BIN = r'(?:\s?(?:[+=]|−|\\?-|×|·|≤|≥|≒)\s?)'


def merge(s):
    """$a^2$ + $b^2$ 처럼 끊긴 식을 $a^2 + b^2$ 하나로 잇는다."""
    pat_mm = re.compile(r'\$([^$]{1,60})\$(' + BIN + r')\$([^$]{1,60})\$')
    pat_mr = re.compile(r'\$([^$]{1,60})\$(' + BIN + r')([0-9A-Za-zα-ω]{1,6})(?![0-9A-Za-z가-힣$√({.,])')
    pat_lm = re.compile(r'(?<![0-9A-Za-z가-힣$√)}.,])([0-9A-Za-zα-ω]{1,6})(' + BIN + r')\$([^$]{1,60})\$')
    for _ in range(6):
        t = pat_mm.sub(lambda m: '$%s %s %s$' % (m.group(1), tex_of(m.group(2).strip()) or '', m.group(3)), s)
        t = pat_mr.sub(lambda m: '$%s %s %s$' % (m.group(1), tex_of(m.group(2).strip()) or '', m.group(3)), t)
        t = pat_lm.sub(lambda m: '$%s %s %s$' % (m.group(1), tex_of(m.group(2).strip()) or '', m.group(3)), t)
        if t == s:
            break
        s = t
    return s


def convert(s):
    for r in (r_sqrt, r_func, r_unit, r_paren, r_atom, r_frac):
        s = r(s)
    s = merge(s)
    # JS 문자열 안에 들어가므로 역슬래시를 둘로 — '\left' 는 JS 가 'left' 로,
    # '\frac' 은 폼피드로 삼켜 버린다. 눈에 띄지 않게 수식이 깨지는 함정이다.
    s = re.sub(r'\$[^$]+\$',
               lambda m: m.group(0) if '\\\\' in m.group(0) else m.group(0).replace('\\', '\\\\'),
               s)
    return s


# ── 어디를 고칠지 ────────────────────────────────────────────────────────
def regions(h):
    out = []
    i = h.index('const NOTE_SPECS')
    out.append((i, h.index('function labNo(spec)')))
    i = h.index('LESSON[1]={')
    j = h.index('LESSON[356]={')
    j = h.index('\n};\n', j) + 4
    out.append((i, j))
    return out


def protected(seg):
    """손대면 안 되는 구간.
       · svg:`…`  — MathML 이 <svg> 안에 들어갈 수 없다
       · ${…}     — 템플릿 보간. $ 를 건드리면 코드가 통째로 깨진다
       · re:'…'   — 미션 달성 신호. 화면 문구와 글자 그대로 맞아야 하고,
                    $ 나 ^ 가 섞이면 정규식 앵커가 되어 영영 매칭되지 않는다
       · id:'…'   — 탐구 보고서의 식별자
    """
    sp = []
    for m in re.finditer(r'<div class="lsnfigs">', seg):   # patch_openfigs 가 소유한 블록
        k = seg.find('</div>', m.end())
        if k > 0:
            sp.append((m.start(), k + 6))
    for m in re.finditer(r'svg:`', seg):
        k = seg.find('`', m.end())
        sp.append((m.start(), k + 1))
    for m in re.finditer(r"(?:re|id):'", seg):
        k = seg.find("'", m.end())
        if k > 0:
            sp.append((m.start(), k + 1))
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
        sp.append((i, k + 1))
        i = k + 1
    sp.sort()
    out = []
    for a, b in sp:                      # 겹치는 구간을 합친다
        if out and a <= out[-1][1]:
            out[-1] = (out[-1][0], max(out[-1][1], b))
        else:
            out.append((a, b))
    return out


def main(path, dry):
    h = open(path, encoding='utf-8').read()
    if '$\\' in h or '$\\mathrm' in h:
        pass
    pieces, pos, n, sample = [], 0, 0, []
    for a, b in regions(h):
        pieces.append(h[pos:a])
        seg = h[a:b]
        sp = protected(seg)
        cut, p = [], 0
        for x, y in sp + [(len(seg), len(seg))]:
            part = seg[p:x]
            new = convert(part)
            if new != part:
                n += 1
                if len(sample) < 18:
                    for m in re.finditer(r'.{0,34}\$[^$]{1,40}\$.{0,24}', new):
                        if len(sample) < 18:
                            sample.append(m.group(0).replace('\n', ' '))
            cut.append(new)
            cut.append(seg[x:y])
            p = y
        pieces.append(''.join(cut))
        pos = b
    pieces.append(h[pos:])
    out = ''.join(pieces)
    assert out.count('${') == h.count('${'), '템플릿 보간을 건드렸다 — 멈춘다'
    sys.stdout.write('식으로 바꾼 토막 %d개 · 파일 %.2f MB\n' % (n, len(out.encode('utf-8')) / 1048576))
    for s in sample:
        sys.stdout.write('   %s\n' % s)
    if not dry:
        open(path, 'w', encoding='utf-8').write(out)
        sys.stdout.write('반영했습니다\n')


if __name__ == '__main__':
    main(sys.argv[1], '--dry' in sys.argv)
