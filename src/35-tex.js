/* ================= LaTeX → MathML ==================
   단일 파일 원칙 때문에 MathJax·KaTeX 같은 CDN 라이브러리를 쓸 수 없다.
   MathML 은 브라우저가 기본으로 그리므로 외부 스크립트도 글꼴 파일도 필요 없다.
   지원 범위는 이 자료에서 실제로 쓰는 부분집합뿐이다. 아래 목록 밖의 명령을 쓰면
   글자 그대로 나오므로, 새 수식을 넣을 때는 반드시 화면에서 확인할 것.

   지원: \frac \sqrt(\sqrt[n]) ^ _ \sum(\munderover) \left \right \text
         \bar \overline \vec \hat \pmod
         그리스문자 · 연산기호 · sin cos tan log ln 등 함수명 */

const TEX_GREEK = {alpha:'α',beta:'β',gamma:'γ',delta:'δ',epsilon:'ε',varepsilon:'ε',
  theta:'θ',lambda:'λ',mu:'μ',pi:'π',rho:'ρ',sigma:'σ',tau:'τ',phi:'φ',omega:'ω',
  Delta:'Δ',Sigma:'Σ',Omega:'Ω',Phi:'Φ'};
const TEX_OPS = {cdot:'·',times:'×',div:'÷',pm:'±',mp:'∓',le:'≤',leq:'≤',ge:'≥',geq:'≥',
  ne:'≠',neq:'≠',approx:'≈',equiv:'≡',to:'→',rightarrow:'→',Rightarrow:'⇒',
  in:'∈',notin:'∉',mid:'∣',cap:'∩',cup:'∪',ldots:'…',cdots:'⋯',infty:'∞',
  partial:'∂',propto:'∝',because:'∵',therefore:'∴'};
const TEX_FUNCS = ['sin','cos','tan','sec','csc','cot','log','ln','exp','max','min','arg','det'];

function xe(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function texTokens(s){
  const T=[]; let i=0;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){i++;continue;}
    if(c==='\\'){ const m=/^\\([a-zA-Z]+|.)/.exec(s.slice(i)); T.push({t:'cmd',v:m[1]}); i+=m[0].length; continue; }
    if(c==='{'){T.push({t:'{'});i++;continue;}
    if(c==='}'){T.push({t:'}'});i++;continue;}
    if(c==='^'||c==='_'){T.push({t:'sc',v:c});i++;continue;}
    if(/[0-9]/.test(c)){const m=/^[0-9]+(?:\.[0-9]+)?/.exec(s.slice(i));T.push({t:'num',v:m[0]});i+=m[0].length;continue;}
    if(/[a-zA-Z]/.test(c)){T.push({t:'id',v:c});i++;continue;}
    T.push({t:'op',v:c}); i++;
  }
  return T;
}

function texToMathML(src, block){
  const T = texTokens(src);
  let p = 0;

  function atom(){
    const t = T[p];
    if(!t) return '';
    if(t.t==='{'){
      p++; const inner = seq('}'); if(T[p] && T[p].t==='}') p++;
      return '<mrow>'+inner.join('')+'</mrow>';
    }
    if(t.t==='num'){ p++; return '<mn>'+t.v+'</mn>'; }
    if(t.t==='id'){ p++; return '<mi>'+t.v+'</mi>'; }
    if(t.t==='op'){ p++; return '<mo>'+xe(t.v)+'</mo>'; }
    if(t.t==='}'){ p++; return ''; }
    if(t.t==='sc'){ p++; return ''; }              // 홀로 온 첨자 기호는 버린다
    /* cmd */
    const v = t.v; p++;
    if(v==='frac'){ const a=atom(), b=atom(); return '<mfrac>'+a+b+'</mfrac>'; }
    if(v==='sqrt'){
      if(T[p] && T[p].t==='op' && T[p].v==='['){
        p++; const idx=[];
        while(p<T.length && !(T[p].t==='op' && T[p].v===']')) idx.push(atom());
        if(T[p]) p++;
        return '<mroot>'+atom()+'<mrow>'+idx.join('')+'</mrow></mroot>';
      }
      return '<msqrt>'+atom()+'</msqrt>';
    }
    if(v==='text'||v==='mathrm'||v==='operatorname'){
      if(T[p] && T[p].t==='{'){
        p++; let s=''; let d=1;
        while(p<T.length){
          const q=T[p];
          if(q.t==='{'){ d++; s+='{'; }
          else if(q.t==='}'){ d--; if(!d){ p++; break; } s+='}'; }
          else if(q.t==='cmd'){ s+=(TEX_GREEK[q.v]||TEX_OPS[q.v]||q.v); }
          else s += q.v;
          p++;
        }
        return '<mtext>'+xe(s)+'</mtext>';
      }
      return '';
    }
    if(v==='bar'||v==='overline') return '<mover accent="true">'+atom()+'<mo>&#x203E;</mo></mover>';
    if(v==='vec')  return '<mover accent="true">'+atom()+'<mo>&#x2192;</mo></mover>';
    if(v==='hat')  return '<mover accent="true">'+atom()+'<mo>&#x5E;</mo></mover>';
    if(v==='left'||v==='right'){
      const d=T[p]; p++;
      let ch = d ? (d.t==='cmd' ? (TEX_OPS[d.v]||d.v) : d.v) : '';
      if(ch==='.') return '';
      return '<mo stretchy="true">'+xe(ch)+'</mo>';
    }
    if(v==='pmod'){ return '<mo>(</mo><mi>mod</mi><mspace width="0.25em"/>'+atom()+'<mo>)</mo>'; }
    if(v==='sum')  return '<mo movablelimits="false">&#x2211;</mo>';
    if(v==='prod') return '<mo movablelimits="false">&#x220F;</mo>';
    if(v===','||v===':'||v===';') return '<mspace width="0.25em"/>';
    if(v==='quad')  return '<mspace width="1em"/>';
    if(v==='qquad') return '<mspace width="2em"/>';
    if(v==='!')     return '<mspace width="-0.15em"/>';
    if(v===' ')     return '<mspace width="0.3em"/>';
    if(TEX_GREEK[v]) return '<mi>'+TEX_GREEK[v]+'</mi>';
    if(TEX_OPS[v])   return '<mo>'+TEX_OPS[v]+'</mo>';
    if(TEX_FUNCS.indexOf(v)>=0) return '<mi mathvariant="normal">'+v+'</mi>';
    return '<mi>'+xe(v)+'</mi>';
  }

  function seq(stop){
    const out=[];
    while(p<T.length){
      const t=T[p];
      if(stop==='}' && t.t==='}') break;
      if(t.t==='sc'){
        const kind=t.v; p++; const s=atom();
        const base = out.pop() || '<mrow></mrow>';
        const big = /&#x2211;|&#x220F;/.test(base);      // ∑ ∏ 는 위아래로 붙인다
        let second=null, kind2=null;
        if(T[p] && T[p].t==='sc' && T[p].v!==kind){ kind2=T[p].v; p++; second=atom(); }
        if(second!==null){
          const sub = kind==='_' ? s : second, sup = kind==='_' ? second : s;
          out.push((big?'<munderover>':'<msubsup>')+base+sub+sup+(big?'</munderover>':'</msubsup>'));
        } else if(big){
          out.push((kind==='_'?'<munder>':'<mover>')+base+s+(kind==='_'?'</munder>':'</mover>'));
        } else {
          out.push((kind==='_'?'<msub>':'<msup>')+base+s+(kind==='_'?'</msub>':'</msup>'));
        }
        continue;
      }
      out.push(atom());
    }
    return out;
  }

  const body = seq(null).join('');
  return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="'+(block?'block':'inline')+'">'
       + '<mrow>'+body+'</mrow></math>';
}

/* 유도 한 단계 = 번호 + 수식(항상 보임) + 접어 둔 설명 + 접어 둔 LaTeX 원본.
   설명을 접어 두는 것이 핵심이다. 학생이 “왜 이렇게 되지?”를 먼저 스스로 생각한 뒤
   눌러서 확인하게 한다. 바로 보이면 읽고 넘어가 버린다.
   LaTeX 원본은 교사가 HWP 수식 편집기나 다른 자료로 그대로 옮기기 위한 것이다. */
function texBlock(latex, say, n){
  return '<div class="tx">'
    + '<div class="txhead"><span class="txn">'+n+'단계</span>'
    + '<div class="txf">'+texToMathML(latex, true)+'</div></div>'
    + (say ? '<details class="txwhy"><summary>왜 이렇게 되나?</summary><p>'+say+'</p></details>' : '')
    + '<details class="txsrc"><summary>LaTeX 원본</summary><code>'+xe(latex)+'</code></details>'
    + '</div>';
}
function texSteps(list){
  if(!list || !list.length) return '';
  return '<div class="txwrap">'
    + '<div class="txlead">수식을 <b>먼저 눈으로 따라가 본 뒤</b>, “왜 이렇게 되나?”를 눌러 확인하세요.</div>'
    + list.map((x,i)=>texBlock(x.t, x.s, i+1)).join('')
    + '</div>';
}
