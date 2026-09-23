# -*- coding: utf-8 -*-
"""수업 모형 실험실에 「학생 활동지 내려받기」를 붙인다 (LAB 01~04 먼저).

단일 파일 원칙 때문에 활동지 파일을 따로 두고 링크를 걸 수 없다.
그래서 화면에서 **그 자리에서 만들어** 내려받는다 — 이미 있는 dl() 헬퍼를 쓴다.
내용은 LESSON[n] · PRINS[n-1] 에서 뽑으므로 실험실을 고치면 활동지도 따라 바뀐다.

넣는 곳 — 「문제」 단계의 단추 줄. 교사가 열자마자 보이는 자리다.
대상 — WS_LABS 에 적은 번호. 지금은 수업 모형이 있는 22종 전부.

사용: python docs/활동지/patch_worksheet.py dist/index.html
"""
import sys

# 그림은 여기 두지 않는다 — 「생각 열기」(docs/생각열기그림/patch_openfigs.py)가 실험실에 넣은
# <figure> 를 활동지가 그대로 읽어 간다. 한 곳에만 둔다.

JS = r'''
/* ══ WS-START ══ 학생 활동지 — 화면에서 만들어 내려받는다 (2026-09-21) ══
   파일을 따로 두지 않는다. LESSON/PRINS 에서 뽑아 인쇄용 A4 HTML 한 장을 만든다.
   삽화는 실험실이 이미 갖고 있는 힉스필드 그림(base64 webp)을 그대로 옮긴다 —
   장당 20~35 KB 라 파일이 무겁지 않고, 흰 바탕 선화라 흑백 인쇄에도 뭉개지지 않는다. */
/* 수업 모형이 있는 실험실 전부 — LESSON 에 있으면 활동지가 나온다 */
const WS_LABS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,356];
/* 「생각 열기」에 붙은 설명 그림을 그대로 읽어 온다 — 그림은 실험실에만 두고, 여기서는 빌려 쓴다 */
function wsFigs(sit){
  const out = [];
  const re = /<figure>\s*<img[^>]*src="([^"]+)"[^>]*>\s*<figcaption>([\s\S]*?)<\/figcaption>\s*<\/figure>/g;
  let m; while((m = re.exec(String(sit||'')))) out.push({src:m[1], cap:m[2]});
  return out;
}
/* 그림 묶음을 뺀 나머지 안내 글 */
function wsSit(sit){ return String(sit||'').replace(/<div class="lsnfigs">[\s\S]*?<\/div>\s*$/,''); }
function wsNo(spec){ for(const k of Object.keys(LESSON)) if(LESSON[k]===spec) return +k; return 0; }
function wsText(s){
  return String(s==null?'':s)
    .replace(/<img[^>]*>/g,'')
    .replace(/<br\s*\/?>/gi,' ')
    .replace(/<[^>]+>/g,'')
    .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/\s+/g,' ').trim();
}
function wsEsc(s){ return String(s==null?'':s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function wsLines(n){ return '<div class="ln">'+Array.from({length:n},()=>'<i></i>').join('')+'</div>'; }
/* 실험실 화면의 삽화·도해를 그대로 가져온다 */
function wsImg(html, mm){
  const m = String(html||'').match(/<img[^>]*>/i);
  if(!m) return '';
  return '<div class="fig" style="--h:'+(mm||40)+'mm">'+m[0].replace(/class="[^"]*"/,'class="wsimg"')+'</div>';
}
function wsSvg(html, mm){
  const m = String(html||'').match(/<svg[\s\S]*?<\/svg>/i);
  if(!m) return '';
  return '<div class="fig svg" style="--h:'+(mm||44)+'mm">'+m[0]+'</div>';
}

function lessonSheet(spec, P, n){
  const L = (typeof LABS!=='undefined' && LABS[n-1]) ? LABS[n-1] : null;
  const title = wsText(spec.title);
  const iq = (spec.inquiry && spec.inquiry.q) || [];
  const cols = (spec.inquiry && spec.inquiry.cols) || [];
  const figs = wsFigs(spec.problem.sit);
  const sitText = wsText(wsSit(spec.problem.sit));
  const rowsN = 8;
  const table = cols.length ? `<table class="rec"><thead><tr>${
      cols.map(c=>`<th>${wsEsc(wsText(c))}</th>`).join('')}</tr></thead><tbody>${
      Array.from({length:rowsN},()=>`<tr>${cols.map(()=>'<td></td>').join('')}</tr>`).join('')
    }</tbody></table>` : wsLines(6);
  const miss = (spec.missions||[]).map((m,i)=>
    `<li><b>STEP ${i+1}</b> ${wsEsc(wsText(m.t))}${
      m.hand?`<div class="hand">✍ 손으로 — ${wsEsc(wsText(m.hand))}</div>`:''}</li>`).join('');
  const pre = (spec.predict && spec.predict.q) || [];
  const eq = P && P.eq ? wsEsc(wsText(P.eq)) : '';
  const grade = L && L.m ? wsEsc(L.m.join(' · ')) : '';

  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LAB ${String(n).padStart(2,'0')} 학생 활동지 — ${wsEsc(title)}</title>
<style>
 @page{size:A4;margin:14mm}
 *{box-sizing:border-box}
 body{margin:0;font-family:"Freesentation 4 Regular","Pretendard","맑은 고딕",system-ui,sans-serif;
      color:#111827;font-size:11.2pt;line-height:1.6}
 .wrap{max-width:186mm;margin:0 auto;padding:6mm 0}
 header{border-bottom:2.4px solid #16325C;padding-bottom:5px;margin-bottom:9px}
 .no{font-size:9.6pt;color:#2563EB;font-weight:800;letter-spacing:.4px}
 h1{font-size:16.5pt;margin:2px 0 4px;color:#16325C}
 .sub{font-size:9.6pt;color:#6B7280}
 .who{display:flex;gap:8px;margin-top:7px;font-size:9.6pt;color:#374151}
 .who span{flex:1;border:1px solid #D9E1EC;border-radius:5px;padding:4px 7px}
 section{margin:11px 0;break-inside:avoid}
 h2{font-size:11.6pt;margin:0 0 5px;color:#16325C;display:flex;align-items:center;gap:6px}
 h2 em{font-style:normal;background:#2563EB;color:#fff;border-radius:50%;width:19px;height:19px;
       display:inline-flex;align-items:center;justify-content:center;font-size:9.6pt}
 .q{background:#F4F7FB;border-left:3px solid #2563EB;padding:7px 9px;border-radius:0 6px 6px 0;margin-bottom:6px}
 ol,ul{margin:4px 0 0;padding-left:18px}
 li{margin-bottom:5px}
 .hand{color:#92400E;font-size:9.6pt;margin-top:2px}
 .ln i{display:block;border-bottom:1px solid #D9E1EC;height:8.2mm}
 table.rec{width:100%;border-collapse:collapse;margin-top:5px}
 table.rec th{background:#EFF4FF;border:1px solid #C7D8F7;font-size:9.6pt;padding:4px;color:#1D4ED8}
 table.rec td{border:1px solid #D9E1EC;height:8.6mm}
 .box{border:1px solid #D9E1EC;border-radius:6px;padding:7px 9px;margin-top:5px}
 .fig{margin:5px 0 6px;text-align:center}
 .fig .wsimg{max-width:100%;max-height:var(--h);height:auto;border:1px solid #D9E1EC;border-radius:6px}
 .fig.svg svg{width:100%;max-width:150mm;height:auto;max-height:var(--h)}
 .figcap{font-size:9.2pt;color:#374151;margin-top:3px;line-height:1.45}
 .fig2{display:flex;gap:9px;align-items:flex-start;margin:7px 0;break-inside:avoid}
 .fig2 .wsimg2{width:46mm;flex:none;border:1px solid #D9E1EC;border-radius:6px}
 .fig2 .figcap{margin-top:0;flex:1}
 .eq{font-family:"Cambria Math","Times New Roman",serif;font-size:12.5pt;color:#16325C;text-align:center;margin:4px 0}
 .tip{font-size:9.4pt;color:#6B7280;margin-top:4px}
 footer{margin-top:12px;border-top:1px solid #D9E1EC;padding-top:5px;font-size:8.8pt;color:#9CA3AF;
        display:flex;justify-content:space-between}
 @media print{ .wrap{padding:0} *{-webkit-print-color-adjust:exact;print-color-adjust:exact} }
</style></head><body><div class="wrap">
<header>
  <div class="no">LAB ${String(n).padStart(2,'0')} · 학생 활동지</div>
  <h1>${wsEsc(title)}</h1>
  <div class="sub">${grade}</div>
  <div class="who"><span>학년 반 번호</span><span>이름</span><span>날짜</span></div>
</header>

<section>
  <h2><em>1</em>오늘의 문제</h2>
  <div class="q">${wsEsc(wsText(spec.problem.q))}</div>
  ${wsImg(spec.problem.svg, 44)}
  ${wsSvg(spec.problem.svg, 46)}
  <div class="tip">${wsEsc(sitText)}</div>
</section>

${figs.length ? `<section>
  <h2><em>+</em>그림으로 먼저 보기</h2>
  ${figs.map(f=>`<div class="fig2"><img class="wsimg2" src="${f.src}" alt="${wsEsc(wsText(f.cap))}">
    <div class="figcap">${f.cap}</div></div>`).join('')}
</section>` : ''}

<section>
  <h2><em>2</em>나의 예상 — 정답이 아니라 지금 생각을 적습니다</h2>
  <ol>${pre.map(t=>`<li>${wsEsc(wsText(t))}${wsLines(2)}</li>`).join('')}</ol>
</section>

<section>
  <h2><em>3</em>실험 — 화면에서 할 일</h2>
  <ul>${miss}</ul>
</section>

<section>
  <h2><em>4</em>관찰 기록표</h2>
  ${table}
  ${spec.inquiry&&spec.inquiry.hint?`<div class="tip">${wsEsc(wsText(spec.inquiry.hint))}</div>`:''}
</section>

<section>
  <h2><em>5</em>규칙 찾기 · 설명하기</h2>
  <ol>${iq.map(t=>`<li>${wsEsc(wsText(t))}${wsLines(3)}</li>`).join('')}</ol>
</section>

<section>
  <h2><em>6</em>수학 원리 — 내 말로 정리하기</h2>
  ${P ? wsImg(P.what, 34) : ''}
  ${eq?`<div class="eq">${eq}</div>`:''}
  <div class="box">${wsLines(4)}</div>
</section>

<section>
  <h2><em>7</em>적용 문제</h2>
  ${wsImg(spec.apply.q, 34)}
  <div class="q">${wsEsc(wsText(spec.apply.q))}</div>
  <div class="box">풀이${wsLines(4)}<div style="margin-top:4px">답 ______________</div></div>
  ${spec.apply.hint?`<div class="tip">힌트 — ${wsEsc(wsText(spec.apply.hint))}</div>`:''}
</section>

<footer><span>일상 속 수학 실험실 · 2026 대전광역시교육청 AI·디지털 기반 교육혁신 역량강화 연수</span><span>대전대신고 하진수</span></footer>
</div></body></html>`;
}
/* ══ WS-END ══ */
'''

BTN_OLD = """     <div class="pgbar"><button class="b t" id="ls0go">예상하러 가기 →</button></div>`;
  phs[0].querySelector('#ls0go').onclick=()=>unlock(1);"""

BTN_NEW = """     <div class="pgbar"><button class="b t" id="ls0go">예상하러 가기 →</button>
       <button class="b g" id="ls0ws" hidden>🖨 학생 활동지 내려받기 (인쇄용 HTML)</button>
       <span class="pgn" id="ls0wsn" hidden>수업 시간에 나눠 줄 A4 한 장 — 문제·예상·기록표·적용까지</span></div>`;
  phs[0].querySelector('#ls0go').onclick=()=>unlock(1);
  /* 학생 활동지 — 파일을 따로 두지 않고 이 자리에서 만들어 내려받는다 */
  (function(){
    const no=wsNo(spec); if(!WS_LABS.includes(no)) return;
    const wb=phs[0].querySelector('#ls0ws'), wn=phs[0].querySelector('#ls0wsn');
    wb.hidden=false; wn.hidden=false;
    wb.onclick=()=>{
      dl(lessonSheet(spec, P, no),
         'LAB'+String(no).padStart(2,'0')+'_학생활동지_'+wsText(spec.title)+'.html', 'text/html');
      wn.textContent='내려받았습니다 — 브라우저로 열어 Ctrl+P 로 인쇄하세요.';
    };
  })();"""


def main(path):
    h = open(path, encoding='utf-8').read()

    # 1) 활동지 만드는 함수 — lessonFlow 앞에 둔다
    anchor = 'function lessonFlow(root, spec, P){'
    assert h.count(anchor) == 1, 'lessonFlow 를 못 찾음'
    js = JS
    S, E = '/* ══ WS-START ══', '/* ══ WS-END ══ */'
    if S in h:                      # 이미 있으면 통째로 갈아 끼운다 (몇 번을 돌려도 같도록)
        a = h.index(S)
        b = h.index(E) + len(E)
        h = h[:a] + js.strip() + h[b:]
    else:
        h = h.replace(anchor, js + '\n' + anchor, 1)

    # 2) 「문제」 단계 단추 줄에 활동지 단추
    if 'id="ls0ws"' not in h:
        assert h.count(BTN_OLD) == 1, '문제 단계 단추 줄을 못 찾음'
        h = h.replace(BTN_OLD, BTN_NEW, 1)

    open(path, 'w', encoding='utf-8').write(h)
    print('활동지 단추 붙임 (LAB 01~04) · size MB', round(len(h.encode('utf-8')) / 1048576, 2))


if __name__ == '__main__':
    main(sys.argv[1])
