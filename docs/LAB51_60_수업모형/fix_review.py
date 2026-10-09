# -*- coding: utf-8 -*-
"""LAB 51~60 교차 검증(수학 교사 눈 · 수학 교수 눈)에서 나온 지적을 반영한다.

지적을 하나하나 직접 재어 보고, 사실인 것만 고친다.
(LAB 51 의 「noteNum 이 음수를 못 읽는다」는 지적은 사실이 아니어서 반영하지 않았다 —
 정규식이 /-?\\d+(\\.\\d+)?/ 라 "-3" 에서 -3 을 그대로 집어낸다.)

사용: python docs/LAB51_60_수업모형/fix_review.py src/40-demos.js
"""
import sys, math

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HALO = ' paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"'


# ══════════════ ① 그림의 수가 본문 주장을 반증하던 곳 ══════════════

# ── LAB 58 · 네 점이 원 위에 있지 않았다 (|OB|=58.3 |OC|=64.5 |OD|=65.1) ──
def quad58():
    O, R = (200.0, 86.0), 62.0
    ang = {'A': -90, 'B': -20, 'C': 60, 'D': 145}
    P = {k: (O[0] + R * math.cos(math.radians(v)), O[1] + R * math.sin(math.radians(v)))
         for k, v in ang.items()}
    def inner(at, u, v):
        a = math.atan2(u[1] - at[1], u[0] - at[0])
        b = math.atan2(v[1] - at[1], v[0] - at[0])
        d = abs(math.degrees(a - b)) % 360
        return min(d, 360 - d)
    s1 = inner(P['A'], P['B'], P['D']) + inner(P['C'], P['B'], P['D'])
    s2 = inner(P['B'], P['A'], P['C']) + inner(P['D'], P['A'], P['C'])
    assert abs(s1 - 180) < 0.6 and abs(s2 - 180) < 0.6, (s1, s2)
    lab = {'A': (P['A'][0], P['A'][1] - 9, 'middle', '#BE123C'),
           'B': (P['B'][0] + 10, P['B'][1] + 2, 'start', '#0B6E63'),
           'C': (P['C'][0] + 8, P['C'][1] + 14, 'start', '#BE123C'),
           'D': (P['D'][0] - 10, P['D'][1] + 14, 'end', '#0B6E63')}
    out = ['<polygon points="%s" fill="#2563EB" opacity=".10" stroke="#2563EB" stroke-width="1.8"/>'
           % ' '.join('%.1f,%.1f' % P[k] for k in 'ABCD')]
    for k in 'ABCD':
        x, y, an, col = lab[k]
        out.append('<circle cx="%.1f" cy="%.1f" r="4" fill="%s"/>' % (P[k][0], P[k][1], col))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="%s" text-anchor="%s"%s>%s</text>'
                   % (x, y, col, an, HALO, k))
    return ''.join(out)


# ── LAB 56 · 원주각 꼭짓점이 원 밖이라 두 각이 46.9° · 50.0° 로 달랐다 ──
def circ56():
    O, R = (200.0, 88.0), 62.0
    at = lambda d: (O[0] + R * math.cos(math.radians(d)), O[1] + R * math.sin(math.radians(d)))
    A, B, P1, P2 = at(140), at(40), at(200), at(310)
    def ang(v, u, w):
        a = math.atan2(u[1] - v[1], u[0] - v[0]); b = math.atan2(w[1] - v[1], w[0] - v[0])
        d = abs(math.degrees(a - b)) % 360
        return min(d, 360 - d)
    i1, i2, c = ang(P1, A, B), ang(P2, A, B), ang(O, A, B)
    assert abs(i1 - 50) < 0.3 and abs(i2 - 50) < 0.3 and abs(c - 100) < 0.3, (i1, i2, c)
    return (''.join([
        '<circle cx="200" cy="88" r="62" fill="none" stroke="#9CA3AF" stroke-width="1.6"/>',
        '<circle cx="%.1f" cy="%.1f" r="4.2" fill="#BE123C"/>' % A,
        '<circle cx="%.1f" cy="%.1f" r="4.2" fill="#BE123C"/>' % B,
        '<path d="M%.1f %.1f L200 88 L%.1f %.1f" stroke="#B45309" stroke-width="1.8" fill="none"/>' % (A + B),
        '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f" stroke="#2563EB" stroke-width="1.8" fill="none"/>' % (A + P1 + B),
        '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="1.8" fill="none"/>' % (A + P2 + B),
        '<circle cx="200" cy="88" r="3.4" fill="#111827"/>',
        '<text x="200" y="76" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle"%s>중심각 100°</text>' % HALO,
        '<text x="%.1f" y="%.1f" font-size="9.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>원주각 50°</text>' % (P1[0] - 7, P1[1] + 4, HALO),
        '<text x="%.1f" y="%.1f" font-size="9.5" font-weight="800" fill="#0B6E63"%s>원주각 50°</text>' % (P2[0] + 7, P2[1] + 4, HALO),
        '<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>두 원주각은 같을까? 중심각과는 어떤 관계일까?</text>' % HALO,
    ]))


# ── LAB 53 · 정사각형이라 했는데 직사각형, ab 두 조각 넓이가 달랐다 ──
def sq53():
    a, b, x0, y0 = 80, 40, 100, 30
    assert a * b == a * b
    parts = [(x0, y0, a, a, '#2563EB', '#1D4ED8', 'a²', 14),
             (x0 + a, y0, b, a, '#0E9384', '#0B6E63', 'ab', 12),
             (x0, y0 + a, a, b, '#0E9384', '#0B6E63', 'ab', 12),
             (x0 + a, y0 + a, b, b, '#B45309', '#92400E', 'b²', 12)]
    out = []
    for X, Y, W, H, f, t, nm, sz in parts:
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="3" fill="%s" opacity=".26" stroke="%s" stroke-width="1.6"/>'
                   % (X, Y, W, H, f, f))
        out.append('<text x="%d" y="%d" font-size="%d" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (X + W / 2, Y + H / 2 + sz * 0.35, sz, t, HALO, nm))
    out.append('<path d="M%d %d H%d" stroke="#111827" stroke-width="1.2"/>' % (x0, y0 - 8, x0 + a + b))
    out.append('<text x="%d" y="%d" font-size="10" font-weight="800" fill="#111827" text-anchor="middle"%s>a + b</text>'
               % (x0 + (a + b) / 2, y0 - 12, HALO))
    out.append('<text x="300" y="86" font-size="11.5" font-weight="800" fill="#111827"%s>(a+b)²</text>' % HALO)
    out.append('<text x="300" y="108" font-size="11" fill="#6B7280"%s>= a² + 2ab + b²</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>ab 조각이 두 개 — 그것이 2ab 다</text>' % HALO)
    return ''.join(out)


# ── LAB 59 · 그림의 «이상치» 가 울타리(Q3+1.5IQR=420) 안이었다 ──
def box59():
    Q1, Q3 = 110, 190
    IQR = Q3 - Q1
    fence = Q3 + 1.5 * IQR          # 310
    out = [
        '<path d="M60 92 H%d" stroke="#111827" stroke-width="1.6"/>' % Q1,
        '<rect x="%d" y="70" width="%d" height="44" rx="3" fill="#2563EB" opacity=".22" stroke="#2563EB" stroke-width="1.8"/>' % (Q1, IQR),
        '<path d="M150 70 V114" stroke="#BE123C" stroke-width="2.2" stroke-linecap="round"/>',
        '<path d="M%d 92 H250" stroke="#111827" stroke-width="1.6"/>' % Q3,
        '<path d="M60 80 V104 M250 80 V104" stroke="#111827" stroke-width="1.6"/>',
        '<path d="M%d 60 V124" stroke="#B45309" stroke-width="1.4" stroke-dasharray="4 3"/>' % fence,
        '<text x="%d" y="54" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle"%s>Q3 + 1.5 × IQR</text>' % (fence, HALO),
        '<circle cx="340" cy="92" r="5" fill="#BE123C"/>',
        '<text x="150" y="62" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>중앙값</text>' % HALO,
        '<text x="150" y="132" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>가운데 절반이 이 상자 안</text>' % HALO,
        '<text x="340" y="76" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>이상치</text>' % HALO,
        '<text x="200" y="26" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>울타리 밖으로 나가야 «이상치»다</text>' % HALO,
        '<text x="200" y="158" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>기준은 눈이 아니라 «상자 끝에서 상자 길이의 1.5배»</text>' % HALO,
    ]
    assert 340 > fence
    return ''.join(out)


# ══════════════ ② 글·판정 고치기 ══════════════
MOVES = [
 # ─ LAB 58 ② : 네 각의 합 360° 는 어느 사각형에서나 참이라 180° 가 나오지 않는다 ─
 ("""  {t:'생각 — 두 합을 <b>더해</b> 보세요',
   f:'(∠A+∠C) + (∠B+∠D) = {0} ° · 사각형 네 각의 합과 같으면 1 → {1}',""",
  """  {t:'생각 — 두 합이 각각 <b>180°</b> 인지 확인하세요',
   f:'∠A + ∠C = {0} ° · 180° 와의 차 = {1}',"""),
 ("""     if(Math.abs(got[0]-(mem.ac+mem.bd))>2) return {ok:false, msg:'①에 적은 두 합을 더하세요.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'사각형 네 각의 합은 360° 입니다. 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 둘을 더하면 360°, 그러니 각각은 <b>180°</b> 입니다.'};""",
  """     if(Math.abs(got[0]-mem.ac)>2) return {ok:false, msg:'①에 적은 ∠A + ∠C 를 그대로 넣으세요.'};
     if(Math.abs(got[1]-(mem.ac-180))>2) return {ok:false, msg:'그 값에서 180 을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 합이 <b>각각 180°</b> 입니다. 네 각의 합이 360° 인 것은 <b>어느 사각형에서나</b> 그렇지만, 그 360° 가 180° 씩으로 <b>갈라지는</b> 것은 다른 이야기입니다. 무엇이 그렇게 만드는지 ③에서 확인합니다.'};"""),

 # ─ LAB 54 : 중학 삼각비는 예각에서만 정의된다 ─
 ("'sin²θ + cos²θ = 1 은 <b>어떤 각에서나</b> 성립한다 — 피타고라스 정리를 빗변 1 로 쓴 것이다'",
  "'sin²θ + cos²θ = 1 은 <b>0° < θ < 90° 인 어떤 각에서나</b> 성립한다 — 피타고라스 정리를 빗변 1 로 쓴 것이다'"),
 ("'sin²θ + cos²θ = 1 이 피타고라스 정리와 같은 말임을 그림으로 설명하기'",
  "'0° < θ < 90° 에서 sin²θ + cos²θ = 1 이 피타고라스 정리와 같은 말임을 그림으로 설명하기'"),
 # LAB 54 적용 — 문제가 「왜 그 수인가」로 시작했으니 적용도 그 줄기로 되돌린다
 ("""  q:'새 문제 — <b>sin² 30° + cos² 30°</b> 의 값은?',
  a:1, tol:0.02,
  why:'(1/2)² + (√3/2)² = 1/4 + 3/4 = 1. 어떤 각에서도 sin²θ + cos²θ = 1 입니다.',
  hint:'피타고라스 정리를 떠올리세요.' },""",
  """  q:'새 문제 — 한 변이 2 인 정삼각형을 반으로 자르면 밑변 1 · 빗변 2 · 높이 √3 인 직각삼각형이 됩니다. 이 삼각형에서 <b>cos 60°</b> 의 값은?',
  a:0.5, tol:0.02,
  why:'cos 60° = 밑변 ÷ 빗변 = 1 ÷ 2 = 0.5. 외워서 아는 값이 아니라 <b>정삼각형을 반으로 자른 그림에서 읽어 낸</b> 값입니다.',
  hint:'cos 는 «밑변 ÷ 빗변» 입니다. 그림에서 두 변을 찾으세요.' },"""),

 # ─ LAB 55 적용 : 보간값과 참값이 넷째 자리에서 같아 오차가 0 으로 보였다 ─
 ("""  q:'새 문제 — sin 30° = 0.5000, sin 32° = 0.5299 입니다. <b>sin 31°</b> 를 선형보간으로 어림하면? (소수 넷째 자리)',
  a:0.5150, tol:0.0006,
  why:'두 값의 가운데이므로 (0.5000 + 0.5299) ÷ 2 = 0.51495 ≈ 0.5150. 실제 값 0.5150 과 거의 같습니다.',
  hint:'두 값의 평균을 구하세요.' },""",
  """  q:'새 문제 — sin 30° = 0.5000, sin 50° = 0.7660 입니다. <b>sin 40°</b> 를 선형보간으로 어림하면? (소수 넷째 자리)',
  a:0.6330, tol:0.0006,
  why:'(0.5000 + 0.7660) ÷ 2 = 0.6330 입니다. 참값은 0.6428 이므로 어림이 <b>0.0098 만큼 작습니다.</b> sin 곡선이 위로 볼록해서 두 점을 이은 직선이 곡선 <b>아래</b>를 지나기 때문입니다 — 구간이 넓을수록 이 차이가 커집니다.',
  hint:'두 값의 평균을 구한 뒤, 참값과 견주어 어느 쪽이 큰지도 생각해 보세요.' },"""),

 # ─ LAB 53 : b = 10 − a 라서 (a+b)² 이 늘 100, 적용 답도 100 이었다 ─
 ("""  q:'새 문제 — <b>(7 + 3)²</b> 을 전개해 계산하면? (a² + 2ab + b² 를 써서)',
  a:100, tol:0.5,
  why:'49 + 2·7·3 + 9 = 49 + 42 + 9 = 100. 물론 10² = 100 과 같습니다.',
  hint:'a = 7, b = 3 을 공식에 넣으세요.' },""",
  """  q:'새 문제 — <b>(12 + 5)²</b> 을 전개해 계산하면? (a² + 2ab + b² 를 써서)',
  a:289, tol:0.5,
  why:'144 + 2·12·5 + 25 = 144 + 120 + 25 = 289. 17² = 289 와 같습니다 — 2ab 인 120 을 빠뜨리면 169 가 되어 크게 어긋납니다.',
  hint:'a = 12, b = 5 를 공식에 넣으세요. 2ab 를 빠뜨리지 마세요.' },"""),
 # LAB 53 ③ : 2ab 는 a 와 10−a 에서 같은 값이라 «바뀌었는지» 를 못 잰다
 ("     mem.a2=a2; mem.ab=ab; mem.b2=b2;\n     return {ok:true, msg:'기록했습니다 — 네 조각 중 ab 가 <b>두 개</b>입니다.'};",
  "     mem.a2=a2; mem.ab=ab; mem.b2=b2; mem.a=a;\n     return {ok:true, msg:'기록했습니다 — 네 조각 중 ab 가 <b>두 개</b>입니다.'};"),
 ("     if(Math.abs(ab-mem.ab)<0.5) return {ok:false, msg:'값이 그대로입니다 — a 를 바꾸세요.'};",
  "     if(Math.abs(a-mem.a)<0.5) return {ok:false, msg:'a 가 그대로입니다 — a 를 바꾸세요.'};"),

 # ─ LAB 56 : 문제 문장이 예상 1번의 답을 미리 말해 버렸다 ─
 ("q:'축구 골대를 향해 공을 찰 때, <b>어느 자리</b>에서 차면 골대가 가장 넓어 보일까요? 놀랍게도 원 위에서는 <b>어디서 봐도 똑같이</b> 보이는 자리들이 있습니다.',",
  "q:'축구 골대를 향해 공을 찰 때, 좌우로 자리를 옮기면 골대가 <b>더 넓어 보일까요, 그대로일까요?</b> 그리고 <b>왜</b> 그럴까요?',"),

 # ─ LAB 57 ② : 물음에 답을 괄호로 적어 두어 ③ 이 베끼기가 되었다 ─
 ("{t:'생각 — <b>OP² − PA²</b> 을 구해 보세요 (그것이 반지름의 제곱입니다)',",
  "{t:'생각 — <b>OP² − PA²</b> 을 구해 보세요. 이 값이 무엇인지는 ③에서 판단합니다',"),

 # ─ LAB 59 : 이상치 기준 서술이 「IQR 의 1.5배를 넘으면」 으로 잘못 줄어 있었다 ─
 ("hint:'힌트 — 상자의 길이(IQR)의 1.5배를 넘어가면 이상치로 봅니다. 중앙값은 순서만 보므로 잘 흔들리지 않습니다.' },",
  "hint:'힌트 — 상자의 <b>끝에서</b> 상자 길이의 1.5배보다 더 멀리 벗어나면(Q3 + 1.5 × IQR 위, Q1 − 1.5 × IQR 아래) 이상치로 봅니다. 중앙값은 순서만 보므로 잘 흔들리지 않습니다.' },"),

 # ─ LAB 60 적용 : 0.8 − 0.2 단순 뺄셈이라 판단이 평가되지 않았다 ─
 ("""  q:'새 문제 — 자료 스무 개의 r 이 <b>0.8</b> 이었는데 점 하나를 빼자 <b>0.2</b> 가 되었습니다. 두 값의 <b>차</b>는?',
  a:0.6, tol:0.02,
  why:'0.8 − 0.2 = 0.6. 점 하나가 상관계수를 0.6 이나 움직였다면, 그 결론은 그 점 하나에 기대고 있던 것입니다.',
  hint:'두 값을 빼세요.' },""",
  """  q:'새 문제 — 자료 스무 개의 r 이 <b>0.8</b> 이었는데 점 하나를 빼자 <b>0.2</b> 가 되었습니다. 결론을 뒤집은 그 자료는 전체의 몇 <b>%</b> 일까요?',
  a:5, tol:0.5,
  why:'1 ÷ 20 = 0.05 — 전체의 <b>5 %</b> 입니다. 스무 개 중 단 하나가 «관계가 있다»는 결론을 혼자 떠받치고 있었다는 뜻입니다.',
  hint:'한 개는 스무 개 중 몇 %인가요?' },"""),
]

# ─ 8줄 → 5줄 (한 차시 45~50분에 들어가게) ─
EIGHT = ['51', '52', '53', '55', '56', '58', '59', '60']


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'Q3 + 1.5 × IQR' in h and '정삼각형을 반으로 자르면 밑변 1' in h:
        sys.stdout.write('이미 반영됨\n')
        return

    def swap_svg(no, body):
        """LESSON[no].problem.svg 의 <svg> 안쪽을 통째로 갈아 끼운다."""
        nonlocal h
        import re as _re
        m = _re.search(r'LESSON\[%d\]=\{' % no, h)
        i = h.find('svg:`', m.end()); j = h.find('`', i + 5)
        svg = h[i + 5:j]
        a = svg.index('>') + 1
        b = svg.rindex('</svg>')
        h = h[:i + 5] + svg[:a] + body + svg[b:] + h[j:]

    swap_svg(53, sq53())
    swap_svg(56, circ56())
    swap_svg(58, quad58())
    swap_svg(59, box59())
    # LAB 60 — 기저 10점이 이미 r = 0.71 이라 «점 하나로 뒤집힌다» 가 성립하지 않았다
    old60 = '[[70,120],[92,112],[108,124],[124,108],[140,118],[156,104],[172,114],[188,100],[204,110],[220,96]]'
    new60 = '[[70,108],[92,116],[108,104],[124,118],[140,106],[156,114],[172,110],[188,112],[204,106],[220,116]]'
    assert h.count(old60) == 1
    h = h.replace(old60, new60, 1)

    n = 0
    for a, b in MOVES:
        assert h.count(a) == 1, '못 찾음: ' + a[:60]
        h = h.replace(a, b, 1)
        n += 1

    for no in EIGHT:
        pass
    m8 = h.count("8줄 이상 기록하세요")
    h = h.replace("8줄 이상 기록하세요", "5줄 이상 기록하세요")

    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('그림 5장 다시 계산 · 글·판정 %d곳 · 「8줄」→「5줄」 %d곳\n' % (n, m8))


if __name__ == '__main__':
    main(sys.argv[1])
