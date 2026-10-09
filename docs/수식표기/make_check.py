# -*- coding: utf-8 -*-
"""변환한 식이 실제로 MathML 로 그려지는지 작은 쪽 하나로 확인한다.

dist/index.html 은 15 MB 라 미리보기에 띄우기 무겁다. 변환기와 표본만 담은 쪽을 따로 만든다.
사용: python docs/수식표기/make_check.py
"""
import sys, re, json

sys.stdout.reconfigure(encoding='utf-8')
BS = chr(92)                       # 역슬래시 하나

tex = open('src/35-tex.js', encoding='utf-8').read()
h = open('src/40-demos.js', encoding='utf-8').read()

pat = r'\$((?:' + BS + BS + r'[A-Za-z]+\{[^$\n]{0,40}\}|[^$\n]){1,52}?)\$'
seen, picks = set(), []
for g in re.findall(pat, h):
    # 표본 고르기 — 템플릿 보간 ${…} 조각이 섞여 들어오지 않게 거른다
    if '^' not in g and BS not in g:
        continue
    if not re.fullmatch(r'[A-Za-z0-9α-ω()\{}^_+\- =.,/]+', g):
        continue
    if '.toFixed' in g or 'n' == g[:1] and False:
        continue
    if g in seen:
        continue
    seen.add(g)
    picks.append(g)
    if len(picks) >= 24:
        break

# 소스에는 역슬래시가 둘, JS 문자열을 거치면 하나가 된다 — 화면에 가는 것은 이 꼴이다
runtime = [p.replace(BS + BS, BS) for p in picks]

page = ('<!doctype html><meta charset="utf-8"><title>수식 표기 확인</title>'
        '<style>body{font-family:"Malgun Gothic",system-ui;padding:16px;background:#F8FAFC}'
        'h1{font-size:16px;margin:0 0 4px}p{color:#6B7280;font-size:13px;margin:0 0 12px}'
        'table{border-collapse:collapse;font-size:14px;background:#fff}'
        'td{border:1px solid #E5E7EB;padding:7px 10px}'
        'td.s{color:#6B7280;font-family:ui-monospace,monospace;font-size:12px}'
        '.mx{display:inline-block;vertical-align:-0.12em}</style>'
        '<h1>글꼴에 기대지 않는 수식 — 화면에 가는 그대로</h1>'
        '<p>왼쪽은 LaTeX 원본, 오른쪽은 브라우저가 그린 MathML.</p>'
        '<table id="t"></table>'
        '<script>' + tex + '\nconst L=' + json.dumps(runtime, ensure_ascii=False) + ';\n'
        'document.getElementById("t").innerHTML = L.map(s=>'
        '`<tr><td class="s">${s.replace(/</g,"&lt;")}</td>'
        '<td>${texToMathML(s,false)}</td></tr>`).join("");'
        '</script>')
open('docs/수식표기/확인.html', 'w', encoding='utf-8').write(page)
print('표본 %d개 → docs/수식표기/확인.html' % len(runtime))
for r in runtime[:10]:
    print('   ', r)
