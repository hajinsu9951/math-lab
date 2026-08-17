/* ================= 확장 카탈로그 렌더 =================
   화면에 찍히는 “○○종”은 전부 여기서 배열 길이로 계산합니다.
   LABS / CATALOG 에 항목을 넣고 빼면 탭 이름·제목·안내문이 함께 따라옵니다.
   숫자를 본문에 손으로 적지 마십시오.                                    */
const CF = { key:'all' };

function catFilters(){
  $('#catfil').innerHTML =
    `<button class="cbtn${CF.key==='all'?' on':''}" data-g="all">전체 <b>${CATALOG.length}</b></button>`
    + CAT_GROUPS.map(g=>{
        const n = CATALOG.filter(c=>c.k===g.k).length;
        return `<button class="cbtn${CF.key===g.k?' on':''}" data-g="${g.k}">${g.n} <b>${n}</b></button>`;
      }).join('');
  $('#catfil').querySelectorAll('.cbtn').forEach(b=>b.onclick=()=>{
    CF.key = b.dataset.g; catFilters(); catDraw();
  });
}

/* 실험실 수 · 카탈로그 수 · 합계를 화면 곳곳에 반영 */
function catCounts(){
  const nLab  = (typeof LABS !== 'undefined') ? LABS.length : 0;
  const nCore = (typeof LABS !== 'undefined') ? LABS.filter(l=>l.core).length : 0;
  const nCat  = CATALOG.length;
  const set = (id, html)=>{ const e = document.getElementById(id); if(e) e.innerHTML = html; };
  set('tabLab',  nLab + '종');
  set('tabCat',  nCat + '종');
  set('nCore',   '연수 편성 ' + nCore + '종');
  set('nExt',    '확장 후보 ' + (nLab - nCore) + '종');
  set('catTitle','확장 카탈로그 ' + nCat + '종 — 합해서 ' + (nLab + nCat) + '종');
  set('nLab1',   nLab + '종');
  set('nCat1',   nCat + '종');
  if(typeof VLAB !== 'undefined') set('nVlab', Object.keys(VLAB).length + '종');
}

function catDraw(){
  catFilters();                      // 갤러리에서 승격되면 묶음별 개수도 함께 갱신
  const groups = CF.key==='all' ? CAT_GROUPS : CAT_GROUPS.filter(g=>g.k===CF.key);
  let shown = 0;
  $('#catbody').innerHTML = groups.map(g=>{
    const items = CATALOG.filter(c=>c.k===g.k);
    shown += items.length;
    const base = (typeof LABS !== 'undefined' ? LABS.length : 0) + 1;   // 완성 실험실 다음 번호부터
    const start = CATALOG.findIndex(c=>c.k===g.k) + base;
    return `<section class="catg">
      <div class="catgh"><h4>${g.n}<span>${items.length}종</span></h4><p>${g.d}</p></div>
      <div class="catgrid">${items.map((c,i)=>`
        <article class="citem ${c.k}">
          <div class="cno">${String(start+i).padStart(3,'0')}</div>
          <h5>${c.t}</h5>
          <div class="cg">${c.g}</div>
          ${c.q ? `<p class="cq">${c.q}</p>` : ''}
          ${c.b ? `<p class="cb"><span>R4 결함 후보</span>${c.b}</p>`
                : `<p class="cb none"><span>R4 결함 후보</span>아직 설계되지 않음 — 만들기 전에 반드시 채울 것</p>`}
          ${c.a ? `<div class="ca">${c.a}</div>` : ''}
        </article>`).join('')}</div>
    </section>`;
  }).join('');
  const ready = CATALOG.filter(c=>c.b).length;
  $('#catcnt').innerHTML = `<b>${shown}종</b> 표시 중 · 전체 ${CATALOG.length}종 가운데 `
    + `설계가 끝난 것 <b>${ready}종</b> · 주제만 잡힌 것 ${CATALOG.length - ready}종`;
  catCounts();
}
catDraw();
