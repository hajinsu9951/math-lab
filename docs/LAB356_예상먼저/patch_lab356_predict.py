# -*- coding: utf-8 -*-
"""LAB 356 — 스위치를 누르기 전에 「예상」을 먼저 적게 한다.

무엇이 문제였나
  실험실 안내문에는 「먼저 활동지에 진리표를 채우고 논리식을 추리한 뒤 회로판으로 확인하라」고
  적혀 있는데, **화면이 그 순서를 지키게 하지 않았다.** 스위치부터 눌러도 표가 저절로 채워졌다.
  그러면 남는 것은 클릭뿐이고, 「예상이 빗나갔다」는 경험이 사라진다.

어떻게 바꾸나
  · 진리표에 <b>「내 예상」 칸</b>을 넣는다 — 조합마다 1 · 0 을 찍는다.
  · 네 칸을 다 찍어 <b>「예상 제출」</b> 을 눌러야 스위치가 열린다. 그 전에 누르면 안내가 뜬다.
  · 제출 뒤 실험하면 줄마다 <b>✓ / ✗</b> 가 붙고, 다 채우면 「예상이 맞은 칸 n / 전체」를 알려 준다.
  · 미션 1 의 문구도 「예상 → 확인」 으로 바꾼다.

사용: python docs/LAB356_예상먼저/patch_lab356_predict.py src/40-demos.js
"""
import sys, os

S_OLD = """  const S = { i:0, sw:{A:0,B:0,C:0}, tried:{}, gates:[], out:'-', pass:{}, last:'' };
  LCP.forEach(p=>{ S.tried[p.id]={}; S.pass[p.id]=[]; });"""
S_NEW = """  const S = { i:0, sw:{A:0,B:0,C:0}, tried:{}, gates:[], out:'-', pass:{}, last:'',
              pred:{}, predDone:{} };
  LCP.forEach(p=>{ S.tried[p.id]={}; S.pass[p.id]=[]; S.pred[p.id]={}; S.predDone[p.id]=false; });"""

TOG_OLD = """  function toggle(n){ S.sw[n]=S.sw[n]?0:1; drawAll(); }"""
TOG_NEW = """  function toggle(n){
    /* 예상을 내기 전에는 스위치가 열리지 않는다 — 찍어 보고 나서 확인하는 순서다 */
    if(!S.predDone[P().id]){ note('예상을 먼저 제출하세요 — 조합마다 전구를 1·0 으로 찍으면 스위치가 열립니다.'); return; }
    S.sw[n]=S.sw[n]?0:1; drawAll(); }"""

TT_OLD = """  /* ── 진리표 — 실험한 조합만 열린다 ── */
  function drawTable(){
    const p=P(), cs=lcCombos(p.sw), tr=S.tried[p.id];
    tr[lcKey(p,S.sw)] = p.f(S.sw);
    const done = cs.filter(c=>tr[lcKey(p,c)]!==undefined).length;
    const now = lcKey(p,S.sw);
    $('#lcTT').innerHTML =
      `<div class="lctth">진리표 <span>${done} / ${cs.length} 조사</span></div>
       <table><thead><tr>${p.sw.map(n=>`<th>${n}</th>`).join('')}<th>전구</th></tr></thead>
       <tbody>${cs.map(c=>{
         const k=lcKey(p,c), v=tr[k];
         return `<tr class="${k===now?'now':''}">${p.sw.map(n=>`<td>${c[n]}</td>`).join('')}
           <td class="${v===undefined?'unk':v?'on':'off'}">${v===undefined?'?':v?'● 1':'○ 0'}</td></tr>`;
       }).join('')}</tbody></table>`;
    const full = done===cs.length;
    $('#lcOut').innerHTML = full
      ? `<b style="color:#0E9384">진리표를 모두 채웠습니다</b> — 이제 <b>종이 활동지</b>에 이 표를 옮겨 그리고,
         어떤 논리식인지 추리해 적은 뒤 아래 2단계에서 조립해 확인하세요.`
      : `<span style="color:#6B7280">아직 ${cs.length-done}가지 조합을 안 해 봤습니다 —
         빈칸(?)이 남아 있으면 논리식을 확정할 수 없습니다.</span>`;
    return full;
  }"""

TT_NEW = """  /* ── 진리표 — 예상을 먼저 적고, 실험으로 확인한다 ── */
  function drawTable(){
    const p=P(), cs=lcCombos(p.sw), tr=S.tried[p.id];
    const pr=S.pred[p.id], ready=S.predDone[p.id];
    if(ready) tr[lcKey(p,S.sw)] = p.f(S.sw);        // 예상을 낸 뒤에야 실험값이 쌓인다
    const done = cs.filter(c=>tr[lcKey(p,c)]!==undefined).length;
    const now = lcKey(p,S.sw);
    const left = cs.filter(c=>pr[lcKey(p,c)]===undefined).length;
    const hit = cs.filter(c=>{ const k=lcKey(p,c); return tr[k]!==undefined && tr[k]===pr[k]; }).length;
    $('#lcTT').innerHTML =
      `<div class="lctth">진리표 <span>${ready ? done+' / '+cs.length+' 조사' : '① 먼저 예상을 적으세요'}</span></div>
       <table><thead><tr>${p.sw.map(n=>`<th>${n}</th>`).join('')}<th>내 예상</th><th>전구</th><th></th></tr></thead>
       <tbody>${cs.map(c=>{
         const k=lcKey(p,c), v=tr[k], q=pr[k];
         const pc = ready
           ? `<td class="lcpd">${q===undefined?'—':q?'1':'0'}</td>`
           : `<td class="lcpd"><button class="lcpv${q===1?' on':''}" data-pk="${k}" data-pv="1">1</button>`
             + `<button class="lcpv${q===0?' off':''}" data-pk="${k}" data-pv="0">0</button></td>`;
         const mark = (ready && v!==undefined && q!==undefined)
           ? (v===q ? '<td class="lcok">✓</td>' : '<td class="lcng">✗</td>') : '<td></td>';
         return `<tr class="${k===now?'now':''}">${p.sw.map(n=>`<td>${c[n]}</td>`).join('')}
           ${pc}
           <td class="${!ready||v===undefined?'unk':v?'on':'off'}">${!ready?'—':v===undefined?'?':v?'● 1':'○ 0'}</td>
           ${mark}</tr>`;
       }).join('')}</tbody></table>
       ${ready ? '' : `<div class="lcpbar"><button class="b t sm" id="lcPgo"${left?' disabled':''}>예상 제출 (${cs.length-left} / ${cs.length} 칸)</button>
          <span class="muted">모든 조합을 찍어야 스위치가 열립니다</span></div>`}`;
    if(!ready){
      $('#lcTT').querySelectorAll('[data-pk]').forEach(b=>b.onclick=()=>{
        pr[b.dataset.pk] = +b.dataset.pv; drawTable(); });
      const go = $('#lcPgo');
      if(go) go.onclick = ()=>{ S.predDone[p.id]=true; drawAll(); };
    }
    const full = ready && done===cs.length;
    $('#lcOut').innerHTML = !ready
      ? `<span style="color:#B45309">스위치를 누르기 전에 <b>예상부터</b> 적으세요 —
         전류가 어느 길로 흐르는지 따라가면 답이 나옵니다. 빗나가도 괜찮습니다, 그게 이 활동의 핵심입니다.</span>`
      : full
      ? `<b style="color:#0E9384">진리표를 모두 채웠습니다</b> — 예상이 맞은 칸 <b>${hit} / ${cs.length}</b>.
         ${hit===cs.length
            ? '전부 맞혔습니다. 무엇을 근거로 그렇게 예상했는지 한 줄로 적어 두세요.'
            : '틀린 칸(✗)에서 전류가 어디로 흘렀는지 다시 따라가 보세요 — 거기에 배울 것이 있습니다.'}
         이제 <b>종이 활동지</b>에 이 표를 옮겨 적고, 어떤 논리식인지 추리한 뒤 아래 2단계에서 조립해 확인하세요.`
      : `<span style="color:#6B7280">아직 ${cs.length-done}가지 조합을 안 해 봤습니다 —
         빈칸(?)이 남아 있으면 논리식을 확정할 수 없습니다.</span>`;
    return full;
  }"""

MISS_OLD = """  {t:'회로 하나를 골라 스위치를 눌러 가며 표의 물음표를 전부 없애세요.', re:'진리표를 모두 채웠습니다'},"""
MISS_NEW = """  {t:'회로 하나를 고르고 <b>먼저 예상</b>을 적으세요 — 조합마다 전구를 1·0 으로 찍어 제출한 뒤, 스위치를 눌러 확인합니다.',
   re:'진리표를 모두 채웠습니다',
   do:'① 「내 예상」 칸의 1·0 단추 ② 「예상 제출」 ③ 스위치를 눌러 ✓·✗ 확인',
   hand:'전류가 흐르는 길을 따라가며 왜 그렇게 예상했는지 조합마다 한 줄씩 적기'},"""

CSS = '''
/* LAB 356 — 예상 먼저 (2026-09-22) */
.lcpd{white-space:nowrap}
.lcpv{border:1px solid #C7D8F7;background:#fff;color:var(--ink2);border-radius:6px;
      width:26px;height:24px;margin:0 1px;font:inherit;font-size:12px;cursor:pointer}
.lcpv.on{background:#BE123C;border-color:#BE123C;color:#fff}
.lcpv.off{background:#0E9384;border-color:#0E9384;color:#fff}
.lcok{color:#0E9384;font-weight:800}
.lcng{color:#BE123C;font-weight:800}
.lcpbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px}
'''


def main(path):
    h = open(path, encoding='utf-8').read()
    done, skip = [], []
    for name, old, new in [('예상 상태 보관', S_OLD, S_NEW),
                           ('예상 전에는 스위치 잠금', TOG_OLD, TOG_NEW),
                           ('진리표에 예상 칸', TT_OLD, TT_NEW),
                           ('미션 1 문구', MISS_OLD, MISS_NEW)]:
        if new in h:
            skip.append(name)
            continue
        n = h.count(old)
        assert n == 1, '「%s」 자리를 %d 번 찾음' % (name, n)
        h = h.replace(old, new, 1)
        done.append(name)
    open(path, 'w', encoding='utf-8').write(h)
    print('고침 :', ' · '.join(done) if done else '(없음)')
    print('이미  :', ' · '.join(skip) if skip else '(없음)')

    css = os.path.join(os.path.dirname(os.path.abspath(path)), 'styles.css')
    if os.path.exists(css):
        c = open(css, encoding='utf-8').read()
        if '.lcpv{' not in c:
            open(css, 'w', encoding='utf-8').write(c + CSS)
            print('styles.css 에 예상 칸 모양 추가')
        else:
            print('styles.css 이미 반영됨')


if __name__ == '__main__':
    main(sys.argv[1])
