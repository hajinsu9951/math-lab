# -*- coding: utf-8 -*-
"""LAB 18 의 「오늘의 문제」 선 그림에서 사잇각 호를 바로잡는다.

무엇이 틀렸었나
  두 화살표는 원점에서 **6.3°** 와 **33.7°** 로 뻗는데, 사잇각 호는 **17.6°~32.2°** 를 지나갔다.
  호의 두 끝이 반지름도 서로 달라(46 과 54) 원호가 아니었다. 그래서 각을 나타내지 못했다.
  라벨 「나 (짧음) · 헤비유저 (김)」도 화살표 하나에 두 사람을 겹쳐 적어 무엇을 가리키는지 알 수 없었다.

무엇으로 고치나
  화살표의 실제 방향을 계산해 **그 사이만** 호로 잇고, 세 화살표에 각각 제 이름을 붙인다.
  실선 파랑 = 나(짧음) · 점선 파랑 = 헤비유저(같은 방향, 긴 화살표) · 빨강 = 취향이 다른 친구.

사용: python docs/LAB18_그림수정/patch_lab18_svg.py src/40-demos.js
"""
import sys, math

O  = (60.0, 146.0)
ME = (180.0, 66.0)          # 나 — 짧은 화살표
OT = (340.0, 116.0)         # 취향이 다른 친구 — 긴 화살표
R  = 52.0


def ang(p):
    return math.degrees(math.atan2(O[1] - p[1], p[0] - O[0]))


def pt(a, r):
    t = math.radians(a)
    return (O[0] + r * math.cos(t), O[1] - r * math.sin(t))


aM, aO = ang(ME), ang(OT)
th = aM - aO
L = math.hypot(ME[0] - O[0], ME[1] - O[1])
HEAVY = pt(aM, L * 2.06)                       # 같은 방향으로 두 배 넘게 긴 화살표
A0, A1 = pt(aO, R), pt(aM, R)
LAB = pt((aM + aO) / 2, R + 17)


def head(p, a, c):
    """화살촉 — 방향 a 로 뻗은 끝점 p 에 붙인다."""
    t = math.radians(a)
    b = (p[0] - 11 * math.cos(t), p[1] + 11 * math.sin(t))
    n = (-math.sin(t) * 4.4, -math.cos(t) * 4.4)
    return ('<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="%s"/>'
            % (p[0], p[1], b[0] + n[0], b[1] + n[1], b[0] - n[0], b[1] - n[1], c))


SVG = '''svg:`<svg viewBox="0 0 400 180" role="img" aria-label="취향을 화살표로 나타내고 길이가 아니라 사잇각으로 닮음을 재는 그림">
    <path d="M{OX} {OY} H386 M{OX} {OY} V18" stroke="#9CA3AF" stroke-width="1.3"/>
    <text x="374" y="164" font-size="10" fill="#6B7280" text-anchor="end">액션 →</text>
    <text x="{OX}" y="14" font-size="10" fill="#6B7280" text-anchor="middle">로맨스 ↑</text>
    <path d="M{OX} {OY} L{HX} {HY}" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5 4" opacity=".6"/>
    {HEAD_H}
    <path d="M{OX} {OY} L{MX} {MY}" stroke="#2563EB" stroke-width="2.8"/>
    {HEAD_M}
    <path d="M{OX} {OY} L{TX} {TY}" stroke="#BE123C" stroke-width="2.8"/>
    {HEAD_T}
    <path d="M{A0X} {A0Y} A {R} {R} 0 0 0 {A1X} {A1Y}" stroke="#B45309" stroke-width="2" fill="none"/>
    <text x="{LX}" y="{LY}" font-size="10.5" font-weight="800" fill="#92400E">사잇각 θ</text>
    <text x="{MX2}" y="{MY2}" font-size="10" font-weight="800" fill="#1D4ED8">나 (짧음)</text>
    <text x="{HX2}" y="{HY2}" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end">헤비유저 — 같은 방향, 긴 화살표</text>
    <text x="{TX2}" y="{TY2}" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">취향이 다른 친구</text>
    <text x="210" y="176" font-size="10.5" fill="#6B7280" text-anchor="middle">길이(시청량)일까, 각(취향 방향)일까?</text>
  </svg>`,'''.format(
    OX=O[0], OY=O[1], MX=ME[0], MY=ME[1], TX=OT[0], TY=OT[1],
    HX=round(HEAVY[0], 1), HY=round(HEAVY[1], 1), R=R,
    A0X=round(A0[0], 1), A0Y=round(A0[1], 1), A1X=round(A1[0], 1), A1Y=round(A1[1], 1),
    LX=round(LAB[0], 1), LY=round(LAB[1] + 4, 1),
    MX2=ME[0] + 8, MY2=ME[1] + 4, HX2=round(HEAVY[0] - 8, 1), HY2=round(HEAVY[1] + 13, 1),
    TX2=OT[0] - 6, TY2=OT[1] - 9,
    HEAD_H=head(HEAVY, aM, '#2563EB'), HEAD_M=head(ME, aM, '#2563EB'), HEAD_T=head(OT, aO, '#BE123C'))


def main(path):
    h = open(path, encoding='utf-8').read()
    i = h.find('LESSON[18]')
    j = h.find('svg:`', i)
    k = h.find('`,', j) + 2
    assert i > 0 and j > i and k > j, 'LAB 18 의 그림 자리를 못 찾음'
    if '취향이 다른 친구' in h[j:k]:
        print('이미 고쳐져 있음')
        return
    open(path, 'w', encoding='utf-8').write(h[:j] + SVG + h[k:])
    print('LAB 18 그림 교체 — 사잇각 θ = %.1f° (%.1f° 와 %.1f° 사이)' % (th, aO, aM))


if __name__ == '__main__':
    main(sys.argv[1])
