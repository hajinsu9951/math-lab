# -*- coding: utf-8 -*-
"""LAB 22 급수의 부분합 — 7단계 수업 모형 + 탐구 노트를 붙인다.

실험 화면은 이미 있는 seriesDemo 를 그대로 쓴다. 다만 탐구 노트가 화면의 값을 읽어야 하므로
**read() 를 돌려주도록** 한 줄 보탠다. 실험을 새로 만들지 않는다 — 같은 실험이 두 벌이 되면
고칠 곳이 두 곳이 되고, 둘이 어긋나면 어느 쪽이 맞는지 알 수 없다.

사용: python docs/LAB22_수업모형/patch_lab22.py src/40-demos.js
"""
import sys

F_OLD = """  const F={
    geo: {f:n=>Math.pow(0.5,n), lim:1,    note:'첫째항 1/2, 공비 1/2 → 합은 1'},
    geo2:{f:n=>Math.pow(1.5,n), lim:null, note:'공비가 1보다 커서 발산 — |r| < 1 이 수렴 조건'},
    harm:{f:n=>1/n,             lim:null, note:'항은 0으로 가는데도 합은 발산 — 아주 느리게 커진다'},
    p2:  {f:n=>1/(n*n),         lim:Math.PI*Math.PI/6, note:'π²/6 ≈ 1.6449 (바젤 문제)'},
    alt: {f:n=>Math.pow(-1,n+1)/n, lim:Math.log(2), note:'ln 2 ≈ 0.6931 — 부호가 번갈아 상쇄된다'}
  };"""

F_NEW = """  const F={
    geo: {nm:'Σ (1/2)^n', f:n=>Math.pow(0.5,n), lim:1,    note:'첫째항 1/2, 공비 1/2 → 합은 1'},
    geo2:{nm:'Σ (3/2)^n', f:n=>Math.pow(1.5,n), lim:null, note:'공비가 1보다 커서 발산 — |r| < 1 이 수렴 조건'},
    harm:{nm:'Σ 1/n',     f:n=>1/n,             lim:null, note:'항은 0으로 가는데도 합은 발산 — 아주 느리게 커진다'},
    p2:  {nm:'Σ 1/n^2',   f:n=>1/(n*n),         lim:Math.PI*Math.PI/6, note:'π²/6 ≈ 1.6449 (바젤 문제)'},
    alt: {nm:'Σ (−1)^(n+1)/n', f:n=>Math.pow(-1,n+1)/n, lim:Math.log(2), note:'ln 2 ≈ 0.6931 — 부호가 번갈아 상쇄된다'}
  };"""

END_OLD = """  $('#seRst').onclick  =()=>{ S.N=6; draw(); };
  draw();
}"""

END_NEW = """  $('#seRst').onclick  =()=>{ S.N=6; draw(); };
  draw();

  /* 탐구 노트가 읽어 갈 값 — 화면에 지금 보이는 것 그대로 */
  return { read:()=>{
    const v=verdict(), last=sums[sums.length-1];
    return [F[S.k].nm, String(S.N), last.toFixed(4), S.L.toFixed(3), S.eps.toFixed(3),
            v.msg ? '아직 띠 밖' : 'N = '+v.N+(v.ok?'':' (확인 부족)')];
  }};
}"""

# 부분합 S(n) = 1 − 2^(−n) 을 실제로 계산해 좌표를 만든다 (v=0 → y=150, v=1 → y=40)
PTS = [(40.0 + 36 * (n - 1), 150 - 110 * (1 - 0.5 ** n), abs((1 - 0.5 ** n) - 1) < 0.12)
       for n in range(1, 11)]
PATH = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', x, y) for i, (x, y, _) in enumerate(PTS))
DOTS = ''.join('<circle cx="%.1f" cy="%.1f" r="3.4" fill="%s"/>' % (x, y, '#0E9384' if ok else '#BE123C')
               for (x, y, ok) in PTS)

LESSON = """LESSON[22]={
 title:'급수의 부분합과 수렴',
 problem:{
  q:'친구가 “1/2 + 1/4 + 1/8 + … 을 끝까지 더하면 딱 1 이 된다”고 합니다. 더할 항이 <b>끝없이</b> 남아 있는데 어떻게 값이 정해질까요? 그런데 1 + 1/2 + 1/3 + … 은 아무리 더해도 정해지지 않는다고 합니다 — 무엇이 이 둘을 가를까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="부분합이 한 값에 가까워지며 어느 항부터 좁은 띠 안에 머무는 그림">
    <rect x="30" y="26.8" width="352" height="26.4" fill="#2563EB" opacity=".10"/>
    <path d="M30 26.8 H382 M30 53.2 H382" stroke="#93B4F7" stroke-width="1.3" stroke-dasharray="4 3"/>
    <path d="M30 40 H382" stroke="#2563EB" stroke-width="2"/>
    <text x="378" y="36" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end">L = 1</text>
    <text x="34" y="22" font-size="9.5" font-weight="800" fill="#1D4ED8">허용 오차 ε 띠</text>
    <path d="M30 150 H382 M30 150 V20" stroke="#9CA3AF" stroke-width="1.2"/>
    <path d="__PATH__" stroke="#111827" stroke-width="1.5" fill="none"/>
    __DOTS__
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">더한 항의 수 n — 어느 항부터 띠 안에 계속 머무는가?</text>
  </svg>`,
  sit:'부분합을 한 항씩 쌓으면서 <b>극한 후보 L</b> 과 <b>허용 오차 ε</b> 를 직접 끌어 옮깁니다. 아무리 좁은 띠를 줘도 <b>어느 항부터는 계속</b> 그 안에 있는지 — 그것이 수렴의 뜻입니다. 조화급수로 바꾸면 항은 0 으로 가는데도 합은 끝없이 커집니다.'
 },
 predict:{
  q:['1/2 + 1/4 + 1/8 + … 을 100항까지 더하면 1 을 넘을까요, 못 넘을까요? 그렇게 생각한 까닭도 적으세요.',
     '“항이 점점 0 에 가까워지면 합도 정해진다” — 맞을까요? 반례가 있을 것 같으면 무엇일지 적으세요.',
     '“수렴한다”를 여러분의 말로 한 문장으로 정의해 보세요.'] },
 missions:[
  {t:'등비급수 Σ (1/2)ⁿ 을 고르고 <b>＋10항</b> 을 눌러 부분합을 쌓아 보세요. 점이 어디로 모이나요?', re:'N = '},
  {t:'조화급수 Σ 1/n 으로 바꿔 보세요. 항은 0 으로 가는데 부분합은 어떻게 되나요?', re:'극한이 없습니다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 화면의 값을 <b>기록</b>하고, |Sₙ − L| 을 <b>계산</b>하고, ε 을 좁혀 다시 재어 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 화면의 n·Sₙ·L·ε 적기 ② |Sₙ − L| 을 구해 ε 과 견주기 ③ ε 을 절반 이하로 좁히고 항을 더 쌓아 새 N 읽기',
   hand:'ε 을 좁혔더니 N 이 어떻게 달라졌는지 적고, 그래도 수렴이라고 말할 수 있는 까닭을 쓰기'}],
 inquiry:{
  id:'sr22', title:'급수 — 어느 항부터 띠 안에 머무는가',
  q:['급수를 바꿔 가며 (급수, n, Sₙ, L, ε, N) 을 여섯 줄 이상 기록하세요.',
     'ε 을 절반으로 줄이면 N 은 어떻게 변하나요? 두 급수에서 각각 확인하세요.',
     '“수렴한다”를 ε 과 N 을 써서 손으로 정의하고, 조화급수가 왜 여기에 해당하지 않는지 설명하세요.'],
  cols:['급수','항 수 n','부분합 Sₙ','내 L','ε','N'],
  hint:'힌트 — 항이 0 으로 가는 것은 <b>필요조건일 뿐</b>입니다. 조화급수가 바로 그 반례입니다.' },
 apply:{
  q:'새 문제 — 첫째항이 <b>3</b>, 공비가 <b>1/4</b> 인 등비급수의 합은?',
  a:4, tol:0.05,
  why:'S = a ÷ (1 − r) = 3 ÷ (1 − 1/4) = 3 ÷ (3/4) = 4.',
  hint:'|r| < 1 일 때 S = 첫째항 ÷ (1 − 공비).' },
 demo(root){ return seriesDemo(root); }
};

"""

NOTE = """
 /* LAB 22 급수의 부분합 — 내가 쌓은 부분합으로 ε 과 N 을 내가 확인한다 */
 22:{ h:'내가 쌓고 · 내가 재고 · 내가 판단한다',
  c:[
  {t:'기록 — 등비급수 Σ (1/2)ⁿ 을 고르고 항을 쌓은 뒤, 화면의 값을 그대로 옮겨 적으세요',
   f:'항 수 n = {0} · 부분합 Sₙ = {1} · 내가 놓은 L = {2} · 허용 오차 ε = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. 급수를 고르고 항을 쌓아 보세요.'};
     if(String(r[0]).indexOf('1/2')<0 || String(r[0]).indexOf('3/2')>=0)
       return {ok:false, msg:'먼저 <b>Σ (1/2)ⁿ</b> 을 고르세요. 지금은 '+r[0]+' 입니다.'};
     const n=noteNum(r[1]), S=noteNum(r[2]), L=noteNum(r[3]), e=noteNum(r[4]);
     if(n<8) return {ok:false, msg:'항이 '+n+'개뿐입니다. ＋10항 을 눌러 8항 이상 쌓으세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'항 수가 다릅니다 — 화면은 '+n+' 입니다.'};
     if(Math.abs(got[1]-S)>0.003) return {ok:false, msg:'부분합이 다릅니다 — 화면은 '+S+' 입니다. 자료는 있는 그대로 옮겨 적어야 합니다.'};
     if(Math.abs(got[2]-L)>0.003) return {ok:false, msg:'L 이 다릅니다 — 화면은 '+L+' 입니다.'};
     if(Math.abs(got[3]-e)>0.003) return {ok:false, msg:'ε 이 다릅니다 — 화면은 '+e+' 입니다.'};
     mem.n=n; mem.S=S; mem.L=L; mem.eps=e;
     return {ok:true, msg:'기록했습니다 — 이 네 수가 오늘 실험의 자료입니다.'};
   }},
  {t:'생각 — 적은 값으로 <b>부분합과 L 의 거리</b>를 구하고, ε 과 견주세요',
   f:'|Sₙ − L| = {0} · ε = {1} · 띠 안이면 1, 밖이면 0 → {2}',
   chk(got, r, mem){
     if(mem.S===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     const d=Math.abs(mem.S-mem.L);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.004) return {ok:false, msg:'①에 적은 Sₙ 과 L 의 차를 절댓값으로 구하세요.'};
     if(Math.abs(got[1]-mem.eps)>0.003) return {ok:false, msg:'①에 적은 ε 을 그대로 옮기세요.'};
     const want = d<mem.eps ? 1 : 0;
     if(Math.abs(got[2]-want)>0.01)
       return {ok:false, msg:'|Sₙ − L| = '+d.toFixed(4)+' 과 ε = '+mem.eps+' 을 견주어 다시 판단하세요.'};
     mem.d=d;
     return {ok:true, msg:'계산했습니다 — 지금 이 항은 띠 '+(want?'안':'밖')+'에 있습니다. 한 항만으로는 수렴을 말할 수 없습니다.'};
   }},
  {t:'판단 — ε 을 ①에 적은 값의 <b>절반 이하로 좁히고</b> 항을 더 쌓은 뒤, 새 N 을 근거로 고르세요',
   f:'좁힌 ε = {0} · 새 N = {1}',
   opts:['ε 을 좁혀도 어느 항부터는 계속 띠 안에 있다 — 수렴한다',
         'ε 을 좁히면 결국 어떤 항도 띠 안에 들어오지 못한다 — 발산한다',
         'ε 을 좁히면 N 도 함께 작아진다'],
   chk(got, r, mem, pick){
     if(mem.d===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e2=noteNum(r[4]);
     if(!(e2 <= mem.eps/2 + 1e-9))
       return {ok:false, msg:'아직 ε = '+e2+' 입니다. ①에 적은 '+mem.eps+' 의 <b>절반 이하</b>로 띠를 좁히세요.'};
     const nm=String(r[5]).match(/N = (\\d+)/);
     if(!nm) return {ok:false, msg:'아직 띠 안에 머물지 못합니다 — 항을 더 쌓아 N 이 나오게 하세요.'};
     const N=+nm[1];
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e2)>0.003) return {ok:false, msg:'지금 화면의 ε 은 '+e2+' 입니다.'};
     if(Math.abs(got[1]-N)>0.5) return {ok:false, msg:'화면이 말하는 N 은 '+N+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'띠를 '+mem.eps+' 에서 '+e2+' 로 좁혔는데도 N = '+N+' 부터 계속 안에 있습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>아무리 좁은 ε 을 줘도 그에 맞는 N 이 있다</b>, 이것이 수렴의 정의입니다. 띠를 좁히면 N 은 커지지만 <b>언제나 존재</b>합니다. 조화급수에서는 이 N 이 아예 없습니다.'};
   }}
 ]},
"""


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[22]=' in h:
        print('이미 반영됨')
        return

    lesson = LESSON.replace('__PATH__', PATH).replace('__DOTS__', DOTS)

    for old, new, what in ((F_OLD, F_NEW, '급수 이름 붙이기'), (END_OLD, END_NEW, 'read() 추가')):
        assert h.count(old) == 1, '%s — 자리를 못 찾음 (%d곳)' % (what, h.count(old))
        h = h.replace(old, new, 1)

    a = 'LESSON[356]={'
    assert h.count(a) == 1, 'LESSON[356] 자리를 못 찾음'
    h = h.replace(a, lesson + a, 1)

    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1, 'NOTE_SPECS 끝을 못 찾음'
    h = h.replace(b, NOTE + b, 1)

    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 22 수업 모형 + 탐구 노트 삽입 — 파일 %.2f MB' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
