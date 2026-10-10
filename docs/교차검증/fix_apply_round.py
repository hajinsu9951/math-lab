# -*- coding: utf-8 -*-
"""적용 문제에 «어떻게 적을지» 안내를 넣는다 — ② 교육과정과 평가.

왜
  적용은 기계가 채점한다. LAB 272 의 답은 1/8 = 0.125 인데 허용오차가 ±0.002 다.
  학생이 0.13 이라 적으면 틀렸다는 말을 듣는다 — 수학을 틀린 것이 아니라
  «몇 자리까지 적어야 하는지» 를 몰랐을 뿐이다. LAB 342 도 같다(0.425 · ±0.005).
  다른 104종의 소수 답 문제는 모두 자릿수를 말해 주고 있으므로 이 둘만 관례에서 벗어나 있었다.

사용: python docs/교차검증/fix_apply_round.py src/40-demos.js
"""
import io
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

FIX = [
    ('적분하면 값은 얼마인가요?',
     '적분하면 값은 얼마인가요? (소수 셋째 자리까지)'),
    ('평균 풀링</b> 의 결과는 얼마인가요?',
     '평균 풀링</b> 의 결과는 얼마인가요? (소수 셋째 자리까지)'),
]


def main(path):
    s = io.open(path, encoding='utf-8').read()
    done = 0
    for old, new in FIX:
        if new in s:
            continue
        assert s.count(old) == 1, (s.count(old), old[:40])
        s = s.replace(old, new, 1)
        done += 1
    io.open(path, 'w', encoding='utf-8').write(s)
    sys.stdout.write('적용 문제 %d곳에 자릿수 안내를 넣었습니다\n' % done)
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
