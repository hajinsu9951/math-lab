/* ================= LaTeX → MathML ==================
   단일 파일 원칙 때문에 MathJax·KaTeX 같은 CDN 라이브러리를 쓸 수 없다.
   MathML 은 브라우저가 기본으로 그리므로 외부 스크립트도 글꼴 파일도 필요 없다.
   지원 범위는 이 자료에서 실제로 쓰는 부분집합뿐이다. 아래 목록 밖의 명령을 쓰면
   글자 그대로 나오므로, 새 수식을 넣을 때는 반드시 화면에서 확인할 것.

   지원: \frac \sqrt(\sqrt[n]) ^ _ \sum(\munderover) \left \right \text
         \begin{pmatrix|bmatrix|vmatrix|cases} (& 로 열, \\ 로 행) \bmod
         \bar \overline \vec \hat \pmod
         그리스문자 · 연산기호 · sin cos tan log ln 등 함수명 */

const TEX_GREEK = {alpha:'α',beta:'β',gamma:'γ',delta:'δ',epsilon:'ε',varepsilon:'ε',
  theta:'θ',lambda:'λ',mu:'μ',pi:'π',rho:'ρ',sigma:'σ',tau:'τ',phi:'φ',omega:'ω',
  Delta:'Δ',Sigma:'Σ',Omega:'Ω',Phi:'Φ',ell:'ℓ',
  varphi:'φ',psi:'ψ',chi:'χ',eta:'η',nu:'ν',xi:'ξ',zeta:'ζ',kappa:'κ',
  iota:'ι',vartheta:'ϑ',varrho:'ϱ',
  Gamma:'Γ',Lambda:'Λ',Theta:'Θ',Pi:'Π',Psi:'Ψ',Xi:'Ξ'};
const TEX_OPS = {cdot:'·',times:'×',div:'÷',pm:'±',mp:'∓',le:'≤',leq:'≤',ge:'≥',geq:'≥',
  ne:'≠',neq:'≠',approx:'≈',equiv:'≡',to:'→',rightarrow:'→',Rightarrow:'⇒',
  in:'∈',notin:'∉',mid:'∣',cap:'∩',cup:'∪',ldots:'…',cdots:'⋯',infty:'∞',
  partial:'∂',propto:'∝',because:'∵',therefore:'∴',
  Leftrightarrow:'⇔',Longleftrightarrow:'⟺',leftrightarrow:'↔',mapsto:'↦',
  parallel:'∥',perp:'⊥',angle:'∠',triangle:'△',circ:'∘',
  varnothing:'∅',emptyset:'∅',subset:'⊂',subseteq:'⊆',supset:'⊃',supseteq:'⊇',
  sim:'∼',cong:'≅',forall:'∀',exists:'∃',setminus:'∖',land:'∧',lor:'∨',
  iff:'⇔',dots:'…',nRightarrow:'⇏',Longrightarrow:'⟹',longrightarrow:'⟶',
  Longleftarrow:'⟸',longleftarrow:'⟵',uparrow:'↑',downarrow:'↓',
  lceil:'⌈',rceil:'⌉',lfloor:'⌊',rfloor:'⌋',langle:'⟨',rangle:'⟩',
  oplus:'⊕',otimes:'⊗',ast:'∗',star:'⋆',prime:'′',nabla:'∇',
  simeq:'≃',ll:'≪',gg:'≫',subsetneq:'⊊',neg:'¬',top:'⊤',bot:'⊥',
  Leftarrow:'⇐',leftarrow:'←',nLeftarrow:'⇍',nleftrightarrow:'↮',
  vdash:'⊢',nvdash:'⊬',models:'⊨',vDash:'⊨',
  oint:'∮',iint:'∬',iiint:'∭',bigcup:'⋃',bigcap:'⋂',
  supsetneq:'⊋',nsubseteq:'⊈',sqrt2:'√',degree:'°',odot:'⊙',ominus:'⊖',
  succ:'≻',prec:'≺',lesssim:'≲',gtrsim:'≳',asymp:'≍',doteq:'≐'};
const TEX_FUNCS = ['sin','cos','tan','sec','csc','cot','log','ln','exp','max','min','arg','det','gcd','lcm',
  'sinh','cosh','tanh','arcsin','arccos','arctan','sup','inf','deg','dim','rank','tr'];
const TEX_BB = {N:'ℕ',Z:'ℤ',Q:'ℚ',R:'ℝ',C:'ℂ',P:'ℙ'};

function xe(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function texTokens(s){
  const T=[]; let i=0;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){T.push({t:'sp',v:' '});i++;continue;}   // \text 안의 띄어쓰기를 살린다
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
    if(t.t==='sp'){ p++; return ''; }
    if(t.t==='sc'){ p++; return ''; }              // 홀로 온 첨자 기호는 버린다
    /* cmd */
    const v = t.v; p++;
    if(v==='frac'||v==='tfrac'||v==='dfrac'){ const a=atom(), b=atom(); return '<mfrac>'+a+b+'</mfrac>'; }
    if(v==='{'||v==='}'||v==='%'||v==='&'||v==='#') return '<mo>'+xe(v)+'</mo>';
    if(v==='\\') return '<mspace linebreak="newline"/>';
    if(v==='lim') return '<mo movablelimits="false">lim</mo>';
    if(v==='int') return '<mo>&#x222B;</mo>';
    if(v==='not'){
      const q=T[p];
      if(q&&q.t==='cmd'){ p++;
        if(q.v==='Rightarrow') return '<mo>&#x21CF;</mo>';
        if(q.v==='Leftrightarrow') return '<mo>&#x21CE;</mo>';
        if(q.v==='in') return '<mo>&#x2209;</mo>';
        if(q.v==='equiv') return '<mo>&#x2262;</mo>';
        return '<mo>&#xAC;</mo><mo>'+(TEX_OPS[q.v]||xe(q.v))+'</mo>';
      }
      if(q&&q.t==='op'&&q.v==='='){ p++; return '<mo>&#x2260;</mo>'; }
      return '<mo>&#xAC;</mo>';
    }
    if(v==='mathbb'){
      if(T[p]&&T[p].t==='{'){ p++; let out='';
        while(p<T.length&&T[p].t!=='}'){ const q=T[p];
          out+=(q.t==='id'&&TEX_BB[q.v])?'<mi mathvariant="normal">'+TEX_BB[q.v]+'</mi>':'<mi>'+xe(q.v||'')+'</mi>'; p++; }
        if(T[p]) p++;
        return out;
      }
      return '';
    }
    if(v==='begin'){
      /* \begin{pmatrix} a & b \\ c & d \end{pmatrix} 처럼 쓴다.
         & 가 열을, \\ 가 행을 나눈다. cases 는 왼쪽 중괄호만 붙인다. */
      let env='';
      if(T[p]&&T[p].t==='{'){ p++;
        while(p<T.length&&T[p].t!=='}'){ env+=(T[p].v||''); p++; }
        if(T[p]) p++; }
      const rows=[]; let cur=[], cell=[];
      const endCell=()=>{ cur.push('<mtd>'+cell.join('')+'</mtd>'); cell=[]; };
      while(p<T.length){
        const q=T[p];
        if(q.t==='cmd'&&q.v==='end'){ p++;
          if(T[p]&&T[p].t==='{'){ let d=1; p++;
            while(p<T.length&&d){ if(T[p].t==='{')d++; if(T[p].t==='}')d--; p++; } }
          break; }
        if(q.t==='cmd'&&q.v==='\\'){ p++; endCell(); rows.push(cur); cur=[]; continue; }
        if(q.t==='sp'){ p++; continue; }
        if(q.t==='op'&&q.v==='&'){ p++; endCell(); continue; }
        if(q.t==='sc'){ const kind=q.v; p++; const sc2=atom();
          const base=cell.pop()||'<mrow></mrow>';
          cell.push((kind==='_'?'<msub>':'<msup>')+base+sc2+(kind==='_'?'</msub>':'</msup>'));
          continue; }
        cell.push(atom());
      }
      endCell(); rows.push(cur);
      const FENCE={pmatrix:['(',')'],bmatrix:['[',']'],Bmatrix:['{','}'],
                   vmatrix:['|','|'],Vmatrix:['‖','‖'],matrix:['',''],
                   cases:['{',''],aligned:['','','left'],array:['','']};
      const f=FENCE[env]||['',''];
      const align=f[2]||(env==='cases'||env==='aligned'?'left':'center');
      const table='<mtable columnalign="'+align+'">'
        + rows.map(r=>'<mtr>'+(r.length?r.join(''):'<mtd></mtd>')+'</mtr>').join('')
        + '</mtable>';
      /* 괄호는 글자로 찍지 않고 styles.css 의 테두리로 그린다 — 글꼴에 기대지 않는다 */
      const cls = FENCE[env] ? 'mtx mtx-'+env : 'mtx';
      return '<mrow class="'+cls+'">'+table+'</mrow>';
    }
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
    if(v==='binom'||v==='dbinom'||v==='tbinom'){ const a=atom(), b=atom();
      return '<mo>(</mo><mfrac linethickness="0">'+a+b+'</mfrac><mo>)</mo>'; }
    if(v==='bmod'){ return '<mspace width="0.22em"/><mi mathvariant="normal">mod</mi><mspace width="0.22em"/>'; }
    if(v==='pmod'){ return '<mo>(</mo><mi mathvariant="normal">mod</mi><mspace width="0.25em"/>'+atom()+'<mo>)</mo>'; }
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
      if(t.t==='sp'){ p++; continue; }
      if(t.t==='sc'){
        const kind=t.v; p++; const s=atom();
        const base = out.pop() || '<mrow></mrow>';
        const big = /&#x2211;|&#x220F;|>lim</.test(base);      // ∑ ∏ 는 위아래로 붙인다
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

/* 유도 한 단계 = 번호 + 수식(항상 보임) + 접어 둔 설명.
   설명을 접어 두는 것이 핵심이다. 학생이 “왜 이렇게 되지?”를 먼저 스스로 생각한 뒤
   눌러서 확인하게 한다. 바로 보이면 읽고 넘어가 버린다.
   LaTeX 원본은 화면에 내보이지 않는다. 수식은 자료에 문자열로 남아 있으므로
   교사가 옮겨 쓸 일이 있으면 src/40-demos.js 의 PRINS 에서 그대로 복사하면 된다. */
function texBlock(latex, say, n){
  return '<div class="tx">'
    + '<div class="txhead"><span class="txn">'+n+'단계</span>'
    + '<div class="txf">'+texToMathML(latex, true)+'</div></div>'
    + (say ? '<details class="txwhy"><summary>왜 이렇게 되나?</summary><p>'+say+'</p></details>' : '')
    + '</div>';
}
function texSteps(list){
  if(!list || !list.length) return '';
  return '<div class="txwrap">'
    + '<div class="txlead">수식을 <b>먼저 눈으로 따라가 본 뒤</b>, “왜 이렇게 되나?”를 눌러 확인하세요.</div>'
    + list.map((x,i)=>texBlock(x.t, x.s, i+1)).join('')
    + '</div>';
}
