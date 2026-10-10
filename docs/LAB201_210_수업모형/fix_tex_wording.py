# -*- coding: utf-8 -*-
"""LAB 202 · 208 의 풀이 글귀를 수식으로 깨끗이 바뀌는 꼴로 고친다.

왜
  texify 는 「숫자나 글자 하나 + 위첨자」를 수식으로 바꾼다. 그런데
   · 「4P²」 처럼 밑 앞에 숫자가 붙은 꼴은 밑을 가려내지 못해 위첨자가 날글자로 남는다
     (본문 글꼴에 위첨자 글리프가 없어 □ 로 깨진다)
   · 「… = 1.12² − 1 = 1.2544」 는 등호가 한 번 끼어 식이 어정쩡하게 잘렸다
  그림·판정의 수는 건드리지 않고 **글귀만** 고친다.

사용: python docs/LAB201_210_수업모형/fix_tex_wording.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

E = [
    ('why:\'(1 + 0.24 ÷ 2)² − 1 = 1.12² − 1 = 1.2544 − 1 = 0.2544 이므로 25.44% 입니다. '
     '표시된 24% 보다 1.44%p 높습니다.\'',
     'why:\'반년마다 12% 가 두 번 붙으므로 배율은 1 + 0.24 ÷ 2 = 1.12 입니다. '
     '실효이자율은 1.12² − 1 = 0.2544 이므로 25.44% — 표시된 24% 보다 1.44%p 높습니다.\''),
    ('why:\'매출 = P(60 − 4P) = 60P − 4P² 이고 꼭짓점은 P = 60 ÷ 8 = 7.5 입니다. '
     '그때 판매량이 30, 매출이 225 이고 탄력성이 정확히 1 입니다.\'',
     'why:\'매출 = P × (60 − 4P) 는 P 에 대한 아래로 열린 이차식이고, 두 영점 0 과 15 의 '
     '가운데인 P = 7.5 에서 꼭짓점을 가집니다. 그때 판매량이 30, 매출이 225 이고 '
     '탄력성이 정확히 1 입니다.\''),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    if '반년마다 12% 가 두 번 붙으므로' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    for a, b in E:
        assert h.count(a) == 1, '앵커가 %d곳 — 멈춘다:\n%s' % (h.count(a), a[:60])
        h = h.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 202 · 208 풀이 글귀 교정\n')


if __name__ == '__main__':
    main(sys.argv[1])
