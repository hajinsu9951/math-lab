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
