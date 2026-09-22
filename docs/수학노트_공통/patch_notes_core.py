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

};

function labNo(spec){ for(const k of Object.keys(LESSON)) if(LESSON[k]===spec) return +k; return 0; }
/* 「50 m」·「38.7°」 처럼 단위가 붙은 화면 값에서 수만 꺼낸다 */
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
