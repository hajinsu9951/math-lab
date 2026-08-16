/* ---------- 코드 생성 엔진 (레벨 1~7 누적) ---------- */
function genLab(key, lv){
  const S = VLAB[key], L = [];
  L.push('<!DOCTYPE html>');
  L.push('<html lang="ko">');
  L.push('<head>');
  L.push('<meta charset="utf-8">');
  if(lv>=7) L.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
  L.push('<title>'+S.q+'</title>');
  L.push('<style>');
  BASECSS.forEach(x=>L.push(x));
  if(lv>=7) L.push('  .guide{margin-top:18px;padding:12px 14px;background:#F5F7FA;border-left:3px solid #2563EB;font-size:13.5px;line-height:1.9}');
  L.push('</style>');
  L.push('</head>');
  L.push('<body>');
  if(lv>=7) L.push('<p style="color:#2563EB;font-weight:700;font-size:13px">학습 목표 — '+S.obj+'</p>');
  L.push('<h1>'+S.q+'</h1>');
  if(lv===1) L.push('<p style="color:#888">(여기에 수학 모델 · 조작 요소 · 그래프가 들어갈 예정)</p>');
  if(lv>=2) L.push('<p>모델 : <b>'+S.eq+'</b></p>');
  if(lv>=3) S.body3.forEach(x=>L.push(x));
  if(lv>=4) S.body4.forEach(x=>L.push(x));
  if(lv>=6) S.body6.forEach(x=>L.push(x));
  if(lv>=7){
    L.push('<div class="guide">');
    S.guide.forEach((g,i)=>L.push('  '+(i+1)+'. '+g+(i<S.guide.length-1?'<br>':'')));
    L.push('</div>');
  }
  if(lv>=2){
    L.push('<script>');
    S.js2.forEach(x=>L.push(x));
    if(lv>=3) S.js3.forEach(x=>L.push(x));
    if(lv>=5) S.js5.forEach(x=>L.push(x));
    else if(lv>=4) S.js4.forEach(x=>L.push(x));
    if(lv>=6) S.js6.forEach(x=>L.push(x));
    if(lv>=3){
      L.push('function update(){');
      L.push('  if(typeof readInputs === "function") readInputs();');
      L.push('  if(typeof draw === "function") draw();');
      L.push('  if(typeof check === "function") check();');
      L.push('}');
      S.events.forEach(x=>L.push(x));
      L.push('update();');
    }
    L.push('<\/script>');
  }
  L.push('</body>');
  L.push('</html>');
  return L.join('\n');
}

/* ---------- 7라운드 시나리오 ---------- */
const RMETA=[
 {tt:'뼈대 만들기',      goal:'아직 아무것도 없습니다. <b>무엇을, 어떤 형태로</b> 만들지부터 못박습니다.'},
 {tt:'수학 원리 심기',   goal:'이제 <b>수학</b>을 넣습니다. 식을 교과서 형태 그대로 불러 줍니다.'},
 {tt:'학생이 만질 것',   goal:'보기만 하는 자료는 그림입니다. <b>무엇을 만지면 무엇이 바뀌는지</b>를 지시합니다.'},
 {tt:'눈에 보이게',      goal:'숫자만으로는 부족합니다. 화면에 그려 올립니다. 그리고 <b>반드시 눌러 봅니다.</b>'},
 {tt:'잘못된 곳 고치기 ★', goal:''},
 {tt:'활동·피드백 붙이기', goal:'탐구를 <b>활동</b>으로 바꿉니다. 판정 기준을 숫자로 줍니다.'},
 {tt:'교실에 내보내기',  goal:'수업에서 바로 쓸 수 있게 마무리합니다.'}
];
const RCOACH=[
 '<b>왜 이렇게 시작하나</b> — ① 산출물의 형태(HTML 한 파일) ② 제약(외부 라이브러리 금지) ③ <b>지금 할 것만</b>. 이 셋을 먼저 고정합니다. 한 번에 다 시키면 나중에 어디를 고쳐야 할지 못 찾습니다. “파일 하나” 원칙 덕분에 설치·서버·로그인 없이 학생에게 그대로 배포됩니다.',
 '<b>수학은 AI에게 맡기지 마세요.</b> 식을 그대로 적어 주는 것이 핵심입니다. “이차함수로 만들어 줘”라고만 하면 교과서와 다른 형태로 나옵니다. 변수의 <b>이름·범위·초기값</b>까지 지정해야 우리 학년 수준에 맞는 자료가 됩니다.',
 '<b>조작 요소 = 탐구의 입구.</b> “슬라이더를 만들어 줘”로 끝내지 말고 <b>“움직이면 무엇이 바뀌는지”</b>까지 한 문장에 넣으세요. 학생이 직접 바꿔 보는 순간 개념이 몸에 남습니다.',
 '<b>AI가 “되었습니다”라고 해도 믿지 마세요.</b> 오른쪽 미리보기를 직접 조작해 보십시오. 지금 화면에 분명히 이상한 점이 있습니다. 그것을 찾아내는 것이 다음 라운드의 재료입니다.',
 '',
 '<b>즉시 피드백이 있으면 학생이 스스로 100번 시도합니다.</b> “정답이면 알려 줘”가 아니라 <b>판정 기준을 숫자로</b> 주세요. 이 한 줄이 그대로 평가 루브릭의 “상” 기준이 됩니다.',
 '<b>끝나고 반드시 검산하세요.</b> 수식·단위·범위는 AI가 자주 틀립니다. 선생님이 직접 두세 값을 손으로 계산해 맞춰 보는 것까지가 자료 제작입니다. 완성 파일은 클래스룸에 올리고 QR로 배포하면 됩니다.'
];
function rounds(key){
  const S = VLAB[key];
  const P = [
`중·고등학교 수학 수업에 쓸 학습자료를 만들 거야.
조건: HTML 파일 하나로만 만들고, CSS와 자바스크립트는 그 안에 넣어 줘. 외부 라이브러리는 쓰지 마.
지금은 제목과 도입 질문만 있는 뼈대만 만들어 줘. 계산이나 그래프는 아직 넣지 마.

제목(도입 질문): ${S.q}`,

`이제 수학을 넣자.
원리: ${S.model}
식: ${S.eq}
준비할 값: ${S.params}

계산에 쓸 값과 함수를 만들어 줘. 아직 화면에 그리지는 말고.`,

`이제 학생이 직접 만질 수 있게 해 줘.
만들 것: ${S.controls}
조작하면 현재 값이 화면에 바로 보이게 해 줘.`,

`이제 결과를 눈에 보이게 그려 줘.
그릴 것: ${S.viz}
학생이 값을 바꾸면 즉시 다시 그려져야 해.`,

 S.fixask,

`이제 활동을 하나 넣자.
${S.act}
판정 기준은 숫자로 정확히 정해 줘.`,

`마무리하자.
① 휴대폰에서도 화면이 깨지지 않게 해 줘.
② 맨 아래에 학생용 안내문 3줄을 넣어 줘.
③ 이 활동의 학습 목표를 한 줄로 맨 위에 적어 줘.`
  ];
  const A = [
   '단일 HTML 파일로 뼈대를 만들었습니다. 제목과 도입 질문만 넣었고, 여기에 계산·조작·그래프를 얹으면 됩니다.',
   '주신 식 그대로 값과 함수를 준비했습니다. 값을 바꾸면 계산 결과가 따라 바뀝니다.',
   '조작 요소를 추가하고, 값이 바뀔 때마다 화면의 숫자가 즉시 갱신되도록 연결했습니다.',
   '화면에 그렸고, 값이 바뀌면 다시 그리도록 연결했습니다. 확인해 보세요.',
   '말씀하신 부분을 수정했습니다. 다시 확인해 보세요.',
   '활동과 판정 기준을 추가했습니다. 기준을 넘으면 바로 표시됩니다.',
   '모바일 대응, 학습 목표 한 줄, 학생용 안내문 3줄을 추가했습니다. 이제 내려받아 바로 쓰실 수 있습니다.'
  ];
  return RMETA.map((m,i)=>({
    lv:i+1, tt:m.tt,
    goal:i===4 ? `<b>증상</b> — ${S.bug}` : m.goal,
    p:P[i], ai:A[i],
    coach: i===4
      ? `<b>여기가 바이브 코딩의 진짜 본체입니다.</b> AI는 한 번에 맞히지 않습니다. 중요한 것은 “고쳐 줘”가 아니라 <b>학생이 보는 화면 기준으로 증상을 말하는 것</b>입니다 — “${S.bug.split('.')[0]}”처럼요. 오류 메시지가 뜬다면 그 문장을 그대로 붙여넣는 것이 가장 빠릅니다. 연수에서 선생님들이 가장 많이 막히는 지점이자, 넘고 나면 자신감이 가장 크게 붙는 지점입니다.`
      : RCOACH[i]
  }));
}

/* ---------- 상태 ---------- */
const V={key:'gps', r:0, sent:[], prev:''};

/* ---------- 실험실 선택 ---------- */
function labPicker(){
  $('#picker').innerHTML = Object.keys(VLAB).map((k,i)=>{
    const S=VLAB[k];
    return `<div class="pcard ${k===V.key?'on':''}" data-k="${k}">
      <div class="pn">LAB ${String(i+1).padStart(2,'0')}</div>
      <div class="pt">${S.t}</div>
      <div class="pg">${S.grade}</div></div>`;}).join('');
  $('#picker').querySelectorAll('.pcard').forEach(c=>c.onclick=()=>{
    V.key=c.dataset.k;
    $('#picker').querySelectorAll('.pcard').forEach(x=>x.classList.remove('on'));
    c.classList.add('on');
    startLab();});
}

/* ---------- 모드 ---------- */
document.querySelectorAll('#modeSeg button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#modeSeg button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  const ai=b.dataset.m==='ai';
  $('#aiMode').style.display=ai?'block':'none';
  $('#clickMode').style.display=ai?'none':'block';
  if(!ai) clickInit();});

/* ---------- AI 대화 모드 ---------- */
function startLab(){
  V.r=0; V.sent=[]; V.prev='';
  $('#chat').innerHTML=''; $('#finish').style.display='none'; $('#composer').style.display='block';
  $('#coach').innerHTML='';
  const S=VLAB[V.key];
  say('ai',`좋습니다. <b>“${S.q}”</b> 자료를 함께 만들죠. 한 번에 다 말하지 말고 <b>한 단계씩</b> 요청해 주세요.`,true);
  $('#pv').srcdoc='<body style="font-family:sans-serif;color:#999;padding:30px">아직 아무것도 없습니다. ROUND 1을 보내 보세요.</body>';
  $('#code').textContent=''; $('#difftip').innerHTML='';
  loadRound();
}
function say(who,html,instant){
  const b=el(`<div class="bub ${who}"><div class="who">${who==='ai'?'AI':'선생님'}</div><div class="tx"></div></div>`);
  $('#chat').appendChild(b); const tx=b.querySelector('.tx');
  if(instant||who==='me'){tx.innerHTML=html; sc(); return Promise.resolve();}
  tx.innerHTML='<span class="dots"><i></i><i></i><i></i></span>'; sc();
  return new Promise(res=>setTimeout(()=>{tx.innerHTML=html;sc();res();},650));
}
function sc(){const c=$('#chat');c.scrollTop=c.scrollHeight;}
function dots(){
  const R=rounds(V.key);
  $('#rdots').innerHTML=R.map((r,i)=>
    `<span class="rd ${i<V.r?'done':i===V.r?'now':''}">${i+1}</span>`).join('')
    +`<span class="rlab">${V.r<7?R[V.r].tt:'완성'}</span>`;
}
function loadRound(){
  const R=rounds(V.key); dots();
  if(V.r>=R.length){
    $('#composer').style.display='none';
    $('#finish').style.display='block'; return;
  }
  const r=R[V.r];
  $('#goal').innerHTML=`<b>ROUND ${V.r+1}. ${r.tt}</b><br>${r.goal}`;
  $('#prompt').value='';
  $('#prompt').placeholder='AI에게 할 말을 직접 써 보세요. 막히면 아래 “모범 프롬프트 넣기”를 누르세요.';
}
$('#reveal').onclick=()=>{ $('#prompt').value=rounds(V.key)[V.r].p; };
$('#send').onclick=async()=>{
  const R=rounds(V.key), r=R[V.r];
  let txt=$('#prompt').value.trim(); if(!txt) txt=r.p;
  V.sent.push({round:V.r+1,title:r.tt,prompt:txt});
  $('#send').disabled=true; $('#reveal').disabled=true;
  await say('me', esc(txt).replace(/\n/g,'<br>'), true);
  await say('ai', r.ai);
  const n=applyLevel(r.lv);
  await say('ai', `<span class="meta">코드 <b>${n}줄</b>이 추가·수정되었습니다. 오른쪽 화면에서 직접 확인해 보세요.</span>`, true);
  V.r++; $('#send').disabled=false; $('#reveal').disabled=false;
  loadRound();
  $('#coach').innerHTML=`<div class="ct">코치</div>${r.coach}`;
};
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function applyLevel(lv){
  const code=genLab(V.key,lv);
  const prev=new Set(V.prev.split('\n'));
  const lines=code.split('\n');
  const n=lines.filter(l=>l.trim()&&!prev.has(l)).length;
  $('#code').innerHTML=lines.map(l=>{
    const t=esc(l)||'&nbsp;';
    return (l.trim()&&!prev.has(l))?`<span class="hl">${t}</span>`:t;}).join('\n');
  V.prev=code; window.__code=code;
  $('#pv').srcdoc=code;
  $('#pvStep').textContent=` — ROUND ${lv} 반영`;
  $('#difftip').innerHTML=`<b>+${n}줄</b> 변경됨 · 총 ${lines.length}줄`;
  $('#pvWrap').classList.add('flash'); setTimeout(()=>$('#pvWrap').classList.remove('flash'),600);
  return n;
}
document.querySelectorAll('#viewSeg button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#viewSeg button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  const cd=b.dataset.v==='cd';
  $('#codebox').style.display=cd?'block':'none';
  $('#pvWrap').style.display=cd?'none':'block';});
$('#restart').onclick=startLab;
$('#dlHtml').onclick=()=>dl(window.__code||'', VLAB[V.key].t+'.html','text/html');
$('#dlLog').onclick=()=>{
  const S=VLAB[V.key];
  const t=`[바이브 코딩 프롬프트 기록]\n실험실: ${S.t}\n질문: ${S.q}\n모델: ${S.eq}\n\n`
   + V.sent.map(s=>`── ROUND ${s.round}. ${s.title}\n${s.prompt}\n`).join('\n');
  dl(t, S.t+'_프롬프트기록.txt','text/plain');};
function dl(text,name,type){
  const b=new Blob([text],{type:type+';charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(b);
  a.download=name.replace(/[\\/:*?"<>|]/g,''); a.click(); URL.revokeObjectURL(a.href);}

/* ---------- 클릭 조립 모드 (참고용) ---------- */
const CB={key:'gps', lv:0};
function clickInit(){
  $('#cbSel').innerHTML=Object.keys(VLAB).map(k=>
    `<option value="${k}" ${k===CB.key?'selected':''}>${VLAB[k].t}</option>`).join('');
  $('#cbSel').onchange=()=>{CB.key=$('#cbSel').value;CB.lv=0;cbRender();};
  cbRender();
}
function cbRender(){
  const R=rounds(CB.key);
  $('#cbBlocks').innerHTML=R.map((r,i)=>
    `<button class="blk ${i<CB.lv?'done':i===CB.lv?'next':''}" data-i="${i}" ${i>CB.lv?'disabled':''}>
       <span class="bn">${i+1}</span>${r.tt}</button>`).join('');
  $('#cbBlocks').querySelectorAll('.blk').forEach(b=>b.onclick=()=>{
    CB.lv=+b.dataset.i+1; cbRender();});
  if(CB.lv===0){
    $('#cbPv').srcdoc='<body style="font-family:sans-serif;color:#999;padding:30px">블록을 순서대로 눌러 조립해 보세요.</body>';
    $('#cbNote').innerHTML='<b>참고용 모드</b> — AI 없이 구성 요소만 빠르게 조립해 보는 화면입니다. 실제 연수 실습은 왼쪽 “AI와 대화하며 만들기”로 진행합니다.';
  } else {
    $('#cbPv').srcdoc=genLab(CB.key,CB.lv);
    $('#cbNote').innerHTML=`<b>ROUND ${CB.lv}에서 AI에게 보낼 말</b><pre>${esc(R[CB.lv-1].p)}</pre>`;
  }
  $('#cbDl').style.display=CB.lv>=7?'inline-block':'none';
}
$('#cbReset').onclick=()=>{CB.lv=0;cbRender();};
$('#cbDl').onclick=()=>dl(genLab(CB.key,7), VLAB[CB.key].t+'.html','text/html');

labPicker(); startLab();
