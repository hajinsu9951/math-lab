/* ================= 탭④ 렌더 + 학습지·교사자료 내려받기 ================= */

/* ---------- 설계 5단계 ---------- */
$('#dsteps').innerHTML = DSTEP.map(s=>`
  <div class="dstep">
    <div class="dsn">${s.n}</div>
    <h4>${s.t}</h4>
    <p>${s.d}</p>
    <div class="dsmap"><span class="dsl">실험실</span>${s.lab}<span class="dsr">${s.r}</span></div>
  </div>`).join('');

/* ---------- 갤러리 워크 ---------- */
$('#gwalk').innerHTML = `
  <div class="gw">
    <p class="gwwhy">${GWALK.why}</p>
    <div class="gwrun">${GWALK.run.map((r,i)=>`
      <div class="gwi"><div class="gwn">${i+1}</div><div><b>${r.t}</b><p>${r.d}</p></div></div>`).join('')}</div>
    <div class="gwrule"><b>진행 규칙 4가지</b><ul>${GWALK.rule.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="note">${GWALK.caution}</div>
  </div>`;

/* ---------- 실험실 선택 ---------- */
const D = { key:'gps' };
// 정의 순서가 아니라 LAB 번호 순으로 세운다 (LAB 01 → 04)
const DKEYS = Object.keys(DESIGN).sort((a,b)=>DESIGN[a].lab - DESIGN[b].lab);
$('#dsel').innerHTML = DKEYS.map(k=>{
  const S = DESIGN[k];
  return `<div class="pcard ${k===D.key?'on':''}" data-k="${k}">
    <div class="pn">LAB ${String(S.lab).padStart(2,'0')}</div>
    <div class="pt">${S.t}</div>
    <div class="pg">${S.head.과목} · ${S.head.형태}</div></div>`;}).join('');
$('#dsel').querySelectorAll('.pcard').forEach(c=>c.onclick=()=>{
  D.key = c.dataset.k;
  $('#dsel').querySelectorAll('.pcard').forEach(x=>x.classList.remove('on'));
  c.classList.add('on'); drawDesign();});

/* ---------- 4단계 본문 ---------- */
/* 총점은 채점 요소의 합이다. 기본 점수는 더하는 값이 아니라 최저 보장선이며
   (수업에 성실히 참여하면 최소 그만큼), 총점을 넘지 않는다. HWPX 원안과 같은 구조. */
/* 총점은 채점 요소의 합이다. 기본 점수는 더하는 값이 아니라 최저 보장선이며 총점을 넘지 않는다.
   루브릭은 두 가지 모양을 받는다 — 수준별(lv 있음)과 단일 기준(p 만 있음). */
const leveled = S => !!(S.rub[0] && S.rub[0].lv);
const list = v => Array.isArray(v) ? '<ul class="dul">'+v.map(x=>`<li>${x}</li>`).join('')+'</ul>' : v;
function totals(S){
  const sum = leveled(S) ? S.rub.reduce((a,r)=>a+r.max,0) : S.rub.reduce((a,r)=>a+r.p,0);
  return { sum, all: sum };
}
function rubRows(S){
  if(!leveled(S))
    return S.rub.map(r=>`<tr><td class="rn">${r.n}</td><td class="re">${r.e}</td><td>${r.c}</td><td class="rp">${r.p}</td></tr>`).join('');
  return S.rub.map(r=>r.lv.map((L,i)=>
    `<tr>${i===0?`<td class="re lvl" rowspan="${r.lv.length}">${r.e}
        ${r.note?`<div class="rnote">${r.note}</div>`:''}</td>`:''}
      <td class="lvt ${i===0?'top':''}">${['상','중','하'][i]||''}</td>
      <td>${L.c}</td><td class="rp">${L.p}</td>
      ${i===0?`<td class="rmax" rowspan="${r.lv.length}">${r.max}</td>`:''}</tr>`).join('')).join('');
}
function drawDesign(){
  const S = DESIGN[D.key], T = totals(S);
  $('#dbody').innerHTML = `
  <div class="dcard">
    <div class="dhead">
      <div><span class="dpill">${S.pill}</span><h3>${S.t}</h3></div>
      <div class="dmeta">${Object.keys(S.head).map(k=>`<span><b>${k}</b> ${S.head[k]}</span>`).join('')}</div>
    </div>

    <div class="dsec"><div class="dnum">1</div><h4>교육과정 살펴보기</h4></div>
    <table class="dtb">
      <tr><th>성취기준</th><td>${S.cur.기준.map(x=> typeof x==='string'
          ? `<div class="std">${x}</div>`
          : `<div class="std">${x.c}</div><div class="stdd">└ ${x.d}</div>`).join('')}
        ${S.cur.중점?`<div class="stdk">◇ 본 수행평가 중점 성취기준 — ${S.cur.중점}</div>`:''}</td></tr>
      <tr><th>핵심 아이디어</th><td>${S.cur.핵심}
        ${(S.cur.핵심부연||[]).map(x=>`<div class="kidea">─ ${x}</div>`).join('')}
        ${S.cur.연결?`<div class="klink"><b>개념의 연결</b>
           <span class="kl s">선수</span>${S.cur.연결.선수}
           <span class="kl m">본시</span>${S.cur.연결.본시}
           <span class="kl e">후속</span>${S.cur.연결.후속}</div>`:''}</td></tr>
      <tr><th>지식·이해</th><td>${list(S.cur.지식)}</td></tr>
      <tr><th>과정·기능</th><td>${list(S.cur.기능)}</td></tr>
      <tr><th>가치·태도</th><td>${list(S.cur.태도)}</td></tr>
      <tr><th>수업 흐름</th><td>${S.cur.흐름.map(x=> typeof x==='string' ? `<div>${x}</div>`
        : `<div class="flowi ${x.hl?'hl':''}"><span class="fn">${x.n}</span><b>${x.t}</b>
             <p>${x.d}</p>${x.f?`<span class="fform">형성평가 · ${x.f}</span>`:''}</div>`).join('')}</td></tr>
    </table>

    <div class="dsec"><div class="dnum">2</div><h4>평가 설계하기 — 학습자 루브릭</h4></div>
    <p class="dintent"><b>평가 의도</b> ${S.intent}</p>
    ${S.worth?`<p class="dworth"><b>이 수행평가의 유의미성</b> ${S.worth}</p>`:''}
    ${S.diff?`<p class="ddiff"><b>설계의 차별화 지점</b> ${S.diff}</p>`:''}
    ${S.comp?`<div class="dcomp"><b>역량별 연결</b><ul>${S.comp.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:''}
    ${S.phil?`<p class="dphil"><b>채점 철학</b> ${S.phil}</p>`:''}
    <p class="dlabuse"><b>실험실을 어떻게 쓰나</b> ${S.labuse}</p>
    ${S.elems?`<p class="delem"><b>평가 요소</b> ${S.elems}</p>`:''}
    <div class="tablewrap"><table class="dtb rub">
      <thead><tr>${leveled(S)
        ? '<th style="width:120px">평가 요소</th><th style="width:34px">수준</th><th>수준별 채점 기준</th><th style="width:46px">배점</th><th style="width:44px">만점</th>'
        : '<th style="width:34px"></th><th style="width:130px">평가 요소</th><th>채점 기준</th><th style="width:52px">배점</th>'}</tr></thead>
      <tbody>
        ${rubRows(S)}
        <tr class="rtot"><td${leveled(S)?'':''}>총점</td><td colspan="${leveled(S)?2:2}">채점 요소의 합</td><td class="rp">${T.sum}</td>${leveled(S)?`<td class="rp">${T.sum}</td>`:''}</tr>
        <tr class="rsum"><td>기본 점수</td><td colspan="2">총점의 40% · 수업에 성실히 참여한 경우 보장되는 <b>최저 점수</b>이며 총점에 더하지 않습니다.
          미인정결석·장기결석·불성실 참여 시 0점.</td><td class="rp">${S.base}</td>${leveled(S)?'<td></td>':''}</tr>
      </tbody>
    </table></div>
    <div class="dcau"><b>평가 기준 및 유의사항</b><ol>${S.caution.map(x=>`<li>${x}</li>`).join('')}</ol>
      <p class="dcau-f">※ 수업 시간 내 실시하며, 학교교육과정의 범위·수준을 벗어나지 않도록 합니다.</p></div>

    <div class="dsec"><div class="dnum">3</div><h4>학생 활동지 — 실험실로 탐구하고 단계별로 기록하기</h4></div>
    <p class="dnote">각 STEP은 <b>웹 실험실에서 무엇을 조작하고 무엇을 기록할지</b>가 짝지어져 있습니다.
    조작만 하고 끝나지 않도록, 화면에서 본 값을 반드시 손계산과 대조하게 했습니다.</p>
    <div class="steps">${S.steps.map((s,i)=>`
      <details class="dstp"${i===0?' open':''}>
        <summary><span class="dstpn">${s.n}</span><b>${s.t}</b></summary>
        <div class="dstpb">
          <p class="ask">${s.ask}</p>
          <p class="guide">${s.guide}</p>
          ${s.labtip?`<p class="labtip">${s.labtip}</p>`:''}
          ${s.fig?`<figure class="dfig"><img src="${FIGS[s.fig]||''}" alt="${s.figalt||''}">
            ${s.figcap?`<figcaption>${s.figcap}</figcaption>`:''}</figure>`:''}
          ${s.mini?`<div class="mini" data-mini="${s.mini}"></div>`:''}
          <ul class="rec">${s.rec.map(x=>`<li>${x}</li>`).join('')}</ul>
          <div class="pad" data-pad="${esc(S.t)} ${s.n}"></div>
        </div>
      </details>`).join('')}</div>

    <div class="dlbar">
      <button class="b t" id="dlSheet">학생 활동지 내려받기</button>
      <button class="b" id="dlTeach">교사 안내 자료 내려받기</button>
      <span class="dlhint">.doc 파일로 저장됩니다 — <b>구글 문서·한글·워드</b>에서 바로 열립니다.
      구글 드라이브에 올린 뒤 “연결 프로그램 → Google 문서”를 고르면 그대로 편집·배부할 수 있습니다.</span>
    </div>

    ${S.mission?`
    <div class="dsec"><div class="dnum">＋</div><h4>모둠 미션 5단계</h4></div>
    <ol class="miss">${S.mission.map(x=>`<li>${x}</li>`).join('')}</ol>`:''}

    ${S.answer?`
    <div class="dsec"><div class="dnum">답</div><h4>교사용 모범답안 — 단계별 완전 풀이</h4></div>
    <details class="ansbox"><summary>펼쳐 보기 · 학생에게는 활동이 끝난 뒤 공개하세요</summary>
      ${S.answer.map(a=>`<div class="ans"><b>${a.t}</b>
        ${a.l.map(x=>`<div class="ansl">· ${x}</div>`).join('')}</div>`).join('')}
    </details>`:''}

    ${S.deep?`
    <div class="dsec"><div class="dnum">논</div><h4>심화 논술 근거 — 왜 그 식이 나오는가</h4></div>
    <div class="deep">${S.deep.map(x=>`<div class="dpi"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div>`:''}

    <div class="dsec"><div class="dnum">4</div><h4>세특 기재 예시</h4></div>
    <div class="sets">${S.sets.map((x,i)=>`<div class="set"><div class="setn">${'ㄱㄴㄷ'[i]}</div><p>${x}</p></div>`).join('')}</div>
  </div>`;

  // 손글씨 답안판 — 태블릿 펜·손가락·마우스로 직접 쓸 수 있게
  $('#dbody').querySelectorAll('.pad').forEach(box=>{
    try{ writePad(box, box.dataset.pad); }catch(e){ box.innerHTML=''; }
  });

  // STEP 에 딸린 미니 실험 도구를 그린다 (탭①의 실험실과 별개로, 이 수업 전용)
  $('#dbody').querySelectorAll('.mini').forEach(box=>{
    const fn = MINI[box.dataset.mini];
    if(typeof fn === 'function'){ try{ fn(box); }catch(e){ box.innerHTML =
      '<div class="mnb"><div class="mno"><div class="mnr no">도구를 그리지 못했습니다 — '+esc(e.message)+'</div></div></div>'; } }
  });

  $('#dlSheet').onclick = ()=>dlDoc(sheetDoc(S), S.t+'_학생활동지');
  $('#dlTeach').onclick = ()=>dlDoc(teachDoc(S), S.t+'_교사안내자료');
}

/* ---------- .doc 만들기 ----------
   외부 라이브러리 없이 워드·구글 문서가 여는 형식은 HTML 기반 .doc 이다.
   진짜 .docx 는 ZIP 컨테이너라 라이브러리 없이 만들 수 없다. */
const DOCCSS = `
body{font-family:'맑은 고딕','Malgun Gothic',sans-serif;font-size:10.5pt;line-height:1.7;color:#111}
h1{font-size:16pt;margin:0 0 4pt} h2{font-size:12pt;margin:18pt 0 6pt;border-bottom:1.5pt solid #111;padding-bottom:3pt}
h3{font-size:11pt;margin:12pt 0 4pt;color:#2563EB}
table{border-collapse:collapse;width:100%;margin:6pt 0} th,td{border:0.75pt solid #999;padding:5pt 7pt;vertical-align:top}
th{background:#F0F3F8;text-align:left;width:110pt}
.q{color:#444;margin:2pt 0 6pt} .g{color:#555;font-size:9.5pt;margin:0 0 6pt}
.line{border-bottom:0.75pt dotted #888;height:20pt;margin:5pt 0}
.box{border:0.75pt solid #999;padding:7pt;margin:5pt 0}
.ln{display:inline-block;font-weight:bold;color:#2563EB;margin-right:6pt}
ol,ul{margin:4pt 0 4pt 16pt;padding:0} li{margin-bottom:3pt}
.hd{font-size:9pt;color:#666;text-align:right}`;

function docWrap(title, inner){
  return '﻿<html xmlns:o="urn:schemas-microsoft-com:office:office" '
    + 'xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
    + '<head><meta charset="utf-8"><title>'+title+'</title><style>'+DOCCSS+'</style></head><body>'
    + inner + '</body></html>';
}
function dlDoc(html, name){
  const b = new Blob([html], {type:'application/msword'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = name.replace(/[\\/:*?"<>|]/g,'') + '.doc';
  a.click(); URL.revokeObjectURL(a.href);
}

/* 학생 활동지 — 인쇄해서 바로 나눠 줄 수 있는 형태 */
function sheetDoc(S){
  const T = totals(S);
  return docWrap(S.t + ' 학생 활동지', `
  <p class="hd">${S.head.과목} · ${S.head.단원}</p>
  <h1>${S.t}</h1>
  <p class="q">${S.head.형태} · ${S.head.배점}</p>
  <table>
    <tr><th>학번</th><td style="width:120pt"></td><th>이름</th><td></td></tr>
    <tr><th>모둠</th><td></td><th>날짜</th><td></td></tr>
  </table>

  <h2>이 활동에서 하는 일</h2>
  <p>${S.cur.핵심}</p>
  <p class="g"><b>웹 실험실 사용</b> — ${S.labuse.replace(/<\/?b>/g,'')}</p>

  <h2>단계별 탐구와 기록</h2>
  ${S.steps.map(s=>`
    <h3>${s.n}. ${s.t}</h3>
    <p class="q"><b>물음</b> ${s.ask}</p>
    <p class="g">${s.guide}</p>
    ${s.labtip?`<p class="g"><b>실험실</b> ${s.labtip}</p>`:''}
    ${s.rec.map(r=> r.length > 40 && !r.includes('=')
        ? `<p style="margin:6pt 0 2pt">${r}</p><div class="line"></div><div class="line"></div><div class="line"></div>`
        : `<p style="margin:4pt 0">${r}</p>`).join('')}
  `).join('')}

  <h2>채점 기준 — 무엇을 보고 채점하는지 미리 알려 줍니다</h2>
  <table>
    <tr><th style="width:30pt">　</th><th style="width:90pt">평가 요소</th><th>채점 기준</th><th style="width:40pt">배점</th></tr>
    ${S.rub.map(r=>`<tr><td>${r.n}</td><td>${r.e}</td><td>${r.c}</td><td>${r.p}</td></tr>`).join('')}
    <tr><td></td><td><b>총점</b></td><td>채점 요소의 합</td><td><b>${T.sum}</b></td></tr>
    <tr><td></td><td>기본 점수</td><td>성실히 참여하면 보장되는 최저 점수 (총점에 더하지 않습니다)</td><td>${S.base}</td></tr>
  </table>

  <h2>갤러리 워크 기록</h2>
  <div class="box">
    <p><b>내가 방문한 모둠</b></p>
    ${[1,2,3].map(i=>`<p style="margin:4pt 0">${i}. 모둠 ________ · 잘된 점 ______________________ · 묻고 싶은 것 ______________________</p>`).join('')}
    <p style="margin-top:8pt"><b>내가 받은 질문 중 가장 날카로웠던 것</b></p><div class="line"></div>
    <p style="margin-top:6pt"><b>다시 한다면 고칠 것 한 가지</b></p><div class="line"></div>
  </div>`);
}

/* 교사 안내 자료 — 수업 운영과 채점을 위한 것 */
function teachDoc(S){
  const T = totals(S);
  return docWrap(S.t + ' 교사 안내 자료', `
  <p class="hd">교사용 · 2026 대전광역시교육청 인공지능 활용 선도교사 연수</p>
  <h1>${S.t}</h1>
  <p class="q">${S.head.과목} · ${S.head.단원} · ${S.head.형태} · ${S.head.배점}</p>

  <h2>1. 교육과정 살펴보기</h2>
  <table>
    <tr><th>성취기준</th><td>${S.cur.기준.join('<br>')}</td></tr>
    <tr><th>핵심 아이디어</th><td>${S.cur.핵심}</td></tr>
    <tr><th>지식·이해</th><td>${S.cur.지식}</td></tr>
    <tr><th>과정·기능</th><td>${S.cur.기능}</td></tr>
    <tr><th>가치·태도</th><td>${S.cur.태도}</td></tr>
    <tr><th>수업 흐름</th><td>${S.cur.흐름.join('<br>')}</td></tr>
  </table>

  <h2>2. 평가 설계하기</h2>
  <p><b>평가 의도</b><br>${S.intent.replace(/<\/?b>/g,'')}</p>
  <p><b>웹 실험실 활용</b><br>${S.labuse.replace(/<\/?b>/g,'')}</p>
  <table>
    <tr><th style="width:30pt">　</th><th style="width:90pt">평가 요소</th><th>채점 기준</th><th style="width:40pt">배점</th></tr>
    ${S.rub.map(r=>`<tr><td>${r.n}</td><td>${r.e}</td><td>${r.c}</td><td>${r.p}</td></tr>`).join('')}
    <tr><td></td><td><b>총점</b></td><td>채점 요소의 합</td><td><b>${T.sum}</b></td></tr>
    <tr><td></td><td>기본 점수</td><td>성실히 참여하면 보장되는 최저 점수 (총점에 더하지 않음). 미인정결석·장기결석·불성실 참여 시 0점</td><td>${S.base}</td></tr>
  </table>
  <p><b>평가 기준 및 유의사항</b></p>
  <ol>${S.caution.map(x=>`<li>${x.replace(/<\/?b>/g,'')}</li>`).join('')}</ol>
  <p class="g">※ 수업 시간 내 실시하며, 학교교육과정의 범위·수준을 벗어나지 않도록 합니다.</p>

  <h2>3. 단계별 진행 — 무엇을 조작하고 무엇을 기록하게 하나</h2>
  ${S.steps.map(s=>`
    <h3>${s.n}. ${s.t}</h3>
    <p><b>학생에게 던질 물음</b> ${s.ask}</p>
    <p class="g"><b>지도 요점</b> ${s.guide}</p>
    ${s.labtip?`<p class="g"><b>실험실 조작</b> ${s.labtip}</p>`:''}
    <p class="g"><b>기록하게 할 것</b> ${s.rec.join(' / ').replace(/_/g,'')}</p>
  `).join('')}

  <h2>4. 갤러리 워크 운영</h2>
  <p>${GWALK.why.replace(/<\/?b>/g,'')}</p>
  <table>
    <tr><th style="width:70pt">단계</th><th>운영 방법</th></tr>
    ${GWALK.run.map(r=>`<tr><td>${r.t}</td><td>${r.d.replace(/<\/?b>/g,'')}</td></tr>`).join('')}
  </table>
  <p><b>진행 규칙</b></p>
  <ul>${GWALK.rule.map(x=>`<li>${x.replace(/<\/?b>/g,'')}</li>`).join('')}</ul>
  <p class="g">${GWALK.caution.replace(/<\/?b>/g,'')}</p>

  <h2>5. 세특 기재 예시</h2>
  ${S.sets.map((x,i)=>`<p><b>${'ㄱㄴㄷ'[i]}.</b> ${x}</p>`).join('')}`);
}

drawDesign();
