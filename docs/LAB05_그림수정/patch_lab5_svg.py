# -*- coding: utf-8 -*-
"""LAB 05 의 「오늘의 문제」 선 그림을 바로잡는다.

무엇이 틀렸었나
  · 「높이 = ?」 글자는 있는데 **높이를 나타내는 선이 없었다.**
  · θ 호가 관측점(지면에서 8px 떠 있는 점)에서 그려져 수평선과 맞지 않았고,
    「θ = ?」 글자가 조준선 위에 겹쳐 읽히지 않았다.
  · 직각 표시가 없어 직각삼각형인 것이 보이지 않았다.
  · 제목은 「드론으로 높이 재기」인데 그림에는 드론이 없었다 — 작은 집 모양 아이콘뿐.

무엇으로 고치나
  지면·건물·높이·수평거리·조준선·θ 를 모두 **한 직각삼각형**으로 맞추고,
  각은 **지면 위 관측점(드론 카메라)** 에서 수평선과 조준선 사이에 그린다.
  드론을 알아볼 수 있게 그리고, 드론이 **지면 높이에서 재기 때문에 눈높이 보정이 없다**는
  이 실험의 가정을 그림이 스스로 말하게 한다.

사용: python docs/LAB05_그림수정/patch_lab5_svg.py src/40-demos.js
"""
import sys, math

GY, BX, BW, BTOP, DX = 148, 30, 58, 26, 318      # 지면 · 건물 왼쪽 · 폭 · 꼭대기 · 드론
BR = BX + BW                                      # 건물 오른쪽 모서리 = 높이를 재는 선
TH = math.degrees(math.atan2(GY - BTOP, DX - BR)) # 실제 올려본각

R = 60                                            # θ 호 반지름
a0, a1 = 180.0, 180.0 - TH
p0 = (DX + R * math.cos(math.radians(a0)), GY - R * math.sin(math.radians(a0)))
p1 = (DX + R * math.cos(math.radians(a1)), GY - R * math.sin(math.radians(a1)))
am = math.radians((a0 + a1) / 2)
lab = (DX + (R + 13) * math.cos(am), GY - (R + 13) * math.sin(am))

SVG = '''svg:`<svg viewBox="0 0 400 170" role="img" aria-label="지면의 드론에서 건물 꼭대기를 올려다본 각과 수평거리, 건물 높이가 직각삼각형으로 표시된 그림">
    <path d="M14 {GY} H386" stroke="#9CA3AF" stroke-width="1.4"/>
    <rect x="{BX}" y="{BTOP}" width="{BW}" height="{BH}" rx="4" fill="#E8EDF4" stroke="#64748B" stroke-width="1.6"/>
    ${{[0,1,2,3].map(r=>[0,1].map(c=>`<rect x="${{{WX}+c*22}}" y="${{{WY}+r*28}}" width="14" height="16" rx="2" fill="#C7D3E3"/>`).join('')).join('')}}
    <path d="M{BR} {GY} V{BTOP}" stroke="#BE123C" stroke-width="2.4"/>
    <path d="M{BR} {BTOP} l-4 7 M{BR} {BTOP} l4 7 M{BR} {GY} l-4 -7 M{BR} {GY} l4 -7" stroke="#BE123C" stroke-width="2"/>
    <text x="{BRT}" y="18" font-size="11.5" font-weight="800" fill="#BE123C" text-anchor="middle">높이 = ?</text>
    <path d="M{RA} {GY} h13 v-13" stroke="#64748B" stroke-width="1.4" fill="none"/>
    <path d="M{BR} {GY} H{DX}" stroke="#0E9384" stroke-width="2.2"/>
    <path d="M{BR} {GY1} v9 M{DX} {GY1} v9" stroke="#0E9384" stroke-width="1.6"/>
    <text x="{MID}" y="165" font-size="11.5" font-weight="800" fill="#0B6E63" text-anchor="middle">수평거리 50 m (측정기)</text>
    <path d="M{DX} {GY} L{BR} {BTOP}" stroke="#B45309" stroke-width="1.8" stroke-dasharray="6 4"/>
    <path d="M{P0X} {P0Y} A {R} {R} 0 0 0 {P1X} {P1Y}" stroke="#B45309" stroke-width="1.8" fill="none"/>
    <text x="{LX}" y="{LY}" font-size="11.5" font-weight="800" fill="#92400E" text-anchor="end">θ = ?°</text>
    <g>
      <path d="M306 136 h13 M323 136 h13" stroke="#6B7280" stroke-width="2"/>
      <path d="M312 136 v4 M330 136 v4" stroke="#6B7280" stroke-width="1.4"/>
      <rect x="{DBX}" y="140" width="12" height="7" rx="2.5" fill="#374151"/>
      <circle cx="{DX}" cy="{GY}" r="2.6" fill="#BE123C"/>
    </g>
    <text x="344" y="151" font-size="10" font-weight="800" fill="#374151">드론</text>
    <text x="196" y="112" font-size="10.5" fill="#6B7280" text-anchor="middle">지면 높이에서 재니 눈높이를 더할 것이 없다</text>
  </svg>`,'''.format(
    GY=GY, GY1=GY - 4, BX=BX, BW=BW, BTOP=BTOP, BH=GY - BTOP, BR=BR, BRT=BX + BW // 2,
    WX=BX + 11, WY=BTOP + 6, RA=BR, DX=DX, MID=(BR + DX) // 2, R=R, DBX=DX - 6,
    P0X=round(p0[0], 1), P0Y=round(p0[1], 1), P1X=round(p1[0], 1), P1Y=round(p1[1], 1),
    LX=round(lab[0], 1), LY=round(lab[1] + 4, 1))


def main(path):
    h = open(path, encoding='utf-8').read()
    i = h.find('LESSON[5]={')
    j = h.find('svg:`', i)
    k = h.find('`,', j) + 2
    assert i > 0 and j > i and k > j, 'LAB 05 의 그림 자리를 못 찾음'
    if '지면 높이에서 재니' in h[j:k]:
        print('이미 고쳐져 있음')
        return
    h = h[:j] + SVG + h[k:]
    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 05 그림 교체 — 올려본각 θ = %.1f°, 직각·높이선·드론 포함' % TH)


if __name__ == '__main__':
    main(sys.argv[1])
