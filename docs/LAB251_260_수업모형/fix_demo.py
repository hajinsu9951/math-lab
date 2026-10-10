# -*- coding: utf-8 -*-
"""LAB 260 lsqDemo — 기록이 화면과 어긋나던 것을 고친다.
   「가장 가까운 직선 찾기」 는 정확한 a, b 로 그림을 그리면서 슬라이더에는
   반올림한 값을 써 넣는다. read() 가 슬라이더를 다시 읽었으므로
   화면에는 내적 0 이 보이는데 기록표에는 0.200 / 0.100 이 적혔다.
   draw() 가 실제로 쓴 a, b 를 S 에 남겨 read() 가 같은 값을 보게 한다."""
import io, sys
sys.stdout.reconfigure(encoding='utf-8')

P = 'src/40-demos.js'
s = io.open(P, encoding='utf-8').read()

E = [("      $('#lsA').value=Math.round(ba*20)/20; $('#lsB').value=Math.round(bb*10)/10; }\n",
      "      $('#lsA').value=Math.round(ba*20)/20; $('#lsB').value=Math.round(bb*10)/10; }\n"
      "    S.a=a; S.b=b;   /* 기록표가 화면과 어긋나지 않게 — 슬라이더 값은 반올림된다 */\n"),
     ("    read:()=>{ const P=pts(),a=+$('#lsA').value,b=+$('#lsB').value;",
      "    read:()=>{ const P=pts(),a=S.a,b=S.b;")]

for old, new in E:
    if new in s and old not in s:
        print('이미 적용됨'); continue
    assert s.count(old) == 1, (s.count(old), old[:40])
    s = s.replace(old, new)

io.open(P, 'w', encoding='utf-8').write(s)
print('lsqDemo 기록 일치 수정 완료')
