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
/* 필기판이 비었는지 — 공책 줄만 있고 획이 없으면 빈 것으로 본다 */
function isBlankPad(cv){
  try{
    const d = cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
    for(let i=0;i<d.length;i+=16){
      if(d[i]<200 && d[i+1]<200 && d[i+2]<200) return false;   // 줄(#EEF1F5)보다 진한 점
    }
  }catch(e){ return false; }
  return true;
}
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

    ${S.plan?`
    <div class="dsec"><div class="dnum">2</div><h4>수업 구성 지도서 — 차시별 운영</h4></div>
    <div class="dplan">
      <p class="dplanh">${S.plan.head}</p>
      <div class="dprep"><b>준비물</b><ul>${S.plan.준비물.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      ${S.plan.차시.map(c=>`
        <div class="dper">
          <header class="dperh"><span class="dpern">${c.n}</span><b>${c.t}</b></header>
          <p class="dpergoal"><b>학습 목표</b> ${c.goal}</p>
          <table class="dpert"><tbody>${c.flow.map(f=>
            `<tr><td class="dperm">${f.m}</td><td>${f.d}</td></tr>`).join('')}</tbody></table>
          <div class="dperg">
            <div class="dpergi ask"><div class="dpergt">핵심 발문</div><p>${c.ask}</p></div>
            <div class="dpergi miss"><div class="dpergt">예상되는 오개념</div><p>${c.miss}</p></div>
            <div class="dpergi watch"><div class="dpergt">교사가 볼 지점</div><p>${c.watch}</p></div>
          </div>
        </div>`).join('')}
      <p class="dplantie">${S.plan.tie}</p>
    </div>`:''}
    <div class="dsec"><div class="dnum">${S.plan?3:2}</div><h4>평가 설계하기 — 학습자 루브릭</h4></div>
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

    <div class="dsec"><div class="dnum">${S.plan?4:3}</div><h4>학생 활동지 — 실험실로 탐구하고 단계별로 기록하기</h4></div>
    <p class="dnote">각 STEP은 <b>웹 실험실에서 무엇을 조작하고 무엇을 기록할지</b>가 짝지어져 있습니다.
    조작만 하고 끝나지 않도록, 화면에서 본 값을 반드시 손계산과 대조하게 했습니다.</p>
    <div class="subm">
      <div class="submh">✎ 제출용 정보 — 다 쓴 뒤 아래 버튼으로 내려받아 제출하세요</div>
      <div class="submc">
        <label class="mnl">학번<input type="text" id="sb_no" maxlength="12" placeholder="10315"></label>
        <label class="mnl">이름<input type="text" id="sb_nm" maxlength="20" placeholder="홍길동"></label>
        <label class="mnl">모둠<input type="text" id="sb_gr" maxlength="20" placeholder="3모둠"></label>
        <button class="b t" id="sb_go">과제 제출용 내려받기</button>
      </div>
      <p class="submn">손으로 쓴 <b>모든 단계의 풀이와 답안</b>이 파일 하나로 묶입니다.
      브라우저에 저장되지 않으니 <b>새로고침 전에 반드시 내려받으세요.</b></p>
    </div>
    <nav class="stepnav">${S.steps.map((s,i)=>
      `<a href="#stp${i}" data-j="${i}"><span>${s.n}</span>${s.t}</a>`).join('')}</nav>
    <div class="steps">${S.steps.map((s,i)=>`
      <section class="dstp" id="stp${i}">
        <header class="dsth"><span class="dstpn">${s.n}</span><b>${s.t}</b>
          <span class="dstpi">${i+1} / ${S.steps.length}</span></header>
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
      </section>`).join('')}</div>

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

    <div class="dsec"><div class="dnum">${S.plan?5:4}</div><h4>세특 기재 예시</h4></div>
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

  // 과제 제출 — 손으로 쓴 모든 단계를 활동지 한 부로 묶는다 (낱장 이미지가 아니라 한 파일)
  $('#sb_go').onclick = ()=>{
    const no = $('#sb_no').value.trim(), nm = $('#sb_nm').value.trim(), gr = $('#sb_gr').value.trim();
    if(!no || !nm){ alert('학번과 이름을 먼저 적어 주세요.'); ($('#sb_no').value?$('#sb_nm'):$('#sb_no')).focus(); return; }
    const pads = [...$('#dbody').querySelectorAll('.dstp')];
    let written = 0;
    const body = pads.map((sec,i)=>{
      const s = S.steps[i];
      const cv = sec.querySelector('.wpcv');
      const img = cv ? cv.toDataURL('image/png') : '';
      if(cv && !isBlankPad(cv)) written++;
      return `<section class="st">
        <h2><span>${s.n}</span> ${esc(s.t)}</h2>
        <p class="q"><b>물음</b> ${s.ask}</p>
        <ul>${s.rec.map(x=>`<li>${x}</li>`).join('')}</ul>
        ${img?`<img src="${img}" alt="${esc(s.n)} 손글씨 풀이와 답안">`:''}
      </section>`;
    }).join('');
    const stamp = new Date().toLocaleString('ko-KR');
    const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(S.t)} 활동지 — ${esc(no)} ${esc(nm)}</title>
<style>
body{margin:0;background:#F7F8FA;color:#111827;
  font-family:'Freesentation','Pretendard','맑은 고딕',system-ui,sans-serif;line-height:1.7}
.wrap{max-width:900px;margin:0 auto;padding:26px 20px 60px}
header{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px 20px;margin-bottom:16px}
h1{margin:0 0 6px;font-size:22px;font-weight:800;letter-spacing:-.4px}
.meta{display:flex;gap:18px;flex-wrap:wrap;font-size:14px;color:#374151;margin-top:8px}
.meta b{color:#6B7280;font-weight:700;margin-right:5px}
.st{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 18px;margin-bottom:13px}
.st h2{margin:0 0 7px;font-size:16px;font-weight:800;display:flex;align-items:center;gap:9px}
.st h2 span{font-size:11px;font-weight:800;color:#fff;background:#2563EB;padding:2px 10px;border-radius:999px}
.q{margin:0 0 7px;font-size:13.5px;color:#2563EB;font-weight:700}
.st ul{margin:0 0 11px;padding-left:18px;font-size:12.8px;color:#374151;line-height:1.85}
.st img{display:block;width:100%;border:1px solid #E5E7EB;border-radius:9px;background:#fff}
footer{margin-top:20px;font-size:12.5px;color:#6B7280}
@media print{body{background:#fff}.st,header{break-inside:avoid;box-shadow:none}}
</style></head><body><div class="wrap">
<header>
  <h1>${esc(S.t)}</h1>
  <div>${esc(S.head.과목)} · ${esc(S.head.단원)} · ${esc(S.head.배점)}</div>
  <div class="meta"><span><b>학번</b>${esc(no)}</span><span><b>이름</b>${esc(nm)}</span>
    ${gr?`<span><b>모둠</b>${esc(gr)}</span>`:''}<span><b>제출</b>${esc(stamp)}</span></div>
</header>
${body}
<footer>손으로 작성한 ${S.steps.length}단계 활동지입니다. 인쇄하면 그대로 제출본이 됩니다.</footer>
</div></body></html>`;
    dl(html, `${S.t}_활동지_${no}_${nm}.html`, 'text/html');
    if(!written) alert('아직 손으로 쓴 내용이 없습니다. 빈 활동지로 저장됩니다.');
  };

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
