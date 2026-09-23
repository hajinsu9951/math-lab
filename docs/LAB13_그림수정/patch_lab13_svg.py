# -*- coding: utf-8 -*-
"""LAB 13 의 「오늘의 문제」 거리-시간 그래프를 식에서 계산해 다시 그린다.

무엇이 틀렸었나
  · 「한 점의 순간속도(접선)」이라고 그린 선의 기울기는 **−0.549**,
    그런데 곡선의 그 점에서의 실제 기울기는 **−0.311** 이었다. 접선이 아니다.
  · 그 선은 빨간 점을 **지나지도 않았다** — 16 px 위로 비껴갔다.
  · 할선도 두 점을 정확히 지나지 않았다(뒷점에서 4 px 어긋남).
  접선은 ① 그 점을 지나고 ② 그 점에서의 곡선 기울기를 가져야 한다. 둘 다 아니었다.

무엇으로 고치나
  거리 s(t) = 1.2 t² 를 정해 놓고 곡선·두 점·할선·접선의 좌표를 **모두 계산한다.**
  할선은 두 점을 정확히 지나고, 접선의 기울기는 s'(t) = 2.4t 에서 나온다.

사용: python docs/LAB13_그림수정/patch_lab13_svg.py src/40-demos.js
"""
import sys

# ── 그림틀과 모형 ────────────────────────────────────────────
X0, X1, Y0, Y1 = 40.0, 384.0, 24.0, 146.0      # 그림 영역
TMAX, SMAX = 10.0, 120.0
TA, TB = 4.0, 8.0                               # 앞점 · 뒷점


def s(t):
    return 1.2 * t * t


def ds(t):
    return 2.4 * t


def X(t):
    return X0 + (X1 - X0) * t / TMAX


def Y(v):
    return Y1 - (Y1 - Y0) * v / SMAX


A = (X(TA), Y(s(TA)))
B = (X(TB), Y(s(TB)))
SEC = (B[1] - A[1]) / (B[0] - A[0])                        # 할선 기울기 (화면 좌표)
TAN = -(Y1 - Y0) / SMAX * ds(TA) / ((X1 - X0) / TMAX)      # 접선 기울기 (화면 좌표)

CURVE = ' '.join(
    '%s%.1f %.1f' % ('M' if i == 0 else 'L', X(t), Y(s(t)))
    for i, t in enumerate([k * TMAX / 60 for k in range(61)]))


def seg(x0, x1, p, m):
    return 'M%.1f %.1f L%.1f %.1f' % (x0, p[1] + m * (x0 - p[0]), x1, p[1] + m * (x1 - p[0]))


SVG = '''svg:`<svg viewBox="0 0 400 170" role="img" aria-label="거리-시간 곡선 위 두 점을 잇는 할선과 앞점에서의 접선을 견주는 그림">
    <path d="M{X0} {Y1} H388 M{X0} {Y1} V18" stroke="#9CA3AF" stroke-width="1.3"/>
    <text x="386" y="162" font-size="9.5" fill="#6B7280" text-anchor="end">시간 →</text>
    <text x="{X0}" y="14" font-size="9.5" fill="#6B7280" text-anchor="middle">거리 ↑</text>
    <path d="{CURVE}" stroke="#2563EB" stroke-width="2.4" fill="none"/>
    <path d="{SECP}" stroke="#B45309" stroke-width="1.7" stroke-dasharray="6 4"/>
    <path d="{TANP}" stroke="#0E9384" stroke-width="1.9"/>
    <circle cx="{AX}" cy="{AY}" r="4.6" fill="#BE123C"/>
    <circle cx="{BX}" cy="{BY}" r="4.6" fill="#B45309"/>
    <path d="M{ARX1} {ARY} H{ARX2}" stroke="#B45309" stroke-width="1.4"/>
    <path d="M{ARX2} {ARY} l6 -3 l0 6 z" fill="#B45309"/>
    <text x="382" y="44" font-size="10" font-weight="800" fill="#92400E" text-anchor="end">두 점의 평균속도 — 할선</text>
    <text x="{TLX}" y="{TLY}" font-size="10" font-weight="800" fill="#0B6E63">앞점의 순간속도 — 접선</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">뒷점을 앞점 쪽으로 끌어당기면 할선은 어디로 갈까?</text>
  </svg>`,'''.format(
    X0=X0, Y1=Y1, CURVE=CURVE,
    SECP=seg(X(2.2), X(9.4), A, SEC),
    TANP=seg(X(1.2), X(7.4), A, TAN),
    AX=round(A[0], 1), AY=round(A[1], 1), BX=round(B[0], 1), BY=round(B[1], 1),
    ARX1=round(B[0] - 6, 1), ARX2=round(A[0] + 14, 1), ARY=round(B[1] - 16, 1),
    TLX=round(X(7.6), 1), TLY=round(A[1] + TAN * (X(7.6) - A[0]) - 8, 1))


def main(path):
    h = open(path, encoding='utf-8').read()
    i = h.find('LESSON[13]=')
    j = h.find('svg:`', i)
    k = h.find('`,', j) + 2
    assert i > 0 and j > i and k > j, 'LAB 13 의 그림 자리를 못 찾음'
    if '앞점의 순간속도' in h[j:k]:
        print('이미 고쳐져 있음')
        return
    open(path, 'w', encoding='utf-8').write(h[:j] + SVG + h[k:])
    print('LAB 13 그래프 교체 — 할선 기울기 %.3f · 접선 기울기 %.3f (곡선의 실제 기울기)'
          % (SEC, TAN))


if __name__ == '__main__':
    main(sys.argv[1])
