# -*- coding: utf-8 -*-
"""탐구 노트 — 학생이 「기록하고 · 생각하고 · 판단하는」 도구.

왜 다시 짰나
  앞서 만든 수학 노트는 **화면과 무관한 고정 문제(퀴즈)** 였다.
  tan 45° 를 묻든 평균을 묻든, 학생이 방금 조작한 것과 이어지지 않았다.
  그러면 「실험 따로, 계산 따로」가 되어 웹 실험이 도구가 되지 못한다.

무엇이 달라졌나 — 세 칸이 고정된 흐름을 갖는다
  ① 기록 — **지금 화면에 있는 내 값**을 그대로 옮겨 적는다.
           화면 값과 다르면 통과하지 않는다. (자료를 정확히 읽는 일이 첫 걸음이다)
  ② 생각 — 그 값으로 식을 세워 계산한다.
           정답이 고정되어 있지 않다. **내가 적은 값에서 나온 답**이어야 맞다.
  ③ 판단 — 조건을 바꿔 한 번 더 재고, 두 결과를 견주어 **보기 중 하나를 고르고 근거 수치를 적는다.**
           고르기만 해서는 통과하지 않는다 — 근거가 맞아야 한다.

  세 칸을 다 통과하면 「🏁 탐구 노트 통과」 신호가 떠 미션이 열린다.

만드는 법
  실험실마다 NOTE_SPECS 에 줄 하나만 더하면 된다. 화면을 만드는 코드는 하나다.
  카드의 chk(got, r, mem, pick) 는 {ok, msg} 를 돌려준다 —
    got  : 학생이 적은 숫자들 (분수도 읽는다)
    r    : 지금 화면의 값 (그 실험실의 api.read())
    mem  : 카드 사이에 남기는 메모 (①에서 적은 값을 ②·③이 쓴다)
    pick : 고른 보기 번호 (없으면 -1)

사용: python docs/수학노트_공통/patch_notes_core.py src/40-demos.js
"""
import sys, os

JS = r'''
/* ══ NOTE-START ══ 탐구 노트 — 기록하고 · 생각하고 · 판단하는 도구 (2026-09-22) ══
   실험실별 내용은 NOTE_SPECS 에만 적는다. 화면을 만드는 코드는 하나다. */
const NOTE_SPECS = {

 /* LAB 05 드론으로 높이 재기 — 내가 잰 각으로 내가 구한 높이, 그리고 거리를 바꿔도 같은가 */
 5:{ h:'내가 잰 값으로 · 내가 구하고 · 내가 판단한다',
  c:[
  {t:'기록 — 지금 화면에서 읽은 값을 그대로 옮겨 적으세요',
   f:'거리 d = {0} m · 조준각 θ = {1} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 잰 값이 없습니다. 조준선을 끌어 건물 꼭대기를 겨냥하세요.'};
     const d=noteNum(r[0]), th=noteNum(r[1]);
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.6||Math.abs(got[1]-th)>0.6)
       return {ok:false, msg:`화면에 지금 표시된 값과 다릅니다 — 거리 ${d} m · 각 ${th}° 입니다. 자료는 있는 그대로 옮겨 적어야 합니다.`};
     mem.d=d; mem.th=th;
     return {ok:true, msg:'기록했습니다 — 이 두 수가 오늘 실험의 자료입니다.'};
   }},
  {t:'생각 — 적은 값으로 높이를 구하세요 (정답은 내 값에서 나옵니다)',
   f:'tan θ = {0} · 높이 H = d × tan θ = {1} m',
   chk(got, r, mem){
     if(mem.d===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     const t=Math.tan(mem.th*Math.PI/180), H=mem.d*t;
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.035)
       return {ok:false, msg:`내가 적은 각 ${mem.th}° 의 tan 값을 구하세요 — 「1 m 가면 몇 m 오르나」입니다.`};
     if(Math.abs(got[1]-H)>1.3)
       return {ok:false, msg:`내가 적은 거리 ${mem.d} m 에 방금 구한 tan 을 곱하세요.`};
     mem.H1=got[1];
     return {ok:true, msg:`계산했습니다 — 내가 잰 각으로 구한 높이 ${H.toFixed(1)} m. 아직 답을 맞힌 것이 아니라 <b>내 자료로 얻은 값</b>입니다.`};
   }},
  {t:'판단 — 거리를 바꿔 다시 재고, 두 결과를 견주세요',
   f:'두 번째 거리에서 구한 높이 H₂ = {0} m · 두 높이의 차 = {1} m',
   opts:['거리가 멀수록 높이가 크게 나온다','거리를 바꿔도 높이는 거의 같다','거리가 멀수록 높이가 작게 나온다'],
   chk(got, r, mem, pick){
     if(mem.H1===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'거리를 바꾼 뒤 다시 조준하세요.'};
     const d=noteNum(r[0]), th=noteNum(r[1]);
     if(Math.abs(d-mem.d)<3)
       return {ok:false, msg:`아직 거리가 ${mem.d} m 그대로입니다. 3 m 이상 옮겨 다시 조준한 뒤 적으세요.`};
     const H2=d*Math.tan(th*Math.PI/180);
     if(!isFinite(got[0])||Math.abs(got[0]-H2)>1.6)
       return {ok:false, msg:`지금 화면의 거리 ${d} m · 각 ${th}° 로 다시 계산해 적으세요.`};
     const diff=Math.abs(got[0]-mem.H1);
     if(!isFinite(got[1])||Math.abs(got[1]-diff)>0.7)
       return {ok:false, msg:'두 높이의 차를 적으세요 — 앞에서 구한 값과 방금 구한 값의 차입니다.'};
     if(pick!==1)
       return {ok:false, msg:`두 높이의 차가 ${diff.toFixed(1)} m 입니다. 이 수를 보고 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>거리를 바꿔도 높이는 같습니다.</b> 멀어지면 각이 작아지고 tan 도 작아져 서로 상쇄되기 때문입니다. 닮은 직각삼각형이 같은 답을 주는 것, 이것이 측량의 원리입니다.'};
   }}
 ]},

 /* LAB 06 산점도와 상관계수 — 점 하나가 결론을 바꿀 수 있는가 */
 6:{ h:'점 하나가 결론을 바꿀 수 있는가',
  c:[
  {t:'기록 — 강한 관계를 만든 뒤, 지금 화면의 값을 적으세요',
   f:'점 개수 = {0} 개 · r = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'점을 세 개 이상 찍어 배치를 만드세요.'};
     const n=noteNum(r[0]), rv=noteNum(r[1]);
     if(Math.abs(rv)<0.9) return {ok:false, msg:`지금 r = ${rv.toFixed(3)} 입니다. 먼저 |r| ≥ 0.9 인 강한 관계를 만든 뒤 적으세요.`};
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-rv)>0.013)
       return {ok:false, msg:`화면의 값과 다릅니다 — 점 ${n}개 · r = ${rv.toFixed(3)}.`};
     mem.n=n; mem.r1=rv;
     return {ok:true, msg:'기록했습니다 — 이것이 「무너뜨리기 전」의 자료입니다.'};
   }},
  {t:'생각 — 점 하나만 멀리 끌어 무너뜨린 뒤, 얼마나 달라졌는지 구하세요',
   f:'무너뜨린 뒤 r₂ = {0} · 변화량 |r₁ − r₂| = {1}',
   chk(got, r, mem){
     if(mem.r1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'점을 끌어 배치를 바꾸세요.'};
     const rv=noteNum(r[1]);
     if(Math.abs(rv)>0.5) return {ok:false, msg:`아직 r = ${rv.toFixed(3)} 입니다. 점 하나를 더 멀리 끌어 |r| 을 0.5 아래로 내리세요.`};
     if(!isFinite(got[0])||Math.abs(got[0]-rv)>0.013) return {ok:false, msg:`지금 화면의 r = ${rv.toFixed(3)} 을 적으세요.`};
     const d=Math.abs(mem.r1-rv);
     if(!isFinite(got[1])||Math.abs(got[1]-d)>0.025) return {ok:false, msg:'①에 적은 r 에서 방금 적은 r 을 뺀 값(절댓값)을 적으세요.'};
     mem.r2=rv; mem.d=d;
     return {ok:true, msg:`계산했습니다 — 점 <b>하나</b>를 옮겼을 뿐인데 r 이 ${d.toFixed(2)} 만큼 움직였습니다.`};
   }},
  {t:'판단 — 「이상치 제외」를 켜고 그 점을 뺀 r 을 적은 뒤, 무엇을 말할 수 있는지 고르세요',
   f:'이상치를 뺀 r = {0}',
   opts:['점 하나가 전체 결론을 바꿀 수 있다','점 하나는 전체에 거의 영향이 없다','점이 많으면 이상치는 영향이 없다'],
   chk(got, r, mem, pick){
     if(mem.r2===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면의 값을 읽을 수 없습니다.'};
     const rx=noteNum(r[3]);
     if(!isFinite(rx)) return {ok:false, msg:'「이상치 제외」를 켜세요 — 그 점을 뺀 r 이 화면에 나타납니다.'};
     if(!isFinite(got[0])||Math.abs(got[0]-rx)>0.013)
       return {ok:false, msg:`화면의 값과 다릅니다 — 이상치를 뺀 r = ${rx.toFixed(3)}.`};
     if(pick!==0)
       return {ok:false, msg:`그 점 하나를 빼니 r 이 ${mem.r2.toFixed(3)} 에서 ${rx.toFixed(3)} 로 돌아왔습니다. 이 사실을 보고 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>점 하나가 결론을 뒤집을 수 있습니다.</b> 그래서 상관계수를 보고할 때는 산점도를 함께 봅니다. 숫자 하나만 믿으면 안 됩니다.'};
   }}
 ]},

 /* LAB 07 대푯값과 이상치 — 한 사람이 평균을 끌고 간다 */
 7:{ h:'한 사람이 평균을 끌고 간다',
  c:[
  {t:'기록 — 막대를 고르게 맞춘 뒤, 지금 화면의 값을 적으세요',
   f:'평균 = {0} · 중앙값 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'막대를 끌어 배치를 만드세요.'};
     const me=noteNum(r[1]), md=noteNum(r[2]);
     if(Math.abs(me-md)>300)
       return {ok:false, msg:`지금은 평균과 중앙값이 ${Math.abs(me-md).toFixed(0)} 만큼 벌어져 있습니다. 막대를 고르게 맞춰 둘이 거의 같아진 뒤 적으세요.`};
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-me)>3||Math.abs(got[1]-md)>3)
       return {ok:false, msg:`화면의 값과 다릅니다 — 평균 ${me} · 중앙값 ${md}.`};
     mem.me1=me; mem.md1=md;
     return {ok:true, msg:'기록했습니다 — 고른 배치에서는 두 대푯값이 거의 같습니다.'};
   }},
  {t:'생각 — 맨 오른쪽 한 명만 꼭대기로 끌어올린 뒤 다시 적고, 둘의 차를 구하세요',
   f:'평균 = {0} · 중앙값 = {1} · 평균 − 중앙값 = {2}',
   chk(got, r, mem){
     if(mem.me1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'막대를 끌어 배치를 바꾸세요.'};
     const me=noteNum(r[1]), md=noteNum(r[2]), d=me-md;
     if(d<400) return {ok:false, msg:`아직 평균과 중앙값의 차가 ${d.toFixed(0)} 입니다. 한 명만 더 높이 끌어올리세요.`};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-me)>3||Math.abs(got[1]-md)>3)
       return {ok:false, msg:`화면의 값과 다릅니다 — 평균 ${me} · 중앙값 ${md}.`};
     if(Math.abs(got[2]-d)>3) return {ok:false, msg:'방금 적은 평균에서 중앙값을 빼세요.'};
     mem.gap=d;
     return {ok:true, msg:`계산했습니다 — 한 사람만 올렸는데 평균은 ${(me-mem.me1).toFixed(0)} 만큼 따라 올라가고, 중앙값은 ${(md-mem.md1).toFixed(0)} 만큼만 움직였습니다.`};
   }},
  {t:'판단 — 「우리 회사 평균 연봉」 광고에 어느 값을 쓰는 것이 정직할까요',
   f:'근거 — 내가 구한 평균 − 중앙값 = {0}',
   opts:['평균이 정직하다','중앙값이 정직하다','둘 중 아무거나 써도 된다'],
   chk(got, r, mem, pick){
     if(mem.gap===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!isFinite(got[0])||Math.abs(got[0]-mem.gap)>3)
       return {ok:false, msg:'②에서 구한 「평균 − 중앙값」을 근거로 적으세요.'};
     if(pick!==1)
       return {ok:false, msg:`평균이 중앙값보다 ${mem.gap.toFixed(0)} 이나 높습니다. 열 명 중 아홉이 중앙값 근처인데 어느 쪽이 「보통 직원」을 말해 줍니까?`};
     return {ok:true, msg:'판단했습니다 — <b>중앙값</b>입니다. 평균은 한 사람의 큰 값에 끌려가지만 중앙값은 「몇 번째」만 보기 때문에 버팁니다. 통계를 읽을 때 늘 이것부터 확인하세요.'};
   }}
 ]},

 /* LAB 08 비밀번호와 경우의 수 — 무엇을 늘려야 벽이 높아지나 */
 8:{ h:'무엇을 늘려야 벽이 높아지나',
  c:[
  {t:'기록 — 지금 정책의 값을 화면에서 읽어 적으세요',
   f:'문자 종류 k = {0} · 자릿수 n = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'문자 종류와 자릿수를 골라 정책을 만드세요.'};
     const k=noteNum(r[0]), n=noteNum(r[1]);
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:`화면의 값과 다릅니다 — 종류 ${k} · 자릿수 ${n}.`};
     mem.k=k; mem.n=n;
     return {ok:true, msg:'기록했습니다 — 밑이 종류, 지수가 자릿수입니다.'};
   }},
  {t:'생각 — 내 정책의 경우의 수를 구하세요',
   f:'k<sup>n</sup> = {0} 가지',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     const N=Math.pow(mem.k, mem.n);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-N)/N>0.02)
       return {ok:false, msg:`${mem.k} 을 ${mem.n} 번 곱하세요. 자리마다 ${mem.k} 갈래가 다시 뻗습니다.`};
     mem.N=N;
     const sec=N/1e8;
     const dur = sec<0.01 ? '눈 깜빡할 새도 못 버팁니다'
               : sec<60 ? sec.toFixed(sec<10?1:0)+' 초면 뚫립니다'
               : sec<3600 ? (sec/60).toFixed(0)+' 분이면 뚫립니다'
               : sec<86400*365 ? (sec/3600).toFixed(sec<86400?1:0)+' 시간이면 뚫립니다'
               : (sec/(86400*365)).toExponential(1)+' 년은 버팁니다';
     return {ok:true, msg:`계산했습니다 — ${N.toExponential(2)} 가지. 초당 1억으로 두들기면 ${dur}.`};
   }},
  {t:'판단 — 자리를 늘릴까, 종류를 늘릴까. 각각 몇 배가 되는지 구한 뒤 고르세요',
   f:'자리를 하나 늘리면 {0} 배 · 종류를 하나 늘리면 {1} 배',
   opts:['자릿수를 늘리는 쪽이 훨씬 세다','종류를 늘리는 쪽이 훨씬 세다','둘이 비슷하다'],
   chk(got, r, mem, pick){
     if(mem.N===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     const byDigit=mem.k, byKind=Math.pow((mem.k+1)/mem.k, mem.n);
     if(!isFinite(got[0])||Math.abs(got[0]-byDigit)>0.05)
       return {ok:false, msg:'자리를 하나 늘리면 경우의 수에 종류 수가 한 번 더 곱해집니다.'};
     if(!isFinite(got[1])||Math.abs(got[1]-byKind)/byKind>0.04)
       return {ok:false, msg:`종류가 ${mem.k} 에서 ${mem.k+1} 로 늘면 밑이 바뀝니다 — ((k+1)/k) 를 ${mem.n} 번 곱해 보세요.`};
     const want = byDigit>byKind*1.3 ? 0 : (byKind>byDigit*1.3 ? 1 : 2);
     if(pick!==want)
       return {ok:false, msg:`내가 구한 두 배율은 ${byDigit.toFixed(2)} 배와 ${byKind.toFixed(2)} 배입니다. 이 두 수를 견주어 다시 고르세요.`};
     const why = want===0 ? '<b>자릿수</b>를 늘리는 쪽이 셉니다 — 자리는 지수를 키우기 때문입니다'
               : want===1 ? '<b>종류</b>를 늘리는 쪽이 셉니다 — 자릿수가 커서 밑의 작은 변화가 크게 증폭되기 때문입니다'
                          : '두 쪽이 비슷합니다';
     return {ok:true, msg:`판단했습니다 — 내 정책(k=${mem.k}, n=${mem.n})에서는 ${why}. 배율은 내가 쓴 정책이 정합니다 — 외울 규칙이 아니라 계산할 값입니다.`};
   }}
 ]},

 /* LAB 09 뽑기와 큰 수의 법칙 — 한 번의 운과 천 번의 안정 */
 9:{ h:'한 번의 운과 천 번의 안정',
  c:[
  {t:'기록 — 「1000명 시뮬」을 한 번 돌리고, 나온 꽝 비율을 적으세요',
   f:'꽝 비율 = {0} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'먼저 뽑아 보거나 1000명 시뮬을 돌리세요.'};
     const p=noteNum(r[3]);
     if(!isFinite(p)) return {ok:false, msg:'「1000명이 각자 200번」 시뮬을 한 번 돌리세요.'};
     if(!isFinite(got[0])||Math.abs(got[0]-p)>0.15)
       return {ok:false, msg:`화면의 값과 다릅니다 — 꽝 비율 ${p.toFixed(1)} %.`};
     mem.p1=p; mem.runs=String(r[1]);
     return {ok:true, msg:'기록했습니다 — 천 명이 각자 200번을 뽑은 결과입니다.'};
   }},
  {t:'생각 — 이론값을 구하고, 내 결과와 얼마나 차이 나는지 보세요',
   f:'0.995<sup>200</sup> × 100 = {0} % · 내 결과와의 차 = {1} %p',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     const th=Math.pow(0.995,200)*100;
     if(!isFinite(got[0])||Math.abs(got[0]-th)>0.6)
       return {ok:false, msg:'매 회 「안 나옴」이 독립으로 이어집니다 — 0.995 를 200번 곱한 값입니다.'};
     const d=Math.abs(mem.p1-th);
     if(!isFinite(got[1])||Math.abs(got[1]-d)>0.7)
       return {ok:false, msg:'①에 적은 내 결과와 방금 구한 이론값의 차를 적으세요.'};
     mem.th=th;
     return {ok:true, msg:`계산했습니다 — 이론은 ${th.toFixed(1)} %, 내 시뮬은 ${mem.p1.toFixed(1)} %. 차이는 ${d.toFixed(1)} %p 뿐입니다.`};
   }},
  {t:'판단 — 시뮬을 한 번 더 돌린 뒤 두 결과를 견주고 고르세요',
   f:'두 번째 꽝 비율 = {0} % · 두 값의 차 = {1} %p',
   opts:['돌릴 때마다 크게 달라진다','돌릴 때마다 36~37 % 근처로 모인다','돌릴수록 100 % 에 가까워진다'],
   chk(got, r, mem, pick){
     if(mem.th===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'시뮬을 한 번 더 돌리세요.'};
     if(String(r[1])===mem.runs) return {ok:false, msg:'아직 한 번만 돌렸습니다. 「1000명 시뮬」을 한 번 더 돌린 뒤 적으세요.'};
     const p2=noteNum(r[3]);
     if(!isFinite(got[0])||Math.abs(got[0]-p2)>0.15)
       return {ok:false, msg:`지금 화면의 꽝 비율 ${p2.toFixed(1)} % 를 적으세요.`};
     const d=Math.abs(p2-mem.p1);
     if(!isFinite(got[1])||Math.abs(got[1]-d)>0.3)
       return {ok:false, msg:'①에 적은 값과 방금 적은 값의 차를 적으세요.'};
     if(pick!==1)
       return {ok:false, msg:`두 번의 결과가 ${mem.p1.toFixed(1)} % 와 ${p2.toFixed(1)} % 로 ${d.toFixed(1)} %p 밖에 차이 나지 않습니다. 이 사실을 보고 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>한 사람의 결과는 들쭉날쭉하지만 천 명의 비율은 이론값 근처로 모입니다.</b> 이것이 큰 수의 법칙입니다. 그래서 「200번이면 무조건」은 틀렸고, 「대략 37 % 는 빈손」이 맞습니다.'};
   }}
 ]},

 /* LAB 10 정규분포와 표준점수 — 같은 점수라도 반이 다르면 위치가 다르다 */
 10:{ h:'같은 점수, 다른 위치',
  c:[
  {t:'기록 — 두 시험 모두 78점에 놓고, 화면의 σ 와 z 를 적으세요',
   f:'σ 수학 = {0} · σ 영어 = {1} · z 수학 = {2} · z 영어 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'점수 마커를 끌어 두 시험 모두 78점에 놓으세요.'};
     const sc=noteNums(r[1]), sg=noteNums(r[2]), z=noteNums(r[3]);
     if(Math.abs(sc[0]-78)>0.6||Math.abs(sc[1]-78)>0.6)
       return {ok:false, msg:`두 시험 모두 78점에 놓으세요 — 지금은 ${sc[0]}점 / ${sc[1]}점 입니다.`};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sg[0])>0.6||Math.abs(got[1]-sg[1])>0.6)
       return {ok:false, msg:`화면의 σ 와 다릅니다 — 수학 ${sg[0]} · 영어 ${sg[1]}.`};
     if(Math.abs(got[2]-z[0])>0.03||Math.abs(got[3]-z[1])>0.03)
       return {ok:false, msg:`화면의 z 와 다릅니다 — 수학 ${z[0].toFixed(2)} · 영어 ${z[1].toFixed(2)}.`};
     mem.sm=sg[0]; mem.se=sg[1]; mem.zm=z[0]; mem.ze=z[1];
     return {ok:true, msg:'기록했습니다 — 점수는 같은데 z 가 다릅니다. 무엇 때문일까요.'};
   }},
  {t:'생각 — z 의 뜻을 뒤집어, 반 평균을 구하세요',
   f:'평균 = 점수 − z × σ → 수학에서 {0} 점 · 영어에서 {1} 점',
   chk(got, r, mem){
     if(mem.zm===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     const mm=78-mem.zm*mem.sm, me=78-mem.ze*mem.se;
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mm)>1.5||Math.abs(got[1]-me)>1.5)
       return {ok:false, msg:'z = (점수 − 평균) ÷ σ 를 평균에 대해 풀어 보세요. 내가 적은 z 와 σ 를 씁니다.'};
     mem.mu=(mm+me)/2;
     return {ok:true, msg:`계산했습니다 — 두 반의 평균이 같습니다(약 ${mem.mu.toFixed(0)}점). 평균이 같은데도 z 가 달랐던 것입니다.`};
   }},
  {t:'판단 — σ 손잡이를 끌어 영어를 수학만큼 촘촘하게 만든 뒤 고르세요',
   f:'바뀐 영어 σ = {0} · 바뀐 영어 z = {1}',
   opts:['같은 점수라도 반이 촘촘할수록 z 가 커진다','같은 점수면 z 도 같다','반이 촘촘할수록 z 가 작아진다'],
   chk(got, r, mem, pick){
     if(mem.mu===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'σ 손잡이를 끄세요.'};
     const sg=noteNums(r[2]), z=noteNums(r[3]);
     if(Math.abs(sg[1]-mem.se)<1)
       return {ok:false, msg:`아직 영어 σ 가 ${sg[1]} 그대로입니다. 손잡이를 끌어 수학(${mem.sm})에 가깝게 줄이세요.`};
     if(!isFinite(got[0])||Math.abs(got[0]-sg[1])>0.6) return {ok:false, msg:`지금 화면의 영어 σ = ${sg[1]} 을 적으세요.`};
     if(!isFinite(got[1])||Math.abs(got[1]-z[1])>0.05) return {ok:false, msg:`지금 화면의 영어 z = ${z[1].toFixed(2)} 을 적으세요.`};
     if(pick!==0)
       return {ok:false, msg:`영어 σ 를 ${mem.se} 에서 ${sg[1]} 로 줄이니 z 가 ${mem.ze.toFixed(2)} 에서 ${z[1].toFixed(2)} 로 움직였습니다. 이 사실을 보고 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>점수만으로는 위치를 말할 수 없습니다.</b> 같은 78점이라도 반이 촘촘하면(σ 가 작으면) 평균에서 멀리 떨어진 것이라 z 가 커집니다. 표준점수는 「몇 점」이 아니라 「몇 σ 만큼 떨어졌나」입니다.'};
   }}
 ]},

 /* LAB 11 복리와 72의 법칙 — 어림이 맞는 자리와 빗나가는 자리 */
 11:{ h:'72 로 나눈 어림은 어디까지 맞나',
  c:[
  {t:'기록 — r = 6 % 로 한 해씩 진행해 두 배가 되는 해를 찾아 적으세요',
   f:'이율 r = {0} % · 두 배가 된 해 = {1} 년째',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'「한 해 진행」을 눌러 시간을 보내세요.'};
     const rr=noteNum(r[0]), db=noteNum(r[1]);
     if(!isFinite(db)) return {ok:false, msg:'아직 두 배가 되지 않았습니다. 복리가 200만을 넘을 때까지 진행하세요.'};
     if(Math.abs(rr-6)>0.4) return {ok:false, msg:`먼저 이율을 6 % 로 맞추세요 — 지금은 ${rr} % 입니다.`};
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.4||Math.abs(got[1]-db)>0.6)
       return {ok:false, msg:`화면의 값과 다릅니다 — 이율 ${rr} % · 두 배가 된 해 ${db} 년째.`};
     mem.r1=rr; mem.d1=db;
     return {ok:true, msg:'기록했습니다 — 이것이 직접 세어 본 「실측」입니다.'};
   }},
  {t:'생각 — 어림 공식과 견주세요',
   f:'72 ÷ r = {0} 년 · 실측과의 차 = {1} 년',
   chk(got, r, mem){
     if(mem.r1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     const est=72/mem.r1, d=Math.abs(mem.d1-est);
     if(!isFinite(got[0])||Math.abs(got[0]-est)>0.3) return {ok:false, msg:`72 를 ${mem.r1} 로 나누세요.`};
     if(!isFinite(got[1])||Math.abs(got[1]-d)>0.4) return {ok:false, msg:'실측 햇수와 방금 구한 어림값의 차를 적으세요.'};
     mem.e1=est; mem.gap1=d;
     return {ok:true, msg:`계산했습니다 — 어림 ${est.toFixed(1)} 년, 실측 ${mem.d1} 년. 차이는 ${d.toFixed(1)} 년뿐입니다.`};
   }},
  {t:'판단 — r = 20 %(대출 금리)로 바꿔 다시 재고 고르세요',
   f:'20 % 에서 실측 = {0} 년 · 72 ÷ 20 = {1} 년 · 차 = {2} 년',
   opts:['이율이 커질수록 72 어림은 조금씩 빗나간다','이율과 상관없이 72 어림은 언제나 정확하다','이율이 커질수록 72 어림이 더 정확해진다'],
   chk(got, r, mem, pick){
     if(mem.e1===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'이율을 바꾸고 다시 진행하세요.'};
     const rr=noteNum(r[0]), db=noteNum(r[1]);
     if(Math.abs(rr-20)>0.5) return {ok:false, msg:`이율을 20 % 로 바꾸세요 — 지금은 ${rr} % 입니다.`};
     if(!isFinite(db)) return {ok:false, msg:'아직 두 배가 되지 않았습니다. 두 배를 넘을 때까지 진행하세요.'};
     const est=72/20, d=Math.abs(db-est);
     if(!isFinite(got[0])||Math.abs(got[0]-db)>0.6) return {ok:false, msg:`화면의 실측 ${db} 년을 적으세요.`};
     if(!isFinite(got[1])||Math.abs(got[1]-est)>0.2) return {ok:false, msg:'72 를 20 으로 나누세요.'};
     if(!isFinite(got[2])||Math.abs(got[2]-d)>0.5) return {ok:false, msg:'실측과 어림의 차를 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:`6 % 에서는 차가 ${mem.gap1.toFixed(1)} 년, 20 % 에서는 ${d.toFixed(1)} 년입니다. 두 수를 견주어 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>72 법칙은 공식이 아니라 어림입니다.</b> 이율이 작을 때는 잘 맞고 커질수록 조금씩 벌어집니다. 어림을 쓸 때는 「어디까지 믿을 수 있는지」를 함께 알아야 합니다.'};
   }}
 ]},

 /* LAB 12 로그 스케일 — 곱하기의 세계를 더하기의 세계로 */
 12:{ h:'곱하기의 세계를 더하기의 세계로',
  c:[
  {t:'기록 — 보통 눈금에서 <b>1일차</b> 점을 짚어 값을 적으세요',
   f:'일차 = {0} · 값 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'그래프의 점을 하나 짚으세요.'};
     const d=noteNum(r[0]), v=noteNum(r[1]);
     if(Math.abs(d-1)>0.4) return {ok:false, msg:`1일차 점을 짚으세요 — 지금은 ${d}일차입니다.`};
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.4||Math.abs(got[1]-v)/Math.max(1,Math.abs(v))>0.02)
       return {ok:false, msg:`화면의 값과 다릅니다 — ${d}일차 · ${v}.`};
     mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 출발점의 값입니다.'};
   }},
  {t:'생각 — <b>14일차</b> 점을 짚어 값을 적고, 며 배가 되었는지 구하세요',
   f:'14일차 값 = {0} · 1일차의 {1} 배',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'점을 짚으세요.'};
     const d=noteNum(r[0]), v=noteNum(r[1]);
     if(Math.abs(d-14)>0.4) return {ok:false, msg:`14일차 점을 짚으세요 — 지금은 ${d}일차입니다.`};
     if(!isFinite(got[0])||Math.abs(got[0]-v)/Math.max(1,Math.abs(v))>0.02)
       return {ok:false, msg:`화면의 값 ${v} 를 적으세요.`};
     const ratio=v/mem.v1;
     if(!isFinite(got[1])||Math.abs(got[1]-ratio)/ratio>0.05)
       return {ok:false, msg:'14일차 값을 1일차 값으로 나누세요.'};
     mem.ratio=ratio;
     return {ok:true, msg:`계산했습니다 — 13일 만에 <b>${ratio.toFixed(0)} 배</b>. 보통 눈금에서는 앞쪽 며칠이 바닥에 붙어 구분되지 않았던 까닭입니다.`};
   }},
  {t:'판단 — 로그 눈금으로 바꾼 뒤, 곡선이 무엇이 되는지 보고 고르세요',
   f:'근거 — 내가 구한 배수 = {0} 배',
   opts:['같은 비율로 곱해지는 자료는 로그 눈금에서 직선이 된다','로그 눈금에서도 여전히 휜 곡선이다','로그 눈금에서 자료가 뒤집힌다'],
   chk(got, r, mem, pick){
     if(mem.ratio===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'점을 짚으세요.'};
     if(String(r[3]).indexOf('제 높이')<0)
       return {ok:false, msg:'아직 보통 눈금입니다. 「로그 눈금」으로 전환한 뒤 판단하세요.'};
     if(!isFinite(got[0])||Math.abs(got[0]-mem.ratio)/mem.ratio>0.05)
       return {ok:false, msg:'②에서 구한 배수를 근거로 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'로그 눈금으로 바꾼 화면을 보세요 — 곡선이 어떤 모양이 되었습니까?'};
     return {ok:true, msg:'판단했습니다 — <b>로그 눈금은 곱하기를 더하기로 바꿉니다.</b> 같은 비율로 곱해지는 자료는 한 칸이 「몇 배」를 뜻하는 눈금에서 일정한 간격으로 올라가므로 직선이 됩니다. 지진·소리·감염자 수를 로그로 그리는 까닭입니다.'};
   }}
 ]},

 /* LAB 13 순간속도와 미분계수 — 조여들면 무엇이 남는가 */
 13:{ h:'구간을 조이면 무엇이 남는가',
  c:[
  {t:'기록 — 지금 구간의 값을 화면에서 읽어 적으세요',
   f:'h = {0} · 평균속도 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'구간의 끝점을 끌어 보세요.'};
     const h=noteNum(r[1]), avg=noteNum(r[3]);
     if(!isFinite(got[0])||!isFinite(got[1])) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.015||Math.abs(got[1]-avg)>0.05)
       return {ok:false, msg:`화면의 값과 다릅니다 — h = ${h} · 평균속도 ${avg}.`};
     mem.h1=h; mem.a1=avg;
     return {ok:true, msg:'기록했습니다 — 이것이 「구간의 평균」, 곧 할선의 기울기입니다.'};
   }},
  {t:'생각 — 끝점을 끌어 h 를 0.1 이하로 조인 뒤 다시 적고, 20 에서 얼마나 떨어졌는지 구하세요',
   f:'h = {0} · 평균속도 = {1} · 20 과의 차 = {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'끝점을 끄세요.'};
     const h=noteNum(r[1]), avg=noteNum(r[3]);
     if(h>0.1+1e-9) return {ok:false, msg:`아직 h = ${h} 입니다. 끝점을 2초 쪽으로 더 바짝 붙여 h 를 0.1 이하로 만드세요.`};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.015||Math.abs(got[1]-avg)>0.05)
       return {ok:false, msg:`화면의 값과 다릅니다 — h = ${h} · 평균속도 ${avg}.`};
     if(Math.abs(got[2]-(avg-20))>0.06) return {ok:false, msg:'방금 적은 평균속도에서 20 을 빼세요.'};
     mem.h2=h; mem.a2=avg;
     return {ok:true, msg:`계산했습니다 — h 를 ${mem.h1} 에서 ${h} 로 줄이니 평균속도가 ${mem.a1} 에서 ${avg} 로 옮겨 갔습니다.`};
   }},
  {t:'판단 — h 를 0.01 까지 더 조인 뒤 고르세요',
   f:'h = {0} · 평균속도 = {1} · 20 과의 차 = {2}',
   opts:['h 를 줄일수록 평균속도가 한 값(20)으로 조여든다','h 를 줄이면 평균속도가 0 으로 간다','h 를 줄여도 평균속도는 그대로다'],
   chk(got, r, mem, pick){
     if(mem.a2===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'끝점을 끄세요.'};
     const h=noteNum(r[1]), avg=noteNum(r[3]);
     if(h>0.02+1e-9) return {ok:false, msg:`아직 h = ${h} 입니다. 0.01 까지 조이세요.`};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.006||Math.abs(got[1]-avg)>0.05)
       return {ok:false, msg:`화면의 값과 다릅니다 — h = ${h} · 평균속도 ${avg}.`};
     if(Math.abs(got[2]-(avg-20))>0.06) return {ok:false, msg:'평균속도에서 20 을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:`20 과의 차가 ${Math.abs(mem.a2-20).toFixed(2)} 에서 ${Math.abs(avg-20).toFixed(2)} 로 줄었습니다. 이 사실을 보고 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>구간을 조일수록 평균속도가 한 값으로 조여듭니다.</b> 그 목적지가 2초에서의 순간속도이고, 할선이 접선으로 옮겨 가는 장면입니다. 미분계수는 「도착한 값」입니다.'};
   }}
 ]},

 /* LAB 14 룬 알고리즘 — 오류를 잡아내는 검사 숫자 */
 14:{ h:'무엇을 잡아내고, 무엇을 놓치는가',
  c:[
  {t:'기록 — 손대지 않은 유효한 번호의 룬 합을 적으세요',
   f:'룬 합 = {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'화면의 값을 읽을 수 없습니다.'};
     if(String(r[0]).indexOf('없음')<0)
       return {ok:false, msg:'먼저 번호를 원래대로 되돌리세요 — 아직 바꾼 자리가 남아 있습니다.'};
     const sum=noteNum(r[2]);
     if(!isFinite(got[0])||Math.abs(got[0]-sum)>0.5) return {ok:false, msg:`화면의 룬 합 ${sum} 을 적으세요.`};
     mem.s0=sum;
     return {ok:true, msg:`기록했습니다 — ${sum} 은 10 의 배수입니다. 검사 숫자는 합이 10 의 배수가 되도록 맞춰 둔 것입니다.`};
   }},
  {t:'생각 — 아무 자리나 +1 한 뒤 합을 다시 적고, 얼마나 달라졌는지 구하세요',
   f:'바뀐 룬 합 = {0} · 처음과의 차 = {1}',
   chk(got, r, mem){
     if(mem.s0===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면의 값을 읽을 수 없습니다.'};
     if(String(r[0]).indexOf('없음')>=0) return {ok:false, msg:'아직 아무 자리도 바꾸지 않았습니다. 한 자리를 +1 해 보세요.'};
     const sum=noteNum(r[2]);
     if(!isFinite(got[0])||Math.abs(got[0]-sum)>0.5) return {ok:false, msg:`화면의 룬 합 ${sum} 을 적으세요.`};
     const d=Math.abs(sum-mem.s0);
     if(!isFinite(got[1])||Math.abs(got[1]-d)>0.5) return {ok:false, msg:'①에 적은 합과의 차를 적으세요.'};
     mem.d1=d;
     return {ok:true, msg:`계산했습니다 — 합이 ${d} 만큼 움직여 10 의 배수에서 벗어났습니다. 그래서 오류로 잡힙니다.`};
   }},
  {t:'판단 — 번호를 되돌린 뒤 <b>이웃 두 자리를 맞바꿔</b> 보고 고르세요',
   f:'맞바꾼 뒤 룬 합 = {0} · 10 으로 나눈 나머지 = {1}',
   opts:['한 자리 오류도, 이웃 맞바꿈도 잡아낸다','한 자리 오류만 잡고 맞바꿈은 놓친다','둘 다 잡지 못한다'],
   chk(got, r, mem, pick){
     if(mem.d1===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면의 값을 읽을 수 없습니다.'};
     const sum=noteNum(r[2]), rem=((sum%10)+10)%10;
     if(!isFinite(got[0])||Math.abs(got[0]-sum)>0.5) return {ok:false, msg:`화면의 룬 합 ${sum} 을 적으세요.`};
     if(!isFinite(got[1])||Math.abs(got[1]-rem)>0.5) return {ok:false, msg:'합을 10 으로 나눈 나머지를 적으세요.'};
     const caught = rem!==0;
     const want = caught ? 0 : 1;
     if(pick!==want)
       return {ok:false, msg:`지금 나머지가 ${rem} 입니다 — ${caught?'0 이 아니므로 오류로 잡힌 것':'0 이므로 그냥 통과한 것'}입니다. 이 사실을 보고 다시 고르세요.`};
     return {ok:true, msg: caught
       ? '판단했습니다 — <b>2배 규칙 덕분에 이웃을 맞바꾼 것도 잡힙니다.</b> 한 자리 걸러 2배를 하기 때문에 두 자리의 역할이 서로 달라, 자리를 바꾸면 합이 달라집니다.'
       : '판단했습니다 — 이 조합은 <b>놓칩니다.</b> 룬 알고리즘도 모든 오류를 잡지는 못합니다 — 어떤 맞바꿈은 합을 그대로 두기 때문입니다. 검사 방법에는 한계가 있다는 것까지가 오늘의 결론입니다.'};
   }}
 ]},

 /* LAB 15 최소제곱 회귀 — 무엇을 가장 작게 만드는 직선인가 */
 15:{ h:'무엇을 가장 작게 만드는 직선인가',
  c:[
  {t:'기록 — 지금 내가 그은 직선의 값을 적으세요',
   f:'기울기 = {0} · 절편 = {1} · 잔차²합 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'직선을 끌어 보세요.'};
     const m=noteNum(r[0]), c=noteNum(r[1]), s=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.03||Math.abs(got[1]-c)>0.03||Math.abs(got[2]-s)>0.6)
       return {ok:false, msg:`화면의 값과 다릅니다 — 기울기 ${m} · 절편 ${c} · 잔차²합 ${s}.`};
     mem.s1=s;
     return {ok:true, msg:'기록했습니다 — 잔차²합이 「얼마나 안 맞는가」를 재는 점수입니다.'};
   }},
  {t:'생각 — 직선을 고쳐 점수를 더 낮춘 뒤, 얼마나 줄었는지 구하세요',
   f:'낮춘 잔차²합 = {0} · 줄어든 양 = {1}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'직선을 끄세요.'};
     const s=noteNum(r[2]);
     if(s>=mem.s1-0.5) return {ok:false, msg:`아직 ${s} 입니다. ①의 ${mem.s1} 보다 더 낮추세요.`};
     if(!isFinite(got[0])||Math.abs(got[0]-s)>0.6) return {ok:false, msg:`지금 화면의 잔차²합 ${s} 을 적으세요.`};
     const d=mem.s1-s;
     if(!isFinite(got[1])||Math.abs(got[1]-d)>0.8) return {ok:false, msg:'①에 적은 값에서 방금 값을 빼세요.'};
     mem.s2=s;
     return {ok:true, msg:`계산했습니다 — ${d.toFixed(1)} 만큼 줄였습니다. 직선을 고른다는 것은 이 점수를 줄이는 일입니다.`};
   }},
  {t:'판단 — 「컴퓨터 답 공개」를 누르고 격차를 본 뒤 고르세요',
   f:'컴퓨터 대비 격차 = {0} %',
   opts:['컴퓨터는 잔차²합을 가장 작게 만드는 직선을 고른다','컴퓨터는 점들을 모두 지나는 직선을 고른다','컴퓨터는 눈대중으로 고른다'],
   chk(got, r, mem, pick){
     if(mem.s2===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면의 값을 읽을 수 없습니다.'};
     const g=noteNum(r[3]);
     if(!isFinite(g)) return {ok:false, msg:'「컴퓨터 답 공개」를 누르세요 — 격차가 화면에 나타납니다.'};
     if(!isFinite(got[0])||Math.abs(got[0]-g)>1.5) return {ok:false, msg:`화면의 격차 ${g} % 를 적으세요.`};
     if(pick!==0)
       return {ok:false, msg:'컴퓨터의 직선도 점들을 다 지나지는 못합니다. 그런데도 「가장 좋은」 직선이라 부르는 까닭이 무엇일까요.'};
     return {ok:true, msg:'판단했습니다 — <b>최소제곱은 「잔차²합을 가장 작게」를 기준으로 삼은 것입니다.</b> 다른 기준을 택하면 다른 직선이 최선이 됩니다. 기준을 정하는 일이 먼저입니다.'};
   }}
 ]},

 /* LAB 16 경사하강법 — 걸음 폭과 출발점이 운명을 가른다 */
 16:{ h:'걸음 폭과 출발점이 운명을 가른다',
  c:[
  {t:'기록 — 학습률 0.1 로 바닥에 안착시킨 뒤 값을 적으세요',
   f:'학습률 η = {0} · 걸음 수 = {1} · 도착 x = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'공을 놓고 「한 걸음」을 눌러 보세요.'};
     const lr=noteNum(r[1]), st=noteNum(r[2]), x=noteNum(r[3]);
     if(String(r[4]).indexOf('이동 중')>=0) return {ok:false, msg:'아직 굴러가는 중입니다. 멈출 때까지 더 진행하세요.'};
     if(Math.abs(lr-0.1)>0.02) return {ok:false, msg:`학습률을 0.1 로 맞추세요 — 지금은 ${lr} 입니다.`};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-lr)>0.02||Math.abs(got[1]-st)>0.5||Math.abs(got[2]-x)>0.05)
       return {ok:false, msg:`화면의 값과 다릅니다 — η ${lr} · 걸음 ${st} · 도착 ${x}.`};
     mem.x1=x; mem.st1=st;
     return {ok:true, msg:'기록했습니다 — 작은 걸음으로 차근차근 내려와 바닥에 닿았습니다.'};
   }},
  {t:'생각 — 학습률을 0.95 로 바꿔 다시 굴린 뒤, 도착점이 얼마나 달라졌는지 구하세요',
   f:'도착 x = {0} · ①의 도착과의 차 = {1}',
   chk(got, r, mem){
     if(mem.x1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'공을 다시 놓고 굴리세요.'};
     const lr=noteNum(r[1]), x=noteNum(r[3]);
     if(Math.abs(lr-0.95)>0.03) return {ok:false, msg:`학습률을 0.95 로 바꾸세요 — 지금은 ${lr} 입니다.`};
     if(!isFinite(got[0])||Math.abs(got[0]-x)>0.08) return {ok:false, msg:`지금 화면의 도착 x = ${x} 를 적으세요.`};
     const d=Math.abs(x-mem.x1);
     if(!isFinite(got[1])||Math.abs(got[1]-d)>0.1) return {ok:false, msg:'①의 도착점과의 차를 적으세요.'};
     mem.far=d;
     return {ok:true, msg:`계산했습니다 — 걸음이 너무 크면 골짜기를 건너뛰어 ${d.toFixed(2)} 만큼 엉뚱한 곳에 갑니다. 빨리 가려다 못 갑니다.`};
   }},
  {t:'판단 — 왼쪽 작은 웅덩이에 공을 놓고 내려 보낸 뒤 고르세요',
   f:'그때의 도착 x = {0}',
   opts:['출발점에 따라 진짜 바닥이 아닌 곳에 갇힐 수 있다','어디서 출발해도 늘 같은 바닥에 도착한다','출발점은 걸음 수만 바꾼다'],
   chk(got, r, mem, pick){
     if(mem.far===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'공을 놓고 굴리세요.'};
     const x=noteNum(r[3]);
     if(!isFinite(got[0])||Math.abs(got[0]-x)>0.08) return {ok:false, msg:`지금 화면의 도착 x = ${x} 를 적으세요.`};
     if(String(r[4]).indexOf('웅덩이')<0)
       return {ok:false, msg:'왼쪽 작은 웅덩이 쪽에 공을 놓고 내려 보내세요 — 거기서 멈추는지 보는 것이 이 칸의 목적입니다.'};
     if(pick!==0)
       return {ok:false, msg:`①에서는 ${mem.x1} 에, 지금은 ${x} 에 멈췄습니다. 같은 규칙으로 내려왔는데 도착점이 다릅니다.`};
     return {ok:true, msg:'판단했습니다 — <b>경사하강법은 「지금 발밑의 기울기」만 보고 내려갑니다.</b> 그래서 근처 웅덩이에 갇힐 수 있습니다(지역 최솟값). 출발점을 여러 번 바꿔 보는 까닭이 여기 있습니다.'};
   }}
 ]},

 /* LAB 17 몬테카를로 π — 무작위로 얼마나 정확해지나 */
 17:{ h:'무작위를 쌓으면 얼마나 정확해지나',
  c:[
  {t:'기록 — 과녁을 직접 눌러 10발쯤 쏜 뒤 값을 적으세요',
   f:'발수 = {0} · π 추정 = {1} · 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'과녁을 눌러 몇 발 쏘아 보세요.'};
     const n=noteNum(r[0]), est=noteNum(r[3]), er=noteNum(r[4]);
     if(n<5) return {ok:false, msg:`아직 ${n} 발입니다. 10발쯤 쏘고 적으세요.`};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-est)>0.02||Math.abs(got[2]-er)>0.02)
       return {ok:false, msg:`화면의 값과 다릅니다 — ${n}발 · 추정 ${est} · 오차 ${er}.`};
     mem.n1=n; mem.e1=er;
     return {ok:true, msg:'기록했습니다 — 몇 발로는 어림도 없습니다. 이것이 출발점입니다.'};
   }},
  {t:'생각 — 1,000발까지 쏜 뒤 오차를 적고, 몇 분의 1 로 줄었는지 구하세요',
   f:'오차 = {0} · ①의 오차의 {1} 분의 1',
   chk(got, r, mem){
     if(mem.e1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'더 쏘세요.'};
     const n=noteNum(r[0]), er=noteNum(r[4]);
     if(n<900) return {ok:false, msg:`아직 ${n} 발입니다. 1,000발까지 쏘세요.`};
     if(!isFinite(got[0])||Math.abs(got[0]-er)>0.02) return {ok:false, msg:`지금 화면의 오차 ${er} 를 적으세요.`};
     const ratio=mem.e1/Math.max(er,1e-6);
     if(!isFinite(got[1])||Math.abs(got[1]-ratio)/Math.max(ratio,1)>0.25)
       return {ok:false, msg:'①의 오차를 방금 오차로 나누세요.'};
     mem.e2=er; mem.n2=n;
     return {ok:true, msg:`계산했습니다 — 발수는 약 ${(n/mem.n1).toFixed(0)} 배가 되었는데 오차는 ${ratio.toFixed(1)} 분의 1 로만 줄었습니다.`};
   }},
  {t:'판단 — 10,000발까지 쏜 뒤 오차를 적고 고르세요',
   f:'오차 = {0}',
   opts:['발수를 늘리면 오차가 줄지만, 발수에 비례할 만큼 빨리 줄지는 않는다','발수를 늘린 만큼 오차가 정비례해 줄어든다','발수를 늘려도 오차는 줄지 않는다'],
   chk(got, r, mem, pick){
     if(mem.e2===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'더 쏘세요.'};
     const n=noteNum(r[0]), er=noteNum(r[4]);
     if(n<9000) return {ok:false, msg:`아직 ${n} 발입니다. 10,000발까지 쏘세요.`};
     if(!isFinite(got[0])||Math.abs(got[0]-er)>0.02) return {ok:false, msg:`지금 화면의 오차 ${er} 를 적으세요.`};
     if(pick!==0)
       return {ok:false, msg:`발수가 10배 될 때 오차는 10분의 1 이 아니라 그보다 천천히 줄었습니다(${mem.e2} → ${er}). 이 사실을 보고 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>무작위로 쌓는 방법은 느리게 정확해집니다.</b> 오차는 대략 발수의 제곱근에 반비례해 줄어듭니다 — 자릿수 하나를 더 맞히려면 발수를 100배로 늘려야 합니다.'};
   }}
 ]},

 /* LAB 18 코사인 유사도 — 방향을 재는 심판과 거리를 재는 심판 */
 18:{ h:'방향을 재는 심판과 거리를 재는 심판',
  c:[
  {t:'기록 — 내 화살표를 김(4, 2)과 같은 방향으로 맞춘 뒤 적으세요',
   f:'내 벡터 x = {0} · y = {1} · 코사인 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'화살표를 끌어 보세요.'};
     const v=String(r[0]).replace(/[()]/g,'').split(','), x=noteNum(v[0]), y=noteNum(v[1]);
     const cs=noteNum(r[3]);
     if(cs<0.995) return {ok:false, msg:`지금 코사인이 ${cs.toFixed(3)} 입니다. 김(4, 2)과 같은 방향이 되도록 더 맞추세요.`};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.15||Math.abs(got[1]-y)>0.15||Math.abs(got[2]-cs)>0.01)
       return {ok:false, msg:`화면의 값과 다릅니다 — (${x}, ${y}) · 코사인 ${cs.toFixed(3)}.`};
     mem.x=x; mem.y=y; mem.c1=cs;
     return {ok:true, msg:'기록했습니다 — 길이는 달라도 방향이 같으면 코사인은 1 입니다.'};
   }},
  {t:'생각 — 내 벡터로 코사인을 직접 계산하세요 (상대는 김 = (4, 2))',
   f:'내적 4x + 2y = {0} · 내 벡터의 크기 √(x²+y²) = {1} · 코사인 = 내적 ÷ (크기 × √20) = {2}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     const dot=4*mem.x+2*mem.y, len=Math.hypot(mem.x,mem.y), cs=dot/(len*Math.sqrt(20));
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dot)>0.25) return {ok:false, msg:`내가 적은 (${mem.x}, ${mem.y}) 로 4x + 2y 를 구하세요.`};
     if(Math.abs(got[1]-len)>0.15) return {ok:false, msg:'x² 과 y² 을 더한 뒤 제곱근을 구하세요.'};
     if(Math.abs(got[2]-cs)>0.02) return {ok:false, msg:'내적을 두 크기의 곱으로 나누세요. √20 ≈ 4.47 입니다.'};
     mem.calc=cs;
     return {ok:true, msg:`계산했습니다 — 손으로 구한 ${cs.toFixed(3)} 이 화면의 값과 같습니다. 코사인은 <b>내적을 길이로 나눠 방향만 남긴 값</b>입니다.`};
   }},
  {t:'판단 — 화살표를 돌려 거리 1위와 코사인 1위가 <b>다른</b> 상대가 되게 만든 뒤 고르세요',
   f:'그때의 코사인 = {0}',
   opts:['거리와 코사인은 다른 것을 재므로 순위가 갈릴 수 있다','거리와 코사인은 늘 같은 순위를 낸다','코사인은 거리의 다른 이름이다'],
   chk(got, r, mem, pick){
     if(mem.calc===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화살표를 끄세요.'};
     const cs=noteNum(r[3]);
     if(!isFinite(got[0])||Math.abs(got[0]-cs)>0.02) return {ok:false, msg:`지금 화면의 코사인 ${cs.toFixed(3)} 을 적으세요.`};
     if(String(r[4]).indexOf('다름')<0)
       return {ok:false, msg:'아직 두 심판의 1위가 같습니다. 화살표를 더 돌려 순위가 갈리는 자리를 찾으세요.'};
     if(pick!==0) return {ok:false, msg:'지금 화면에서 두 심판이 서로 다른 상대를 1위로 꼽고 있습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>거리는 「얼마나 떨어졌나」, 코사인은 「어느 쪽을 보나」를 잽니다.</b> 취향이 같아도 열성의 크기가 다르면 거리는 멀어집니다. 추천 시스템이 코사인을 쓰는 까닭입니다.'};
   }}
 ]},

 /* LAB 19 합성곱 필터 — 커널의 합이 정하는 것 */
 19:{ h:'커널의 합이 무엇을 정하는가',
  c:[
  {t:'기록 — 「흐림」 프리셋을 적용하고 커널의 합을 적으세요',
   f:'커널의 합 = {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'프리셋을 적용해 보세요.'};
     const sum=noteNum(r[1]);
     if(Math.abs(sum-1)>0.06) return {ok:false, msg:`「흐림」 프리셋을 적용하세요 — 지금 합은 ${sum} 입니다.`};
     if(!isFinite(got[0])||Math.abs(got[0]-sum)>0.06) return {ok:false, msg:`화면의 합 ${sum} 을 적으세요.`};
     mem.s1=sum;
     return {ok:true, msg:'기록했습니다 — 합이 1 이면 밝기가 그대로 보존됩니다.'};
   }},
  {t:'생각 — 커널을 고쳐 세로 경계만 켜지게 만든 뒤, 평평한 곳의 출력을 구하세요',
   f:'커널의 합 = {0} · 밝기가 모두 같은 평평한 곳의 출력 = 밝기 × 합 = {1}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'커널을 고쳐 보세요.'};
     const sum=noteNum(r[1]);
     if(Math.abs(sum)>0.02) return {ok:false, msg:`아직 합이 ${sum} 입니다. 경계를 뽑으려면 합이 0 이 되어야 합니다.`};
     if(!isFinite(got[0])||Math.abs(got[0]-sum)>0.02) return {ok:false, msg:'지금 화면의 합을 적으세요.'};
     if(!isFinite(got[1])||Math.abs(got[1])>0.02) return {ok:false, msg:'같은 밝기에 합을 곱하면 얼마가 됩니까?'};
     mem.zero=true;
     return {ok:true, msg:'계산했습니다 — 합이 0 이면 <b>평평한 곳은 0 이 되어 꺼지고</b>, 밝기가 변하는 자리만 살아남습니다.'};
   }},
  {t:'판단 — 커널을 돌려(전치) 가로 경계용으로 바꾼 뒤 고르세요',
   f:'그때의 합 = {0}',
   opts:['합이 0 이면 평평한 곳은 꺼지고 경계만 남는다','합이 0 이면 그림이 어두워질 뿐이다','합은 결과와 상관없다'],
   chk(got, r, mem, pick){
     if(!mem.zero) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'커널을 고쳐 보세요.'};
     const sum=noteNum(r[1]);
     if(!isFinite(got[0])||Math.abs(got[0]-sum)>0.02) return {ok:false, msg:`지금 화면의 합 ${sum} 을 적으세요.`};
     if(String(r[2]).indexOf('꺼짐')<0)
       return {ok:false, msg:'가로 경계용으로 바꾼 뒤에도 합이 0 이어야 합니다. 화면의 「평평한 곳」이 꺼짐으로 표시되는지 보세요.'};
     if(pick!==0) return {ok:false, msg:'화면이 평평한 곳을 「꺼짐(0)」으로, 경계를 「켜짐」으로 표시하고 있습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>커널의 합이 필터의 성격을 정합니다.</b> 합이 1 이면 밝기를 지키는 필터(흐림), 0 이면 변화만 뽑는 필터(경계)입니다. 방향은 숫자를 어디에 놓느냐가 정합니다.'};
   }}
 ]},

 /* LAB 20 파형 합성 — 음색은 배합, 음높이는 기본음 */
 20:{ h:'음색은 배합이 정하고, 음높이는 기본음이 정한다',
  c:[
  {t:'기록 — 배음을 모두 끄고 기본음만 남긴 뒤 적으세요',
   f:'a₁ = {0} · a₂ = {1} · a₃ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'손잡이를 움직여 보세요.'};
     const a=[noteNum(r[0]),noteNum(r[1]),noteNum(r[2])];
     if(a[1]>0.03||a[2]>0.03) return {ok:false, msg:`아직 배음이 남아 있습니다 — a₂ = ${a[1]} · a₃ = ${a[2]}. 둘을 0 으로 내리세요.`};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if([0,1,2].some(j=>Math.abs(got[j]-a[j])>0.03))
       return {ok:false, msg:`화면의 값과 다릅니다 — ${a[0]} · ${a[1]} · ${a[2]}.`};
     mem.a1=a[0];
     return {ok:true, msg:'기록했습니다 — 배음이 없는 소리가 순음입니다. 매끈한 사인파 하나입니다.'};
   }},
  {t:'생각 — 2배음·3배음을 섞은 뒤 다시 적고, 더해진 양을 구하세요',
   f:'a₁ = {0} · a₂ = {1} · a₃ = {2} · 배음의 합 a₂ + a₃ = {3}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'①을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'손잡이를 움직이세요.'};
     const a=[noteNum(r[0]),noteNum(r[1]),noteNum(r[2])];
     if(a[1]+a[2]<0.1) return {ok:false, msg:'2배음과 3배음을 올려 섞어 보세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if([0,1,2].some(j=>Math.abs(got[j]-a[j])>0.03))
       return {ok:false, msg:`화면의 값과 다릅니다 — ${a[0]} · ${a[1]} · ${a[2]}.`};
     if(Math.abs(got[3]-(a[1]+a[2]))>0.04) return {ok:false, msg:'a₂ 와 a₃ 를 더하세요.'};
     mem.mix=a[1]+a[2];
     return {ok:true, msg:'계산했습니다 — 파형이 울퉁불퉁해졌습니다. 무엇이 바뀌었고 무엇이 그대로인지 화면에서 확인하세요.'};
   }},
  {t:'판단 — 목표 파형(회색)에 가깝게 맞춰 본 뒤, 무엇이 바뀌었는지 고르세요',
   f:'근거 — 내가 섞은 배음의 합 = {0}',
   opts:['배합이 바뀌면 음색만 바뀌고 음높이(주기)는 그대로다','배합이 바뀌면 음높이도 함께 바뀐다','배합은 소리의 크기만 바꾼다'],
   chk(got, r, mem, pick){
     if(mem.mix===undefined) return {ok:false, msg:'②를 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'손잡이를 움직이세요.'};
     if(!isFinite(got[0])||Math.abs(got[0]-mem.mix)>0.06)
       return {ok:false, msg:'②에서 구한 배음의 합을 근거로 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:`화면의 「주기 변화」 칸이 ${r[4]} 라고 말하고 있습니다. 이 사실을 보고 다시 고르세요.`};
     return {ok:true, msg:'판단했습니다 — <b>배음의 배합이 음색을 정하고, 기본음이 음높이를 정합니다.</b> 같은 「도」라도 피아노와 바이올린이 다르게 들리는 까닭이 이것입니다. 파형은 사인파 여러 개의 합입니다.'};
   }}
 ]},

};

function labNo(spec){ for(const k of Object.keys(LESSON)) if(LESSON[k]===spec) return +k; return 0; }
/* 「50 m」·「38.7°」 처럼 단위가 붙은 화면 값에서 수만 꺼낸다 */
function noteNums(v){ return String(v==null?'':v).split('/').map(x=>noteNum(x)); }
function noteNum(v){ const m=String(v==null?'':v).replace(/,/g,'').match(/-?\d+(\.\d+)?/); return m?+m[0]:NaN; }

function mathNote(root, spec, api){
  const N = NOTE_SPECS[labNo(spec)];
  if(!N) return;
  const NUM=['①','②','③','④'], COL=['#2563EB','#B45309','#0E9384','#7C3AED'];
  const STEP=['기록','생각','판단','정리'];
  const box=document.createElement('div');
  box.className='lsnnote';
  box.innerHTML = `<div class="lsnnh">✎ 탐구 노트 — ${N.h}</div>`
    + N.c.map((c,i)=>`<div class="eqc" data-k="${i}">
        <div class="eqt"><span class="eqn" style="background:${COL[i%4]}">${NUM[i%4]}</span>${c.t}</div>
        <div class="eqf">${c.f.replace(/\{(\d+)\}/g,'<input class="eqi w" data-i="$1">')}</div>
        ${c.opts?`<div class="nopts">${c.opts.map((o,j)=>
           `<label><input type="radio" name="np${i}" value="${j}"> ${o}</label>`).join('')}</div>`:''}
        <div class="eqb"><button class="b t sm nek">${STEP[i%4]} 확인</button><span class="eqr"></span></div>
      </div>`).join('')
    + `<div class="out nout"><span style="color:#6B7280">화면에서 <b>읽고</b> · 그 값으로 <b>계산하고</b> · 조건을 바꿔 <b>판단</b>하면 미션이 열립니다. 분수로 적어도 됩니다.</span></div>`;
  root.appendChild(box);
  const pass=N.c.map(()=>false), mem={};
  box.querySelectorAll('.eqc').forEach(el=>{
    const k=+el.dataset.k, c=N.c[k];
    el.querySelector('.nek').onclick=()=>{
      const got=[...el.querySelectorAll('.eqi')].map(x=>noteFrac(x.value));
      const sel=el.querySelector('input[type=radio]:checked');
      const pick=sel?+sel.value:-1;
      let r=null; try{ r = api&&api.read ? api.read() : null; }catch(_){}
      const res=c.chk(got, r, mem, pick) || {ok:false,msg:''};
      pass[k]=!!res.ok;
      el.querySelector('.eqr').innerHTML = res.ok
        ? `<b style="color:#0E9384">${res.msg}</b>` : `<span style="color:#BE123C">${res.msg}</span>`;
      const done=pass.filter(Boolean).length;
      box.querySelector('.nout').innerHTML = done===N.c.length
        ? '<b style="color:#0E9384">🏁 탐구 노트 통과</b> — 읽고 · 계산하고 · 판단했습니다.'
        : `<span style="color:#6B7280">탐구 노트 ${done} / ${N.c.length} 칸</span>`;
    };
  });
}
/* 분수로 적어도 읽는다 — 16/20 · 4/5 · 0.8 */
function noteFrac(v){
  const t=String(v==null?'':v).replace(/[\s,]/g,'').replace(/[^0-9.\/\-]/g,'');
  if(!t) return NaN;
  const f=t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if(f){ const d=parseFloat(f[2]); return d===0?NaN:parseFloat(f[1])/d; }
  const n=parseFloat(t); return isFinite(n)?n:NaN;
}
/* ══ NOTE-END ══ */
'''

HOOK_OLD = """  const labRoot=phs[2].querySelector('#lsLab');
  const api=spec.demo(labRoot)||{};"""
HOOK_NEW = """  const labRoot=phs[2].querySelector('#lsLab');
  const api=spec.demo(labRoot)||{};
  mathNote(labRoot, spec, api);     // 탐구 노트 — NOTE_SPECS 에 적힌 실험실에만 붙는다"""

MISSION_OLD = """  {t:'거리를 바꿔 다시 조준·제출 — 같은 높이가 나오는지 확인하세요.', re:'거리를 바꿔도 같은 높이'}]"""
MISSION_NEW = """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 화면의 값을 <b>기록</b>하고, 그 값으로 높이를 <b>계산</b>하고, 거리를 바꿔 다시 재어 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 화면의 거리·각을 그대로 적기 ② 그 값으로 tan 과 높이 구하기 ③ 거리를 3 m 이상 옮겨 다시 재고 두 높이를 견주기',
   hand:'두 번 구한 높이를 나란히 적고, 거리가 달라졌는데도 같은 값이 나온 까닭을 닮은 직각삼각형으로 설명하기'}]"""

CSS = '''
/* 탐구 노트 — 기록·생각·판단 (2026-09-22) */
.lsnnote{margin-top:12px;background:#FBFCFE;border:1px solid var(--line);border-radius:12px;padding:10px 12px}
.lsnnh{font-size:12.5px;font-weight:800;color:var(--ink);margin-bottom:8px;
       padding-bottom:6px;border-bottom:1px dashed var(--line)}
.lsnnote .eqf{line-height:2.1}
.lsnnote .out{margin-top:2px}
.nopts{display:flex;flex-direction:column;gap:3px;margin:4px 0 2px}
.nopts label{font-size:12.3px;color:var(--ink2);display:flex;gap:6px;align-items:flex-start;cursor:pointer}
.nopts input{margin-top:3px}
'''

MISSIONS = [
 (6, """  {t:'\u300c이상치 제외\u300d로 다시 계산 \u2014 한 점이 결론을 바꿨는지 확인하세요.', re:'제외하니 r'}]""",
     """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 \u2014 강한 관계를 <b>기록</b>하고, 한 점을 옮겨 변화를 <b>계산</b>하고, 이상치를 빼 본 뒤 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 |r| \u2265 0.9 를 만들어 적기 \u2461 점 하나를 끌어 |r| < 0.5 로 무너뜨리고 변화량 구하기 \u2462 \u300c이상치 제외\u300d를 켜고 판단',
   hand:'점 하나가 r 을 그만큼 움직일 수 있는 까닭을 \u300c공분산이 한 점에 끌려간다\u300d는 말로 쓰기'}]"""),
 (7, """  {t:'그 상태에서 중앙값이 왜 안 움직였는지, 기록 단계에 손으로 설명하세요.'}]""",
     """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 \u2014 고른 배치를 <b>기록</b>하고, 한 명만 올려 차이를 <b>계산</b>하고, 광고에 어느 값을 쓸지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 막대를 고르게 맞추고 평균\u00b7중앙값 적기 \u2461 한 명만 꼭대기로 올린 뒤 다시 적고 차 구하기 \u2462 근거를 적고 판단',
   hand:'중앙값이 버티는 까닭을 \u300c정렬해서 몇 번째\u300d라는 정의로 쓰기'}]"""),
 (8, """  {t:'자릿수 +1 과 종류 추가를 번갈아 눌러 \u2014 몇 배씩 세지는지 비교하세요.', re:'이전의 \u00d7'}]""",
     """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 \u2014 내 정책을 <b>기록</b>하고, 경우의 수를 <b>계산</b>하고, 무엇을 늘릴지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 화면의 종류 k \u00b7 자릿수 n 적기 \u2461 k\u207f 구하기 \u2462 두 배율을 각각 구해 견주고 판단',
   hand:'경우의 수가 k\u207f 인 까닭을 나무 그림으로 그려 설명하기'}]"""),
 (9, """  {t:'1000명 시뮬을 여러 번 반복 \u2014 꽝 비율이 어디로 안정되는지 확인하세요.', re:'큰 수의 법칙'}]""",
     """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 \u2014 시뮬 결과를 <b>기록</b>하고, 이론값과의 차를 <b>계산</b>하고, 한 번 더 돌려 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 1000명 시뮬을 돌리고 꽝 비율 적기 \u2461 0.995\u00b2\u2070\u2070 를 구해 내 결과와 견주기 \u2462 한 번 더 돌려 두 값을 견주고 판단',
   hand:'여사건을 쓰는 까닭과, \u300c확률 \u00d7 횟수\u300d가 왜 확률이 될 수 없는지 쓰기'}]"""),
]

MISSIONS += [
 (10, """  {t:'\u03c3 손잡이를 끌어 영어를 수학만큼 촘촘하게 — 78점의 등수가 어떻게 변하나요?', re:'등수가 급등'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 시험의 \u03c3 와 z 를 <b>기록</b>하고, 평균을 <b>계산</b>하고, \u03c3 를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 두 시험 모두 78점에 놓고 \u03c3 \u00b7 z 적기 \u2461 z 를 뒤집어 평균 구하기 \u2462 영어 \u03c3 를 줄이고 z 가 어떻게 되는지 보기',
   hand:'같은 점수인데 z 가 달랐던 까닭을 「평균에서 몇 \u03c3 만큼 떨어졌나」라는 말로 쓰기'}]"""),
 (11, """  {t:'r = 20%(대출 금리)로 바꿔 다시 — 빚이 두 배 되는 데 몇 년인가요?', re:'20% 에서는'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 6 % 의 두 배 햇수를 <b>기록</b>하고, 72 어림과 <b>견주고</b>, 20 % 에서 다시 재어 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 r = 6 % 로 두 배 되는 해 찾기 \u2461 72 \u00f7 r 와의 차 구하기 \u2462 r = 20 % 로 다시 재어 두 차를 견주기',
   hand:'72 법칙이 어림인 까닭과, 어디까지 믿을 수 있는지 쓰기'}]"""),
 (12, """  {t:'직선의 기울기(한 칸에 며칠?)에서 성장률을 읽어 내세요.', re:'기울기가 성장률'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 1일차 값을 <b>기록</b>하고, 14일차와의 배수를 <b>계산</b>하고, 로그 눈금으로 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 1일차 점 짚어 값 적기 \u2461 14일차 점을 짚어 몇 배인지 구하기 \u2462 로그 눈금으로 전환한 뒤 판단',
   hand:'로그 눈금에서 직선이 되는 까닭을 「한 칸이 몇 배」라는 말로 쓰기'}]"""),
 (13, """  {t:'h = 0.01 — 할선이 접선과 겹치는 순간을 확인하세요.', re:'접선과 겹쳤습니다'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 구간을 <b>기록</b>하고, h 를 조여 다시 <b>계산</b>하고, 더 조여 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 지금 h 와 평균속도 적기 \u2461 h \u2264 0.1 로 조여 20 과의 차 구하기 \u2462 h = 0.01 까지 조이고 판단',
   hand:'할선이 접선으로 옮겨 가는 장면을 그림으로 그리고, 미분계수가 「도착한 값」인 까닭 쓰기'}]"""),
 (14, """  {t:'앞 15자리로 검사 숫자를 직접 계산해 유효한 번호를 완성하세요.', re:'직접 만든 유효한 번호'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 유효한 번호의 룬 합을 <b>기록</b>하고, 한 자리를 바꿔 <b>계산</b>하고, 이웃을 맞바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 손대지 않은 번호의 합 적기 \u2461 한 자리 +1 하고 차 구하기 \u2462 되돌린 뒤 이웃 두 자리를 맞바꿔 나머지 보기',
   hand:'한 자리 걸러 2배를 하는 까닭과, 그래서 무엇을 잡아낼 수 있는지 쓰기'}]"""),
]

MISSIONS += [
 (15, """  {t:'이상치 점을 하나 추가하고 재대결 — 최적 직선이 얼마나 끌려가나요?', re:'이상치가 직선을'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 내 직선을 <b>기록</b>하고, 점수를 낮춰 <b>계산</b>하고, 컴퓨터 답과 견주어 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 지금 기울기·절편·잔차²합 적기 \u2461 직선을 고쳐 점수를 더 낮추고 줄어든 양 구하기 \u2462 「컴퓨터 답 공개」로 격차 보고 판단',
   hand:'왜 「잔차의 제곱」을 더하는지, 그냥 잔차를 더하면 안 되는 까닭 쓰기'}]"""),
 (16, """  {t:'왼쪽 작은 웅덩이에 공을 놓고 내려 보내세요 — 진짜 바닥이 아닌 곳에 갇히나요?', re:'작은 웅덩이에 갇혔습니다'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — \u03b7 = 0.1 의 결과를 <b>기록</b>하고, \u03b7 = 0.95 로 바꿔 차이를 <b>계산</b>하고, 출발점을 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 \u03b7 0.1 로 바닥 안착시켜 적기 \u2461 \u03b7 0.95 로 바꿔 도착점 차 구하기 \u2462 왼쪽 웅덩이에서 출발해 판단',
   hand:'걸음이 너무 크면 왜 건너뛰는지, 지역 최솟값이 무엇인지 그림으로 쓰기'}]"""),
 (17, """  {t:'10,000발 — 오차가 어디까지 줄어드는지 확인하세요.', re:'무작위가 이만큼 정확'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 10발의 결과를 <b>기록</b>하고, 1,000발에서 오차가 몇 분의 1 이 되었는지 <b>계산</b>하고, 10,000발에서 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 직접 10발 쏘고 적기 \u2461 1,000발까지 쏘고 오차 비 구하기 \u2462 10,000발까지 쏘고 판단',
   hand:'발수를 100배로 늘려야 자릿수 하나를 더 맞히는 까닭을 제곱근으로 설명하기'}]"""),
 (18, """  {t:'내 취향을 정반대로 돌려 — 코사인이 어디까지 내려가는지 확인하세요.', re:'정반대 — 유사도 −1'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 방향을 맞춰 <b>기록</b>하고, 내 벡터로 코사인을 손으로 <b>계산</b>하고, 두 심판의 순위가 갈리는 자리를 찾아 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 김(4,2)과 같은 방향으로 맞추고 적기 \u2461 내적 \u00f7 (크기 \u00d7 \u221a20) 을 손으로 \u2462 순위가 갈리는 방향을 찾아 판단',
   hand:'코사인이 길이에 흔들리지 않는 까닭을 「내적을 길이로 나눈다」는 말로 쓰기'}]"""),
 (19, """  {t:'커널을 돌려(전치) 가로 경계용으로 개조하세요.', re:'가로 경계 검출'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 흐림 커널의 합을 <b>기록</b>하고, 합이 0 일 때 평평한 곳이 어떻게 되는지 <b>계산</b>하고, 전치해 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 흐림 프리셋의 합 적기 \u2461 세로 경계 커널을 만들어 합과 평평한 곳의 출력 구하기 \u2462 전치해 가로 경계로 바꾸고 판단',
   hand:'합이 1 인 필터와 0 인 필터가 하는 일이 어떻게 다른지 쓰기'}]"""),
 (20, """  {t:'목표 파형(회색)을 똑같이 복제하세요 — 배합비 사냥!', re:'목표 파형 복제 성공'}]""",
      """  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 순음을 <b>기록</b>하고, 배음을 섞어 <b>계산</b>하고, 목표 파형에 맞춰 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'\u2460 배음을 모두 끄고 a\u2081·a\u2082·a\u2083 적기 \u2461 2·3배음을 섞고 배음의 합 구하기 \u2462 목표 파형에 맞춘 뒤 주기가 변했는지 보고 판단',
   hand:'같은 음높이인데 악기마다 다르게 들리는 까닭을 배음으로 설명하기'}]"""),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    done, skip = [], []

    S, E = '/* ══ NOTE-START ══', '/* ══ NOTE-END ══ */'
    if S in h:
        a = h.index(S); b = h.index(E) + len(E)
        h = h[:a] + JS.strip() + h[b:]
        done.append('노트 장치 갱신')
    else:
        anchor = 'function lessonFlow(root, spec, P){'
        assert h.count(anchor) == 1, 'lessonFlow 를 못 찾음'
        h = h.replace(anchor, JS + '\n' + anchor, 1)
        done.append('노트 장치 심음')

    if 'mathNote(labRoot, spec, api)' in h:
        skip.append('연결')
    else:
        assert h.count(HOOK_OLD) == 1, '실험 화면 연결 자리를 못 찾음'
        h = h.replace(HOOK_OLD, HOOK_NEW, 1)
        done.append('연결')

    for lab, old, new in [(5, MISSION_OLD, MISSION_NEW)] + MISSIONS:
        if new in h:
            skip.append('LAB %02d 미션' % lab)
            continue
        n = h.count(old)
        assert n == 1, 'LAB %02d 의 미션 3 자리를 %d 번 찾음' % (lab, n)
        h = h.replace(old, new, 1)
        done.append('LAB %02d 미션' % lab)

    open(path, 'w', encoding='utf-8').write(h)
    print('고침 :', ' · '.join(done) if done else '(없음)')
    print('이미  :', ' · '.join(skip) if skip else '(없음)')

    css = os.path.join(os.path.dirname(os.path.abspath(path)), 'styles.css')
    if os.path.exists(css):
        c = open(css, encoding='utf-8').read()
        if '.lsnnote{' not in c:
            open(css, 'w', encoding='utf-8').write(c + CSS)
            print('styles.css 에 노트 모양 추가')
        else:
            print('styles.css 이미 반영됨')


if __name__ == '__main__':
    main(sys.argv[1])
