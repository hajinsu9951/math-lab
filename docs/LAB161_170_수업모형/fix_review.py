# -*- coding: utf-8 -*-
"""LAB 161~170 교차 검증 지적 반영 — coneCutDemo(LAB 170) 의 이심률 식이 틀렸다.

지적
  화면과 안내문이 `e = tan(자른 각) / tan(모선 각)` 이라고 말한다.
  이 식은 0°, 45°, 그리고 모선 각과 같을 때만 우연히 맞고 그 밖에서는 틀린다.
  특히 자르는 각이 90° 로 가면 e 가 무한대로 발산한다 — 그런 원뿔곡선은 없다.

  바른 식은 e = cos β / cos α (α = 모선 각, β = 평면과 축이 이루는 각).
  우리 화면의 t 는 **밑면과 이루는 각** 이므로 β = 90° − t 이고,
      e = cos(90° − t) / cos α = sin t / cos α.

  검산 — 45° 원뿔을 축과 나란히(t = 90°) 자르면 점근선이 ±45° 인 직각쌍곡선이고
  그 이심률은 √2 ≒ 1.4142 다. 바른 식은 sin 90° / cos 45° = 1.4142 로 맞고,
  데모의 식은 무한대로 틀린다. t = 30° 에서도 0.7071 이어야 하는데 0.5774 로 나왔다.

반영
  계산식 두 곳(그리기 · read)과 안내문 한 곳을 고친다.
  원 · 타원 · 포물선 · 쌍곡선의 갈림목은 그대로 45° 다 (e = 1 이 되는 자리가 같다).

사용: python docs/LAB161_170_수업모형/fix_review.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

JOBS = [
 ("""      이심률 e = tan(자른 각)/tan(모선 각).</div>""",
  """      이심률 e = sin(자른 각) ÷ cos(모선 각) — 축과 나란히 자르면 √2 입니다.</div>"""),
 ("""    const e=Math.tan(t*Math.PI/180)/Math.tan(CONE*Math.PI/180);""",
  """    /* e = cos(평면과 축이 이루는 각) / cos(모선 각). 우리 t 는 밑면과의 각이므로 sin t 가 된다 */
    const e=Math.sin(t*Math.PI/180)/Math.cos(CONE*Math.PI/180);"""),
 ("""read:()=>{ const t=+$('#ccT').value, e=Math.tan(t*Math.PI/180)/Math.tan(45*Math.PI/180);""",
  """read:()=>{ const t=+$('#ccT').value, e=Math.sin(t*Math.PI/180)/Math.cos(45*Math.PI/180);"""),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'Math.sin(t*Math.PI/180)/Math.cos(CONE' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    for a, b in JOBS:
        assert h.count(a) == 1, '못 찾음: ' + a[:60]
        h = h.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('coneCutDemo 이심률 식 교정 ok\n')


if __name__ == '__main__':
    main(sys.argv[1])
