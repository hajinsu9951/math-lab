/* ================= 탭⑤ 우리 연수 모음집 =================
   브라우저 저장소는 쓰지 않는다(단일 파일 원칙 · localStorage 금지).
   올린 파일은 메모리에만 있다가 세 가지 방법으로 밖에 남는다.

     ① 모음집 내려받기  — 열람용 단일 HTML. 배포하면 누구나 바로 열어 본다.
     ② 작업 저장(.json) — 메타까지 그대로 담은 작업 파일. 다시 올리면 이어서 작업한다.
     ③ 공동 보관함      — 구글 스프레드시트에 누적. 연수가 끝난 뒤에도 우수 사례를 올리고 꺼낸다.

   ③은 주소가 있을 때만 켜진다. 없으면 ①②만으로 완결되며 연수장 인터넷이 끊겨도 진행에 지장이 없다. */

const GAL = [];
const MAXB = 2 * 1024 * 1024;   // 한 파일 2MB 제한 — 모음집이 감당 못 할 만큼 커지는 것을 막는다

/* 공동 보관함 기본 주소. 배포 뒤 여기에 박아 두면 참가자가 주소를 입력할 필요가 없다.
   비워 두면 화면의 입력칸에 직접 넣어 쓴다. */
const GAL_URL = '';

function galCount(){
  const n = GAL.length;
  $('#gcount').innerHTML = n
    ? `<b>${n}편</b>이 모였습니다 · 합계 ${(GAL.reduce((s,g)=>s+g.src.length,0)/1024).toFixed(0)} KB`
    : '아직 올라온 자료가 없습니다.';
  $('#gExport').disabled = !n;
  $('#gClear').disabled = !n;
}
/* 과목 고르기 — 확장 카탈로그와 같은 묶음을 쓴다 (그래야 그대로 옮길 수 있다) */
$('#gsub').innerHTML = '<option value="">고르지 않음</option>'
  + CAT_GROUPS.map(g=>`<option value="${g.k}">${g.n}</option>`).join('');

function galRender(){
  $('#glist').innerHTML = GAL.map((g,i)=>{
    const gname = g.sub ? (CAT_GROUPS.find(x=>x.k===g.sub)||{}).n : '';
    const tagline = [gname, g.unit].filter(Boolean).join(' · ');
    return `
    <div class="gcard${g.moved?' moved':''}">
      <div class="gn">${String(i+1).padStart(2,'0')}</div>
      <h4>${esc(g.topic || g.title)}</h4>
      ${tagline ? `<div class="gtag">${esc(tagline)}</div>` : ''}
      <div class="gwho">${esc(g.who||'이름 없음')}</div>
      <p class="gmemo">${esc(g.memo||'소개가 없습니다.')}</p>
      <div class="gfoot"><span class="gfile">${esc(g.name)} · ${(g.src.length/1024).toFixed(0)} KB</span>
        <span class="gbtns"><button class="b sm" data-o="${i}">열어 보기</button>
        ${g.moved
          ? '<span class="movedtag">✔ 카탈로그에 있음</span>'
          : `<button class="b t sm" data-m="${i}">확장 카탈로그로 보내기</button>`}
        <button class="b g sm" data-x="${i}">빼기</button></span></div>
    </div>`;}).join('');
  $('#glist').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>galOpen(+b.dataset.o));
  $('#glist').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>galPromote(+b.dataset.m));
  $('#glist').querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{
    GAL.splice(+b.dataset.x,1); galRender(); galCount(); $('#gpv').style.display='none';});
  galCount();
}

/* 우수작을 확장 카탈로그로 올린다 — 누르면 그 자리에서 탭①의 목록이 늘어난다.
   저장소를 쓰지 않으므로 새로고침하면 사라진다. 그래서 모음집 내려받기를 함께 안내한다. */
function galPromote(i){
  const g = GAL[i];
  if(!g.sub){ alert('먼저 과목을 골라 주세요. 카탈로그의 어느 묶음에 넣을지 정해야 합니다.'); return; }
  const topic = (g.topic || g.title || '').trim();
  if(!topic){ alert('주제를 적어 주세요.'); return; }
  if(CATALOG.some(c=>c.t === topic)){ alert('같은 주제가 이미 카탈로그에 있습니다.'); return; }
  const gname = (CAT_GROUPS.find(x=>x.k===g.sub)||{}).n || '';
  CATALOG.push({
    k: g.sub,
    t: topic,
    g: [gname, (g.unit||'').trim()].filter(Boolean).join(' · '),
    q: (g.memo||'').trim(),
    b: '',                                  // 결함 후보는 아직 — 실험실로 올리기 전에 채워야 한다
    a: '연수 산출물 · ' + (g.who || '이름 없음')
  });
  g.moved = true;
  if(typeof catDraw === 'function') catDraw();
  galRender();
  const tabBtn = document.querySelector('nav.tabs button[data-p=p1]');
  if(confirm(`「${topic}」을 확장 카탈로그 ${gname} 묶음에 넣었습니다.\n지금 확인하러 가시겠습니까?`)){
    if(tabBtn) tabBtn.click();
    const el = document.querySelector('#catbody');
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }
}
function galOpen(i){
  const g = GAL[i];
  $('#gpvT').textContent = g.title + ' — ' + (g.who||'이름 없음');
  $('#gpvF').srcdoc = g.src;
  $('#gpv').style.display = 'block';
  $('#gpv').scrollIntoView({behavior:'smooth', block:'nearest'});
}
$('#gpvX').onclick = ()=>{ $('#gpv').style.display='none'; $('#gpvF').srcdoc=''; };

/* ---------- 파일 받기 ---------- */
function galAdd(files){
  const list = [...files].filter(f=>/\.html?$/i.test(f.name));
  if(!list.length){ alert('HTML 파일만 올릴 수 있습니다.'); return; }
  let done = 0;
  list.forEach(f=>{
    if(f.size > MAXB){ alert(`${f.name} 은 2MB를 넘어 올릴 수 없습니다.`); return; }
    const rd = new FileReader();
    rd.onload = ()=>{
      const src = rd.result;
      const m = src.match(/<title>([\s\S]*?)<\/title>/i);
      GAL.push({
        name: f.name,
        title: (m && m[1].trim()) || f.name.replace(/\.html?$/i,''),
        who:   $('#who').value.trim(),
        memo:  $('#memo').value.trim(),
        sub:   $('#gsub').value,                 // 과목 묶음 (카탈로그와 같은 키)
        unit:  $('#gunit').value.trim(),         // 단원
        topic: $('#gtopic').value.trim(),        // 주제
        moved: false,
        src
      });
      if(++done === list.length){ ['memo','gunit','gtopic'].forEach(id=>$('#'+id).value=''); galRender(); }
      else galRender();
    };
    rd.readAsText(f, 'utf-8');
  });
}
$('#pick').onclick = ()=>$('#file').click();
$('#file').onchange = e=>{ galAdd(e.target.files); e.target.value=''; };
const drop = $('#drop');
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{
  e.preventDefault(); drop.classList.add('over');}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{
  e.preventDefault(); drop.classList.remove('over');}));
drop.addEventListener('drop', e=>{ if(e.dataTransfer && e.dataTransfer.files) galAdd(e.dataTransfer.files); });

/* 승격한 항목을 소스에 그대로 붙여 넣을 코드 조각으로 내보낸다.
   페이지는 저장소를 쓰지 않으므로 새로고침하면 승격 결과가 사라진다.
   이 파일을 src/55-catalog.js 에 붙여 넣고 다시 빌드해야 영구히 남는다. */
$('#gCatOut').onclick = ()=>{
  const moved = GAL.filter(g=>g.moved);
  if(!moved.length){ alert('아직 카탈로그로 보낸 자료가 없습니다.\n카드의 「확장 카탈로그로 보내기」를 먼저 누르세요.'); return; }
  const q = s => "'" + String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'") + "'";
  const lines = moved.map(g=>{
    const gname = (CAT_GROUPS.find(x=>x.k===g.sub)||{}).n || '';
    const unit  = [gname, (g.unit||'').trim()].filter(Boolean).join(' · ');
    return `{k:${q(g.sub)},t:${q(g.topic||g.title)},g:${q(unit)},q:${q(g.memo)},b:'',a:${q('연수 산출물 · ' + (g.who||'이름 없음'))}},`;
  });
  const txt =
`/* 연수에서 나온 우수작 ${moved.length}종 — 확장 카탈로그 추가분
   ────────────────────────────────────────────────
   넣는 법
     1. src/55-catalog.js 를 연다
     2. const CATALOG = [ 바로 다음 줄에 아래 줄들을 붙여 넣는다
     3. node build.mjs 로 다시 빌드한다
   주의
     b(결함 후보)가 비어 있다. 실험실로 승격하기 전에 반드시 채울 것.
     ROUND 4 에 심을 "눈에 보이는 오류"가 없으면 실습이 성립하지 않는다.
   ──────────────────────────────────────────────── */

${lines.join('\n')}
`;
  dl(txt, '확장카탈로그_추가분.js', 'text/plain');
};

$('#gClear').onclick = ()=>{
  if(!GAL.length) return;
  if(confirm(`${GAL.length}편을 모두 지웁니다. 모음집을 내려받지 않았다면 되살릴 수 없습니다.`)){
    GAL.length = 0; galRender(); $('#gpv').style.display='none';}
};

/* ---------- 모음집 내보내기 ----------
   각 자료의 원본을 그대로 품은 단일 HTML. 자료는 iframe srcdoc 으로 격리해 서로 간섭하지 않는다.
   <\/script> 로 빠져나가지 못하도록 < 를 이스케이프한다. */
$('#gExport').onclick = ()=>{
  if(!GAL.length) return;
  const data = JSON.stringify(GAL.map(g=>({t:g.title, w:g.who, m:g.memo, n:g.name, s:g.src,
      u:[(CAT_GROUPS.find(x=>x.k===g.sub)||{}).n, g.unit].filter(Boolean).join(' · '), p:g.topic})))
    .replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>우리 연수 모음집 — 일상 속 수학 실험실</title>
<style>
:root{--ink:#111827;--ink2:#374151;--ink3:#6B7280;--line:#E5E7EB;--bg:#F7F8FA;--blue:#2563EB;--teal:#0E9384}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:'Freesentation','Pretendard','맑은 고딕','Malgun Gothic',system-ui,sans-serif;line-height:1.7}
.wrap{max-width:1180px;margin:0 auto;padding:26px 20px 60px}
header{background:#fff;border-bottom:1px solid var(--line)}
header .wrap{padding:22px 20px 18px}
.kick{font-size:12px;font-weight:800;letter-spacing:1px;color:var(--blue)}
h1{margin:6px 0 4px;font-size:26px;font-weight:800;letter-spacing:-.5px}
header p{margin:0;color:var(--ink2);font-size:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:13px;margin-top:20px}
.c{background:#fff;border:1px solid var(--line);border-radius:13px;padding:15px;cursor:pointer;transition:.16s;
  display:flex;flex-direction:column;gap:6px}
.c:hover{border-color:#B9CBF5;box-shadow:0 6px 20px rgba(17,24,39,.07);transform:translateY(-2px)}
.c.on{border-color:var(--blue);box-shadow:0 0 0 2px #DBE6FF}
.n{font-size:11.5px;font-weight:800;color:var(--ink3);letter-spacing:.6px}
.c h3{margin:0;font-size:15.5px;font-weight:800;line-height:1.35}
.u{font-size:12px;color:var(--ink3);font-weight:700}
.w{font-size:12.5px;color:var(--teal);font-weight:700}
.m{margin:0;font-size:13px;color:var(--ink2)}
.f{margin-top:auto;font-size:11.5px;color:var(--ink3)}
.stage{margin-top:22px;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;display:none}
.sh{display:flex;justify-content:space-between;align-items:center;gap:10px;
  padding:11px 15px;border-bottom:1px solid var(--line);background:#FAFBFC}
.sh b{font-size:14.5px}
.sh span{font-size:12.5px;color:var(--ink3)}
iframe{width:100%;height:74vh;border:0;display:block;background:#fff}
footer{margin-top:34px;padding-top:16px;border-top:1px solid var(--line);font-size:12.5px;color:var(--ink3)}
@media(max-width:640px){iframe{height:66vh}}
</style>
</head>
<body>
<header><div class="wrap">
  <div class="kick">2026 대전광역시교육청 · 인공지능 활용 선도교사 연수 (중등 수학)</div>
  <h1>우리 연수 모음집</h1>
  <p>선생님들이 직접 만든 학습자료 ${GAL.length}편입니다. 카드를 누르면 바로 열립니다 — 설치·서버·로그인이 필요 없습니다.</p>
</div></header>
<div class="wrap">
  <div class="grid" id="g"></div>
  <div class="stage" id="st">
    <div class="sh"><b id="sT"></b><span id="sN"></span></div>
    <iframe id="sF"></iframe>
  </div>
  <footer>이 파일 하나에 모든 자료가 들어 있습니다. USB로 옮겨도, 메일로 보내도 그대로 열립니다.</footer>
</div>
<script>
var D = ${data};
var g = document.getElementById('g');
g.innerHTML = D.map(function(d,i){
  return '<div class="c" data-i="'+i+'">'
    + '<div class="n">' + String(i+1).padStart(2,'0') + '</div>'
    + '<h3>' + esc(d.p || d.t) + '</h3>'
    + (d.u ? '<div class="u">' + esc(d.u) + '</div>' : '')
    + '<div class="w">' + esc(d.w || '이름 없음') + '</div>'
    + '<p class="m">' + esc(d.m || '') + '</p>'
    + '<div class="f">' + esc(d.n) + '</div></div>';
}).join('');
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
g.querySelectorAll('.c').forEach(function(c){
  c.onclick = function(){
    var d = D[+c.dataset.i];
    g.querySelectorAll('.c').forEach(function(x){x.classList.remove('on');});
    c.classList.add('on');
    document.getElementById('sT').textContent = d.t;
    document.getElementById('sN').textContent = d.w || '';
    document.getElementById('sF').srcdoc = d.s;
    document.getElementById('st').style.display = 'block';
    document.getElementById('st').scrollIntoView({behavior:'smooth', block:'nearest'});
  };
});
<\/script>
</body>
</html>`;
  dl(html, '우리_연수_모음집.html', 'text/html');
};

galRender();

/* ================= ② 작업 저장 / 불러오기 =================
   메타(과목·단원·주제·제작자·소개)까지 그대로 담은 작업 파일.
   「모음집 내려받기」가 열람용이라면 이쪽은 이어서 작업하기 위한 것이다.
   연수가 끝난 뒤 우수 사례를 골라 올릴 때도 이 파일에서 꺼낸다. */
const GAL_FMT = 'mathlab-gallery-1';

function galBundle(){
  return { fmt: GAL_FMT, at: new Date().toISOString(), n: GAL.length,
    items: GAL.map(g=>({ name:g.name, title:g.title, who:g.who, memo:g.memo,
      sub:g.sub, unit:g.unit, topic:g.topic, moved:!!g.moved, src:g.src })) };
}
function galAdopt(items, mode){
  if(mode === 'replace') GAL.length = 0;
  const have = new Set(GAL.map(g=>g.name + '\u0000' + g.src.length));
  let added = 0, skipped = 0;
  items.forEach(it=>{
    if(!it || typeof it.src !== 'string') return;
    const key = (it.name||'') + '\u0000' + it.src.length;
    if(have.has(key)){ skipped++; return; }
    have.add(key);
    GAL.push({ name:it.name||'이름없음.html', title:it.title||it.name||'제목 없음',
      who:it.who||'', memo:it.memo||'', sub:it.sub||'', unit:it.unit||'',
      topic:it.topic||'', moved:!!it.moved, src:it.src, id:it.id||'' });
    added++;
  });
  galRender();
  return { added, skipped };
}

$('#gSaveJ').onclick = ()=>{
  if(!GAL.length){ alert('아직 올라온 자료가 없습니다.'); return; }
  const d = new Date(), p = n => String(n).padStart(2,'0');
  dl(JSON.stringify(galBundle()), `연수모음집_작업_${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}.json`,
     'application/json');
};
$('#gLoadJ').onclick = ()=>$('#gfileJ').click();
$('#gfileJ').onchange = e=>{
  const f = e.target.files[0]; e.target.value = '';
  if(!f) return;
  const rd = new FileReader();
  rd.onload = ()=>{
    let b;
    try { b = JSON.parse(rd.result); } catch { alert('작업 파일을 읽지 못했습니다. 「작업 저장」으로 받은 .json 인지 확인해 주세요.'); return; }
    const items = Array.isArray(b) ? b : b.items;
    if(!Array.isArray(items)){ alert('작업 파일의 형식이 아닙니다.'); return; }
    const mode = GAL.length
      ? (confirm(`지금 ${GAL.length}편이 올라와 있습니다.\n\n[확인] 지금 것에 이어 붙이기\n[취소] 지금 것을 지우고 파일 것으로 바꾸기`) ? 'merge' : 'replace')
      : 'replace';
    const r = galAdopt(items, mode);
    alert(`${r.added}편을 불러왔습니다.` + (r.skipped ? `\n같은 파일 ${r.skipped}편은 건너뛰었습니다.` : ''));
  };
  rd.readAsText(f, 'utf-8');
};

/* ================= ③ 공동 보관함 (구글 스프레드시트) =================
   주소가 없으면 버튼이 꺼져 있고, 나머지 기능은 그대로 쓸 수 있다.
   실패해도 화면은 멈추지 않는다 — 메시지만 띄우고 메모리 모드로 계속 간다. */
function galUrl(){ return (($('#gurl').value || '').trim() || GAL_URL).replace(/\s/g,''); }
function gstat(msg, bad){
  const el = $('#gstat');
  el.textContent = msg || '';
  el.className = 'gstat' + (bad ? ' bad' : '');
}
function galSyncReady(){
  const on = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec/.test(galUrl());
  $('#gPush').disabled = !on;
  $('#gPull').disabled = !on;
  return on;
}
if(GAL_URL) $('#gurl').value = GAL_URL;
$('#gurl').oninput = ()=>{ galSyncReady(); gstat(''); };
galSyncReady();

async function galFetch(url, opt){
  const res = await fetch(url, opt);
  if(!res.ok) throw new Error('보관함이 ' + res.status + ' 를 돌려주었습니다.');
  const txt = await res.text();
  let j; try { j = JSON.parse(txt); } catch { throw new Error('보관함 응답을 읽지 못했습니다. 배포를 「모든 사용자」로 하셨는지 확인해 주세요.'); }
  if(j && j.error) throw new Error(j.error);
  return j;
}

$('#gPush').onclick = async ()=>{
  if(!galSyncReady()) return;
  const todo = GAL.filter(g=>!g.id);
  if(!todo.length){ gstat('새로 올릴 것이 없습니다. 이미 전부 보관함에 있습니다.'); return; }
  $('#gPush').disabled = true;
  let ok = 0;
  try{
    for(const g of todo){
      const gname = (CAT_GROUPS.find(x=>x.k===g.sub)||{}).n || '';
      gstat(`올리는 중… ${ok+1}/${todo.length}`);
      const r = await galFetch(galUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // preflight 를 피한다
        body: JSON.stringify({ mode:'put', sub:g.sub, subName:gname, unit:g.unit,
          topic:g.topic, who:g.who, memo:g.memo, name:g.name, title:g.title, src:g.src })
      });
      g.id = r.id; ok++;
    }
    gstat(`${ok}편을 보관함에 저장했습니다.`);
    galRender();
  }catch(e){
    gstat(`${ok}편까지 올렸습니다 — ` + e.message, true);
  }finally{ galSyncReady(); }
};

$('#gPull').onclick = async ()=>{
  if(!galSyncReady()) return;
  $('#gPull').disabled = true;
  try{
    gstat('목록을 받는 중…');
    const list = await galFetch(galUrl() + '?mode=list');
    const have = new Set(GAL.map(g=>g.id).filter(Boolean));
    const need = list.filter(r=>!have.has(r.id));
    if(!need.length){ gstat(`보관함에 ${list.length}편 — 새로 가져올 것이 없습니다.`); return; }
    const got = [];
    for(let i=0;i<need.length;i++){
      gstat(`가져오는 중… ${i+1}/${need.length}`);
      const it = await galFetch(galUrl() + '?mode=item&id=' + encodeURIComponent(need[i].id));
      got.push(it);
    }
    const r = galAdopt(got, 'merge');
    gstat(`${r.added}편을 가져왔습니다. (보관함 전체 ${list.length}편)`);
  }catch(e){
    gstat(e.message, true);
  }finally{ galSyncReady(); }
};
