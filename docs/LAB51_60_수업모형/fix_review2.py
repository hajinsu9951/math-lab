# -*- coding: utf-8 -*-
"""교차 검증 2차 반영 — 실험 화면이 내주는 값과 노트의 통과 조건.

고치는 것
  LAB 55  「이웃 칸과의 차」 열이 늘 «—» 였다 → 5° 작은 각과의 차를 실제로 계산한다
  LAB 56  P 를 옮겨도 세 열이 전부 같아 기록표가 채워지지 않았고, ③ 이 «P 가 움직였는지» 를
          볼 수단이 없어 가만히 앉아 ②의 수를 베껴도 통과했다 → 「P 위치」 열을 더한다
  LAB 59  「움직인 값」 이 실제로는 자료의 최댓값이었고, 아래쪽으로 만든 이상치를 못 잡았다
  LAB 57·60  ① 에서 이미 끝까지 끌어 둔 학생이 ③ 에서 영영 막혔다 → ① 에 출발 범위를 둔다

사용: python docs/LAB51_60_수업모형/fix_review2.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

MOVES = [
 # ══ LAB 55 tbDemo — 「이웃 칸과의 차」 를 실제로 계산한다 ══
 ("""    read:()=>{ const th=+$('#tbT').value;
      return [th+'°', Math.sin(th*Math.PI/180).toFixed(4), '—']; } };""",
  """    read:()=>{ const th=+$('#tbT').value, s=Math.sin(th*Math.PI/180);
      /* 「이웃 칸과의 차」 — 눈금이 5° 이므로 바로 앞 칸(5° 작은 각)과의 차를 낸다.
         늘 «—» 로 두면 미션과 탐구 질문이 빈 칸을 보라고 시키는 셈이 된다. */
      const prev = th>=5 ? Math.sin((th-5)*Math.PI/180) : null;
      return [th+'°', s.toFixed(4), prev===null?'—':(s-prev).toFixed(4)]; } };"""),
 ("""    cols:['θ','sin θ','이웃 칸과의 차'],
    hint:'힌트 — 90° 근처에서 sin 은 거의 안 늘어납니다.""",
  """    cols:['θ','sin θ','앞 칸(5° 작은 각)과의 차'],
    hint:'힌트 — 90° 근처에서 sin 은 거의 안 늘어납니다."""),
 ("  cols:['θ','sin θ','이웃 칸과의 차'],\n  hint:'힌트 — sin 곡선은 직선이 아닙니다.",
  "  cols:['θ','sin θ','앞 칸(5° 작은 각)과의 차'],\n  hint:'힌트 — sin 곡선은 직선이 아닙니다."),

 # ══ LAB 56 iaDemo — P 가 움직였는지 볼 수 있게 「P 위치」 를 더한다 ══
 ("""    cols:['중심각','원주각','나눗셈'],""",
  """    cols:['중심각','원주각','나눗셈','P 위치'],"""),
 ("""    read:()=>{ const A=pos(S.a),B=pos(S.b),P=pos(S.p); const c=central(), i=angAt(P,A,B);
      return [c.toFixed(0)+'°', i.toFixed(1)+'°', (c/i).toFixed(2)]; } };""",
  """    read:()=>{ const A=pos(S.a),B=pos(S.b),P=pos(S.p); const c=central(), i=angAt(P,A,B);
      /* P 위치를 함께 내준다 — 이것이 없으면 P 를 옮겨도 세 열이 모두 같아
         기록표에 한 줄밖에 쌓이지 않고, 「어디서 봐도 같다」 를 확인할 길이 없다. */
      return [c.toFixed(0)+'°', i.toFixed(1)+'°', (c/i).toFixed(2), S.p.toFixed(0)+'°']; } };"""),
 ("  cols:['중심각','원주각','나눗셈'],\n  hint:'힌트 — 중심과 P 를 이으면",
  "  cols:['중심각','원주각','나눗셈','P 위치'],\n  hint:'힌트 — 중심과 P 를 이으면"),
 # LAB 56 — 원주각 정리의 조건(P 가 호 AB 의 반대쪽)을 밝힌다
 ("{t:'점 P 를 원 위에서 <b>끌어 옮겨</b> 보세요. 원주각이 달라지나요?', re:'원주각'},",
  "{t:'점 P 를 원 위에서 <b>끌어 옮겨</b> 보세요 — 단, <b>두 빨간 점 사이가 아닌 쪽</b> 호 위에서만. 원주각이 달라지나요?', re:'원주각'},"),
 ("'P 를 여러 자리로 옮겨 가며 5줄 이상 기록하세요.',",
  "'P 를 <b>두 빨간 점 사이가 아닌 쪽</b> 호 위에서 여러 자리로 옮겨 가며 5줄 이상 기록하세요.',"),

 # ══ LAB 59 bxDemo — 위아래 양쪽 울타리를 보고, 열 이름을 바로잡는다 ══
 ("""    cols:['움직인 값','이상치?','평균','중앙값'],""",
  """    cols:['가장 바깥 값','이상치?','평균','중앙값'],"""),
 ("""    read:()=>{ const v=S.v, Q1=q(v,.25), Q3=q(v,.75), IQR=Q3-Q1;
      const mx=Math.max(...v), out=mx>Q3+1.5*IQR;
      return [mx, out?'이상치':'수염 안', (v.reduce((a,b)=>a+b,0)/v.length).toFixed(1), q(v,.5).toFixed(1)]; } };""",
  """    read:()=>{ const v=S.v, Q1=q(v,.25), Q3=q(v,.75), IQR=Q3-Q1;
      /* 울타리는 위아래 양쪽이다. 위만 보면 아래로 끌어 만든 이상치를 영영 못 잡는다. */
      const mx=Math.max(...v), mn=Math.min(...v);
      const hi=mx>Q3+1.5*IQR, lo=mn<Q1-1.5*IQR;
      const far=(mx-Q3)>=(Q1-mn)?mx:mn;                 // 상자에서 더 멀리 떨어진 쪽
      return [far, (hi||lo)?'이상치':'수염 안', (v.reduce((a,b)=>a+b,0)/v.length).toFixed(1), q(v,.5).toFixed(1)]; } };"""),
 ("  cols:['움직인 값','이상치?','평균','중앙값'],\n  hint:'힌트 — 상자의 <b>끝에서</b>",
  "  cols:['가장 바깥 값','이상치?','평균','중앙값'],\n  hint:'힌트 — 상자의 <b>끝에서</b>"),
 ("f:'움직인 값 = {0} · 평균 = {1} · 중앙값 = {2}',",
  "f:'가장 바깥 값 = {0} · 평균 = {1} · 중앙값 = {2}',"),
 ("do:'① 이상치가 되기 전의 값·평균·중앙값 적기",
  "do:'① 이상치가 되기 전의 가장 바깥 값·평균·중앙값 적기"),

 # ══ LAB 56 노트 — ① 에 P 위치를 저장하고, ③ 은 P 가 실제로 움직였을 때만 ══
 ("""     mem.c=c; mem.i=i;
     return {ok:true, msg:'기록했습니다 — 두 각의 관계를 구해 봅시다.'};""",
  """     mem.c=c; mem.i=i; mem.pp=noteNum(r[3]);
     return {ok:true, msg:'기록했습니다 — 두 각의 관계를 구해 봅시다.'};"""),
 ("""     if(mem.k===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const i=noteNum(r[1]), k=noteNum(r[2]);""",
  """     if(mem.k===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dp=Math.abs(noteNum(r[3])-mem.pp);
     if(Math.min(dp,360-dp)<25)
       return {ok:false, msg:'P 가 아직 ①의 자리 근처입니다 — 호를 따라 훨씬 멀리 끌어 옮긴 뒤에 적으세요.'};
     const i=noteNum(r[1]), k=noteNum(r[2]);"""),

 # ══ LAB 57 ① — 낮은 자리에서 시작해야 ③ 에서 더 올릴 자리가 남는다 ══
 ("""     const d=noteNum(r[0]), L=noteNum(r[1]);
     if(!(L>0.2)) return {ok:false, msg:'접선이 생기지 않았습니다. 위성을 원 밖으로 끌어내세요.'};""",
  """     const d=noteNum(r[0]), L=noteNum(r[1]);
     if(!(L>0.2)) return {ok:false, msg:'접선이 생기지 않았습니다. 위성을 원 밖으로 끌어내세요.'};
     if(!(d<4.2)) return {ok:false, msg:'①은 <b>낮은 자리</b>에서 적습니다 — 위성을 내려 OP 를 4.2 보다 작게 하세요. 높이는 ③에서 올립니다.'};"""),

 # ══ LAB 60 ① — 가까운 자리에서 시작해야 ③ 에서 더 멀리 보낼 수 있다 ══
 ("""     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.02||Math.abs(got[1]-b)>0.02)
       return {ok:false, msg:'화면은 '+r[1]+' 과 '+r[2]+' 입니다.'};
     mem.a=a; mem.b=b;""",
  """     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(!(Math.abs(a-b)<0.15))
       return {ok:false, msg:'①은 이상치를 <b>점들 가까이</b> 둔 채 적습니다 — 지금은 두 r 이 너무 벌어져 있습니다. 「다시」로 지우고 점 무리 가까이에 찍으세요. 멀리 보내는 것은 ③에서 합니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.02||Math.abs(got[1]-b)>0.02)
       return {ok:false, msg:'화면은 '+r[1]+' 과 '+r[2]+' 입니다.'};
     mem.a=a; mem.b=b;"""),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'P 위치' in h and '가장 바깥 값' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    n = 0
    for a, b in MOVES:
        c = h.count(a)
        assert c == 1, '%d곳 발견: %s' % (c, a[:70].replace('\n', ' / '))
        h = h.replace(a, b, 1)
        n += 1
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('실험 화면·노트 %d곳 반영\n' % n)


if __name__ == '__main__':
    main(sys.argv[1])
