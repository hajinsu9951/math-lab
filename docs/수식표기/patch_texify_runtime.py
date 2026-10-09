# -*- coding: utf-8 -*-
"""수업 모형 화면에서 글 속의 $…$ 를 MathML 로 바꾸는 texify() 를 심는다.

왜
  본문 글꼴에 위첨자 글리프가 없어 2⁵ · aᵐ⁺ⁿ 같은 식이 깨지거나 엉뚱한 글꼴로 대체된다.
  MathML 은 브라우저가 수식으로 그리므로 글꼴에 기대지 않는다.
  변환기는 이미 src/35-tex.js 의 texToMathML() 이 있다 — 외부 라이브러리 없이 쓴다.

어떻게
  수업 모형이 그려진 뒤 그 영역의 글자 마디만 훑어 $…$ 를 <math> 로 바꾼다.
  단계가 열릴 때마다 새 글이 들어오므로 MutationObserver 로 따라간다.
  <svg> 안에는 MathML 을 넣을 수 없으므로 건너뛴다.

사용: python docs/수식표기/patch_texify_runtime.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

FN = r"""/* 글 속의 $…$ 를 MathML 로 — 본문 글꼴에 위첨자가 없어 식이 깨지던 것을 막는다 (2026-10-08).
   변환은 src/35-tex.js 의 texToMathML(). <svg>·<math> 안은 건드리지 않는다.
   수식 하나가 잘못되어도 수업은 계속되어야 하므로 통째로 try 로 감싼다. */
function texify(root){
  if(!root || texify.busy) return;
  texify.busy = true;
  try{
    const SKIP = {MATH:1, SCRIPT:1, STYLE:1, TEXTAREA:1, INPUT:1, svg:1, text:1, tspan:1};
    const bad = n => { for(let p=n.parentNode; p && p!==root.parentNode; p=p.parentNode){
        if(SKIP[p.nodeName] || SKIP[(p.nodeName||'').toLowerCase()]) return true; } return false; };
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const hit = [];
    let n; while((n = w.nextNode())){
      if(n.nodeValue && /\$[^$\s][^$]*\$/.test(n.nodeValue) && !bad(n)) hit.push(n);
    }
    hit.forEach(node => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\$[^$\s][^$]*\$)/).forEach(p => {
        const m = /^\$([^$]+)\$$/.exec(p);
        if(m){
          const s = document.createElement('span');
          s.className = 'mx';
          s.innerHTML = texToMathML(m[1], false);
          frag.appendChild(s);
        } else if(p) frag.appendChild(document.createTextNode(p));
      });
      node.parentNode.replaceChild(frag, node);
    });
  }catch(e){}
  texify.busy = false;
}

"""

HOOK_A = "  root.appendChild(box);\n"
HOOK_B = """  root.appendChild(box);
  /* 글 속의 $…$ 를 수식으로 — 단계가 열릴 때마다 새 글이 들어오므로 지켜본다 */
  const texObs = new MutationObserver(()=>texify(box));
  texObs.observe(box, {subtree:true, childList:true});
"""

CSS = """
/* 글 속에 끼워 넣은 수식 — 글줄 높이를 흔들지 않게 (2026-10-08) */
.mx{display:inline-block;vertical-align:-0.12em}
.mx math{font-size:1.02em}
"""


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'function texify(' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    a = 'function lessonFlow(root, spec, P){'
    assert h.count(a) == 1
    h = h.replace(a, FN + a, 1)
    # root.appendChild(box) 는 파일에 여러 곳 있다 — lessonFlow 안의 것만 바꾼다
    i = h.index(a) + len(a)
    j = h.index(HOOK_A, i)
    h = h[:j] + HOOK_B + h[j + len(HOOK_A):]
    open(path, 'w', encoding='utf-8').write(h)

    c = 'src/styles.css'
    s = open(c, encoding='utf-8').read()
    if '.mx{display:inline-block' not in s:
        open(c, 'w', encoding='utf-8').write(s + CSS)
    sys.stdout.write('texify() 를 심었습니다 (lessonFlow 안에서 지켜봄)\n')


if __name__ == '__main__':
    main(sys.argv[1])
