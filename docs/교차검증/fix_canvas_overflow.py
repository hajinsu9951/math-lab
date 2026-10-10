# -*- coding: utf-8 -*-
"""캔버스 글씨가 그림 밖으로 흘러 잘리던 곳을 고친다 — 중1 묶음(LAB 25·27·29).

어떻게 찾았나
  단행본에 실을 «진짜 화면 사진» 을 찍다가 드러났다. LAB 25 에서는
  「…지만 나눠 보면 됩니다 … 작은 짝이 있…」 처럼 문장의 앞뒤가 사라진 채 보였다.
  글씨 겹침 점검(check_overlap.py)은 «겹침» 을 세지 «넘침» 은 보지 않아 지나쳤다.
  새 점검 도구 test/scan-canvas-overflow.mjs 가 브라우저의 measureText 로 실제 폭을 재고
  변환 행렬까지 적용해 «화면에 실제로 놓이는 자리» 로 판정한다.

무엇을 고치나
  LAB 25  한 줄 447px > 캔버스 380 → 두 줄로 나누고 11px 로
  LAB 27  한 줄 407px > 캔버스 380 → 긴 설명 하나를 두 줄로
  LAB 29  「바위」 라벨이 왼쪽으로 4px 삐져나감 → 받침점 쪽으로 조금 당김

사용: python docs/교차검증/fix_canvas_overflow.py src/40-demos.js
"""
import io
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

FIX = [
    # ── LAB 25 ────────────────────────────────────────────────────────────
    ("    ctx.textAlign='center'; ctx.fillStyle='#374151'; ctx.font='12px sans-serif';\n"
     "    ctx.fillText('여기까지만 나눠 보면 됩니다 — 이 금을 넘는 약수에는 "
     "반드시 작은 짝이 있습니다', W/2, H-10);",
     "    /* 캔버스 폭(380)보다 긴 한 줄이라 양끝이 잘렸다 — 두 줄로 나눠 적는다 (2026-10-10) */\n"
     "    ctx.textAlign='center'; ctx.fillStyle='#374151'; ctx.font='11px sans-serif';\n"
     "    ctx.fillText('여기까지만 나눠 보면 됩니다', W/2, H-24);\n"
     "    ctx.fillText('이 금을 넘는 약수에는 반드시 작은 짝이 있습니다', W/2, H-9);"),

    # ── LAB 27 ────────────────────────────────────────────────────────────
    ("    ctx.fillText(legend, W/2, OY+size+42);",
     "    /* 범례가 캔버스보다 길어 양끝이 잘리던 것을 「→」 앞에서 접어 두 줄로 (2026-10-10) */\n"
     "    if(ctx.measureText(legend).width > W-16 && legend.indexOf(' → ')>0){\n"
     "      const cut=legend.indexOf(' → ');\n"
     "      ctx.fillText(legend.slice(0,cut), W/2, OY+size+36);\n"
     "      ctx.fillText('→'+legend.slice(cut+2), W/2, OY+size+51);\n"
     "    } else ctx.fillText(legend, W/2, OY+size+42);"),

    # ── LAB 29 ────────────────────────────────────────────────────────────
    ("      x1.fillText('바위', LX(0)-24, FY-13);",
     "      x1.fillText('바위', Math.max(14, LX(0)-24), FY-13);   /* 왼쪽으로 삐져나가지 않게 */"),
]


def main(path):
    s = io.open(path, encoding='utf-8').read()
    done = 0
    for old, new in FIX:
        if new in s:
            continue
        assert s.count(old) == 1, (s.count(old), old[:46])
        s = s.replace(old, new, 1)
        done += 1
    io.open(path, 'w', encoding='utf-8').write(s)
    sys.stdout.write('캔버스 밖으로 흘러 잘리던 글씨 %d곳을 고쳤습니다\n' % done)
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
