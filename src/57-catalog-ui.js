/* ================= 확장 카탈로그 80종 렌더 ================= */
const CF = { key:'all' };

$('#catfil').innerHTML =
  `<button class="cbtn on" data-g="all">전체 <b>${CATALOG.length}</b></button>`
  + CAT_GROUPS.map(g=>{
      const n = CATALOG.filter(c=>c.k===g.k).length;
      return `<button class="cbtn" data-g="${g.k}">${g.n} <b>${n}</b></button>`;
    }).join('');

function catDraw(){
  const groups = CF.key==='all' ? CAT_GROUPS : CAT_GROUPS.filter(g=>g.k===CF.key);
  let shown = 0;
  $('#catbody').innerHTML = groups.map(g=>{
    const items = CATALOG.filter(c=>c.k===g.k);
    shown += items.length;
    const start = CATALOG.findIndex(c=>c.k===g.k) + 21;   // 완성 20종 다음 번호부터
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
}
$('#catfil').querySelectorAll('.cbtn').forEach(b=>b.onclick=()=>{
  $('#catfil').querySelectorAll('.cbtn').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); CF.key = b.dataset.g; catDraw();
});
catDraw();
