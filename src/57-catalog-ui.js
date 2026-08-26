/* ================= 확장 카탈로그 렌더 =================
   화면에 찍히는 “○○종”은 전부 여기서 배열 길이로 계산합니다.
   LABS / CATALOG 에 항목을 넣고 빼면 탭 이름·제목·안내문이 함께 따라옵니다.
   숫자를 본문에 손으로 적지 마십시오.

   카탈로그는 두 가지를 함께 싣습니다.
     ① 제작 완료 — LABS 44종. 과목·단원은 LABCAT 에서, 핵심 개념은 LABS 의 m 에서, 제목·질문·AI 는 LABS 에서 읽습니다.
        (같은 문구를 두 곳에 적지 않기 위해서입니다. 실험실 이름을 고치면 카탈로그도 따라옵니다.)
     ② 설계 재료 — CATALOG. 아직 만들지 않은 후보입니다.
   상단 카드 그리드에는 LAB 01~20 만 보이고, 나머지 실험실은 여기 제 과목 자리에서 엽니다.  */
const CF = { key:'all', plan:{}, wall:{} };  /* plan[과목키]=true 면 그 과목의 설계 재료를 편다 */
const planOn = k => !!CF.plan[k];
const wallOn = k => CF.wall[k] !== false;   /* 썸네일 벽은 기본으로 편다 */

/* 실험실 44종을 카탈로그 항목 모양으로 바꾼다 */
function labItems(){
  if (typeof LABS === 'undefined' || typeof LABCAT === 'undefined') return [];
  return LABS.map((L,i)=>{
    const c = LABCAT[i] || {};
    return { k:c.k||'', t:L.t, g:c.g||'', q:L.q||'',
             b:c.b||'', c:(L.m||[]).slice(0,3), a:(L.a||[]).join(' · '), lab:i };
  });
}
/* 카탈로그에 실리는 전체 목록 — 과목별로 제작 완료가 먼저 온다 */
function allItems(){
  const items = labItems().concat(CATALOG);
  items.forEach((c,i)=>{ c._no = i+1; });
  return items;
}

function catFilters(ALL){
  $('#catfil').innerHTML =
    `<button class="cbtn${CF.key==='all'?' on':''}" data-g="all">전체 <b>${ALL.filter(c=>c.lab!=null).length}</b></button>`
    + CAT_GROUPS.map(g=>{
        const n = ALL.filter(c=>c.k===g.k && c.lab!=null).length;
        return `<button class="cbtn${CF.key===g.k?' on':''}" data-g="${g.k}">${g.n} <b>${n}</b></button>`;
      }).join('');
  $('#catfil').querySelectorAll('.cbtn').forEach(b=>{
    b.onclick=()=>{ CF.key = b.dataset.g; catDraw(); };
  });
}

/* 실험실 수 · 카탈로그 수 · 합계를 화면 곳곳에 반영 */
function catCounts(ALL){
  const nAll  = ALL ? ALL.length : 0;
  const nLab  = (typeof LABS !== 'undefined') ? LABS.length : 0;
  // 상단에 실제로 걸린 카드(TOP)를 그대로 센다 — 앞에서 20개를 자르는 것이 아니다
  const top   = (typeof TOP !== 'undefined') ? TOP.map(x=>x.L)
              : (typeof LABS !== 'undefined') ? LABS : [];
  const nTop  = top.length;
  const nCore = top.filter(l=>l.core).length;
  const set = (id, html)=>{ const e = document.getElementById(id); if(e) e.innerHTML = html; };
  set('tabLab',  nLab + '종');
  set('tabCat',  nAll + '종');
  set('nCore',   '연수 편성 ' + nCore + '종');
  set('nExt',    '확장 후보 ' + (nTop - nCore) + '종');
  set('catTitle','확장 카탈로그 ' + nAll + '종 — 제작 완료 ' + nLab + '종 포함');
  set('nLab1',   '대표 ' + nTop + '종');
  set('nCat1',   nAll + '종');
  set('nMade',   nLab + '종');
  if(typeof VLAB !== 'undefined') set('nVlab', Object.keys(VLAB).length + '종');
}

function catDraw(){
  const ALL = allItems();
  catFilters(ALL);
  const groups = CF.key==='all' ? CAT_GROUPS : CAT_GROUPS.filter(g=>g.k===CF.key);
  let shown = 0;
  $('#catbody').innerHTML = groups.map(g=>{
    const all  = ALL.filter(c=>c.k===g.k);
    const done = all.filter(c=>c.lab!=null);
    const plan = all.filter(c=>c.lab==null);
    const items = planOn(g.k) ? done.concat(plan) : done;
    if(!all.length) return '';
    shown += items.length;
    const made = done.length;
    const wall = wallOn(g.k) && done.length
      ? `<div class="catwall" data-g="${g.k}">${done.map(c=>`
          <button class="cwx" data-lab="${c.lab}" title="LAB ${c.lab+1} · ${c.t.replace(/"/g,'')}">
            ${(typeof THUMBS!=='undefined' && THUMBS[c.lab]) ? THUMBS[c.lab] : ''}
            <span class="cwn">${c.lab+1}</span>
          </button>`).join('')}</div>`
      : '';
    return `<section class="catg">
      <div class="catgh"><h4>${g.n}<span>${done.length}종</span>${made?`<span class="gmade">제작 완료 ${made}</span>`:''}</h4><p>${g.d}</p>
        <div class="catgbar">
          ${done.length?`<button class="gtg wall${wallOn(g.k)?' on':''}" data-wall="${g.k}">${wallOn(g.k)?'썸네일 접기':'썸네일 한눈에 보기'} <b>${done.length}</b></button>`:''}
          ${plan.length?`<button class="gtg plan${planOn(g.k)?' on':''}" data-plan="${g.k}">${planOn(g.k)?'설계 재료 접기':'설계 재료 보기'} <b>${plan.length}</b></button>`:''}
        </div>
      </div>
      ${wall}
      <div class="catgrid">${items.map(c=>`
        <article class="citem ${c.k}${c.lab!=null?' made':''}"${c.lab!=null?` data-lab="${c.lab}" tabindex="0" role="button"`:''}>
          <div class="cno"><span class="cnum">${String(c._no).padStart(3,'0')}</span>${c.lab!=null?`<span class="cmade">제작 완료 · LAB ${String(c.lab+1).padStart(2,'0')}</span>`:`<span class="cplan">설계 재료</span>`}</div>
          ${c.lab!=null && typeof THUMBS!=='undefined' && THUMBS[c.lab] ? THUMBS[c.lab] : ''}
          <h5>${c.t}</h5>
          <div class="cg">${c.g}</div>
          ${c.q ? `<p class="cq">${c.q}</p>` : ''}
          ${(c.c && c.c.length)
            ? `<div class="ck"><span class="ckl">핵심 개념</span><span class="ckt">${c.c.slice(0,3).map(x=>`<span class="tag m">${x}</span>`).join('')}</span></div>`
            : `<div class="ck none"><span class="ckl">핵심 개념</span><span class="ckt">아직 정하지 않음</span></div>`}
          ${c.a ? `<div class="ca">${c.a}</div>` : ''}
          ${c.lab!=null ? `<div class="cgo">▶ 직접 조작해 보기</div>` : ''}
        </article>`).join('')}</div>
    </section>`;
  }).join('');

  // 과목마다의 두 토글
  $('#catbody').querySelectorAll('.gtg').forEach(b=>{
    b.onclick = ()=>{
      if(b.dataset.plan) CF.plan[b.dataset.plan] = !planOn(b.dataset.plan);
      else CF.wall[b.dataset.wall] = !wallOn(b.dataset.wall);
      catDraw();
    };
  });
  // 썸네일 벽에서 바로 열기
  $('#catbody').querySelectorAll('.cwx').forEach(b=>{
    b.onclick = ()=>{ if(typeof openLab === 'function') openLab(+b.dataset.lab); };
  });

  // 제작 완료 카드는 눌러서 그 실험실을 연다 (키보드로도)
  $('#catbody').querySelectorAll('.citem.made').forEach(a=>{
    const go = ()=>{ if(typeof openLab === 'function') openLab(+a.dataset.lab); };
    a.onclick = go;
    a.onkeydown = e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } };
  });

  const ready = ALL.filter(c=>(planOn(c.k)||c.lab!=null) && c.c && c.c.length).length;
  const nMade = ALL.filter(c=>c.lab!=null).length;
  const nPlanAll = ALL.length - nMade;
  const opened = Object.keys(CF.plan).filter(k=>CF.plan[k]).length;
  $('#catcnt').innerHTML = `<b>${shown}종</b> 표시 중 · 제작 완료 <b>${nMade}종</b>`
    + ` · 설계 재료 <b>${nPlanAll}종</b>은 과목마다 「설계 재료 보기」를 눌러야 나옵니다`
    + (opened?` (지금 ${opened}과목 펼침)`:'')
    + ` · 핵심 개념이 적힌 것 <b>${ready}종</b>`;
  catCounts(ALL);
}
catDraw();
