# -*- coding: utf-8 -*-
"""LAB 02 — 무엇을 넣어서 그렇게 됐는지 눈에 보이게.

지적받은 세 가지
  1) 「문제의 문자 ①」과 「②」 단추가 같은 색이라 어느 쪽을 넣었는지 구분이 안 된다.
  2) 넣었을 때 왜 그렇게 바뀌는지 시각적으로 이해가 안 된다.
  3) 「무료 당첨 클릭」이 왜 99.8% 인지 설명이 없다.

어떻게 고치나
  · 두 단추를 색으로 가른다 — ①은 장미(스팸 쪽), ②는 청록(정상 쪽). 단추에 실제 문장을 적어 둔다.
  · 지금 넣은 쪽 단추에 테두리를 둘러 「지금 이 문자」를 표시한다.
  · **갱신 표**를 새로 붙인다. 단어를 하나 더할 때마다
      스팸이면 곱할 값 · 정상이면 곱할 값 · 그래서 갱신된 P(스팸)
    을 한 줄씩 쌓아 보여 준다. 0.2 → 80.0% → 98.8% → 99.8% 이 눈으로 따라와진다.
    이것이 「왜 99.8% 인가」의 답이고, 칩을 누를 때마다 줄이 늘고 준다.

사용: python docs/LAB02_상호작용/patch_lab2b.py src/40-demos.js
"""
import sys, os

BTN_OLD = """    <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="b t sm" id="lb2q1">문제의 문자 ① 넣기</button>
      <button class="b t sm" id="lb2q2">문제의 문자 ② 넣기</button>
      <button class="b g sm" id="lb2cl">비우기</button></div>"""

BTN_NEW = """    <div class="ctl lb2qs" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="b sm lb2q q1" id="lb2q1"><b>문제의 문자 ①</b><span>[무료] 대출 당첨! 지금 클릭</span></button>
      <button class="b sm lb2q q2" id="lb2q2"><b>문제의 문자 ②</b><span>내일 회의 자료 감사합니다</span></button>
      <button class="b g sm" id="lb2cl">비우기</button></div>"""

CANVAS_OLD = """    <canvas id="lb2c" width="400" height="150"></canvas>"""
CANVAS_NEW = """    <canvas id="lb2c" width="400" height="150"></canvas>
    <div class="lb2calc" id="lb2calc"></div>"""

# draw() 안 — 미션 신호를 모으기 직전에 갱신 표를 그린다
HOOK_OLD = """    const st=[];
    if(S.q1&&S.q2&&S.eq[0]&&S.eq[1]&&S.eq[2]) st.push('🏁 미션1 달성');"""

HOOK_NEW = """    steps();
    const same=(a,b)=>a.length===b.length&&a.every(v=>b.includes(v));
    root.querySelector('#lb2q1').classList.toggle('on', same(S.sel,Q1));
    root.querySelector('#lb2q2').classList.toggle('on', same(S.sel,Q2));
    const st=[];
    if(S.q1&&S.q2&&S.eq[0]&&S.eq[1]&&S.eq[2]) st.push('🏁 미션1 달성');"""

# steps() 정의 — draw() 앞에 둔다
STEPS_ANCHOR = """  function draw(){
    table();
    root.querySelector('#lb2msg').innerHTML="""

STEPS_FN = """  /* 단어를 하나씩 더할 때마다 확률이 어떻게 갱신되는지 — 「왜 99.8% 인가」의 답 */
  function steps(){
    const el=root.querySelector('#lb2calc'); if(!el) return;
    if(!S.sel.length){
      el.innerHTML='<div class="lb2ch">칩을 누르거나 위 단추로 문자를 넣으면, <b>단어 하나가 들어올 때마다</b> 확률이 어떻게 갱신되는지 한 줄씩 쌓입니다.</div>';
      return;
    }
    let p=S.p;
    const rows=['<tr><th>시작 (아무 단어도 보기 전)</th><td>—</td><td>—</td><td><b>'+(p*100).toFixed(1)+'%</b></td></tr>'];
    S.sel.forEach(k=>{
      const ls=pw(k,0), lh=pw(k,1);
      const a=p*ls, b=(1-p)*lh, np=a/(a+b), up=np>p;
      rows.push('<tr><th>+ 「'+k+'」</th>'
        +'<td class="sp">×'+ls+'</td><td class="hm">×'+lh+'</td>'
        +'<td><b>'+(np*100).toFixed(1)+'%</b> <span style="color:'+(up?'#BE123C':'#0E9384')+'">'+(up?'▲':'▼')+'</span></td></tr>');
      p=np;
    });
    el.innerHTML='<div class="lb2ch">증거가 하나 들어올 때마다 — <b>앞 줄의 확률</b>에 스팸 쪽·정상 쪽 값을 곱해 다시 나눕니다</div>'
      +'<table class="lb2tbl calc"><tr><th></th><th class="sp">스팸이면</th><th class="hm">정상이면</th><th>갱신된 P(스팸)</th></tr>'
      +rows.join('')+'</table>'
      +'<div class="lb2cap">마지막 줄이 화면의 막대와 같은 값입니다. 한 단어가 얼마나 세게 밀었는지는 <b>두 곱셈값의 비</b>가 말해 줍니다 — 「무료」는 0.8 대 0.05 라 16배로 밉니다.</div>';
  }

""" + STEPS_ANCHOR

CSS = '''
/* LAB 02 — 두 문장 단추 구분 · 갱신 표 (2026-09-22) */
.lb2q{display:flex;flex-direction:column;align-items:flex-start;gap:1px;line-height:1.3;
      padding:5px 9px;border-radius:8px;color:#fff;border:1px solid transparent}
.lb2q b{font-size:12px}
.lb2q span{font-size:10.5px;opacity:.9}
.lb2q.q1{background:#BE123C}
.lb2q.q2{background:#0E9384}
.lb2q.on{box-shadow:0 0 0 3px #FDE68A}
.lb2calc{margin-top:8px}
.lb2ch{font-size:12px;font-weight:700;color:var(--ink2);margin-bottom:4px}
table.lb2tbl.calc th:first-child{text-align:left;background:#fff;font-weight:700}
table.lb2tbl.calc td{text-align:center}
'''


def main(path):
    h = open(path, encoding='utf-8').read()
    done, skip = [], []

    for name, old, new in [('두 문장 단추 구분', BTN_OLD, BTN_NEW),
                           ('갱신 표 자리', CANVAS_OLD, CANVAS_NEW),
                           ('draw() 에 연결', HOOK_OLD, HOOK_NEW),
                           ('steps() 정의', STEPS_ANCHOR, STEPS_FN)]:
        if new in h:
            skip.append(name)
            continue
        n = h.count(old)
        assert n == 1, '「%s」 자리를 %d 번 찾음' % (name, n)
        h = h.replace(old, new, 1)
        done.append(name)

    open(path, 'w', encoding='utf-8').write(h)
    print('고침 :', ' · '.join(done) if done else '(없음)')
    print('이미  :', ' · '.join(skip) if skip else '(없음)')

    css = os.path.join(os.path.dirname(os.path.abspath(path)), 'styles.css')
    if os.path.exists(css):
        c = open(css, encoding='utf-8').read()
        if '.lb2calc{' not in c:
            open(css, 'w', encoding='utf-8').write(c + CSS)
            print('styles.css 에 LAB 02 모양 추가')
        else:
            print('styles.css 이미 반영됨')


if __name__ == '__main__':
    main(sys.argv[1])
