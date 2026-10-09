# -*- coding: utf-8 -*-
"""LAB 151~160 교차 검증 지적 반영 — tdoaDemo(LAB 160) 의 거리 차 식이 두 배다.

지적
  소리 속도는 343 m/s = 0.343 m/ms 이므로 시간 차 dt(ms) 에 대한 거리 차는
  **0.343 x dt** 다. 그런데 화면은 `0.343 x dt x 2` 로 계산하고
  그 식을 글자로까지 찍어 학생에게 보여 준다 (주석에 「화면 단위와 맞춘 스케일」).
  그림을 보기 좋게 하려고 곱한 2 가 **물리식의 일부처럼** 읽히게 된 것이다.
  학생이 외워 갈 식이 틀리면 안 된다.

반영
  거리 차 = 0.343 x dt 로 고친다. 쌍곡선의 a = |거리 차| / 2 는 그대로 옳다.
  dt 범위 +-8 ms -> 거리 차 +-2.744 m, a <= 1.372 < c = 4 이므로 쌍곡선은 그대로 그려진다
  (조금 더 완만해질 뿐이다).

사용: python docs/LAB151_160_수업모형/fix_review.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

JOBS = [
 ("""    const dd=V*dt*2; // 거리 차(m) — 화면 단위와 맞춘 스케일""",
  """    const dd=V*dt;   // 거리 차(m) = 소리 속도 × 시간 차. 보기 좋으라고 곱하지 않는다"""),
 ("""시간 차 ${dt.toFixed(1)} ms → 거리 차 = 0.343 × ${dt.toFixed(1)} × 2 = <b>${dd.toFixed(2)} m</b>""",
  """시간 차 ${dt.toFixed(1)} ms → 거리 차 = 0.343 × ${dt.toFixed(1)} = <b>${dd.toFixed(2)} m</b>"""),
 ("""read:()=>{ const dt=+$('#tdD').value, dd=0.343*dt*2;""",
  """read:()=>{ const dt=+$('#tdD').value, dd=0.343*dt;"""),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'const dd=V*dt;   //' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    for a, b in JOBS:
        assert h.count(a) == 1, '못 찾음: ' + a[:60]
        h = h.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('tdoaDemo 거리 차 식 교정 ok\n')


if __name__ == '__main__':
    main(sys.argv[1])
