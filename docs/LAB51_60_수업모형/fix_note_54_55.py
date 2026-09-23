# -*- coding: utf-8 -*-
"""LAB 54·55 탐구 노트를 실제 read() 가 내주는 값에 맞춘다.

54 taDemo — 특수각에서 read() 는 «1/2» «√3/2» 같은 **정확한 꼴**을 돌려준다.
            noteNum 은 거기서 1 이나 3 을 집어 버린다. 그래서 각만 화면에서 읽고,
            소수 값은 화면의 «≈» 줄을 보고 학생이 적게 한다.
55 tbDemo — 슬라이더 눈금이 **5°** 이고 「이웃 칸과의 차」 열은 늘 «—» 다.
            2° 가 아니라 10° 를 건너뛰고 그 가운데 각(5° 떨어진 각)과 견준다.

사용: python docs/LAB51_60_수업모형/fix_note_54_55.py src/40-demos.js
"""
import sys

NEW54 = """
 54:{ h:'내가 맞추고 · 내가 제곱하고 · 내가 판단한다',
  c:[
  {t:'기록 — 각을 <b>30°·45°·60°</b> 중 하나로 맞추고, 화면의 «≈» 줄의 소수를 적으세요',
   f:'θ = {0} ° · sin ≒ {1} · cos ≒ {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. 사분원 위의 점을 끌어 보세요.'};
     const th=noteNum(r[0]);
     if([30,45,60].every(v=>Math.abs(th-v)>0.6))
       return {ok:false, msg:'지금 '+th+'° 입니다. 30·45·60 중 하나로 맞추세요 — 가까이 가면 딸깍 붙습니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6) return {ok:false, msg:'각은 '+th+'° 입니다.'};
     const t=th*Math.PI/180, s=Math.sin(t), c=Math.cos(t);
     if(Math.abs(got[1]-s)>0.002) return {ok:false, msg:'화면의 «≈» 줄에 sin 이 '+s.toFixed(4)+' 로 나와 있습니다.'};
     if(Math.abs(got[2]-c)>0.002) return {ok:false, msg:'화면의 «≈» 줄에 cos 이 '+c.toFixed(4)+' 로 나와 있습니다.'};
     mem.th=th; mem.s=s; mem.c=c; mem.ex=String(r[1]);
     return {ok:true, msg:'기록했습니다 — 정확한 꼴로는 sin '+th+'° = '+mem.ex+' 입니다. 이 두 값을 제곱해 더해 봅시다.'};
   }},
  {t:'생각 — <b>sin² + cos²</b> 을 구하세요',
   f:'sin² = {0} · cos² = {1} · 둘의 합 = {2}',
   chk(got, r, mem){
     if(mem.s===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s*mem.s)>0.01) return {ok:false, msg:'①의 sin 값을 제곱하세요.'};
     if(Math.abs(got[1]-mem.c*mem.c)>0.01) return {ok:false, msg:'①의 cos 값을 제곱하세요.'};
     if(Math.abs(got[2]-1)>0.02) return {ok:false, msg:'두 값을 더해 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 합이 <b>1</b> 입니다. 다른 각에서도 그럴까요?'};
   }},
  {t:'판단 — <b>다른 특수각</b>으로 바꿔 같은 계산을 한 뒤 고르세요',
   f:'새 θ = {0} ° · 그때 sin ≒ {1} · sin² + cos² = {2}',
   opts:['sin²θ + cos²θ = 1 은 <b>어떤 각에서나</b> 성립한다 — 피타고라스 정리를 빗변 1 로 쓴 것이다',
         '특수각에서만 성립하는 우연이다',
         '각이 커지면 합도 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]);
     if(Math.abs(th-mem.th)<1) return {ok:false, msg:'각이 그대로입니다 — 다른 특수각으로 바꾸세요.'};
     if([30,45,60].every(v=>Math.abs(th-v)>0.6))
       return {ok:false, msg:'지금 '+th+'° 입니다. 30·45·60 중 하나로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6) return {ok:false, msg:'지금 각은 '+th+'° 입니다.'};
     const t=th*Math.PI/180, s=Math.sin(t);
     if(Math.abs(got[1]-s)>0.002) return {ok:false, msg:'화면의 «≈» 줄에 sin 이 '+s.toFixed(4)+' 로 나와 있습니다.'};
     if(Math.abs(got[2]-1)>0.02) return {ok:false, msg:'이 각에서도 sin² + cos² 을 직접 계산해 보세요.'};
     if(pick!==0)
       return {ok:false, msg:mem.th+'° 에서도 '+th+'° 에서도 합이 1 이었습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>빗변을 1 로 둔 직각삼각형에서 두 변이 sin θ 와 cos θ 입니다.</b> 피타고라스 정리가 곧 sin²θ + cos²θ = 1 이고, «1/2»·«√3/2» 같은 깔끔한 수는 정삼각형·정사각형을 반으로 자른 데서 나옵니다.'};
   }}
 ]},
"""

NEW55 = """
 55:{ h:'내가 읽고 · 내가 어림하고 · 내가 판단한다',
  c:[
  {t:'기록 — 각을 정해 <b>표의 값</b>을 읽어 적으세요 (눈금은 5° 입니다)',
   f:'θ = {0} ° · sin θ = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[0]), s=noteNum(r[1]);
     if(th<10||th>75) return {ok:false, msg:'각을 10°~75° 사이로 맞추세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6) return {ok:false, msg:'각은 '+th+'° 입니다.'};
     if(Math.abs(got[1]-s)>0.0008) return {ok:false, msg:'sin 값은 '+r[1]+' 입니다.'};
     mem.th=th; mem.s=s;
     return {ok:true, msg:'기록했습니다 — 이제 <b>10° 큰 각</b>('+(th+10)+'°)의 값도 읽어 봅시다.'};
   }},
  {t:'생각 — <b>10° 큰 각</b>의 값을 읽고, 두 값의 평균으로 가운데 각을 어림하세요',
   f:'{0} ° 의 sin = {1} · 두 값의 평균 = {2}',
   chk(got, r, mem){
     if(mem.s===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), s=noteNum(r[1]);
     if(Math.abs(th-(mem.th+10))>0.6)
       return {ok:false, msg:'①의 '+mem.th+'° 보다 <b>10° 큰</b> '+(mem.th+10)+'° 로 맞추세요. 지금은 '+th+'° 입니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6) return {ok:false, msg:'지금 각은 '+th+'° 입니다.'};
     if(Math.abs(got[1]-s)>0.0008) return {ok:false, msg:'지금 sin 값은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(mem.s+s)/2)>0.0012) return {ok:false, msg:'①의 sin 과 지금 sin 의 평균을 구하세요.'};
     mem.mid=(mem.s+s)/2;
     return {ok:true, msg:'계산했습니다 — 이것이 <b>선형보간</b>으로 어림한 '+(mem.th+5)+'° 의 값입니다.'};
   }},
  {t:'판단 — <b>가운데 각</b>의 실제 값을 읽어 어림과 견준 뒤 고르세요',
   f:'가운데 각 = {0} ° · 실제 sin = {1} · 어림 − 실제 = {2}',
   opts:['곡선을 직선으로 대신했기 때문에 <b>작은 오차</b>가 생긴다 — 구간이 좁을수록 잘 맞는다',
         '선형보간은 언제나 정확하다',
         '선형보간은 쓸모없이 크게 빗나간다'],
   chk(got, r, mem, pick){
     if(mem.mid===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), s=noteNum(r[1]);
     if(Math.abs(th-(mem.th+5))>0.6)
       return {ok:false, msg:'가운데 각 '+(mem.th+5)+'° 로 맞추세요. 지금은 '+th+'° 입니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6) return {ok:false, msg:'지금 각은 '+th+'° 입니다.'};
     if(Math.abs(got[1]-s)>0.0008) return {ok:false, msg:'지금 sin 값은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(mem.mid-s))>0.0015) return {ok:false, msg:'②의 어림값에서 실제 값을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'어림과 실제의 차가 '+(mem.mid-s).toFixed(5)+' 로 아주 작습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>곡선을 짧은 구간에서 직선으로 대신한 것</b>이 선형보간입니다. 구간이 좁을수록 오차가 작아집니다 — 옛 항해사들은 이렇게 표 하나로 별을 읽었습니다.'};
   }}
 ]},
"""

WORD = [
 ("'각을 바꿔 가며 <b>sin 값</b>과 이웃 칸과의 차를 보세요.'",
  "'각을 5° 눈금으로 바꿔 가며 <b>sin 값</b>을 읽고 「이 각을 표에 기록」으로 표를 채우세요.'"),
 ("'각을 크게 해 보세요. 이웃 칸과의 차가 어떻게 되나요?'",
  "'각을 크게 해 보세요. 표에서 이웃 칸의 차가 어떻게 되나요?'"),
 ("① 이웃한 두 각의 sin 값 적기 ② 두 값의 평균으로 가운데 각을 어림하기 ③ 실제 값과 견주어 오차 보기",
  "① 어떤 각의 sin 값 적기 ② 10° 큰 각을 읽어 두 값의 평균 구하기 ③ 가운데 각의 실제 값과 견주어 오차 보기"),
 ("각을 바꾸며 <b>표의 값</b>을 읽고, 이웃한 두 칸의 차를 봅니다. 표에 없는 각은 <b>두 값 사이를 직선으로 이어</b> 어림하는데, 그 어림이 실제 값과 얼마나 차이 나는지 확인합니다.",
  "각은 <b>5° 눈금</b>으로 움직입니다. 「이 각을 표에 기록」으로 표를 채운 뒤, 표에 없는 각을 <b>두 값 사이를 직선으로 이어</b> 어림합니다. 그 어림이 실제 값과 얼마나 차이 나는지 직접 확인합니다."),
 ("각을 30°·45°·60° 로 맞추면 <b>sin · cos · tan</b> 가 정확한 꼴로 표시되고, 그 값이 삼각형의 <b>변의 비</b> 에서 어떻게 나오는지 함께 보여 줍니다.",
  "각을 30°·45°·60° 로 맞추면 <b>sin · cos · tan</b> 가 «1/2»·«√3/2» 같은 정확한 꼴과 소수로 함께 표시되고, 그 값이 삼각형의 <b>변의 비</b> 에서 어떻게 나오는지 「근거」 버튼이 도형으로 보여 줍니다."),
]


def swap(h, no, new):
    a, b = "\n %d:{ h:'" % no, "\n %d:{ h:'" % (no + 1)
    i, j = h.index(a), h.index(b)
    return h[:i] + new + h[j + 1:]


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'mem.ex=String(r[1])' in h:
        sys.stdout.write('already fixed\n')
        return
    h = swap(h, 54, NEW54)
    h = swap(h, 55, NEW55)
    for a, b in WORD:
        assert h.count(a) == 1, repr(a[:40])
        h = h.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('54 / 55 note fixed\n')


if __name__ == '__main__':
    main(sys.argv[1])
