# -*- coding: utf-8 -*-
"""LAB 104 의 「내분비」 를 「내분한 비」 로 바꾼다 — ① 교실 운영(읽히는 말).

왜
  「내분비」 는 «내분(의) 비» 로 쓴 줄임말이지만, 교실에서 한글로 읽으면 생물 시간의
  내분비(內分泌) 로 먼저 읽힌다. 중3~고1 학생이 화면·활동지·기록표에서 모두 만나는 낱말이라
  한 번 잘못 읽히면 수업이 멈춘다. 교과서 표기도 아니다.
  → 「내분한 비」 로 적으면 «무엇을 한 비» 인지가 그대로 읽힌다.

  미션 달성 신호도 같은 낱말이므로 함께 바꾼다 (한 번에 바꾸지 않으면 사다리가 멈춘다).

사용: python docs/교차검증/fix_word_naebun.py src/40-demos.js
"""
import io
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OLD, NEW = '내분비', '내분한 비'


def main(path):
    s = io.open(path, encoding='utf-8').read()
    n = s.count(OLD)
    if not n:
        sys.stdout.write('이미 고쳐져 있습니다\n')
        return 0
    io.open(path, 'w', encoding='utf-8').write(s.replace(OLD, NEW))
    sys.stdout.write('「내분비」 %d곳을 「내분한 비」 로 바꿨습니다\n' % n)
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
