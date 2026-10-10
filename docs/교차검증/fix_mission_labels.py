# -*- coding: utf-8 -*-
"""미션이 부른 단추 이름을 화면의 실제 이름과 똑같이 맞춘다 — ① 교실 운영.

왜
  미션 문구는 「…」 안에 화면의 이름을 그대로 인용해야 한다. 열한 종이 뜻은 같지만
  낱말이 달랐다 — 미션은 「부호 버리기」, 화면은 「부호를 무시하고 계산하기」.
  교실에서 학생은 화면을 훑어 그 글자를 찾는다. 글자가 다르면 못 찾고 손이 올라온다.

  LAB 168 처럼 괄호가 빠진 것도, LAB 323 처럼 분모 식이 빠진 것도 같은 문제다.

무엇을 바꾸나
  LESSON[n] 안의 그 이름을 화면 이름으로 통째로 갈아 끼운다 —
  미션 문구·해볼 것·화면 안내가 한 이름을 쓰게 된다. 달성 신호는 건드리지 않는다.
  고친 뒤 docs/교차검증/scan_mission_labels.py 가 0종이어야 한다.

사용: python docs/교차검증/fix_mission_labels.py src/40-demos.js
"""
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks                             # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# (실험실, 미션이 부르던 이름, 화면의 실제 이름)
FIX = [
    (168, '관제탑까지의 거리 보기', '관제탑(0,0,0) 까지의 거리 보기'),
    (278, '부호 버리기', '부호를 무시하고 계산하기'),
    (287, '둔각을 그대로 쓰기', '둔각을 고치지 않고 그대로 쓰기'),
    (287, '법선 뒤집기', '② 평면의 법선을 뒤집기'),
    (294, '세 겹침을 다시 더하지 않기', '세 겹친 인원을 다시 더하지 않기'),
    (303, '모두 같은 길이로 주기', '모든 글자에 같은 길이 주기'),
    (307, '증명할 것을 그대로 가정하기', '가정을 부정하지 않고 그대로 쓰기'),
    (313, 'δ 를 고정해 두기', 'δ 를 ε 과 무관하게 0.5 로 고정'),
    (315, '최대 오차 보기', '최대 오차를 함께 보기'),
    (316, '실수부와 허수부 바꿔 넣기', '실수부와 허수부를 바꿔 넣기'),
    (319, '계산 순서 뒤집기', '순서를 뒤집어 계산하기'),
    (323, '분모를 빼고 계산하기', '분모 √(a²+b²) 를 빼고 계산'),
]


def main(path):
    src = io.open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    done = 0
    for no, old, new in FIX:
        b = LES[no]
        i = src.index(b)                 # LESSON 블록의 자리
        if old not in b:
            continue                     # 이미 고쳐져 있다
        nb = b.replace(old, new)
        src = src[:i] + nb + src[i + len(b):]
        LES = blocks(src, r'LESSON\[(\d+)\]=\{')
        done += 1
    io.open(path, 'w', encoding='utf-8').write(src)
    sys.stdout.write('미션이 부른 단추 이름 %d곳을 화면 이름에 맞췄습니다\n' % done)
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
