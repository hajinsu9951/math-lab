# -*- coding: utf-8 -*-
"""LAB 81~90 — 7단계 수업 모형 + 탐구 노트.

사용: python docs/LAB81_90_수업모형/patch_lab81_90.py src/40-demos.js
"""
import sys, math

# ── LAB 81 · 2배로 키우면 넓이는 4배 ─────────────────────────────
def scale81():
    out = []
    ox, oy, w, h = 46.0, 138.0, 44.0, 30.0
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="1.6"/>'
               % (ox, oy - h, w, h))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">1배</text>' % (ox + w / 2, oy + 16))
    ox2 = 128.0
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#0E9384" opacity=".22" stroke="#0E9384" stroke-width="1.6"/>'
               % (ox2, oy - 2 * h, 2 * w, 2 * h))
    # 안쪽에 1배짜리 네 장이 들어간다는 것을 격자로 보인다
    out.append('<path d="M%.1f %.1f H%.1f M%.1f %.1f V%.1f" stroke="#0E9384" stroke-width="1" opacity=".7"/>'
               % (ox2, oy - h, ox2 + 2 * w, ox2 + w, oy - 2 * h, oy))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">길이 2배 — 넓이는 4배</text>'
               % (ox2 + w, oy + 16))
    ox3 = 242.0
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#B45309" opacity=".18" stroke="#B45309" stroke-width="1.6"/>'
               % (ox3, oy - 3 * h, 3 * w, 3 * h))
    for i in range(1, 3):
        out.append('<path d="M%.1f %.1f H%.1f" stroke="#B45309" stroke-width="1" opacity=".6"/>' % (ox3, oy - i * h, ox3 + 3 * w))
        out.append('<path d="M%.1f %.1f V%.1f" stroke="#B45309" stroke-width="1" opacity=".6"/>' % (ox3 + i * w, oy - 3 * h, oy))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle">3배 — 9배</text>'
               % (ox3 + 1.5 * w, oy + 16))
    return ''.join(out)


K81 = scale81()

# ── LAB 83 · 3-4-5 직각삼각형과 세 정사각형 ──────────────────────
def pyth83():
    u = 13.0
    A = (150.0, 118.0)                      # 직각인 꼭짓점
    B = (A[0] + 4 * u, A[1])                # 밑변 4
    C = (A[0], A[1] - 3 * u)                # 높이 3
    out = ['<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="#2563EB" opacity=".16" stroke="#2563EB" stroke-width="2"/>'
           % (A[0], A[1], B[0], B[1], C[0], C[1])]
    # 밑변 위의 정사각형 (아래쪽)
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#B45309" opacity=".18" stroke="#B45309" stroke-width="1.4"/>'
               % (A[0], A[1], 4 * u, 4 * u))
    out.append('<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#92400E" text-anchor="middle">16</text>'
               % (A[0] + 2 * u, A[1] + 2 * u + 4))
    # 높이 위의 정사각형 (왼쪽)
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#0E9384" opacity=".18" stroke="#0E9384" stroke-width="1.4"/>'
               % (A[0] - 3 * u, A[1] - 3 * u, 3 * u, 3 * u))
    out.append('<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#0B6E63" text-anchor="middle">9</text>'
               % (A[0] - 1.5 * u, A[1] - 1.5 * u + 4))
    # 빗변 위의 정사각형 — B 에서 C 로 가는 변을 밖으로 회전
    dx, dy = C[0] - B[0], C[1] - B[1]
    px, py = -dy, dx                       # 왼쪽 법선 (바깥쪽)
    P = [(B[0], B[1]), (C[0], C[1]), (C[0] + px, C[1] + py), (B[0] + px, B[1] + py)]
    out.append('<polygon points="%s" fill="#BE123C" opacity=".14" stroke="#BE123C" stroke-width="1.4"/>'
               % ' '.join('%.1f,%.1f' % p for p in P))
    cx = sum(p[0] for p in P) / 4
    cy = sum(p[1] for p in P) / 4
    out.append('<text x="%.1f" y="%.1f" font-size="12" font-weight="800" fill="#BE123C" text-anchor="middle">25</text>' % (cx, cy + 4))
    out.append('<path d="M%.1f %.1f h9 v-9" fill="none" stroke="#111827" stroke-width="1.4"/>' % (A[0], A[1] - 0))
    return ''.join(out)


Y83 = pyth83()

# ── LAB 84 · 세 변으로 각의 종류를 가른다 ────────────────────────
def conv84():
    out = []
    for k, (a, b, c, nm, col) in enumerate((
            (6, 8, 9, '예각', '#0E9384'),
            (6, 8, 10, '직각', '#2563EB'),
            (6, 8, 11, '둔각', '#BE123C'))):
        ox = 24 + k * 126
        s = 8.2
        # c 를 밑변으로 두고 a·b 로 꼭짓점을 찾는다
        x = (c * c + a * a - b * b) / (2.0 * c)
        y = math.sqrt(max(0.0, a * a - x * x))
        bx, by = ox + (108 - c * s) / 2, 128.0
        P = [(bx, by), (bx + c * s, by), (bx + x * s, by - y * s)]
        out.append('<rect x="%d" y="26" width="108" height="112" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        out.append('<polygon points="%s" fill="%s" opacity=".16" stroke="%s" stroke-width="1.8"/>'
                   % (' '.join('%.1f,%.1f' % p for p in P), col, col))
        out.append('<text x="%d" y="152" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle">%d · %d · %d — %s</text>'
                   % (ox + 54, col, a, b, c, nm))
    out.append('<text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle">각도기를 대지 않고 세 변만으로 가른다</text>')
    return ''.join(out)


C84 = conv84()

# ── LAB 86 · 곱의 법칙 3 × 2 = 6 ─────────────────────────────────
def count86():
    out = []
    for i in range(3):
        y = 44 + i * 34
        out.append('<rect x="52" y="%d" width="56" height="24" rx="5" fill="#2563EB" opacity=".20" stroke="#2563EB" stroke-width="1.3"/>' % (y - 16))
        out.append('<text x="80" y="%d" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">김밥%d</text>' % (y, i + 1))
        for j in range(2):
            ty = 40 + (i * 2 + j) * 19
            out.append('<path d="M108 %d Q160 %d 212 %d" fill="none" stroke="#9CA3AF" stroke-width="1.1"/>' % (y - 4, (y - 4 + ty) / 2, ty))
            out.append('<rect x="212" y="%d" width="112" height="15" rx="4" fill="#0E9384" opacity=".16" stroke="#0E9384" stroke-width="1"/>' % (ty - 11))
            out.append('<text x="268" y="%d" font-size="9.5" font-weight="800" fill="#0B6E63" text-anchor="middle">김밥%d · 음료%d</text>' % (ty, i + 1, j + 1))
    out.append('<text x="352" y="%d" font-size="13" font-weight="800" fill="#BE123C" text-anchor="middle">6</text>' % 92)
    out.append('<text x="352" y="%d" font-size="9.5" fill="#6B7280" text-anchor="middle">가지</text>' % 108)
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">김밥 «그리고» 음료 — 갈래마다 다시 갈라진다</text>')
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">3 × 2 = 6 — 이어서 고르면 «곱하기»</text>')
    return ''.join(out)


N86 = count86()

# ── LAB 87 · 2배 모형은 8배 무겁다 ───────────────────────────────
def cube87():
    def box(ox, oy, s, col, op):
        d = s * 0.42
        F = [(ox, oy), (ox + s, oy), (ox + s, oy - s), (ox, oy - s)]
        T = [(ox + d, oy - s - d), (ox + s + d, oy - s - d)]
        R = [(ox + s + d, oy - d)]
        p = []
        p.append('<polygon points="%s" fill="%s" opacity="%s" stroke="%s" stroke-width="1.4"/>'
                 % (' '.join('%.1f,%.1f' % q for q in F), col, op, col))
        p.append('<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s" opacity="%s" stroke="%s" stroke-width="1.4"/>'
                 % (F[3][0], F[3][1], T[0][0], T[0][1], T[1][0], T[1][1], F[2][0], F[2][1], col, str(float(op) * 0.6), col))
        p.append('<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s" opacity="%s" stroke="%s" stroke-width="1.4"/>'
                 % (F[1][0], F[1][1], R[0][0], R[0][1], T[1][0], T[1][1], F[2][0], F[2][1], col, str(float(op) * 0.35), col))
        return ''.join(p)

    out = [box(56, 132, 30, '#2563EB', '.34'), box(150, 132, 60, '#0E9384', '.26'), box(272, 132, 90, '#B45309', '.20')]
    for x, t, col in ((71, '1', '#1D4ED8'), (180, '8', '#0B6E63'), (317, '27', '#92400E')):
        out.append('<text x="%d" y="156" font-size="11" font-weight="800" fill="%s" text-anchor="middle">부피 %s배</text>' % (x, col, t))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">길이 1 · 2 · 3 배 — 부피는 1 · 8 · 27 배</text>')
    return ''.join(out)


B87 = cube87()

# ── LAB 88 · 동전 세 개 여덟 가지 ────────────────────────────────
def comp88():
    CASES = ['앞앞앞', '앞앞뒤', '앞뒤앞', '뒤앞앞', '앞뒤뒤', '뒤앞뒤', '뒤뒤앞', '뒤뒤뒤']
    out = []
    for k, c in enumerate(CASES):
        x = 30 + (k % 4) * 88
        y = 44 + (k // 4) * 44
        none = '앞' not in c
        col = '#BE123C' if none else '#2563EB'
        out.append('<rect x="%d" y="%d" width="76" height="30" rx="6" fill="%s" opacity="%s" stroke="%s" stroke-width="1.4"/>'
                   % (x, y, col, '.24' if none else '.13', col))
        out.append('<text x="%d" y="%d" font-size="11.5" font-weight="800" fill="%s" text-anchor="middle">%s</text>'
                   % (x + 38, y + 20, col, c))
    out.append('<text x="200" y="26" font-size="10.5" fill="#6B7280" text-anchor="middle">«적어도 하나 앞면» 을 직접 세면 일곱 칸</text>')
    out.append('<text x="200" y="146" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">반대쪽 «하나도 앞면이 아니다» 는 한 칸뿐</text>')
    out.append('<text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">1 − 1/8 = 7/8 — 세는 대신 «빼면» 된다</text>')
    return ''.join(out)


M88 = comp88()

# ── LAB 90 · 조건은 새로운 전체 ──────────────────────────────────
def cond90():
    out = []
    out.append('<rect x="30" y="34" width="150" height="104" rx="8" fill="#9CA3AF" opacity=".14" stroke="#9CA3AF" stroke-width="1.4"/>')
    out.append('<text x="105" y="28" font-size="10.5" font-weight="800" fill="#6B7280" text-anchor="middle">전체 24명</text>')
    for k in range(24):
        x = 42 + (k % 6) * 23
        y = 48 + (k // 6) * 23
        col = '#BE123C' if k < 5 else '#9CA3AF'
        out.append('<circle cx="%d" cy="%d" r="7" fill="%s" opacity=".55"/>' % (x, y, col))
    out.append('<text x="105" y="152" font-size="10.5" font-weight="800" fill="#6B7280" text-anchor="middle">5 / 24 ≒ 0.208</text>')
    out.append('<rect x="238" y="46" width="128" height="80" rx="8" fill="#2563EB" opacity=".14" stroke="#2563EB" stroke-width="1.6"/>')
    out.append('<text x="302" y="38" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">조건: 여학생 12명</text>')
    for k in range(12):
        x = 254 + (k % 4) * 28
        y = 64 + (k // 4) * 24
        col = '#BE123C' if k < 5 else '#2563EB'
        out.append('<circle cx="%d" cy="%d" r="7" fill="%s" opacity=".55"/>' % (x, y, col))
    out.append('<text x="302" y="152" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">5 / 12 ≒ 0.417</text>')
    out.append('<path d="M186 88 H230" stroke="#B45309" stroke-width="2"/>')
    out.append('<path d="M224 83 L230 88 L224 93" fill="none" stroke="#B45309" stroke-width="2"/>')
    out.append('<text x="208" y="78" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle">좁힌다</text>')
    return ''.join(out)


D90 = cond90()


LESSONS = """LESSON[81]={
 title:'2배로 키우면 4배 무거워진다 — 닮음과 축척',
 problem:{
  q:'지도의 축척이 <b>1 : 50,000</b> 입니다. 지도에서 1 cm 는 실제 500 m — 여기까지는 쉽습니다. 그런데 <b>지도에서 1 cm² 인 땅</b> 의 실제 넓이는 얼마일까요? 여기서 실수가 아주 잦습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="길이를 1·2·3 배로 키우면 넓이가 1·4·9 배가 되는 그림">
    __K81__
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">길이를 k 배 하면 넓이는 몇 배가 될까</text>
    <text x="200" y="168" font-size="10.5" fill="#6B7280" text-anchor="middle">가로도 k 배 · 세로도 k 배 — 그래서 k × k</text>
  </svg>`,
  sit:'닮음비 <b>k</b> 를 바꾸면 <b>둘레 배율</b> 과 <b>넓이 배율</b> 이 따로 계산되고, <b>k²</b> 과 나란히 놓입니다. 둘이 언제나 같은지 직접 확인할 수 있습니다.'
 },
 predict:{
  q:['길이를 2배로 키우면 넓이는 몇 배가 될지 예상하세요.',
     '둘레는 몇 배가 될까요? 넓이와 왜 다를까요?',
     '지도에서 1 cm² 가 실제 얼마일지 예상해 적으세요.'] },
 missions:[
  {t:'k 를 바꿔 <b>둘레 배율</b> 과 <b>넓이 배율</b> 을 견주어 보세요.', re:'배율'},
  {t:'<b>넓이 배율</b> 과 <b>k²</b> 이 같은지 보세요.', re:'k'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 배율을 <b>기록</b>하고, k² 을 <b>계산</b>하고, k 를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 k 와 넓이 배율 적기 ② k 를 직접 제곱해 견주기 ③ k 를 바꿔도 늘 같은지 확인',
   hand:'길이가 k 배일 때 넓이가 k² 배인 까닭을 «가로도 세로도 k 배»로 설명하기'}],
 inquiry:{
  id:'sm81', title:'2배로 키우면 4배 — 닮음과 축척',
  q:['k 를 바꿔 가며 8줄 이상 기록하세요.',
     '「둘레 배율」과 「넓이 배율」을 견주세요. 왜 다른가요?',
     '지도에서 넓이를 읽을 때 실수가 잦은 까닭을 손으로 설명하세요.'],
  cols:['닮음비 k','둘레 배율','넓이 배율','k²','일치?'],
  hint:'힌트 — 축척은 «길이»의 비율입니다. 지도에서 넓이를 읽을 때 실수가 잦은 이유가 바로 이 제곱입니다.' },
 apply:{
  q:'새 문제 — 축척 <b>1 : 50,000</b> 인 지도에서 <b>1 cm²</b> 인 땅의 실제 넓이는 몇 <b>km²</b> 일까요?',
  a:0.25, tol:0.01,
  why:'1 cm 가 50,000 cm = 0.5 km 이므로 1 cm² 는 0.5 × 0.5 = 0.25 km² 입니다. 길이는 5만 배지만 넓이는 25억 배입니다.',
  hint:'길이를 먼저 km 로 바꾼 뒤 제곱하세요.' },
 demo(root){ return scaleMapDemo(root); }
};

LESSON[82]={
 title:'빔프로젝터의 원리 — 닮음의 중심',
 problem:{
  q:'빔프로젝터를 <b>뒤로 물리면</b> 화면이 커집니다. 그림은 하나도 일그러지지 않고 <b>통째로</b> 커집니다. 어떻게 모양이 그대로일 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="한 점에서 뻗은 빛이 작은 삼각형을 큰 삼각형으로 확대하는 그림">
    <circle cx="44" cy="96" r="5.4" fill="#BE123C"/>
    <text x="44" y="82" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">O</text>
    <polygon points="140,64 176,112 142,124" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="1.6"/>
    <polygon points="284,40 356,136 288,160" fill="#0E9384" opacity=".18" stroke="#0E9384" stroke-width="1.8"/>
    <path d="M44 96 L356 40" stroke="#B45309" stroke-width="1.2"/>
    <path d="M44 96 L356 136" stroke="#B45309" stroke-width="1.2"/>
    <path d="M44 96 L288 160" stroke="#B45309" stroke-width="1.2"/>
    <text x="158" y="140" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle">원래</text>
    <text x="320" y="30" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="middle">2배</text>
    <text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle">한 점 O 에서 쏜 빛을 따라 모든 점을 같은 비율로 밀어낸다</text>
  </svg>`,
  sit:'닮음의 중심 <b>O</b> 와 배율 <b>k</b> 를 바꾸면 <b>OA</b> · <b>OA′</b> 와 그 비, 그리고 <b>변의 비</b> 가 함께 계산됩니다. 두 비가 언제나 같은지 확인합니다.'
 },
 predict:{
  q:['빔프로젝터를 두 배 멀리 놓으면 화면은 몇 배가 될지 예상하세요.',
     '모양이 일그러지지 않는 까닭을 예상해 적으세요.',
     'O 에서 각 점까지의 거리와 변의 길이 중 무엇이 먼저 k 배가 될까요?'] },
 missions:[
  {t:'k 를 바꿔 <b>OA′/OA</b> 가 어떻게 되는지 보세요.', re:'OA'},
  {t:'<b>변의 비</b> 와 견주어 보세요. 두 값이 같나요?', re:'비'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 비를 <b>기록</b>하고, k 와 <b>견주고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 k·OA·OA′ 적기 ② OA′/OA 를 직접 나눠 구하기 ③ 변의 비와 견주기',
   hand:'«O 에서 쏜 빛을 따라 k 배 밀어낸다»로 모양이 그대로인 까닭을 설명하기'}],
 inquiry:{
  id:'hm82', title:'빔프로젝터의 원리 — 닮음의 중심',
  q:['k 와 O 를 바꿔 가며 8줄 이상 기록하세요.',
     '「OA′/OA」와 「변의 비」를 견주세요. 무엇이 같나요?',
     'O 를 옮겨도 두 비가 같은 까닭을 손으로 설명하세요.'],
  cols:['k','OA','OA′','OA′/OA','변의 비'],
  hint:'힌트 — 닮음의 위치는 «O 에서 쏜 빛을 따라 모든 점을 k배 밀어낸 것»입니다. 빛이 곧 그 연결선입니다.' },
 apply:{
  q:'새 문제 — 빔프로젝터가 <b>2 m</b> 에서 폭 <b>1 m</b> 인 화면을 만듭니다. <b>6 m</b> 로 물리면 폭은 몇 m 가 될까요?',
  a:3, tol:0.1,
  why:'거리가 3배가 되었으므로 화면의 폭도 3배 — 1 × 3 = 3 m 입니다. 넓이는 9배가 되므로 그만큼 어두워집니다.',
  hint:'거리가 몇 배가 되었나요?' },
 demo(root){ return homothetyDemo(root); }
};

LESSON[83]={
 title:'55인치의 정체 — 피타고라스 정리',
 problem:{
  q:'TV 의 «55인치» 는 <b>가로</b> 도 <b>세로</b> 도 아닌 <b>대각선</b> 길이입니다. 그런데 왜 하필 대각선을 쓸까요? 그리고 가로·세로를 알 때 대각선을 어떻게 구할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="3-4-5 직각삼각형의 세 변 위에 그린 정사각형의 넓이 9·16·25">
    __Y83__
    <text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle">세 변 위에 정사각형을 그려 넓이를 견준다</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">9 + 16 = 25 — 넓이끼리는 정확히 맞아떨어진다</text>
  </svg>`,
  sit:'가로 a 와 세로 b 를 끌면 <b>a² + b²</b> 과 <b>c²</b> 이 나란히 계산됩니다. 많은 사람이 착각하는 <b>a + b</b> 도 함께 표시되어, 대각선이 그보다 얼마나 짧은지 직접 보입니다.'
 },
 predict:{
  q:['가로 3, 세로 4 인 직사각형의 대각선 길이를 예상하세요.',
     '대각선이 «가로 + 세로»보다 짧은 까닭을 적으세요.',
     'a² + b² 과 c² 이 같을지 예상해 보세요.'] },
 missions:[
  {t:'a 와 b 를 바꿔 <b>a²+b²</b> 과 <b>c²</b> 을 견주어 보세요.', re:'c'},
  {t:'<b>a+b (함정)</b> 과 c 를 견주어 보세요. 얼마나 차이 나나요?', re:'함정'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 제곱을 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a·b·c 적기 ② a²+b² 과 c² 을 견주기 ③ a+b 와 c 의 차를 구하기',
   hand:'대각선이 «질러가는 길»임을 그림으로 설명하고, 왜 a+b 가 아닌지 쓰기'}],
 inquiry:{
  id:'py83', title:'55인치의 정체 — 피타고라스 정리',
  q:['a 와 b 를 바꿔 가며 8줄 이상 기록하세요.',
     '「a²+b²」과 「c²」 열을 견주세요. 「a+b (함정)」과 c 도 견주세요.',
     '대각선이 꺾어 가는 길보다 짧은 까닭을 손으로 설명하세요.'],
  cols:['a','b','a²+b²','c','c²','a+b (함정)'],
  hint:'힌트 — 대각선은 «꺾어 가는 길(a+b)»보다 짧은 «질러가는 길»입니다. 얼마나 짧은지가 바로 이 정리입니다.' },
 apply:{
  q:'새 문제 — 가로 <b>12</b>, 세로 <b>5</b> 인 직사각형의 <b>대각선</b> 길이는?',
  a:13, tol:0.1,
  why:'12² + 5² = 144 + 25 = 169 = 13². 꺾어 가면 17 인데 질러가면 13 입니다.',
  hint:'12² + 5² 을 구한 뒤 제곱근을 찾으세요.' },
 demo(root){ return pythaDemo(root); }
};

LESSON[84]={
 title:'직각인지 재지 않고 알기 — 피타고라스의 역',
 problem:{
  q:'목수는 각도기 없이도 <b>직각</b> 을 확인합니다. 줄자 하나로 세 변을 재기만 하면 됩니다. <b>세 변의 길이</b> 만으로 어떻게 각의 종류를 알 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="세 변 6·8·9 와 6·8·10 과 6·8·11 인 삼각형이 각각 예각·직각·둔각인 그림">
    __C84__
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">가장 긴 변의 제곱을 나머지 두 제곱의 합과 견주면 된다</text>
  </svg>`,
  sit:'세 변 a·b·c 를 바꾸면 <b>최장변²</b> 과 <b>나머지² 합</b> 이 나란히 계산되고, <b>예각·직각·둔각</b> 판정이 함께 나옵니다. 삼각형이 아예 만들어지지 않는 경우도 볼 수 있습니다.'
 },
 predict:{
  q:['변이 6·8·10 인 삼각형은 어떤 각을 가질지 예상하세요.',
     '가장 긴 변이 더 길어지면 각은 어떻게 될까요?',
     '왜 «가장 긴 변»을 기준으로 삼아야 할까요?'] },
 missions:[
  {t:'세 변을 바꿔 <b>직각</b> 이 되게 만들어 보세요.', re:'직각'},
  {t:'가장 긴 변을 늘려 <b>둔각</b> 으로 바꿔 보세요.', re:'둔각'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, 판정을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 직각일 때 최장변² 과 나머지² 합 적기 ② 최장변을 늘려 둔각으로 만들기 ③ 두 값의 차를 견주기',
   hand:'가장 큰 각이 가장 긴 변과 마주 보는 까닭을 설명하기'}],
 inquiry:{
  id:'pc84', title:'직각인지 재지 않고 알기',
  q:['세 변을 바꿔 가며 8줄 이상 기록하세요. 예각·직각·둔각을 모두 넣으세요.',
     '「최장변²」과 「나머지²합」을 견주세요. 판정이 어떻게 갈리나요?',
     '가장 큰 각이 가장 긴 변과 마주 보는 까닭을 손으로 설명하세요.'],
  cols:['a','b','c','최장변²','나머지²합','판정'],
  hint:'힌트 — 가장 큰 각은 가장 긴 변과 마주 봅니다. 판정해야 할 각이 그 각이므로 비교도 그 변이어야 합니다.' },
 apply:{
  q:'새 문제 — 세 변이 <b>6 · 8 · 11</b> 인 삼각형에서 <b>최장변² − 나머지² 합</b> 은?',
  a:21, tol:0.5,
  why:'11² = 121, 6² + 8² = 100 이므로 121 − 100 = 21. 양수이므로 <b>둔각</b> 삼각형입니다.',
  hint:'121 에서 100 을 빼세요.' },
 demo(root){ return pythaConvDemo(root); }
};

LESSON[85]={
 title:'자연수 보물찾기 — 피타고라스 수',
 problem:{
  q:'(3, 4, 5) 처럼 <b>세 변이 모두 자연수</b> 인 직각삼각형은 얼마나 있을까요? 아무렇게나 찍어서는 좀처럼 나오지 않습니다. 그런데 <b>규칙</b> 이 하나 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="3-4-5 와 5-12-13 과 8-15-17 의 세 자연수 삼각형">
    <polygon points="44,132 116,132 44,78" fill="#2563EB" opacity=".18" stroke="#2563EB" stroke-width="1.8"/>
    <text x="80" y="150" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">3 · 4 · 5</text>
    <polygon points="152,132 212,132 152,48" fill="#0E9384" opacity=".18" stroke="#0E9384" stroke-width="1.8"/>
    <text x="182" y="150" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">5 · 12 · 13</text>
    <polygon points="254,132 344,132 254,84" fill="#B45309" opacity=".18" stroke="#B45309" stroke-width="1.8"/>
    <text x="299" y="150" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle">8 · 15 · 17</text>
    <text x="200" y="26" font-size="10.5" fill="#6B7280" text-anchor="middle">세 변이 모두 자연수인 직각삼각형 — 우연일까 규칙일까</text>
  </svg>`,
  sit:'수를 넣어 <b>a² + b²</b> 이 완전제곱이 되는지 시험하고, 찾은 수가 <b>원시(서로소)</b> 인지 <b>배수</b> 인지도 표시됩니다. 홀수 n 을 넣는 규칙으로 새 보물을 계속 만들어 낼 수 있습니다.'
 },
 predict:{
  q:['(3, 4, 5) 를 두 배 한 (6, 8, 10) 도 피타고라스 수일지 예상하세요.',
     '자연수 세 쌍을 아무렇게나 찍어 직각이 될 확률이 높을지 적어 보세요.',
     '새 보물을 만드는 규칙이 있을지 짐작해 보세요.'] },
 missions:[
  {t:'수를 넣어 <b>피타고라스 수</b> 를 하나 찾아보세요.', re:'a'},
  {t:'찾은 수가 <b>원시</b> 인지 <b>배수</b> 인지 보세요.', re:'원시'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 수를 <b>기록</b>하고, 제곱합을 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 찾은 세 수와 a²+b² 적기 ② c² 과 같은지 확인 ③ 두 배 한 수도 되는지 시험',
   hand:'홀수 n 에 대해 (n, (n²−1)/2, (n²+1)/2) 가 늘 피타고라스 수인 까닭을 전개해 보이기'}],
 inquiry:{
  id:'tp85', title:'자연수 보물찾기 — 피타고라스 수',
  q:['여러 조합을 시험해 8줄 이상 기록하세요. 원시와 배수를 모두 넣으세요.',
     '「a²+b²」과 c² 을 견주세요. 원시와 배수는 무엇이 다른가요?',
     '홀수 n 으로 만드는 규칙을 손으로 전개해 보이세요.'],
  cols:['a','b','c','a²+b²','원시(서로소)?'],
  hint:'힌트 — 홀수 n 에 대해 (n, (n²−1)/2, (n²+1)/2) 는 늘 피타고라스 수입니다. n = 5, 7 로 시험해 보세요.' },
 apply:{
  q:'새 문제 — <b>(9, 40, 41)</b> 이 피타고라스 수인지 확인하려 합니다. <b>41²</b> 의 값은?',
  a:1681, tol:0.5,
  why:'41² = 1681 이고 9² + 40² = 81 + 1600 = 1681 — 같으므로 피타고라스 수입니다. 홀수 9 에서 (9² − 1)/2 = 40, (9² + 1)/2 = 41 로 만들어집니다.',
  hint:'41 × 41 을 계산하세요.' },
 demo(root){ return tripleDemo(root); }
};

LESSON[86]={
 title:'«또는»은 더하고 «그리고»는 곱한다',
 problem:{
  q:'김밥 3종과 음료 2종이 있습니다. <b>«김밥 또는 음료» 하나</b> 를 고르는 것과 <b>«김밥 그리고 음료» 세트</b> 를 고르는 것 — 경우의 수가 왜 다를까요? 하나는 <b>더하기</b>, 하나는 <b>곱하기</b> 입니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="김밥 세 갈래에서 각각 음료 두 갈래로 갈라져 여섯 가지가 되는 수형도">
    __N86__
  </svg>`,
  sit:'<b>세트</b> 와 <b>하나만</b> 을 오가며 경우를 직접 세어 봅니다. <b>법칙</b> 이름과 <b>경우의 수</b> 가 함께 표시되어, 어느 쪽이 더하기이고 어느 쪽이 곱하기인지 분명해집니다.'
 },
 predict:{
  q:['김밥 3종과 음료 2종으로 «세트»를 만들면 몇 가지일지 예상하세요.',
     '«하나만» 고르면 몇 가지일까요?',
     '두 수가 다른 까닭을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'<b>세트</b> 를 골라 경우의 수를 세어 보세요.', re:'곱'},
  {t:'<b>하나만</b> 으로 바꿔 다시 세어 보세요.', re:'합'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 경우를 <b>기록</b>하고, 수를 <b>견주고</b>, 법칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 세트일 때의 경우의 수 적기 ② 하나만일 때 다시 적기 ③ 두 수의 차를 구하기',
   hand:'«이어서 고르면 곱하기 · 둘 중 하나면 더하기»를 수형도로 설명하기'}],
 inquiry:{
  id:'ct86', title:'또는은 더하고 그리고는 곱한다',
  q:['두 상황을 오가며 기록하세요.',
     '「법칙」과 「경우의 수」를 견주세요. 무엇이 다른가요?',
     '수형도에서 «갈래마다 다시 갈라진다»가 왜 곱하기인지 손으로 설명하세요.'],
  cols:['상황','김밥 수','음료 수','법칙','경우의 수'],
  hint:'힌트 — «안 고르기»도 한 갈래입니다. 음료 갈래가 2 + 1 = 3 이 되는 이유입니다.' },
 apply:{
  q:'새 문제 — 김밥 <b>4종</b>, 음료 <b>3종</b> 에서 <b>세트</b> 를 고르면 몇 가지일까요?',
  a:12, tol:0.5,
  why:'김밥 갈래 4 개마다 음료 갈래가 3 개씩 생기므로 4 × 3 = 12 가지입니다.',
  hint:'이어서 고르면 곱하기입니다.' },
 demo(root){ return countDemo(root); }
};

LESSON[87]={
 title:'2배 모형은 8배 무겁다 — 넓이비와 부피비',
 problem:{
  q:'프라모델을 <b>2배 크기</b> 로 만들면 재료가 2배 들까요? 실제로는 <b>8배</b> 가 듭니다. 길이는 2배인데 무게는 왜 8배가 될까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="길이를 1·2·3 배로 키운 정육면체의 부피가 1·8·27 배가 되는 그림">
    __B87__
    <text x="200" y="168" font-size="10.5" fill="#6B7280" text-anchor="middle">가로·세로·높이 세 방향이 모두 k 배 — 그래서 k × k × k</text>
  </svg>`,
  sit:'닮음비 <b>k</b> 를 바꾸면 <b>길이 배율</b> · <b>겉넓이 배율</b> · <b>부피 배율</b> 이 따로 계산되고 <b>k³</b> 과 나란히 놓입니다. 세 배율이 어떻게 갈라지는지 한눈에 보입니다.'
 },
 predict:{
  q:['길이를 2배로 하면 겉넓이는 몇 배가 될지 예상하세요.',
     '부피는 몇 배가 될까요?',
     '세 배율이 서로 다른 까닭을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'k 를 바꿔 세 배율이 어떻게 갈라지는지 보세요.', re:'배율'},
  {t:'<b>부피 배율</b> 과 <b>k³</b> 을 견주어 보세요.', re:'k'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 세 배율을 <b>기록</b>하고, k³ 을 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 k 와 세 배율 적기 ② k 를 세 번 곱해 견주기 ③ k 를 바꿔도 늘 같은지 확인',
   hand:'«길이는 한 방향 · 넓이는 두 방향 · 부피는 세 방향»으로 1·2·3 제곱을 설명하기'}],
 inquiry:{
  id:'cs87', title:'2배 모형은 8배 무겁다',
  q:['k 를 바꿔 가며 8줄 이상 기록하세요.',
     '「길이 배율」·「겉넓이 배율」·「부피 배율」을 견주세요.',
     '세 배율이 k · k² · k³ 인 까닭을 손으로 설명하세요.'],
  cols:['k','길이 배율','겉넓이 배율','부피 배율','k³'],
  hint:'힌트 — 가로·세로·높이 세 방향이 모두 k배. 넓이는 두 방향, 부피는 세 방향의 곱입니다.' },
 apply:{
  q:'새 문제 — 모형을 길이로 <b>2배</b> 키우면 <b>부피</b> 는 몇 배가 될까요?',
  a:8, tol:0.1,
  why:'2 × 2 × 2 = 8 배. 그래서 재료도 무게도 8배가 듭니다.',
  hint:'세 방향 모두 2배입니다.' },
 demo(root){ return cubeScaleDemo(root); }
};

LESSON[88]={
 title:'«적어도 하나» 의 지름길 — 여사건',
 problem:{
  q:'동전 세 개를 던져 <b>«적어도 하나»</b> 가 앞면일 확률은? 하나·둘·셋인 경우를 모두 세면 일곱 가지입니다. 그런데 <b>세지 않고</b> 구하는 훨씬 빠른 길이 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="동전 세 개의 여덟 가지 중 앞면이 하나도 없는 한 가지만 붉게 표시한 그림">
    __M88__
  </svg>`,
  sit:'여덟 가지 중 «적어도 하나 앞면» 인 칸을 <b>직접 골라</b> 세어 볼 수 있고, <b>여사건으로 뒤집어</b> 보면 한 칸만 남습니다. 두 길이 각각 몇 칸을 세는지 나란히 표시됩니다.'
 },
 predict:{
  q:['동전 세 개로 «적어도 하나 앞면»인 경우가 몇 가지일지 예상하세요.',
     '그 반대는 무엇인지 한 줄로 적어 보세요.',
     '반대쪽이 몇 가지일지 예상하세요.'] },
 missions:[
  {t:'«적어도 하나 앞면» 인 칸을 <b>직접</b> 골라 세어 보세요.', re:'직접'},
  {t:'<b>여사건으로 뒤집어</b> 보세요. 몇 칸이 남나요?', re:'여사건'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 길을 <b>기록</b>하고, 칸 수를 <b>견주고</b>, 어느 쪽이 빠른지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 직접 센 칸 수 적기 ② 여사건 칸 수 적기 ③ 두 수를 더해 8 이 되는지 확인',
   hand:'«적어도 하나» 의 반대가 늘 «하나도 없다» 인 까닭을 설명하기'}],
 inquiry:{
  id:'cm88', title:'적어도 하나의 지름길 — 여사건',
  q:['직접 세는 길과 여사건으로 뒤집는 길을 모두 해 보고 기록하세요.',
     '「직접 센 칸 수」와 「여사건 칸 수」를 견주세요.',
     '«적어도 하나»의 반대가 왜 «하나도 없다»인지 손으로 설명하세요.'],
  cols:['사건','직접 센 칸 수','여사건 칸 수','확률','어느 길이 빨랐나'],
  hint:'힌트 — 「적어도 하나」의 반대는 언제나 「하나도 없다」입니다. 반대쪽이 훨씬 단순할 때 여사건이 이깁니다.' },
 apply:{
  q:'새 문제 — 동전 <b>네 개</b> 를 던질 때 «적어도 하나 앞면» 인 경우는 몇 가지일까요?',
  a:15, tol:0.5,
  why:'전체는 2⁴ = 16 가지이고 «하나도 앞면이 아니다» 는 뒤뒤뒤뒤 한 가지뿐이므로 16 − 1 = 15 가지입니다.',
  hint:'전체에서 «하나도 없다» 를 빼세요.' },
 demo(root){ return complementDemo(root); }
};

LESSON[89]={
 title:'«이제 나올 때가 됐다?» — 독립시행',
 problem:{
  q:'동전에서 <b>앞면이 세 번 연속</b> 나왔습니다. 이제 뒷면이 나올 때가 된 걸까요? 많은 사람이 그렇게 느낍니다. 그런데 동전은 <b>앞의 세 번을 기억하지 못합니다.</b>',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="앞면이 세 번 연속 나온 뒤에도 다음 한 번은 여전히 반반인 그림">
    <circle cx="70" cy="62" r="18" fill="#B45309" opacity=".30" stroke="#B45309" stroke-width="1.6"/>
    <text x="70" y="67" font-size="12" font-weight="800" fill="#92400E" text-anchor="middle">앞</text>
    <circle cx="124" cy="62" r="18" fill="#B45309" opacity=".30" stroke="#B45309" stroke-width="1.6"/>
    <text x="124" y="67" font-size="12" font-weight="800" fill="#92400E" text-anchor="middle">앞</text>
    <circle cx="178" cy="62" r="18" fill="#B45309" opacity=".30" stroke="#B45309" stroke-width="1.6"/>
    <text x="178" y="67" font-size="12" font-weight="800" fill="#92400E" text-anchor="middle">앞</text>
    <circle cx="242" cy="62" r="20" fill="none" stroke="#BE123C" stroke-width="2" stroke-dasharray="5 3"/>
    <text x="242" y="67" font-size="14" font-weight="800" fill="#BE123C" text-anchor="middle">?</text>
    <rect x="286" y="42" width="40" height="40" rx="5" fill="#2563EB" opacity=".22" stroke="#2563EB" stroke-width="1.4"/>
    <rect x="326" y="42" width="40" height="40" rx="5" fill="#2563EB" opacity=".22" stroke="#2563EB" stroke-width="1.4"/>
    <text x="306" y="67" font-size="11" font-weight="800" fill="#1D4ED8" text-anchor="middle">앞</text>
    <text x="346" y="67" font-size="11" font-weight="800" fill="#1D4ED8" text-anchor="middle">뒤</text>
    <text x="326" y="100" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">여전히 반반</text>
    <text x="200" y="132" font-size="10.5" fill="#6B7280" text-anchor="middle">동전에는 «기억» 이 없다 — 앞의 세 번은 다음 한 번에 아무 영향도 주지 않는다</text>
    <text x="200" y="156" font-size="10.5" fill="#6B7280" text-anchor="middle">그런데도 «이제 나올 때가 됐다» 고 느끼는 것 — 도박사의 오류</text>
  </svg>`,
  sit:'동전을 던져 <b>앞면 3연속 직후</b> 의 결과만 따로 모읍니다. 표본이 쌓일수록 그 비율이 어디로 가는지 직접 확인할 수 있습니다 — 느낌이 아니라 <b>모은 자료</b> 로 판정합니다.'
 },
 predict:{
  q:['앞면이 세 번 연속 나온 뒤 다음이 뒷면일 확률을 예상해 적으세요.',
     '그렇게 느끼는 까닭을 한 줄로 적어 보세요.',
     '«큰 수의 법칙» 과 «다음 한 번» 은 같은 말일까요?'] },
 missions:[
  {t:'동전을 여러 번 던져 <b>3연속 직후</b> 의 결과를 모아 보세요.', re:'3연속'},
  {t:'표본이 쌓이면 <b>그 비율</b> 이 어디로 가는지 보세요.', re:'비율'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 결과를 <b>기록</b>하고, 더 모아 <b>견주고</b>, 오류를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 표본이 적을 때의 비율 적기 ② 더 던져 표본을 늘리기 ③ 비율이 어디로 가는지 견주기',
   hand:'«독립»은 다음 한 번에 대한 말이고 «큰 수의 법칙»은 아주 많은 전체에 대한 말임을 구분해 쓰기'}],
 inquiry:{
  id:'id89', title:'이제 나올 때가 됐다? — 독립시행',
  q:['동전을 여러 번 던지며 3연속 직후의 결과를 기록하세요.',
     '표본이 늘수록 「그 비율」이 어디로 가는지 적으세요.',
     '도박사의 오류가 무엇을 섞은 것인지 손으로 설명하세요.'],
  cols:['던진 횟수','3연속 직후 앞','3연속 직후 뒤','그 비율','판정'],
  hint:'힌트 — 독립은 «다음 한 번»에 대한 말이고, 큰 수의 법칙은 «아주 많은 전체»에 대한 말입니다. 둘을 섞는 것이 도박사의 오류입니다.' },
 apply:{
  q:'새 문제 — 앞면이 <b>세 번 연속</b> 나온 뒤, 다음이 <b>앞면</b> 일 확률은 몇 <b>%</b> 일까요?',
  a:50, tol:1,
  why:'동전은 앞의 결과를 기억하지 못합니다. 매번 독립이므로 여전히 50 % 입니다.',
  hint:'동전에 «기억»이 있을까요?' },
 demo(root){ return indepDemo(root); }
};

LESSON[90]={
 title:'조건은 새로운 전체다 — 조건부확률',
 problem:{
  q:'«안경을 쓴 여학생» 일 확률과 «여학생 중에서 안경을 썼을» 확률은 <b>다릅니다.</b> 같은 사람들을 세는데 왜 값이 달라질까요? 달라지는 것은 <b>분자</b> 가 아니라 <b>분모</b> 입니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="전체 24명에서 여학생 12명으로 세상을 좁히면 같은 5명의 비율이 커지는 그림">
    __D90__
    <text x="200" y="168" font-size="10.5" fill="#6B7280" text-anchor="middle">분자는 그대로인데 분모가 줄어 — 그래서 확률이 커진다</text>
  </svg>`,
  sit:'조건을 <b>붙였다 뗐다</b> 하면 <b>분모</b> 와 <b>분자</b> 가 각각 어떻게 변하는지 보입니다. 조건을 붙일 때 확률이 <b>커지는지 작아지는지</b> 도 함께 표시됩니다.'
 },
 predict:{
  q:['조건을 붙이면 분모와 분자 중 무엇이 변할지 예상하세요.',
     '«여학생 중 안경» 과 «안경 중 여학생» 이 다른 까닭을 적어 보세요.',
     '조건을 붙이면 확률이 늘 커질까요?'] },
 missions:[
  {t:'조건을 붙여 <b>분모</b> 가 어떻게 변하는지 보세요.', re:'분모'},
  {t:'<b>분자</b> 는 어떻게 되는지 견주어 보세요.', re:'분자'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 수를 <b>기록</b>하고, 조건을 붙여 <b>견주고</b>, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 조건 없을 때의 분모·분자 적기 ② 조건을 붙여 다시 적기 ③ 분모의 변화를 견주기',
   hand:'«조건은 새로운 전체» 라는 말의 뜻을 그림으로 설명하기'}],
 inquiry:{
  id:'cp90', title:'조건은 새로운 전체다',
  q:['조건을 바꿔 가며 기록하세요.',
     '「분모」와 「분자」가 각각 어떻게 변하는지 견주세요.',
     '«조건은 새로운 전체»의 뜻을 손으로 설명하세요.'],
  cols:['조건','분모(명)','분자(명)','확률','전체 확률과 비교'],
  hint:'힌트 — 조건부확률의 «조건»은 곧 «새로운 전체»입니다. 세상을 조건 안으로 좁히고 그 안에서 다시 세는 것입니다.' },
 apply:{
  q:'새 문제 — 학생 <b>30명</b> 중 여학생이 <b>18명</b> 이고, 그중 안경을 쓴 학생이 <b>6명</b> 입니다. <b>여학생 중 안경을 썼을</b> 확률은? (소수 셋째 자리까지)',
  a:0.333, tol:0.005,
  why:'조건이 «여학생» 이므로 새로운 전체는 18명입니다. 6 ÷ 18 ≒ 0.333. 전체 30명으로 나눈 0.2 와는 다릅니다.',
  hint:'분모를 30 이 아니라 18 로 두세요.' },
 demo(root){ return condProbDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(81, '내가 키우고 · 내가 제곱하고 · 내가 판단한다',
 """  {t:'기록 — 닮음비 k 를 정한 뒤 두 배율을 적으세요',
   f:'k = {0} · 둘레 배율 = {1} · 넓이 배율 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), p=noteNum(r[1]), a=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.03) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-p)>0.03) return {ok:false, msg:'둘레 배율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-a)>0.03) return {ok:false, msg:'넓이 배율은 '+r[2]+' 입니다.'};
     mem.k=k; mem.a=a;
     return {ok:true, msg:'기록했습니다 — 둘레는 k 배인데 넓이는 다릅니다. 직접 제곱해 봅시다.'};
   }}""",
 """  {t:'생각 — k 를 <b>직접 제곱</b> 해 넓이 배율과 견주세요',
   f:'k × k = {0} · 넓이 배율과의 차 = {1}',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.k*mem.k)>0.05) return {ok:false, msg:'①의 k 를 두 번 곱하세요.'};
     if(Math.abs(got[1])>0.05) return {ok:false, msg:'그 값에서 ①의 넓이 배율을 빼세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. k 를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>k 를 바꿔</b> 다시 견준 뒤 고르세요',
   f:'새 k = {0} · 그때 넓이 배율 = {1} · k × k = {2}',
   opts:['길이가 k 배면 <b>둘레는 k 배 · 넓이는 k² 배</b> — 가로도 k 배, 세로도 k 배이기 때문',
         '넓이도 길이와 같이 k 배가 된다',
         '넓이 배율은 k 와 관계없이 정해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), a=noteNum(r[2]);
     if(Math.abs(k-mem.k)<0.15) return {ok:false, msg:'k 가 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.03||Math.abs(got[1]-a)>0.03)
       return {ok:false, msg:'지금은 k = '+r[0]+' · 넓이 배율 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-k*k)>0.05) return {ok:false, msg:'지금 k 를 두 번 곱하세요.'};
     if(pick!==0)
       return {ok:false, msg:'두 번 모두 넓이 배율이 k × k 와 같았습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>축척은 «길이»의 비율입니다.</b> 그래서 1 : 50,000 지도에서 1 cm² 는 0.5 km × 0.5 km = 0.25 km² — 5만 배가 아니라 25억 배입니다.'};
   }}""")
 +
 note(82, '내가 밀어내고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — k 를 정한 뒤 두 거리를 적으세요',
   f:'k = {0} · OA = {1} · OA′ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), oa=noteNum(r[1]), oa2=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.08) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-oa)>1.5||Math.abs(got[2]-oa2)>1.5)
       return {ok:false, msg:'화면은 OA = '+r[1]+' · OA′ = '+r[2]+' 입니다.'};
     mem.k=k; mem.oa=oa; mem.oa2=oa2;
     return {ok:true, msg:'기록했습니다 — 두 거리를 나눠 봅시다.'};
   }}""",
 """  {t:'생각 — <b>OA′ ÷ OA</b> 를 구해 k 와 견주세요',
   f:'OA′ ÷ OA = {0} · k 와의 차 = {1}',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.oa2/mem.oa)>0.06) return {ok:false, msg:'①의 OA′ 를 OA 로 나누세요.'};
     if(Math.abs(got[1])>0.08) return {ok:false, msg:'그 값에서 ①의 k 를 빼세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거리의 비가 곧 k 입니다. 변의 비는 어떨까요?'};
   }}""",
 """  {t:'판단 — <b>변의 비</b> 와 견주고, O 나 k 를 바꿔 다시 확인한 뒤 고르세요',
   f:'새 k = {0} · OA′/OA = {1} · 변의 비 = {2}',
   opts:['O 에서 <b>모든 점을 같은 비율로 밀어내므로</b> 거리의 비도 변의 비도 k 로 같다 — 그래서 모양이 그대로다',
         '변의 비는 거리의 비와 다르다',
         'O 를 옮기면 변의 비가 달라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), q=noteNum(r[3]), s=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.08) return {ok:false, msg:'지금 k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-q)>0.06||Math.abs(got[2]-s)>0.06)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'OA′/OA 가 '+r[3]+', 변의 비가 '+r[4]+' — 같습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>닮음의 위치는 «O 에서 쏜 빛을 따라 모든 점을 k배 밀어낸 것»</b> 입니다. 모든 점이 같은 비율로 밀리므로 모양이 하나도 일그러지지 않습니다.'};
   }}""")
 +
 note(83, '내가 재고 · 내가 제곱하고 · 내가 판단한다',
 """  {t:'기록 — a 와 b 를 정한 뒤 화면의 값을 적으세요',
   f:'a = {0} · b = {1} · c = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), c=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.1||Math.abs(got[1]-b)>0.1)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.02) return {ok:false, msg:'c 는 '+r[3]+' 입니다.'};
     mem.a=a; mem.b=b; mem.c=c;
     return {ok:true, msg:'기록했습니다 — 이제 제곱해서 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>a² + b²</b> 과 <b>c²</b> 을 직접 계산해 견주세요',
   f:'a² + b² = {0} · c² = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.a*mem.a+mem.b*mem.b))>0.6) return {ok:false, msg:'①의 a 와 b 를 각각 제곱해 더하세요.'};
     if(Math.abs(got[1]-mem.c*mem.c)>0.6) return {ok:false, msg:'①의 c 를 제곱하세요.'};
     if(Math.abs(got[2])>0.8) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 그런데 «a + b» 는 어떨까요?'};
   }}""",
 """  {t:'판단 — <b>a + b (함정)</b> 과 c 를 견준 뒤 고르세요',
   f:'a + b = {0} · c = {1} · a + b − c = {2}',
   opts:['대각선은 <b>제곱끼리</b> 맞아떨어진다 — 길이끼리 더하는 a + b 는 «꺾어 가는 길» 이라 늘 더 길다',
         '대각선은 a + b 와 같다',
         'a² + b² 과 (a + b)² 은 같은 값이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ab=noteNum(r[5]), c=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ab)>0.2) return {ok:false, msg:'화면의 「a+b (함정)」은 '+r[5]+' 입니다.'};
     if(Math.abs(got[1]-c)>0.05) return {ok:false, msg:'c 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(ab-c))>0.2) return {ok:false, msg:'a + b 에서 c 를 빼세요.'};
     if(!(ab-c>0.05)) return {ok:false, msg:'a 나 b 를 0 이 아닌 값으로 두세요 — 꺾어 가는 길이 있어야 견줄 수 있습니다.'};
     if(pick!==0)
       return {ok:false, msg:'a + b 가 c 보다 '+(ab-c).toFixed(2)+' 만큼 깁니다. 그런데 제곱끼리는 정확히 맞았습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>대각선은 «질러가는 길»</b> 입니다. 길이끼리는 맞지 않지만 <b>세 변 위에 그린 정사각형의 넓이</b>끼리는 정확히 맞아떨어집니다 — 그것이 피타고라스 정리입니다.'};
   }}""")
 +
 note(84, '내가 재고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 세 변을 <b>직각</b> 이 되게 맞춘 뒤 적으세요',
   f:'최장변² = {0} · 나머지² 합 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[5]).indexOf('직각')<0)
       return {ok:false, msg:'지금 «'+r[5]+'» 입니다. 세 변을 직각이 되게 맞추세요 (예: 6 · 8 · 10).'};
     const m=noteNum(r[3]), s=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.6||Math.abs(got[1]-s)>0.6)
       return {ok:false, msg:'화면은 '+r[3]+' 과 '+r[4]+' 입니다.'};
     mem.m=m; mem.s=s;
     return {ok:true, msg:'기록했습니다 — 직각일 때 두 값이 같습니다. 최장변을 늘리면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — 가장 긴 변을 늘려 <b>둔각</b> 으로 만든 뒤 두 값의 차를 구하세요',
   f:'최장변² = {0} · 나머지² 합 = {1} · 최장변² − 나머지² 합 = {2}',
   chk(got, r, mem){
     if(mem.m===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('둔각')<0)
       return {ok:false, msg:'아직 «'+r[5]+'» 입니다. 가장 긴 변을 더 늘려 둔각으로 만드세요.'};
     const m=noteNum(r[3]), s=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.6||Math.abs(got[1]-s)>0.6)
       return {ok:false, msg:'지금은 '+r[3]+' 과 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(m-s))>0.8) return {ok:false, msg:'최장변² 에서 나머지² 합을 빼세요.'};
     mem.dob=m-s;
     return {ok:true, msg:'계산했습니다 — 차가 '+mem.dob+' 로 <b>양수</b> 입니다. 이번에는 예각을 만들어 봅시다.'};
   }}""",
 """  {t:'판단 — <b>예각</b> 으로 바꿔 차를 구한 뒤 고르세요',
   f:'최장변² − 나머지² 합 = {0} · ②의 값과의 차 = {1}',
   opts:['최장변² 이 나머지² 합보다 <b>크면 둔각 · 같으면 직각 · 작으면 예각</b> — 각도기 없이 세 변만으로 갈린다',
         '세 변만으로는 각의 종류를 알 수 없다',
         '가장 짧은 변을 기준으로 견주어야 한다'],
   chk(got, r, mem, pick){
     if(mem.dob===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('예각')<0)
       return {ok:false, msg:'아직 «'+r[5]+'» 입니다. 가장 긴 변을 줄여 예각으로 만드세요.'};
     const m=noteNum(r[3]), s=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(m-s))>0.8) return {ok:false, msg:'지금은 '+r[3]+' 에서 '+r[4]+' 를 빼세요.'};
     if(Math.abs(got[1]-((m-s)-mem.dob))>1.2) return {ok:false, msg:'지금 차에서 ②의 차를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'직각일 때 0, 둔각일 때 '+mem.dob+', 예각일 때 '+(m-s)+' 였습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가장 큰 각은 가장 긴 변과 마주 봅니다.</b> 판정해야 할 각이 그 각이므로 비교도 그 변으로 해야 하고, 그래서 목수는 줄자 하나로 직각을 확인할 수 있습니다.'};
   }}""")
 +
 note(85, '내가 찾고 · 내가 제곱하고 · 내가 판단한다',
 """  {t:'기록 — 피타고라스 수를 하나 찾아 적으세요',
   f:'a = {0} · b = {1} · c = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 찾은 수가 없습니다. 수를 넣어 시험해 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), c=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5||Math.abs(got[2]-c)>0.5)
       return {ok:false, msg:'화면의 세 수는 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     mem.a=a; mem.b=b; mem.c=c; mem.kind=String(r[4]);
     return {ok:true, msg:'기록했습니다 — 이 수는 «'+mem.kind+'» 입니다. 정말 맞는지 계산해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>a² + b²</b> 과 <b>c²</b> 을 직접 계산해 견주세요',
   f:'a² + b² = {0} · c² = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.a*mem.a+mem.b*mem.b))>0.5) return {ok:false, msg:'①의 a 와 b 를 제곱해 더하세요.'};
     if(Math.abs(got[1]-mem.c*mem.c)>0.5) return {ok:false, msg:'①의 c 를 제곱하세요.'};
     if(Math.abs(got[2])>0.5) return {ok:false, msg:'두 값을 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 딱 맞습니다. 다른 수도 찾아봅시다.'};
   }}""",
 """  {t:'판단 — <b>다른 피타고라스 수</b> 를 하나 더 찾은 뒤 고르세요',
   f:'새 a = {0} · 새 c = {1} · a² + b² = {2}',
   opts:['홀수 n 에 대해 <b>(n, (n²−1)/2, (n²+1)/2)</b> 는 늘 피타고라스 수다 — 보물은 무한히 많다',
         '피타고라스 수는 (3,4,5) 와 그 배수뿐이다',
         '아무 자연수 세 개나 대체로 직각이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), c=noteNum(r[2]), s=noteNum(r[3]);
     if(Math.abs(a-mem.a)<0.5&&Math.abs(c-mem.c)<0.5)
       return {ok:false, msg:'같은 수입니다 — 다른 피타고라스 수를 찾아보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-c)>0.5)
       return {ok:false, msg:'지금은 a = '+r[0]+' · c = '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.5) return {ok:false, msg:'화면의 a²+b² 은 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'n = 5 로 (5, 12, 13), n = 7 로 (7, 24, 25) 가 나옵니다. 직접 시험해 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>(n² − 1)/2 와 (n² + 1)/2 는 1 만큼 차이 나는 두 수</b> 입니다. 제곱의 차가 n² 이 되도록 맞춘 것이라, 홀수 n 마다 새 보물이 하나씩 나옵니다.'};
   }}""")
 +
 note(86, '내가 세고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>세트</b> 를 골라 경우의 수를 적으세요',
   f:'김밥 수 = {0} · 음료 수 = {1} · 경우의 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('그리고')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「김밥 그리고 음료 (세트)」를 눌러 보세요.'};
     const g=noteNum(r[1]), d=noteNum(r[2]), n=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-g)>0.5||Math.abs(got[1]-d)>0.5)
       return {ok:false, msg:'화면은 김밥 '+r[1]+' · 음료 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-n)>0.5) return {ok:false, msg:'경우의 수는 '+r[4]+' 입니다.'};
     mem.and=n; mem.g=g; mem.d=d;
     return {ok:true, msg:'기록했습니다 — 세트는 '+n+' 가지입니다. 이 수가 어디서 나왔을까요?'};
   }}""",
 """  {t:'생각 — 두 수를 <b>곱해</b> 보고, 이번에는 <b>하나만</b> 으로 바꿔 세어 보세요',
   f:'김밥 수 × 음료 수 = {0} · «하나만» 일 때의 경우의 수 = {1}',
   chk(got, r, mem){
     if(mem.and===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('또는')<0)
       return {ok:false, msg:'「김밥 또는 음료 (하나만)」을 눌러 보세요. 지금은 «'+r[0]+'» 입니다.'};
     const n=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g*mem.d)>0.5) return {ok:false, msg:'①의 김밥 수와 음료 수를 곱하세요.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'지금 경우의 수는 '+r[4]+' 입니다.'};
     mem.or=n;
     return {ok:true, msg:'계산했습니다 — 세트는 '+mem.and+', 하나만은 '+mem.or+' 입니다.'};
   }}""",
 """  {t:'판단 — 두 수를 견주어 고르세요',
   f:'세트 = {0} · 하나만 = {1} · 두 수의 차 = {2}',
   opts:['«그리고(이어서 고름)» 는 <b>곱하기</b>, «또는(둘 중 하나)» 는 <b>더하기</b> 다 — 갈래마다 다시 갈라지느냐가 갈림길',
         '둘 다 더하기다',
         '둘 다 곱하기다'],
   chk(got, r, mem, pick){
     if(mem.or===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.and)>0.5||Math.abs(got[1]-mem.or)>0.5)
       return {ok:false, msg:'①과 ②에 적은 '+mem.and+' 와 '+mem.or+' 을 넣으세요.'};
     if(Math.abs(got[2]-(mem.and-mem.or))>0.5) return {ok:false, msg:'두 수를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'세트는 '+mem.g+' × '+mem.d+' = '+mem.and+' 였습니다. 수형도에서 갈래가 어떻게 갈라졌는지 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>수형도에서 «갈래마다 다시 갈라지면» 곱하기</b> 입니다. «안 고르기»도 한 갈래라서, 하나만 고르는 쪽의 수가 단순한 3 + 2 와 달라지는 것도 같은 이유입니다.'};
   }}""")
 +
 note(87, '내가 키우고 · 내가 곱하고 · 내가 판단한다',
 """  {t:'기록 — k 를 정한 뒤 세 배율을 적으세요',
   f:'k = {0} · 겉넓이 배율 = {1} · 부피 배율 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), s=noteNum(r[2]), v=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.08) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.08) return {ok:false, msg:'겉넓이 배율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.08) return {ok:false, msg:'부피 배율은 '+r[3]+' 입니다.'};
     mem.k=k; mem.s=s; mem.v=v;
     return {ok:true, msg:'기록했습니다 — 세 배율이 서로 다릅니다. 직접 곱해 봅시다.'};
   }}""",
 """  {t:'생각 — k 를 <b>두 번</b> 과 <b>세 번</b> 곱해 견주세요',
   f:'k × k = {0} · k × k × k = {1} · 부피 배율과의 차 = {2}',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.k*mem.k)>0.1) return {ok:false, msg:'①의 k 를 두 번 곱하세요.'};
     if(Math.abs(got[1]-mem.k*mem.k*mem.k)>0.15) return {ok:false, msg:'①의 k 를 세 번 곱하세요.'};
     if(Math.abs(got[2])>0.15) return {ok:false, msg:'k³ 에서 ①의 부피 배율을 빼세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — k² 은 겉넓이, k³ 은 부피와 맞습니다.'};
   }}""",
 """  {t:'판단 — <b>k 를 바꿔</b> 다시 확인한 뒤 고르세요',
   f:'새 k = {0} · 겉넓이 배율 = {1} · 부피 배율 = {2}',
   opts:['길이는 한 방향, 넓이는 두 방향, 부피는 세 방향 — 그래서 <b>k · k² · k³</b> 이다',
         '세 배율은 모두 k 배로 같다',
         '부피 배율은 겉넓이 배율의 두 배다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), s=noteNum(r[2]), v=noteNum(r[3]);
     if(Math.abs(k-mem.k)<0.15) return {ok:false, msg:'k 가 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.08||Math.abs(got[1]-s)>0.08||Math.abs(got[2]-v)>0.08)
       return {ok:false, msg:'지금은 '+r[0]+' · '+r[2]+' · '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'k = '+r[0]+' 일 때 겉넓이 '+r[2]+', 부피 '+r[3]+' 입니다. 직접 제곱·세제곱해 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가로·세로·높이 세 방향이 모두 k 배</b> 이기 때문입니다. 그래서 2배 모형은 8배 무겁고, 거대 곤충이 현실에 없는 이유도 같습니다 — 다리 단면(k²)보다 몸무게(k³)가 빨리 늘기 때문입니다.'};
   }}""")
 +
 note(88, '내가 세고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — «적어도 하나 앞면» 인 칸을 <b>직접</b> 골라 세어 적으세요',
   f:'직접 센 칸 수 = {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]);
     if(n<7) return {ok:false, msg:'아직 '+n+' 칸을 골랐습니다. «적어도 하나 앞면» 인 칸을 모두 고르세요 (일곱 칸).'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'화면에는 '+r[1]+' 칸으로 나와 있습니다.'};
     mem.direct=n;
     return {ok:true, msg:'기록했습니다 — 일곱 칸을 일일이 세었습니다. 더 빠른 길이 있을까요?'};
   }}""",
 """  {t:'생각 — <b>여사건으로 뒤집어</b> 본 뒤 두 수를 적으세요',
   f:'여사건 칸 수 = {0} · 직접 센 칸 수 + 여사건 칸 수 = {1}',
   chk(got, r, mem){
     if(mem.direct===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('여사건')<0)
       return {ok:false, msg:'「여사건으로 뒤집어 보기」를 눌러 보세요.'};
     const c=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.5) return {ok:false, msg:'여사건 칸 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-8)>0.5) return {ok:false, msg:'두 수를 더하면 전체 칸 수가 되어야 합니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 반대쪽은 <b>한 칸</b> 뿐입니다. 7 + 1 = 8.'};
   }}""",
 """  {t:'판단 — 두 길을 견주어 고르세요',
   f:'직접 센 칸 수 = {0} · 여사건 칸 수 = {1} · 몇 칸 덜 세었나 = {2}',
   opts:['«적어도 하나» 의 반대는 늘 «<b>하나도 없다</b>» 다 — 반대쪽이 단순할 때 <b>1 − (여사건)</b> 이 훨씬 빠르다',
         '직접 세는 것이 늘 더 정확하다',
         '여사건은 동전이 세 개일 때만 쓸 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.direct)>0.5) return {ok:false, msg:'①에 적은 '+mem.direct+' 을 넣으세요.'};
     if(Math.abs(got[1]-1)>0.5) return {ok:false, msg:'②에서 본 여사건 칸 수를 넣으세요.'};
     if(Math.abs(got[2]-(mem.direct-1))>0.5) return {ok:false, msg:'두 수를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'일곱 칸을 세는 대신 한 칸만 세면 되었습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>P(적어도 하나) = 1 − P(하나도 없다)</b> 입니다. 동전이 열 개면 직접 세는 쪽은 1023 칸이지만 여사건은 여전히 한 칸입니다.'};
   }}""")
 +
 note(89, '내가 던지고 · 내가 모으고 · 내가 판단한다',
 """  {t:'기록 — 동전을 던져 <b>3연속 직후</b> 의 결과를 모으고 적으세요',
   f:'3연속 직후 앞 = {0} · 3연속 직후 뒤 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const h=noteNum(r[1]), t=noteNum(r[2]);
     if(h+t<1) return {ok:false, msg:'아직 앞면 3연속이 나오지 않았습니다. 「20번 연달아」를 눌러 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.5||Math.abs(got[1]-t)>0.5)
       return {ok:false, msg:'화면은 앞 '+r[1]+' · 뒤 '+r[2]+' 입니다.'};
     mem.n=h+t;
     return {ok:true, msg:'기록했습니다 — 아직 표본이 '+mem.n+' 개뿐입니다. 더 모아 봅시다.'};
   }}""",
 """  {t:'생각 — 표본을 <b>더 모은</b> 뒤 비율을 적으세요',
   f:'3연속 직후 앞 = {0} · 3연속 직후 뒤 = {1} · 앞의 비율(%) = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const h=noteNum(r[1]), t=noteNum(r[2]), tot=h+t;
     if(!(tot > mem.n)) return {ok:false, msg:'표본이 아직 '+tot+' 개입니다. 더 던져 모으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.5||Math.abs(got[1]-t)>0.5)
       return {ok:false, msg:'지금은 앞 '+r[1]+' · 뒤 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-h/tot*100)>2) return {ok:false, msg:'앞 ÷ (앞+뒤) × 100 을 구하세요 — 화면에는 '+r[3]+' 로 나와 있습니다.'};
     mem.n2=tot;
     return {ok:true, msg:'계산했습니다 — 표본 '+tot+' 개에서 앞의 비율이 '+r[3]+' 입니다.'};
   }}""",
 """  {t:'판단 — 표본을 <b>여덟 개 이상</b> 모아 판정이 나오게 한 뒤 고르세요',
   f:'표본 수(앞 + 뒤) = {0} · 앞의 비율(%) = {1}',
   opts:['동전에는 <b>기억이 없다</b> — 3연속 뒤에도 다음 한 번은 여전히 반반이다',
         '3연속 뒤에는 뒷면이 나올 확률이 높아진다',
         '많이 던질수록 다음 한 번의 확률이 바뀐다'],
   chk(got, r, mem, pick){
     if(mem.n2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('부족')>=0)
       return {ok:false, msg:'«'+r[4]+'» — 3연속 직후 표본을 여덟 개 이상 모으세요.'};
     const h=noteNum(r[1]), t=noteNum(r[2]), tot=h+t;
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-tot)>0.5) return {ok:false, msg:'앞 '+r[1]+' 과 뒤 '+r[2]+' 를 더하세요.'};
     if(Math.abs(got[1]-h/tot*100)>2) return {ok:false, msg:'지금 비율은 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'3연속 직후에도 앞이 '+r[1]+', 뒤가 '+r[2]+' — 한쪽으로 쏠리지 않았습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>«독립»은 다음 한 번에 대한 말이고, «큰 수의 법칙»은 아주 많은 전체에 대한 말입니다.</b> 이 둘을 섞어 «이제 나올 때가 됐다» 고 믿는 것이 도박사의 오류입니다.'};
   }}""")
 +
 note(90, '내가 좁히고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>조건 없이</b> 전체에서 분모와 분자를 적으세요',
   f:'분모 = {0} 명 · 분자 = {1} 명',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('없음')<0)
       return {ok:false, msg:'지금 조건이 «'+r[0]+'» 입니다. 「조건 없음 — 전체에서」를 눌러 보세요.'};
     const d=noteNum(r[1]), n=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.5||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'화면은 분모 '+r[1]+' · 분자 '+r[2]+' 입니다.'};
     mem.d0=d; mem.n0=n;
     return {ok:true, msg:'기록했습니다 — 전체 '+d+' 명 중 '+n+' 명입니다. 이제 세상을 좁혀 봅시다.'};
   }}""",
 """  {t:'생각 — <b>조건을 붙인</b> 뒤 분모와 분자가 어떻게 변했는지 적으세요',
   f:'분모 = {0} 명 · 분자 = {1} 명 · 분모가 줄어든 만큼 = {2}',
   chk(got, r, mem){
     if(mem.d0===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('없음')>=0)
       return {ok:false, msg:'조건을 하나 붙여 보세요 — 「여학생이다」 나 「안경을 썼다」.'};
     const d=noteNum(r[1]), n=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.5||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'지금은 분모 '+r[1]+' · 분자 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(mem.d0-d))>0.5) return {ok:false, msg:'①의 분모에서 지금 분모를 빼세요.'};
     mem.d1=d; mem.n1=n; mem.cond=String(r[0]);
     return {ok:true, msg:'계산했습니다 — 분모는 '+(mem.d0-d)+' 명 줄었고, 분자는 '+mem.n0+' → '+n+' 입니다.'};
   }}""",
 """  {t:'판단 — 두 확률을 견주어 고르세요',
   f:'조건 없을 때의 확률 = {0} · 조건을 붙였을 때의 확률 = {1}',
   opts:['조건은 <b>새로운 전체</b> 다 — 분자는 거의 그대로인데 <b>분모가 줄어</b> 확률이 달라진다',
         '조건을 붙이면 분자가 줄어든다',
         '조건을 붙여도 확률은 그대로다'],
   chk(got, r, mem, pick){
     if(mem.d1===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('없음')>=0) return {ok:false, msg:'조건을 붙인 상태에서 고르세요.'};
     const p=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.n0/mem.d0)>0.006) return {ok:false, msg:'①의 분자를 분모로 나누세요.'};
     if(Math.abs(got[1]-p)>0.006) return {ok:false, msg:'지금 확률은 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'분자는 '+mem.n0+' → '+mem.n1+', 분모는 '+mem.d0+' → '+mem.d1+' 이었습니다. 어느 쪽이 크게 변했나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>«조건»은 세상을 그 안으로 좁히는 일</b> 입니다. 좁힌 세상 안에서 다시 세기 때문에 «안경 쓴 여학생일 확률» 과 «여학생 중 안경을 썼을 확률» 이 달라집니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[81]=' in h:
        sys.stdout.write('already applied\n')
        return
    L = (LESSONS.replace('__K81__', K81).replace('__Y83__', Y83)
         .replace('__C84__', C84).replace('__N86__', N86)
         .replace('__B87__', B87).replace('__M88__', M88).replace('__D90__', D90))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 81~90 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
