/* ================= 탭⑤ 우리 연수 모음집 =================
   서버도 브라우저 저장소도 쓰지 않는다(단일 파일 원칙 · localStorage 금지).
   올린 파일은 메모리에만 있다가, 「모음집 내려받기」로 단일 HTML 하나에 묶여 나간다.
   그 파일을 강사가 배포하면 연수 뒤에도 전원이 서로의 자료를 열어 볼 수 있다. */

const GAL = [];
const MAXB = 2 * 1024 * 1024;   // 한 파일 2MB 제한 — 모음집이 감당 못 할 만큼 커지는 것을 막는다

function galCount(){
  const n = GAL.length;
  $('#gcount').innerHTML = n
    ? `<b>${n}편</b>이 모였습니다 · 합계 ${(GAL.reduce((s,g)=>s+g.src.length,0)/1024).toFixed(0)} KB`
    : '아직 올라온 자료가 없습니다.';
  $('#gExport').disabled = !n;
  $('#gClear').disabled = !n;
}
function galRender(){
  $('#glist').innerHTML = GAL.map((g,i)=>`
    <div class="gcard">
      <div class="gn">${String(i+1).padStart(2,'0')}</div>
      <h4>${esc(g.title)}</h4>
      <div class="gwho">${esc(g.who||'이름 없음')}</div>
      <p class="gmemo">${esc(g.memo||'소개가 없습니다.')}</p>
      <div class="gfoot"><span class="gfile">${esc(g.name)} · ${(g.src.length/1024).toFixed(0)} KB</span>
        <span class="gbtns"><button class="b sm" data-o="${i}">열어 보기</button>
        <button class="b g sm" data-x="${i}">빼기</button></span></div>
    </div>`).join('');
  $('#glist').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>galOpen(+b.dataset.o));
  $('#glist').querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{
    GAL.splice(+b.dataset.x,1); galRender(); galCount(); $('#gpv').style.display='none';});
  galCount();
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
        who: $('#who').value.trim(),
        memo: $('#memo').value.trim(),
        src
      });
      if(++done === list.length){ $('#memo').value=''; galRender(); }
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
  const data = JSON.stringify(GAL.map(g=>({t:g.title, w:g.who, m:g.memo, n:g.name, s:g.src})))
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
    + '<h3>' + esc(d.t) + '</h3>'
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
