# -*- coding: utf-8 -*-
"""LAB 02 「베이즈 스팸 필터」 수업 고도화 — LESSON[2] · PRINS[1] · LABS[1].note 교체, 삽화 4장(webp base64) 삽입.

작업지시(docs/실습과제_고도화_작업지시.md) 3절의 여섯 곳을 고친다.
  1 문제의 두 문장을 실험에서 실제로 판정한다 (문제의 문자 ①·② 단추)
  2 예상에서 세운 식을 수학 노트에 그대로 입력한다 (LAB 01 방식)
  3 완성된 확률(0.92)을 주지 않는다 — 100통 분할표를 세어서 구한다
  4 「나이브」가 왜 나이브인지 묻는다 (독립 가정이 깨지는 자리)
  5 적용을 희귀 질병 검사로 바꾼다 (한 번 계산으로 끝나던 0.5 문제 폐기)
  6 스팸 비율(사전확률) 슬라이더로 거짓양성을 장치로 만든다

삽화 네 장은 docs/썸네일_힉스필드/상황삽화/ 의 b02_problem·b02_what·b02_probe·b02_apply.webp 를 쓴다.
파일이 아직 없으면 그림 없이 나머지만 반영한다 — 나중에 그림만 받아 다시 돌리면 된다.

사용: python docs/LAB02_고도화/patch_lab2.py dist/index.html
"""
import sys, os, base64

HERE = os.path.dirname(os.path.abspath(__file__))
IMGD = os.path.join(os.path.dirname(HERE), '썸네일_힉스필드', '상황삽화')


def img(name, alt):
    """삽화 <img> 한 줄. webp 가 아직 없으면 빈 문자열 — 그림 없이도 패치가 돈다."""
    p = os.path.join(IMGD, name + '.webp')
    if not os.path.exists(p):
        p2 = os.path.join(HERE, name + '.webp')
        if not os.path.exists(p2):
            return ''
        p = p2
    b = base64.b64encode(open(p, 'rb').read()).decode()
    return '<img class="lsimg" src="data:image/webp;base64,%s" alt="%s">' % (b, alt)


LESSON = r'''LESSON[2]={
 title:'베이즈 스팸 필터',
 problem:{
  q:'“[무료] 대출 당첨! 지금 클릭” — 이 문자는 왜 스팸함으로 갔을까요? 그리고 “내일 회의 자료 감사합니다”는 왜 통과했을까요? 기계는 문장의 <b>뜻</b>을 모릅니다. 세어 둔 <b>숫자</b>만으로 두 문자를 갈랐습니다.',
  svg:`__B_PROBLEM__
   <svg viewBox="0 0 400 170" role="img" aria-label="두 문자가 확률 필터를 지나 스팸함과 수신함으로 갈라지는 그림">
    <g font-size="11">
      <rect x="12" y="16" width="150" height="40" rx="10" fill="#FCE7EB" stroke="#BE123C" stroke-width="1.5"/>
      <text x="24" y="33" font-weight="800" fill="#BE123C">[무료] 대출 당첨!</text>
      <text x="24" y="48" fill="#9F1239">지금 클릭</text>
      <rect x="12" y="108" width="150" height="40" rx="10" fill="#E7F7F5" stroke="#0E9384" stroke-width="1.5"/>
      <text x="24" y="125" font-weight="800" fill="#0B6E63">내일 회의 자료</text>
      <text x="24" y="140" fill="#0F766E">감사합니다</text>
    </g>
    <path d="M186 20 L232 46 L232 118 L186 145 Z" fill="#EFF4FF" stroke="#2563EB" stroke-width="1.6"/>
    <text x="209" y="72" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">100통을</text>
    <text x="209" y="86" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">세어 둔</text>
    <text x="209" y="100" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">표</text>
    <g stroke-width="1.8" fill="none">
      <path d="M162 36 L186 48" stroke="#BE123C"/>
      <path d="M162 128 L186 118" stroke="#0E9384"/>
      <path d="M232 56 L286 40" stroke="#BE123C"/>
      <path d="M232 110 L286 128" stroke="#0E9384"/>
    </g>
    <g font-size="11.5" font-weight="800" text-anchor="middle">
      <rect x="290" y="20" width="98" height="36" rx="8" fill="#FFF1F2" stroke="#BE123C" stroke-width="1.5"/>
      <text x="339" y="42" fill="#BE123C">🚫 스팸함</text>
      <rect x="290" y="112" width="98" height="36" rx="8" fill="#F0FDF9" stroke="#0E9384" stroke-width="1.5"/>
      <text x="339" y="134" fill="#0B6E63">📥 수신함</text>
    </g>
    <text x="209" y="160" font-size="10" fill="#6B7280" text-anchor="middle">같은 기계가 두 문자를 갈랐다 — 무엇을 세어 보고?</text>
  </svg>`,
  sit:'통신사 서버에 쌓인 문자 가운데 <b>100통</b>을 뽑아 두었습니다 — <b>스팸 20통 · 정상 80통</b>. 단어마다 “스팸 몇 통에 들어 있었나 · 정상 몇 통에 들어 있었나”가 세어져 있습니다. <b>생각 열기</b> ─ ① 「무료」가 든 문자는 모두 몇 통이고, 그중 스팸은 몇 통일까요? ② 그 비율은 “스팸인 문자 중 「무료」가 있는 비율”과 같은 수일까요? ③ 단어가 둘이면 두 확률을 곱해도 될까요? — 이 활동이 끝나면 여러분은 분할표에서 <b>조건부확률을 직접 세고</b>, 베이즈 정리로 두 방향을 잇게 됩니다.'
 },
 predict:{
  q:['「무료」가 들어 있는 문자가 스팸일 확률을 <b>분수로</b> 예상해 적으세요. 분자와 분모에 각각 무엇이 오는지도 쓰세요.',
     '왜 그렇게 생각했는지 — 100통을 네 칸(스팸·정상 × 단어 있음·없음)으로 나눈 표를 손으로 그리고, 어느 칸을 세었는지 표시하세요.',
     '「무료」와 「당첨」이 함께 든 문자의 확률을 두 확률의 <b>곱</b>으로 구해도 되는지, 안 된다면 언제 틀릴지 예상해 적으세요.'] },
 missions:[
  {t:'세어서 구하기 — 문제의 두 문자를 먼저 판정한 뒤, 「무료」의 분할표에서 세 값을 읽어 오른쪽 수학 노트 ①②③을 통과하세요.',
   re:'미션1 달성', do:'① 「문제의 문자 ①」·「②」 단추로 판정 ② 「무료」 칩을 눌러 분할표 보기 ③ 노트 ①②③ 에 표에서 센 수를 그대로',
   hand:'100통을 네 칸으로 나눈 표를 종이에 그리고 네 칸의 수를 채워 합이 100이 되는지 확인'},
  {t:'방향 뒤집기 — 「무료」 한 단어만 든 문자가 스팸일 확률을 베이즈 정리의 분자·분모로 노트 ④에 넣으세요. 표에서 <b>세어서</b> 구한 값과 같은지 확인하세요.',
   re:'미션2 달성', do:'분자 = P(무료|스팸)×P(스팸) · 분모 = 분자 + P(무료|정상)×P(정상) · 나눈 값이 답',
   hand:'“「무료」가 든 문자 20통 중 스팸이 16통”이 왜 베이즈로 구한 값과 같은지 한 줄로 설명'},
  {t:'나이브가 순진한 까닭 — 「무료 당첨」 문자의 확률을 ① 곱해서(나이브) ② 표에서 세어서 각각 구해 노트 ⑤에 넣으세요. 두 값이 다릅니다.',
   re:'미션3 달성', do:'① 「무료」·「당첨」 칩을 함께 넣으면 「함께 든 문자」 표가 열립니다 ② 곱해서 구한 값과 그 줄에서 센 값을 각각 노트 ⑤ 에',
   hand:'두 값이 어긋나는 이유를 “독립”이라는 낱말을 써서 설명하고, 어느 쪽이 참값인지 쓰기'}],
 inquiry:{
  id:'bay', title:'베이즈 스팸 필터 — 세어서 구하고, 뒤집어서 잇는다',
  q:['문자를 바꿔 가며 6줄 이상 기록하세요. <b>스팸 비율을 20%와 1%</b>로 바꾼 줄을 각각 넣으세요.',
     '같은 문자인데 스팸 비율만 내렸을 때 P(스팸)이 어떻게 달라졌는지 표에서 찾아 쓰세요.',
     'P(무료|스팸)과 P(스팸|무료)이 왜 다른 수인지, 각각 <b>분모가 무엇인지</b>로 손으로 설명하세요. 스팸이 드물어질수록 “「무료」가 들어 있다”는 증거가 왜 약해지는지도 쓰세요.'],
  cols:['문자 내용','단어 수','스팸 비율','P(스팸)','임계값','판정'],
  hint:'힌트 — 분자는 “스팸이면서 그 단어들이 나올 몫”, 분모는 “스팸이든 정상이든 그 단어들이 나올 몫의 합”입니다. 분모가 좁아지는 것이 조건부확률입니다.' },
 apply:{
  q:`__B_APPLY__
     새 문제 — 1000명 중 10명이 걸리는 병이 있습니다(유병률 1%). 검사는 병이 있으면 <b>90%</b>가 양성으로 나오고, 병이 없어도 <b>10%</b>는 양성으로 나옵니다. 양성 판정을 받은 사람이 <b>실제로 병일 확률</b>은 몇 %일까요? (소수 첫째 자리까지, 예: 12.5)`,
  a:8.3, tol:0.35,
  why:'1000명을 네 칸으로 나눠 세어 보면 — 병 10명 중 양성 9명, 건강한 990명 중 양성 99명. 양성은 모두 108명이고 그중 진짜 병은 9명입니다. 9/108 ≈ <b>8.3%</b>. 검사가 90%를 맞히는데도 양성인 사람 열에 아홉은 건강합니다. 병이 <b>드물기</b> 때문입니다 — 실험실에서 스팸 비율을 1%로 내렸을 때 「무료」의 힘이 약해진 것과 똑같은 일입니다.',
  hint:'1000명을 네 칸으로 나눠 세어 보세요. 스팸 분할표와 같은 모양의 표입니다. 분모는 “양성인 사람 전체”입니다.' },
 demo(root){
  /* 표본 100통 — 스팸 20 · 정상 80. 모든 칸이 정수라 손으로 검산된다.
     TBL[단어] = [스팸 20통 중 있음, 정상 80통 중 있음]
     P(무료|스팸)=16/20=0.8 · P(무료|정상)=4/80=0.05 · P(스팸|무료)=16/(16+4)=0.8 */
  const TBL={'무료':[16,4],'당첨':[10,2],'클릭':[12,8],'회의':[1,40],'감사':[2,48],'내일':[3,36]};
  const NS=20, NH=80;
  /* 「당첨」은 이 표본에서 늘 「무료」와 함께 온다 — 그래서 독립이 아니다.
     함께 든 문자: 스팸 10통 · 정상 2통 → 세어 보면 10/12 ≈ 0.833, 곱으로는 0.988 */
  const PAIR=[10,2];
  const Q1=['무료','당첨','클릭'], Q2=['내일','회의','감사'];
  root.innerHTML=`<div class="lb2wrap">
   <div class="lb2left">
    <div class="lb2h">📮 표본 100통 — 스팸 <b>20</b>통 · 정상 <b>80</b>통</div>
    <div class="ctl">단어 칩을 누르면 문자에 들어가고, <b>그 단어의 분할표</b>가 아래에 펼쳐집니다 (다시 누르면 빠집니다)</div>
    <div id="lb2chips" style="display:flex;gap:5px;flex-wrap:wrap;margin:6px 0"></div>
    <div id="lb2tbl"></div>
    <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="b t sm" id="lb2q1">문제의 문자 ① 넣기</button>
      <button class="b t sm" id="lb2q2">문제의 문자 ② 넣기</button>
      <button class="b g sm" id="lb2cl">비우기</button></div>
    <div id="lb2msg" class="lsnsit" style="min-height:34px;margin-top:6px">（빈 문자）</div>
    <canvas id="lb2c" width="400" height="150"></canvas>
    <div class="ctl" style="margin-top:2px">전체 문자 중 <b>스팸 비율</b>
      <input type="range" id="lb2p" min="1" max="50" step="1" value="20" style="width:120px">
      <span id="lb2pv">20%</span>
      <span style="color:#6B7280;font-size:11.5px">← 표본은 20%입니다. 내려 보세요.</span></div>
    <div class="note" style="margin-top:6px">막대 위 <b>임계값 △(주황)</b>을 끌면 스팸으로 볼 기준이 움직입니다. 기준을 어디 둘지는 수학이 정해 주지 않습니다.</div>
    <div class="out" id="lb2out"></div>
   </div>
   <div class="lg1math">
    <div class="lg1mh">✎ 수학 노트 — 화면이 아니라 표에서 세어 온다</div>
    <div class="eqc" data-n="0"><div class="eqt"><span class="eqn" style="background:#2563EB">①</span> 스팸의 비율 P(스팸)</div>
      <div class="eqf">P(스팸) = <input class="eqi" data-f="a"> / 100 = <input class="eqi w" data-f="v"></div>
      <div class="eqb"><button class="b t sm eqk">값 확인</button><span class="eqr"></span></div></div>
    <div class="eqc" data-n="1"><div class="eqt"><span class="eqn" style="background:#BE123C">②</span> 스팸 중에 「무료」가 있는 비율</div>
      <div class="eqf">P(무료|스팸) = <input class="eqi" data-f="a"> / <input class="eqi" data-f="b"> = <input class="eqi w" data-f="v"></div>
      <div class="eqb"><button class="b t sm eqk">값 확인</button><span class="eqr"></span></div></div>
    <div class="eqc" data-n="2"><div class="eqt"><span class="eqn" style="background:#0E9384">③</span> 정상 중에 「무료」가 있는 비율</div>
      <div class="eqf">P(무료|정상) = <input class="eqi" data-f="a"> / <input class="eqi" data-f="b"> = <input class="eqi w" data-f="v"></div>
      <div class="eqb"><button class="b t sm eqk">값 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-b="0" hidden><div class="eqt"><span class="eqn" style="background:#7C3AED">④</span> 방향 뒤집기 — 「무료」가 들어 있다면?</div>
      <div class="eqf">분자 = <input class="eqi w" data-f="n"> , 분모 = <input class="eqi w" data-f="d"></div>
      <div class="eqf">P(스팸|무료) = <input class="eqi w" data-f="v"></div>
      <div class="eqb"><button class="b t sm eqk2">베이즈 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-b="1" hidden><div class="eqt"><span class="eqn" style="background:#B45309">⑤</span> 「무료 당첨」 — 곱한 값과 세어 본 값</div>
      <div class="eqf">곱해서(나이브) = <input class="eqi w" data-f="n"></div>
      <div class="eqf">세어서(표) = <input class="eqi w" data-f="c"></div>
      <div class="eqb"><button class="b t sm eqk3">두 값 견주기</button><span class="eqr"></span></div></div>
    <div class="note" id="lb2pn" hidden>스팸 비율이 표본의 20%가 아닙니다. 노트 ①②③ 검사는 <b>표본 그대로(20%)</b>일 때만 합니다 — 슬라이더를 20%로 돌리세요.</div>
   </div>
  </div>`;
  const cv=root.querySelector('#lb2c'),ctx=cv.getContext('2d'),CW=400,CH=150;
  const S={ sel:[], show:'무료', th:0.5, p:0.2, q1:false, q2:false,
            eq:[false,false,false], bay:false, naive:false };
  const pw=(k,c)=>TBL[k][c]/(c?NH:NS);
  function prob(){
    if(!S.sel.length) return null;
    let a=S.p, b=1-S.p;
    S.sel.forEach(k=>{ a*=pw(k,0); b*=pw(k,1); });
    return a/(a+b);
  }
  function chips(){
    root.querySelector('#lb2chips').innerHTML=Object.keys(TBL).map(k=>
      `<button class="b ${S.sel.includes(k)?'t':'g'} sm" data-w="${k}" style="font-size:12px">${k}
         <span style="opacity:.6;font-size:10px">${TBL[k][0]}·${TBL[k][1]}</span></button>`).join('');
    root.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{
      const k=b.dataset.w, i=S.sel.indexOf(k);
      if(i>=0) S.sel.splice(i,1); else S.sel.push(k);
      S.show=k; chips(); draw(); });
  }
  function table(){
    const k=S.show,[s,h]=TBL[k], tot=s+h;
    root.querySelector('#lb2tbl').innerHTML=`<table class="lb2tbl"><caption>「${k}」 로 나눈 100통</caption>
      <tr><th></th><th class="sp">스팸 ${NS}통</th><th class="hm">정상 ${NH}통</th><th>합</th></tr>
      <tr class="hi"><th>「${k}」 있음</th><td class="sp">${s}</td><td class="hm">${h}</td><td><b>${tot}</b></td></tr>
      <tr><th>「${k}」 없음</th><td>${NS-s}</td><td>${NH-h}</td><td>${100-tot}</td></tr>
      <tr><th>합</th><td>${NS}</td><td>${NH}</td><td>100</td></tr></table>
      <div class="lb2cap">「${k}」가 있는 <b>가로줄만</b> 보면 분모가 100 → ${tot} 로 좁아집니다. 그 줄 안에서 스팸이 몇 통인지 세어 보세요 — 그 수가 P(스팸|「${k}」)의 분자입니다.</div>`
      /* 두 단어를 함께 넣으면 「함께 든 문자」를 따로 세어 보여 준다.
         이것이 없으면 미션 3 에서 셀 것이 화면에 없다 — 곱한 값과 견줄 상대가 필요하다. */
      + (S.sel.includes('무료')&&S.sel.includes('당첨')
        ? `<table class="lb2tbl" style="margin-top:8px"><caption>「무료」와 「당첨」이 <b>함께</b> 든 문자</caption>
      <tr><th></th><th class="sp">스팸</th><th class="hm">정상</th><th>합</th></tr>
      <tr class="hi"><th>둘 다 있음</th><td class="sp">${PAIR[0]}</td><td class="hm">${PAIR[1]}</td><td><b>${PAIR[0]+PAIR[1]}</b></td></tr></table>
      <div class="lb2cap">「당첨」이 든 문자는 스팸 ${TBL['당첨'][0]}통 · 정상 ${TBL['당첨'][1]}통인데, <b>전부</b> 「무료」와 함께 왔습니다. 곱해서 구한 값과 이 줄에서 센 값을 견주어 보세요.</div>` : '');
  }
  function draw(){
    table();
    root.querySelector('#lb2msg').innerHTML=S.sel.length?('「'+S.sel.join(' ')+'」'):'（빈 문자）';
    root.querySelector('#lb2pv').textContent=(S.p*100).toFixed(0)+'%';
    root.querySelector('#lb2pn').hidden=Math.abs(S.p-0.2)<1e-9;
    root.querySelectorAll('.eqc.ln').forEach(el=>{
      el.hidden = el.dataset.b==='0' ? !(S.eq[0]&&S.eq[1]&&S.eq[2]) : !S.bay; });
    ctx.clearRect(0,0,CW,CH); ctx.fillStyle='#fff'; ctx.fillRect(0,0,CW,CH);
    const p=prob(), bx=30,bw=CW-60,by=54,bh=30;
    ctx.fillStyle='#F3F4F6'; ctx.fillRect(bx,by,bw,bh);
    ctx.textAlign='left';
    if(p!==null){
      ctx.fillStyle=p>=S.th?'#BE123C':'#0E9384'; ctx.fillRect(bx,by,bw*p,bh);
      ctx.fillStyle='#111827'; ctx.font='bold 13px sans-serif';
      ctx.fillText('P(스팸) = '+(p*100).toFixed(1)+'%', bx, by-10);
    } else { ctx.fillStyle='#9CA3AF'; ctx.font='12px sans-serif';
      ctx.fillText('단어를 넣으면 확률이 계산됩니다', bx, by-10); }
    const tx=bx+bw*S.th;
    ctx.strokeStyle='#B45309'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(tx,by-6); ctx.lineTo(tx,by+bh+6); ctx.stroke();
    ctx.fillStyle='#B45309'; ctx.beginPath(); ctx.moveTo(tx,by+bh+18);
    ctx.lineTo(tx-7,by+bh+6); ctx.lineTo(tx+7,by+bh+6); ctx.closePath(); ctx.fill();
    ctx.font='bold 10.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('임계값 '+(S.th*100).toFixed(0)+'%', tx, by+bh+32);
    let msg='';
    if(p!==null){
      msg=`판정: ${p>=S.th?'<b style="color:#BE123C">스팸함으로 이동</b>':'<b style="color:#0E9384">정상 수신함</b>'} (P ${p>=S.th?'≥':'<'} 임계값)`;
      const only무료=S.sel.length===1&&S.sel[0]==='무료';
      if(only무료&&S.p<=0.05) msg+='<br><span style="color:#B45309">스팸이 드물어지자 같은 「무료」 한 단어로는 더 이상 스팸이라 말할 수 없습니다 — 증거는 그대로인데 <b>사전확률</b>이 바뀌었습니다.</span>';
    }
    const st=[];
    if(S.q1&&S.q2&&S.eq[0]&&S.eq[1]&&S.eq[2]) st.push('🏁 미션1 달성');
    if(S.bay) st.push('🏁 미션2 달성');
    if(S.naive) st.push('🏁 미션3 달성');
    root.querySelector('#lb2out').innerHTML=msg+(st.length?'<div style="margin-top:6px;font-weight:800;color:#0E9384">'+st.join(' · ')+'</div>':'');
  }
  const num=el=>{ const v=parseFloat(String(el.value).replace(/[^0-9.\-]/g,'')); return isFinite(v)?v:NaN; };
  const near=(a,b,t)=>Math.abs(a-b)<=(t||0.004);
  const lock=()=>Math.abs(S.p-0.2)>1e-9;
  /* 노트 ①②③ — 표에서 센 수 그대로 */
  const WANT=[[20,null,0.2],[16,20,0.8],[4,80,0.05]];
  root.querySelectorAll('.eqc[data-n]').forEach(el=>{ const n=+el.dataset.n;
    el.querySelector('.eqk').onclick=()=>{ const r=el.querySelector('.eqr');
      if(lock()){ r.innerHTML='<span style="color:#B45309">스팸 비율을 20%로 돌린 뒤 검사하세요.</span>'; return; }
      const a=num(el.querySelector('[data-f=a]')), v=num(el.querySelector('[data-f=v]'));
      const bEl=el.querySelector('[data-f=b]'), b=bEl?num(bEl):null, W=WANT[n];
      const ok=near(a,W[0],0.001)&&(W[1]===null||near(b,W[1],0.001))&&near(v,W[2]);
      S.eq[n]=ok;
      r.innerHTML=ok?'<b style="color:#0E9384">통과 — 표에서 센 그대로입니다</b>'
        :(n>0&&near(a,W[0],0.001)&&b!==null&&near(b,100,0.001)
            ? '<span style="color:#BE123C">분모가 100 이 아닙니다. 「스팸 중에서」이므로 분모는 스팸 통수입니다.</span>'
            : '<span style="color:#BE123C">표의 칸을 다시 세어 보세요 — 어느 줄, 어느 칸입니까?</span>');
      draw(); }; });
  /* 노트 ④ — 베이즈로 방향 뒤집기 */
  root.querySelector('.eqc[data-b="0"] .eqk2').onclick=()=>{
    const el=root.querySelector('.eqc[data-b="0"]'), r=el.querySelector('.eqr');
    if(lock()){ r.innerHTML='<span style="color:#B45309">스팸 비율을 20%로 돌린 뒤 검사하세요.</span>'; return; }
    const n=num(el.querySelector('[data-f=n]')), d=num(el.querySelector('[data-f=d]')), v=num(el.querySelector('[data-f=v]'));
    const okn=near(n,0.16,0.002), okd=near(d,0.2,0.002), okv=near(v,0.8,0.006);
    S.bay=okn&&okd&&okv;
    r.innerHTML=S.bay?'<b style="color:#0E9384">통과 — 0.16 / 0.2 = 0.8. 표에서 센 16/20 과 같은 수입니다 🎯</b>'
      :(okn&&!okd?'<span style="color:#BE123C">분모에 정상 쪽을 더하지 않았습니다 — 0.05 × 0.8 을 더해 보세요.</span>'
        :'<span style="color:#BE123C">분자는 P(무료|스팸)×P(스팸), 분모는 그것에 P(무료|정상)×P(정상)을 더한 값입니다.</span>');
    draw(); };
  /* 노트 ⑤ — 나이브(곱)와 세어 본 값 */
  root.querySelector('.eqc[data-b="1"] .eqk3').onclick=()=>{
    const el=root.querySelector('.eqc[data-b="1"]'), r=el.querySelector('.eqr');
    if(lock()){ r.innerHTML='<span style="color:#B45309">스팸 비율을 20%로 돌린 뒤 검사하세요.</span>'; return; }
    const n=num(el.querySelector('[data-f=n]')), c=num(el.querySelector('[data-f=c]'));
    const okn=near(n,0.988,0.008), okc=near(c,PAIR[0]/(PAIR[0]+PAIR[1]),0.008);
    S.naive=okn&&okc;
    r.innerHTML=S.naive?`<b style="color:#0E9384">통과 — 곱하면 0.988, 세어 보면 ${PAIR[0]}/${PAIR[0]+PAIR[1]} ≈ 0.833. 곱이 확률을 부풀렸습니다.</b>
        <br><span style="color:#B45309">이 표본에서 「당첨」은 늘 「무료」와 함께 옵니다 — 두 단어는 <b>독립이 아닙니다</b>. 나이브 베이즈의 “나이브”가 바로 이 가정입니다.</span>`
      :(okn&&!okc?`<span style="color:#BE123C">세어 보는 쪽이 틀렸습니다. 두 단어가 <b>함께</b> 든 문자만 세세요 — 스팸 ${PAIR[0]}통, 정상 ${PAIR[1]}통입니다.</span>`
        :'<span style="color:#BE123C">곱하는 쪽은 0.2×0.8×0.5 를 분자로, 거기에 0.8×0.05×0.025 를 더해 분모로 두세요.</span>');
    draw(); };
  /* 문제의 두 문자 — 실험에서 실제로 판정한다 */
  root.querySelector('#lb2q1').onclick=()=>{ S.sel=Q1.slice(); S.show='무료'; S.q1=true; chips(); draw(); };
  root.querySelector('#lb2q2').onclick=()=>{ S.sel=Q2.slice(); S.show='회의'; S.q2=true; chips(); draw(); };
  root.querySelector('#lb2cl').onclick=()=>{ S.sel=[]; chips(); draw(); };
  root.querySelector('#lb2p').oninput=e=>{ S.p=+e.target.value/100; draw(); };
  dragOn(cv,{ hit:p=>Math.abs(p.x-(30+(CW-60)*S.th))<16&&p.y>40?'t':null,
    move:(h,p)=>{ S.th=Math.max(0.05,Math.min(0.95,Math.round((p.x-30)/(CW-60)*100)/100)); draw(); } });
  chips(); draw();
  return { read:()=>{ const p=prob(); if(p===null) return null;
    return ['「'+S.sel.join(' ')+'」', S.sel.length, (S.p*100).toFixed(0)+'%',
            (p*100).toFixed(1)+'%', (S.th*100).toFixed(0)+'%', p>=S.th?'스팸':'정상']; } };
 }
};
'''

PRIN = r'''{tex:[
  {t:'P(A \\mid B)=\\frac{P(A \\cap B)}{P(B)}', s:'분모가 <b>전체가 아니라 이미 알고 있는 사건 B</b> 입니다. 표에서 가로줄 하나만 보는 것이 바로 이것입니다 — 100통이 20통으로 좁아집니다.'},
  {t:'P(S \\mid \\text{무료})=\\frac{16}{16+4}=0.8', s:'분할표에서 <b>세어서</b> 구한 값입니다. 「무료」가 든 문자 20통 가운데 스팸이 16통. 공식을 쓰기 전에 이 수가 먼저 나와야 합니다.'},
  {t:'P(S \\mid w)=\\frac{P(w \\mid S)\\,P(S)}{P(w \\mid S)\\,P(S)+P(w \\mid N)\\,P(N)}', s:'같은 값을 <b>방향을 뒤집어</b> 구한 것이 베이즈 정리입니다. 0.8×0.2 = 0.16 을 0.16+0.05×0.8 = 0.2 로 나누면 0.8 — 세어서 구한 값과 정확히 같습니다. 세는 길이 막혔을 때(표본이 없을 때) 쓰는 길입니다.'},
  {t:'P(S \\mid w_1,w_2)\\approx\\frac{P(w_1 \\mid S)\\,P(w_2 \\mid S)\\,P(S)}{\\cdots}', s:'단어가 둘이면 <b>서로 독립이라 가정</b>하고 곱합니다. 이 표본에서 「당첨」은 늘 「무료」와 함께 오므로 독립이 아닙니다 — 곱하면 0.988, 세어 보면 10/12 ≈ 0.833. 나이브 베이즈의 “나이브(순진한)”가 이 가정을 가리킵니다.'}
 ],
 next:[
  {lv:'바로',   t:'내 문자함으로 분할표 만들기', d:'실제 받은 광고 문자 10통과 정상 문자 10통을 골라 자주 나오는 단어가 각각 몇 통에 있었는지 <b>세어 표를 만듭니다</b>. 그 표로 새 문자 한 통을 손으로 판정해 보세요.'},
  {lv:'심화',   t:'처음 보는 단어와 라플라스 보정', d:'사전에 없는 단어는 확률이 0 이 되어 전체 곱이 0 이 됩니다. 모든 칸에 1 을 더하는 <b>라플라스 보정</b>을 분할표에 직접 적용하고, 왜 그것이 타당한지 설명해 보세요.'},
  {lv:'프로젝트', t:'오류의 값이 다를 때 기준 정하기', d:'정상을 스팸으로 막은 오류와 스팸을 통과시킨 오류 중 <b>어느 쪽이 더 비싼지</b> 정하고, 그에 맞게 임계값을 옮긴 뒤 근거를 문서로 남깁니다. 이 문서가 그대로 수행평가의 「판정 기준」 항목이 됩니다.'}
 ],
 eq:'P(A|B) = P(A ∩ B) / P(B)',
 what:'__B_WHAT__분모가 <b>전체가 아니라 “이미 알고 있는 것”</b>이라는 점이 이 단원의 전부입니다. 100통 표에서 「무료」가 있는 가로줄만 보면 분모가 20 으로 좁아지고, 그 안에서 스팸은 16 통 — 0.8 입니다. 같은 값을 세지 않고 구하는 길이 베이즈 정리이고, 둘이 같은 수로 만나는 장면이 이 수업의 고비입니다.',
 probe:'__B_PROBE__단어를 하나씩 넣고 빼며 확률이 어떻게 뛰는지 보세요. 그다음 <b>스팸 비율 슬라이더</b>를 20% 에서 1% 로 내려 보십시오. 증거(「무료」)는 그대로인데 판정이 뒤집힙니다 — 드문 일일수록 거짓양성이 참양성을 압도합니다. 「무료 당첨」에서는 곱한 값과 세어 본 값이 어긋나는데, 그 간극이 <b>독립 가정</b>의 값입니다.',
 link:'조건부확률의 정의를 세운 직후에 씁니다. 순서를 지키십시오 — <b>표에서 세기 → 방향 뒤집기(베이즈) → 두 값이 같음을 확인 → 독립 가정이 깨지는 자리</b>. 마지막의 스팸 비율 슬라이더는 <b>“양성 판정 ≠ 질병”</b> 을 그대로 예고하며, 적용 문제(유병률 1%, 9/108 ≈ 8.3%)가 같은 표로 풀립니다. 평가는 노트 ①~⑤의 수치와 탐구 보고서(사전확률이 판단을 바꾸는 까닭)로 합니다.'},
'''

NOTE = r'''note:'50분 흐름 — 문제 5분 → 예상 5분(분수로 예상) → 실험 15분(문제의 두 문자 판정 → 분할표 세기 ①②③ → 베이즈 ④ → 독립 ⑤) → 기록·발견 10분 → 원리 5분 → 적용 5분(희귀 질병). 핵심은 <b>확률을 주지 않고 세게 하는 것</b>입니다: 화면은 완성된 값을 보여 주지 않고 100통 분할표만 보여 주며, 미션은 표에서 센 수를 노트에 넣어야 열립니다. 발문 — “분모가 무엇인가?”, “세어서 구한 값과 베이즈로 구한 값이 왜 같은가?”, “곱해도 되는가?”. 스팸 비율을 1%로 내리면 같은 「무료」의 판정이 뒤집히는데, 이것이 적용 문제의 거짓양성과 같은 구조이고 <b>수행평가의 「판정 기준」 항목</b>으로 이어집니다.','''

CSS = r'''
/* LAB 02 수업 고도화 — 분할표·수학 노트 (2026-09-18) */
.lb2wrap{display:grid;grid-template-columns:minmax(300px,440px) 1fr;gap:14px;align-items:start}
@media(max-width:820px){.lb2wrap{grid-template-columns:1fr}}
.lb2left canvas{width:100%;max-width:420px;height:auto;background:#fff;border:1px solid var(--line);border-radius:10px}
.lb2h{font-size:12.5px;font-weight:800;color:var(--ink);margin-bottom:6px}
table.lb2tbl{border-collapse:collapse;width:100%;max-width:420px;font-size:12.5px;margin-top:4px}
table.lb2tbl caption{text-align:left;font-weight:800;font-size:12px;color:var(--ink2);padding-bottom:4px}
table.lb2tbl th,table.lb2tbl td{border:1px solid var(--line);padding:4px 6px;text-align:center}
table.lb2tbl th{background:#F7F9FC;font-weight:700}
table.lb2tbl td.sp,table.lb2tbl th.sp{color:#BE123C}
table.lb2tbl td.hm,table.lb2tbl th.hm{color:#0E9384}
table.lb2tbl tr.hi td,table.lb2tbl tr.hi th{background:#FFF7ED;font-weight:800}
.lb2cap{font-size:11.5px;color:var(--ink2);margin-top:4px;line-height:1.6}
'''


def main(path):
    h = open(path, encoding='utf-8').read()

    # 1) LESSON[2]
    i = h.find('LESSON[2]={')
    j = h.find('/* ---------- LAB 03', i)
    assert i > 0 and j > i, 'LESSON[2] 자리를 못 찾음'
    L = (LESSON
         .replace('__B_PROBLEM__', img('b02_problem', '문자 한 통은 휴지통으로, 다른 한 통은 받은편지함으로 갈라지는 그림'))
         .replace('__B_APPLY__', img('b02_apply', '양성으로 표시된 검사지와, 수많은 점 가운데 하나만 강조된 그림')))
    h = h[:i] + L + '\n' + h[j:]

    # 2) PRINS[1] — 배열 원소는 줄머리의 '{tex:[' 로 시작한다
    k = h.find('const PRINS = [')
    assert k > 0, 'PRINS 배열을 못 찾음'
    starts = []
    pos = k
    while len(starts) < 3:
        pos = h.find('\n{tex:[', pos + 1)
        assert pos > 0, 'PRINS 원소 경계를 못 찾음'
        starts.append(pos + 1)
    Pn = (PRIN
          .replace('__B_WHAT__', img('b02_what', '100개의 점을 네 칸으로 나눈 격자에서 한 열만 들어 올려 분모가 좁아지는 그림'))
          .replace('__B_PROBE__', img('b02_probe', '단어 조각이 하나씩 올라갈 때마다 더 기우는 저울')))
    h = h[:starts[1]] + Pn + h[starts[2]:]

    # 3) LABS[1].note
    n0 = h.find("{n:2,core:1,t:'“이 문자, 스팸일까?” 베이즈 분류기'")
    n1 = h.find("note:'", n0)
    n2 = h.find("',\n build:bayesDemo", n1)
    assert n0 > 0 and n1 > n0 and n2 > n1, 'LABS[1].note 자리를 못 찾음'
    h = h[:n1] + NOTE.rstrip(',') + h[n2 + len("'"):]

    # 4) CSS
    if '.lb2wrap{' not in h:
        h = h.replace('</style>', CSS + '</style>', 1)

    open(path, 'w', encoding='utf-8').write(h)
    print('patched; size MB', round(len(h.encode('utf-8')) / 1048576, 2))


if __name__ == '__main__':
    main(sys.argv[1])
