# -*- coding: utf-8 -*-
"""공개본(index.html)에 세 가지를 덧댄다. 소스를 고치지 않고 결과물에만 얹는다.

  사용: python patch_publish.py <index.html>

  ① 단계마다 「다시 보는 오늘의 문제」 — 예상·실험·기록에서 ① 문제가 사라지지 않게
  ② 「풀이와 답안」 칸에 무엇을 쓸지 안내하는 줄
  ③ 카드 격자 — 넓은 화면에서 열을 늘리고 카드를 낮춘다 (썸네일 그림은 자르지 않는다)

  덧대는 코드는 화면(DOM)을 읽어 동작하므로 원본 소스가 없어도 된다.
  같은 파일에 여러 번 돌려도 블록 하나만 유지된다.
"""
import io
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

IDX = sys.argv[1]
h = io.open(IDX, encoding="utf-8").read()
h = re.sub(r"\n<!-- PATCH start -->.*?<!-- PATCH end -->\n", "\n", h, flags=re.S)

BLOCK = r"""
<!-- PATCH start -->
<style>
/* ③ 카드 격자 — 본문은 1140px 로 묶되 격자만 좌우로 빠져나와 열을 늘린다 */
.grid, .catgrid{
  --bleed: clamp(0px, calc((100vw - 1180px) / 2), 320px);
  margin-left: calc(-1 * var(--bleed));
  margin-right: calc(-1 * var(--bleed));
}
.grid{grid-template-columns:repeat(auto-fill,minmax(232px,1fr))}
.catgrid{grid-template-columns:repeat(auto-fill,minmax(228px,1fr))}
@media (max-width:1180px){ .grid, .catgrid{--bleed:0px} }

/* 카드 높이는 글·여백에서만 줄인다 — 힉스필드 삽화 비율은 건드리지 않는다 */
.card{padding:13px 13px 12px;gap:6px}
.card h3{font-size:15.5px;line-height:1.3}
.card .q{font-size:13px;min-height:0;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.card .tags{max-height:24px;overflow:hidden}
.card .go{margin-top:2px}
.citem{padding:12px 13px 11px;gap:4px}
.citem h5{font-size:14px;line-height:1.3}
.citem .cq{font-size:12.5px;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.citem .ckt{max-height:24px;overflow:hidden}

/* ① 단계마다 다시 싣는 오늘의 문제 */
.lsnrc{margin:0 0 12px;padding:9px 13px;background:#FFFBEB;
  border:1px solid #FCD34D;border-left:3px solid #F59E0B;border-radius:9px}
.lsnrc summary{cursor:pointer;font-size:11.8px;font-weight:900;color:#92400E;list-style:none}
.lsnrc summary::-webkit-details-marker{display:none}
.lsnrc summary::before{content:'▾ '}
.lsnrc:not([open]) summary::before{content:'▸ '}
.lsnrc .q{margin:7px 0 0;font-size:13.5px;line-height:1.6;font-weight:800;color:#111827}
.lsnrc .s{margin-top:5px;font-size:12.5px;line-height:1.65;color:#4B5563}

/* ② 풀이와 답안 안내 줄 */
.wphint{flex:0 0 auto;margin:0;padding:7px 11px;font-size:12px;line-height:1.6;
  color:#4B5563;background:#F8FAFF;border-bottom:1px dashed #D8E4FB}
.wphint b{color:#2563EB;font-weight:800}

/* ④ 틀린 칸만 짚어 주기 */
.eqi.eqbad{border-color:#DC2626 !important;background:#FEF2F2 !important;color:#B91C1C !important}
.eqhint{margin:6px 0 0;padding:7px 10px;border-radius:8px;font-size:12.2px;line-height:1.6;
  background:#FEF2F2;border:1px solid #FECACA;color:#991B1B}
.eqhint.ok{background:#F0FDF4;border-color:#BBF7D0;color:#166534}
.eqhint b{font-weight:800}
</style>
<script>
(function(){
  /* ① 예상·실험·기록 단계에 ① 문제를 다시 싣는다.
        문구는 그 실험실의 ① 문제 단계(.lsnph[data-ph="0"])에서 그대로 읽어 온다 —
        같은 말을 두 곳에 적지 않기 위해서다. */
  function recap(flow){
    var p0 = flow.querySelector('.lsnph[data-ph="0"]');
    if(!p0) return;
    var q = p0.querySelector('.lsnq'), s = p0.querySelector('.lsnsit');
    if(!q) return;
    ['1','2','3'].forEach(function(i){
      var ph = flow.querySelector('.lsnph[data-ph="'+i+'"]');
      if(!ph || ph.querySelector('.lsnrc')) return;
      var d = document.createElement('details');
      d.className = 'lsnrc'; d.open = true;
      d.innerHTML = '<summary>📌 다시 보는 오늘의 문제</summary>'
        + '<p class="q">' + q.innerHTML + '</p>'
        + (s ? '<div class="s">' + s.innerHTML + '</div>' : '');
      ph.insertBefore(d, ph.firstChild);
    });
  }

  /* ② 빈 칸 앞에서 막히지 않도록 쓸 것을 번호로 일러 준다.
        어떤 칸인지는 그 칸이 놓인 단계의 머리글을 보고 고른다. */
  var HINT = {
    예상: '이렇게 쓰면 됩니다 — <b>①</b> 예상한 답을 수·식·그림 가운데 하나로 '
        + '<b>②</b> 그렇게 본 까닭을 한 줄 <b>③</b> 실험에서 확인할 것 한 가지. '
        + '틀려도 됩니다 — 실험한 뒤 빨간 펜으로 고쳐 쓰는 것이 이 칸의 목적입니다.',
    원리: '이렇게 쓰면 됩니다 — <b>①</b> 실험에서 찾은 규칙을 <b>내 말로 한 문장</b> '
        + '<b>②</b> 같은 규칙을 <b>식으로 한 줄</b> <b>③</b> 그 식이 맞다고 본 근거(화면에서 읽은 수)를 하나.',
    보고서: '위 세 물음에 차례로 답하세요 — <b>①</b> 표에서 <b>본 것</b>(수치 그대로) '
        + '<b>②</b> 거기서 찾은 <b>규칙</b>(말 또는 식) <b>③</b> 왜 그런지 <b>설명</b>과, 값을 바꿔도 통하는지.'
  };
  function hint(pad){
    if(pad.querySelector('.wphint')) return;
    var host = pad.closest('.lsnph, .iqb, .plock, .pgmemo, section, div');
    var txt = (host && host.innerText || '').slice(0, 200);
    var key = /원리|설명/.test(txt) ? '원리' : /보고서|기록/.test(txt) ? '보고서' : '예상';
    var head = pad.querySelector('.wph');
    if(!head) return;
    var p = document.createElement('p');
    p.className = 'wphint'; p.innerHTML = HINT[key];
    head.parentNode.insertBefore(p, head.nextSibling);
  }


  /* ③ 탐구 사다리의 「이렇게」·「손으로」 줄에 정답 식이 그대로 적혀 있었다.
        절차는 남기고 답만 지운다 — 학생이 스스로 세우게 한다. */
  function hideAnswers(root){
    root.querySelectorAll('.ldd, .ldw').forEach(function(el){
      if(el.dataset.masked) return;
      var h = el.innerHTML;
      var before = h;
      h = h.replace(/\([xX]\s*[−-]\s*\d+\)\s*²\s*\+\s*\([yY]\s*[−-]\s*\d+\)\s*²\s*=\s*\d+/g, '원의 방정식');
      h = h.replace(/\d*\s*[xX]\s*\+\s*\d*\s*[yY]\s*=\s*\d+/g, '직선의 식');
      h = h.replace(/\(\s*5\s*,\s*4\s*\)/g, '친구의 좌표');
      h = h.replace(/정말\s*\d+\s*가\s*되는지/g, '정말 우변 값이 되는지');
      h = h.replace(/[xX]\s*=\s*\d+\s*,\s*[yY]\s*=\s*\d+/g, '해');
      /* 식을 걷어내면 조사가 어긋난다 — 읽히게 다듬는다 */
      h = h.replace(/원의 방정식\s*와\s*원의 방정식\s*를/g, '두 원의 방정식을');
      h = h.replace(/직선의 식\s*와\s*직선의 식\s*를/g, '두 직선의 식을');
      if(h !== before){ el.innerHTML = h; }
      el.dataset.masked = '1';
    });
  }

  /* ④ 「식 확인」을 눌렀을 때 틀린 칸만 붉게 하고 힌트를 준다.
        기대값은 문제에 적힌 기준점과 거리에서 나온다 —
        편의점(1,1) 500 m · 도서관(5,9) 500 m · 학교(9,4) 400 m, 1칸 = 100 m. */
  var WANT = { '①':[1,1,25], '②':[5,9,25], '③':[9,4,16], '④':[1,2,13], '⑤':[8,3,52] };
  var WHY = {
    r2: '우변은 <b>반지름이 아니라 반지름의 제곱</b>입니다. 500 m 는 5칸이니 5² 를 적으세요.',
    c:  '(x − a)² 의 <b>a 는 중심의 x좌표 그대로</b>입니다. 부호를 뒤집지 마세요.',
    ln: '두 원의 식을 <b>빼면</b> x²·y² 이 지워집니다. 남는 x·y 의 계수와 우변을 그대로 적으세요.'
  };
  function num(v){ v = (v||'').trim().replace(/\s/g,''); return v==='' ? null : Number(v); }

  function checkGroup(box){
    var ins = [].slice.call(box.querySelectorAll('.eqi'));
    if(ins.length < 3) return;
    var label = (box.innerText.match(/[①②③④⑤]/)||[])[0];
    var want = WANT[label];
    if(!want) return;
    var bad = [], got = ins.slice(0,3).map(function(i){ return num(i.value); });
    ins.slice(0,3).forEach(function(inp,k){
      var wrong = got[k] === null || got[k] !== want[k];
      inp.classList.toggle('eqbad', wrong);
      if(wrong) bad.push(k);
    });
    var hint = box.querySelector('.eqhint');
    if(!hint){ hint = document.createElement('p'); hint.className='eqhint'; box.appendChild(hint); }
    if(!bad.length){
      hint.className = 'eqhint ok';
      hint.innerHTML = '맞습니다 — 다음 칸으로 가세요.';
      return;
    }
    hint.className = 'eqhint';
    var msg;
    if(label === '④' || label === '⑤') msg = WHY.ln;
    else if(bad.indexOf(2) >= 0 && got[2] !== null && Math.abs(got[2]*got[2] - want[2]) < 1e-9) msg = WHY.r2;
    else if(bad.indexOf(2) >= 0) msg = WHY.r2;
    else msg = WHY.c;
    var names = bad.map(function(k){ return ['첫째','둘째','셋째'][k]; }).join('·');
    hint.innerHTML = '<b>' + names + ' 칸</b>을 다시 보세요. ' + msg;
  }

  function wireChecks(root){
    root.querySelectorAll('.eqk, .lnk, .slk').forEach(function(btn){
      if(btn.dataset.wired) return;
      btn.dataset.wired = '1';
      btn.addEventListener('click', function(){
        var box = btn.closest('div');
        for(var i=0; i<4 && box && box.querySelectorAll('.eqi').length < 3; i++) box = box.parentElement;
        if(box) setTimeout(function(){ checkGroup(box); }, 0);
      });
    });
  }

  function sweep(){
    document.querySelectorAll('.lsn').forEach(recap);
    document.querySelectorAll('.wpb').forEach(hint);
    hideAnswers(document);
    wireChecks(document);
  }
  new MutationObserver(sweep).observe(document.body, {childList:true, subtree:true});
  if(document.readyState === 'loading') addEventListener('DOMContentLoaded', sweep);
  else sweep();
})();
</script>
<!-- PATCH end -->
"""

# 주의 — 공개본 안쪽 자바스크립트 문자열에도 "</body>" 가 들어 있다(내보내기 기능).
# 첫 번째 것을 찾아 넣으면 그 문자열 한가운데를 끊어 페이지가 통째로 죽는다.
# 그래서 무조건 파일 맨 끝에 붙인다 — 브라우저가 body 안으로 넣어 준다.
h = h.rstrip() + BLOCK

io.open(IDX, "w", encoding="utf-8").write(h)
print(f"덧댐 완료 — {IDX}  {round(len(h.encode('utf-8'))/1048576, 2)} MB")
