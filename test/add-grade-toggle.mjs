// 학년·과목별 토글 + 전 실험실 썸네일 카드 설치 (멱등 · CRLF 대응)
import fs from 'node:fs';

/* ① LABCAT 에 신규 2종 추가 (104·105) */
{
  const P = 'src/55-catalog.js';
  let c = fs.readFileSync(P, 'utf8');
  if (!c.includes('종이접기 등분')) {
    const m = c.match(/(\{k:'h12',g:'공통수학2 · 평면좌표와 내분점 \(STEAM 융합\)'[^}]*\})(\r?\n\];)/);
    if (!m) throw new Error('LABCAT 끝 앵커 실패');
    c = c.replace(m[0], m[1] + `,
{k:'m2',g:'중2 · 도형의 닮음 (종이접기 등분)',b:'접힌 선의 교점을 계산하지 않고 눈대중 좌표로 찍어 3등분 비가 2:1 이 아님'},
{k:'alg',g:'대수 · 지수함수와 로그함수 (주사위 실험)',b:'매년 같은 수(1/6×100=16.7)를 빼서 지수 감소가 아니라 직선 감소가 됨'}` + m[2]);
    fs.writeFileSync(P, c);
    console.log('LABCAT 2행 추가');
  } else console.log('LABCAT 이미 반영됨');
}

/* ② pane1 마크업에 토글 영역 추가 */
{
  const P = 'src/10-pane1-labs.html';
  let h = fs.readFileSync(P, 'utf8');
  if (!h.includes('id="gradebar"')) {
    const m = h.match(/[ \t]*<div class="grid" id="cards"><\/div>\r?\n/);
    if (!m) throw new Error('pane1 grid 앵커 실패');
    const nl = m[0].includes('\r\n') ? '\r\n' : '\n';
    const add = m[0] + [
      '',
      '  <h3 class="sub2" style="margin-top:42px">학년·과목별로 모두 보기 <span class="gcnt" id="gAll"></span></h3>',
      '  <p class="sub">학년(과목)을 누르면 그 칸의 실험실이 펼쳐집니다. 카드의 <b>썸네일</b>은 그 실험실에서 무엇을 조작하게 되는지 미리 보여 줍니다.</p>',
      '  <div class="gbar" id="gradebar"></div>',
      '  <div id="gradebody"></div>',
      ''
    ].join(nl);
    h = h.replace(m[0], add);
    fs.writeFileSync(P, h);
    console.log('pane1 토글 마크업 삽입');
  } else console.log('pane1 이미 반영됨');
}

/* ③ 스타일 */
{
  const P = 'src/styles.css';
  let c = fs.readFileSync(P, 'utf8');
  if (!c.includes('.gbar')) {
    c += `
/* 학년·과목 토글 */
.gbar{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 6px}
.gtog{display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:999px;
  border:1.6px solid #D8DEE8;background:#fff;color:#374151;font:inherit;font-size:13.5px;
  font-weight:800;cursor:pointer;transition:.15s}
.gtog:hover{border-color:#2563EB;color:#1D4ED8}
.gtog span{display:inline-block;min-width:20px;padding:1px 6px;border-radius:999px;
  background:#EEF2F8;color:#6B7280;font-size:11.5px;font-weight:800}
.gtog.on{background:#1D4ED8;border-color:#1D4ED8;color:#fff}
.gtog.on span{background:rgba(255,255,255,.22);color:#fff}
.gcnt{font-size:13px;font-weight:700;color:#6B7280;margin-left:6px}
.ghead{margin:16px 0 10px;font-size:13.5px;color:#4B5563}
.ghead b{color:#1D4ED8}
@media (prefers-reduced-motion:reduce){.gtog{transition:none}}
`;
    fs.writeFileSync(P, c);
    console.log('CSS 추가');
  } else console.log('CSS 이미 반영됨');
}

/* ④ 렌더링 코드 */
{
  const P = 'src/40-demos.js';
  let s = fs.readFileSync(P, 'utf8');
  if (!s.includes('학년·과목별 토글')) {
    s += `

/* 학년·과목별 토글 — 전 실험실을 학년 칸에 접어 두고, 누르면 썸네일 카드로 펼친다.
   분류는 LABCAT[i].k (카탈로그 과목 코드), 이름은 CAT_GROUPS 에서 가져온다. */
(function(){
  const bar = $('#gradebar'), body = $('#gradebody');
  if(!bar || !body || typeof LABS === 'undefined') return;
  const NAME = {};
  if(typeof CAT_GROUPS !== 'undefined') CAT_GROUPS.forEach(g=>{ NAME[g.k]=g.n; });
  const groups = {};
  LABS.forEach((L,i)=>{
    const k = (typeof LABCAT !== 'undefined' && LABCAT[i] && LABCAT[i].k) || 'etc';
    (groups[k] = groups[k] || []).push({L:L, i:i});
  });
  const order = (typeof CAT_GROUPS !== 'undefined' ? CAT_GROUPS.map(g=>g.k) : []).filter(k=>groups[k]);
  Object.keys(groups).forEach(k=>{ if(order.indexOf(k)<0) order.push(k); });
  const allTag = $('#gAll'); if(allTag) allTag.textContent = '전체 ' + LABS.length + '종';
  let openK = null;

  function card(L, i){
    const c = el('<div class="card">'
      + '<div class="no">LAB ' + String(i+1).padStart(2,'0')
      + ' <span class="badge ' + (L.core?'b-core':'b-ext') + '">' + (L.core?'연수 편성':'확장 후보') + '</span></div>'
      + (THUMBS[i] || '')
      + '<h3>' + L.t + '</h3>'
      + '<div class="q">' + L.q + '</div>'
      + '<div class="tags">' + L.m.slice(0,2).map(x=>'<span class="tag m">'+x+'</span>').join('')
        + L.a.slice(0,1).map(x=>'<span class="tag a">'+x+'</span>').join('') + '</div>'
      + '<div class="go">▶ 직접 조작해 보기</div></div>');
    c.onclick = function(){ open(L, i); };
    return c;
  }
  function render(){
    bar.innerHTML = order.map(function(k){
      return '<button class="gtog' + (openK===k?' on':'') + '" data-k="' + k + '">'
        + (NAME[k] || '기타') + ' <span>' + groups[k].length + '</span></button>';
    }).join('');
    bar.querySelectorAll('[data-k]').forEach(function(b){
      b.onclick = function(){ openK = (openK === b.dataset.k) ? null : b.dataset.k; render(); };
    });
    body.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'ghead';
    if(!openK){
      p.innerHTML = '위 단추를 누르면 그 학년(과목)의 실험실이 <b>썸네일 카드</b>로 펼쳐집니다. 다시 누르면 접힙니다.';
      body.appendChild(p); return;
    }
    const list = groups[openK].slice().sort(function(a,b){ return a.i-b.i; });
    p.innerHTML = '<b>' + (NAME[openK]||'기타') + '</b> — 실험실 ' + list.length + '종 · 카드를 누르면 바로 조작할 수 있습니다.';
    body.appendChild(p);
    const g = document.createElement('div');
    g.className = 'grid';
    list.forEach(function(x){ g.appendChild(card(x.L, x.i)); });
    body.appendChild(g);
  }
  render();
})();
`;
    fs.writeFileSync(P, s);
    console.log('렌더러 추가');
  } else console.log('렌더러 이미 반영됨');
}
console.log('설치 완료');
