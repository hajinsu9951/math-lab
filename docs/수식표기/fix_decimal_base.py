# -*- coding: utf-8 -*-
"""texify.py — 소수를 지수의 밑으로 제대로 읽게 고친다.

무엇이 틀렸나
  r_atom 의 밑은 `\d+` 였고 앞을 막는 조건에 소수점이 없었다. 그래서
      1.05**20  →  1.$05^{20}$        (소수점 뒤만 밑으로 잡는다)
  이 되고, 이어서 merge 가 소수의 정수 부분까지 수식 안으로 끌어들여
      1.$05^{20} \approx 2$.6533
  처럼 식과 글이 서로 뒤엉켰다. 1.1**2 · 1.12**2 도 똑같이 깨진다.

어떻게 고치나
  ① 밑에 소수를 허용한다            \d+ → \d+(?:\.\d+)?
  ② 밑 앞에 소수점·쉼표를 막는다     소수의 «뒷부분»을 밑으로 잡지 않게
  ③ merge 가 소수를 끊지 않게 한다   오른쪽은 뒤에 . , 가 오면 멈추고,
                                     왼쪽은 앞에 . , 가 있으면 잡지 않는다

사용: python docs/수식표기/fix_decimal_base.py docs/수식표기/texify.py
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

E = [
    # ① ②
    (r"""    return re.sub(r'(?<![A-Za-z0-9가-힣$])([A-Za-zα-ωΑ-Ωπ]{1,3}|\d+)([' + SUP + r']+)'
                  r'(?![A-Za-z0-9])', f, s)""",
     r"""    return re.sub(r'(?<![A-Za-z0-9가-힣$.,])([A-Za-zα-ωΑ-Ωπ]{1,3}|\d+(?:\.\d+)?)'
                  r'([' + SUP + r']+)(?![A-Za-z0-9])', f, s)"""),
    # ③ 오른쪽 조각 — 뒤에 소수점·쉼표가 오면 그 수는 더 긴 수의 앞머리다
    (r"""    pat_mr = re.compile(r'\$([^$]{1,60})\$(' + BIN + r')([0-9A-Za-zα-ω]{1,6})(?![0-9A-Za-z가-힣$√({])')""",
     r"""    pat_mr = re.compile(r'\$([^$]{1,60})\$(' + BIN + r')([0-9A-Za-zα-ω]{1,6})(?![0-9A-Za-z가-힣$√({.,])')"""),
    # ③ 왼쪽 조각 — 앞에 소수점·쉼표가 있으면 그 수는 더 긴 수의 꼬리다
    (r"""    pat_lm = re.compile(r'(?<![0-9A-Za-z가-힣$√)}])([0-9A-Za-zα-ω]{1,6})(' + BIN + r')\$([^$]{1,60})\$')""",
     r"""    pat_lm = re.compile(r'(?<![0-9A-Za-z가-힣$√)}.,])([0-9A-Za-zα-ω]{1,6})(' + BIN + r')\$([^$]{1,60})\$')"""),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    if r'\d+(?:\.\d+)?' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    for a, b in E:
        assert h.count(a) == 1, '앵커가 %d곳 — 멈춘다:\n%s' % (h.count(a), a[:70])
        h = h.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('texify 교정 3곳 — 소수를 지수의 밑으로 읽는다\n')


if __name__ == '__main__':
    main(sys.argv[1])
