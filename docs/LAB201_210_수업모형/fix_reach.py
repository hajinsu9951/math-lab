# -*- coding: utf-8 -*-
"""LAB 201 · 208 — 미션이 실제로 «닿을 수 있게» 고친다.

슬라이더는 min + n×step 자리에만 멈춘다. 이것을 셈에 넣지 않아 두 곳이 어긋났다.

① LAB 208 — 민감도가 작으면 미션을 끝낼 수 없었다
   · 매출이 가장 큰 가격은 30/s 인데 가격 슬라이더의 끝이 14 다.
     s = 1 이면 30 이라서 「매출이 가장 큰 가격으로」 를 눌러도 14 에 멈추고,
     탄력성이 0.30 이어서 «여기서 매출이 가장 큽니다» 가 끝내 뜨지 않는다 → 미션 ① 불가
   · 탄력성 > 1.5 는 p > 36/s 를 뜻해 s = 2.5 면 14.4 — 역시 슬라이더 밖이다 → 미션 ② 불가
   그래서 민감도의 밑을 2.5 로 올리고(최대 가격이 12 이하로 들어온다),
   둘째 알림의 문턱을 1.2 로 낮춘다(p > 32.7/s 이므로 어디서나 닿는다).
   수학은 그대로다 — 탄력성이 1 을 넘으면 올릴수록 매출이 줄어든다는 사실은 바뀌지 않는다.

② LAB 201 — 노트 ③ 이 화면에 없는 수를 물었다
   「a 만 최적으로」 는 a 를 3.36 으로 넣지만 눈금이 0.05 라 3.35 에 멈추고,
   「함께 최적으로」 는 1.98 · 5.06 을 넣지만 2.00 · 5.0 에 멈춘다.
   그래서 「1.98 × 3 + b」 를 물으면 화면의 a 와 다른 수로 계산하게 된다.
   화면의 a 와 b 로 평균점을 확인하게 바꾼다 (2.00 × 3 + 5.0 = 11 — y 의 평균과 꼭 맞는다).

사용: python docs/LAB201_210_수업모형/fix_reach.py src/40-demos.js docs/LAB201_210_수업모형/notes.py
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# ── 실험 화면 (src/40-demos.js 에만 있다) ───────────────────────────
DEMO = [
    ("${slider('elS','손님의 민감도',1,6,0.5,3,'')}",
     "${slider('elS','손님의 민감도',2.5,6,0.5,3,'')}"),
    ("+ (el>1.5 ? `<b style=\"color:#7C3AED\">탄력성이 1 보다 큽니다",
     "+ (el>1.2 ? `<b style=\"color:#7C3AED\">탄력성이 1 보다 큽니다"),
]

# ── 탐구 노트 (두 파일에 똑같이 들어 있다) ─────────────────────────
NOTE = [
    # LAB 201 ③ — 화면의 a·b 로 평균점을 확인한다
    ("""  {t:'판단 — 절편이 지나는 점을 확인하고 고르세요 (x 의 평균 3, y 의 평균 11)',
   f:'절편 b = {0} · 1.98 × 3 + b = {1} · y 의 평균 11 과 같으면 1, 다르면 0 → {2}',""",
     """  {t:'판단 — 최적 직선이 자료의 평균점을 지나는지 확인하고 고르세요 (x 의 평균 3, y 의 평균 11)',
   f:'a = {0} · 절편 b = {1} · a × 3 + b = {2}',"""),
    ("""     if(Math.abs(got[0]-b)>0.06) return {ok:false, msg:'절편은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(1.98*3+b))>0.08) return {ok:false, msg:'1.98 × 3 에 절편 '+r[1]+' 을 더해 보세요.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'방금 구한 값을 y 의 평균 11 과 견주세요.'};""",
     """     if(Math.abs(got[0]-noteNum(r[0]))>0.06) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.06) return {ok:false, msg:'절편은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(noteNum(r[0])*3+b))>0.08) return {ok:false, msg:r[0]+' × 3 에 절편 '+r[1]+' 을 더해 보세요.'};
     if(Math.abs(noteNum(r[0])*3+b-11)>0.25) return {ok:false, msg:'평균점을 지나지 않습니다 — 「a 와 b 를 함께 최적으로」 를 다시 누르세요.'};"""),
    # LAB 208 ① — 눈금 탓에 최대 가격에 꼭 떨어지지 않는다. 탄력성으로 함께 조인다
    ("""     if(Math.abs(p-bp)>0.06) return {ok:false, msg:'가격이 '+r[0]+' 입니다 — 「매출이 가장 큰 가격으로」 를 누르세요 (최대 가격 '+r[4]+').'};""",
     """     if(Math.abs(p-bp)>0.3||Math.abs(el-1)>0.1) return {ok:false, msg:'가격이 '+r[0]+' · 탄력성이 '+r[3]+' 입니다 — 「매출이 가장 큰 가격으로」 를 누르세요 (최대 가격 '+r[4]+').'};"""),
    # LAB 208 ② — 화면 알림과 같은 문턱으로
    ("""     if(!(el>1.5)) return {ok:false, msg:'탄력성이 '+r[3]+' 입니다 — 가격을 더 올려 1.5 보다 크게 만드세요.'};""",
     """     if(!(el>1.2)) return {ok:false, msg:'탄력성이 '+r[3]+' 입니다 — 가격을 더 올려 1.2 보다 크게 만드세요.'};"""),
    # LAB 208 ③ — ① 과 같은 조건으로
    ("""     if(Math.abs(p-bp)>0.06) return {ok:false, msg:'「매출이 가장 큰 가격으로」 를 다시 눌러 주세요 (지금 가격 '+r[0]+').'};""",
     """     if(Math.abs(p-bp)>0.3||Math.abs(el-1)>0.1) return {ok:false, msg:'「매출이 가장 큰 가격으로」 를 다시 눌러 주세요 (지금 가격 '+r[0]+' · 탄력성 '+r[3]+').'};"""),
]


def apply(path, pairs, must):
    h = open(path, encoding='utf-8').read()
    n = 0
    for a, b in pairs:
        c = h.count(a)
        if c == 0 and b in h:
            continue                      # 이미 반영됨
        assert c == 1, '%s — 앵커가 %d곳:\n%s' % (path, c, a[:80])
        h = h.replace(a, b, 1)
        n += 1
    open(path, 'w', encoding='utf-8').write(h)
    return n


if __name__ == '__main__':
    src, notes = sys.argv[1], sys.argv[2]
    a = apply(src, DEMO + NOTE, True)
    b = apply(notes, NOTE, True)
    sys.stdout.write('실험 화면·노트 %d곳 · notes.py %d곳 교정\n' % (a, b))
