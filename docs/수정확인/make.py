# -*- coding: utf-8 -*-
"""교차 검증·그림 다듬기·수식 표기에서 고친 것을 한 쪽에 모아 보여 준다.

dist/index.html 은 15 MB 라 미리보기에 띄우기 무겁다. 고친 자리만 뽑아 가벼운 쪽을 만든다.
사용: python docs/수정확인/make.py
"""
import sys, re, json, math

sys.stdout.reconfigure(encoding='utf-8')
src = open('src/40-demos.js', encoding='utf-8').read()
tex = open('src/35-tex.js', encoding='utf-8').read()
BS = chr(92)


def svg_of(no):
    m = re.search(r'LESSON\[%d\]=\{' % no, src)
    i = src.find('svg:`', m.end())
    j = src.find('`', i + 5)
    s = src[i + 5:j]
    s = re.sub(r'data:image/webp;base64,[A-Za-z0-9+/=]+', '', s)
    # 템플릿 보간은 미리보기에서 평가되지 않는다. 중괄호를 세어 구간을 정확히 잡고,
    # 산점도처럼 «점 찍기» 인 것은 좌표를 꺼내 대신 그려 준다.
    out, k = [], 0
    while True:
        a = s.find('${', k)
        if a < 0:
            out.append(s[k:])
            break
        out.append(s[k:a])
        d, b = 0, a + 1
        while b < len(s):
            if s[b] == '{':
                d += 1
            elif s[b] == '}':
                d -= 1
                if d == 0:
                    break
            b += 1
        inner = s[a:b + 1]
        pts = re.findall(r'\[(\d+),\s*(\d+)\]', inner)
        if len(pts) >= 5:
            out.append(''.join('<circle cx="%s" cy="%s" r="3.8" fill="#111827" opacity=".8"/>' % q
                               for q in pts))
        k = b + 1
    return ''.join(out)


def title(no):
    m = re.search(r'LESSON\[%d\]=\{\s*\n?\s*title:\'([^\']*)\'' % no, src)
    return m.group(1) if m else ''


FIXED = [
    (53, '정사각형이라 했는데 직사각형이었고, 합동이어야 할 ab 두 조각의 넓이가 5160 과 5280 으로 달랐다. '
         'a=80·b=40 으로 다시 그려 네 조각이 실제로 맞물린다.'),
    (56, '원주각 꼭짓점 두 개가 원 밖(63.9 · 69.4, r=62)이라 두 원주각이 46.9° 와 50.0° 로 달랐다. '
         '140°·40°·200°·310° 로 다시 잡아 둘 다 50.0°, 중심각 100.0° 가 되는지 코드가 검산한다.'),
    (58, '네 점이 원 위에 없어(|OB|=58.3 |OC|=64.5 |OD|=65.1) 대각의 합이 175° 와 185° 였다. '
         '중심각 −90°·−20°·60°·145° 로 다시 잡아 두 합이 정확히 180° 임을 코드가 검산한다.'),
    (59, '「이상치」로 표시한 점(348)이 울타리 Q3+1.5·IQR = 420 <b>안쪽</b>이라 그림이 제 설명을 어겼다. '
         'Q1=110·Q3=190 으로 바꿔 울타리 310 을 점선으로 그리고 점을 340 에 두었다.'),
    (60, '기저 10점만으로 이미 r = 0.71 이라 「점 하나로 결론이 뒤집힌다」가 성립하지 않았다. '
         'r = 0.10 이 되도록 점을 다시 놓았다.'),
]

ARROWS = [(51, '세로축·가로축 화살촉'), (52, '가로축 화살촉'), (69, '수직선 화살촉'),
          (73, '로그 눈금 축'), (77, '두 축 모두')]

# 수식 표본 — 소스에는 역슬래시가 둘, 화면에 가는 것은 하나
pat = r'\$((?:' + BS + BS + r'[A-Za-z]+\{[^$\n]{0,40}\}|[^$\n]){1,52}?)\$'
seen, picks = set(), []
for g in re.findall(pat, src):
    if '^' not in g and BS not in g:
        continue
    if not re.fullmatch(r'[A-Za-z0-9α-ω()\\{}^_+\- =.,/]+', g):
        continue
    if g in seen:
        continue
    seen.add(g)
    picks.append(g)
    if len(picks) >= 14:
        break
runtime = [p.replace(BS + BS, BS) for p in picks]

CSS = """
html{background:#F4F6F9}
body{width:1180px;transform:scale(.70);transform-origin:0 0;margin:0;padding:16px 16px 60px;
     font-family:"Malgun Gothic",system-ui,sans-serif;color:#111827}
h1{font-size:20px;margin:0 0 2px}
h2{font-size:15px;margin:22px 0 8px;padding-left:9px;border-left:4px solid #2563EB}
.sub{color:#6B7280;font-size:13px;margin:0 0 6px}
.g{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
figure{margin:0;background:#fff;border:1px solid #E5E7EB;border-radius:11px;padding:11px}
figcaption{font-size:13px;font-weight:800;margin-bottom:5px}
.why{font-size:12.3px;color:#6B7280;line-height:1.55;margin-top:7px;
     border-top:1px dashed #E5E7EB;padding-top:7px}
.why b{color:#BE123C}
svg{width:100%;height:auto;display:block}
table{border-collapse:collapse;font-size:14px;background:#fff;width:100%}
td{border:1px solid #E5E7EB;padding:6px 10px}
td.s{color:#6B7280;font-family:ui-monospace,monospace;font-size:12px;width:46%}
.mx{display:inline-block;vertical-align:-0.12em}
.tag{display:inline-block;font-size:11px;font-weight:800;color:#fff;background:#BE123C;
     border-radius:5px;padding:1px 6px;margin-right:6px;vertical-align:1px}
"""

cards = ''.join(
    '<figure><figcaption><span class="tag">고침</span>LAB %d · %s</figcaption>%s'
    '<div class="why">%s</div></figure>' % (n, title(n), svg_of(n), w)
    for n, w in FIXED)

arrows = ''.join(
    '<figure><figcaption>LAB %d · %s</figcaption>%s</figure>' % (n, w, svg_of(n))
    for n, w in ARROWS)

page = ('<!doctype html><meta charset="utf-8"><title>수정 확인</title><style>' + CSS + '</style>'
        '<h1>고친 것 한눈에 보기</h1>'
        '<p class="sub">수학 교사·교수 교차 검증에서 나온 지적 반영 · 축 화살표 · 글씨 흰 테두리 · 수식 MathML</p>'

        '<h2>① 그림의 수가 본문 주장을 반증하던 곳 — 좌표를 다시 계산했습니다</h2>'
        '<div class="g">' + cards + '</div>'

        '<h2>② 축 화살표 · 글씨 흰 테두리 (79장에 적용, 화살촉 41개 · 테두리 459곳)</h2>'
        '<p class="sub">선 위에 글씨가 올라가도 읽히도록 글자 뒤에만 흰 테두리를 깔았습니다. 좌표·눈금은 그대로입니다.</p>'
        '<div class="g3">' + arrows + '</div>'

        '<h2>③ 수식은 글꼴에 기대지 않게 — MathML</h2>'
        '<p class="sub">본문 글꼴에 위첨자 글리프가 없어 2⁵·aᵐ⁺ⁿ 가 깨지던 것을 고쳤습니다. '
        '왼쪽이 LaTeX 원본, 오른쪽이 브라우저가 그린 결과입니다.</p>'
        '<table id="t"></table>'

        '<script>' + tex + '\nconst L=' + json.dumps(runtime, ensure_ascii=False) + ';\n'
        'document.getElementById("t").innerHTML = L.map(s=>'
        '`<tr><td class="s">${s.replace(/</g,"&lt;")}</td>'
        '<td>${texToMathML(s,false)}</td></tr>`).join("");</script>')

open('docs/수정확인/확인.html', 'w', encoding='utf-8').write(page)
print('docs/수정확인/확인.html  %.0f KB' % (len(page.encode('utf-8')) / 1024))
