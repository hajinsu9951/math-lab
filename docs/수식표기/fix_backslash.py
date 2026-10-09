# -*- coding: utf-8 -*-
"""$…$ 안에서 역슬래시가 하나뿐인 TeX 명령을 둘로 만든다.

왜
  이 수식들은 JS 문자열 안에 들어 있다. 문자열 안의 `\\sqrt` 를 JS 는 `sqrt` 로,
  `\\frac` 은 폼피드로 삼켜 버린다. 화면에는 「sqrt{x-2} + 1」 처럼 나와서
  수식이 깨진 줄도 모르고 지나가기 쉽다.

자리를 찾을 때는 audit.py 와 **똑같이** 템플릿 보간 ${…} 과 svg:`…` 를 먼저 지운 사본에서
짝을 찾는다. 그러지 않으면 `${a}` 의 $ 와 수식의 $ 가 짝지어져 자리가 어긋난다.

사용: python docs/수식표기/fix_backslash.py src/40-demos.js
"""
import sys, re, importlib.util, os

sys.stdout.reconfigure(encoding='utf-8')
BS = chr(92)

_spec = importlib.util.spec_from_file_location(
    'au', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audit.py'))
au = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(au)

SINGLE = re.compile(r'(?<!' + re.escape(BS) + ')' + re.escape(BS) + r'(?=[A-Za-z])')


def main(path):
    h = open(path, encoding='utf-8').read()
    edits = []
    for a, b in au.regions(h):
        seg = h[a:b]
        bl = au.blanked(seg)
        for m in re.finditer(r'\$[^$\n]{1,90}\$', bl):
            t = seg[m.start():m.end()]
            if SINGLE.search(t):
                # 치환을 람다로 — 문자열로 주면 re 가 역슬래시를 escape 로 읽어 도로 한 개가 된다
                edits.append((a + m.start(), a + m.end(), SINGLE.sub(lambda _: BS + BS, t)))
    for s, e, new in reversed(edits):          # 뒤에서부터 고쳐야 자리가 안 밀린다
        h = h[:s] + new + h[e:]
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('역슬래시를 둘로 고친 수식 %d개\n' % len(edits))
    for _, _, new in edits[:6]:
        sys.stdout.write('   %s\n' % new[:76])


if __name__ == '__main__':
    main(sys.argv[1])
