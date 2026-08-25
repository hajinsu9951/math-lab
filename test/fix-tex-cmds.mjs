// 변환기가 모르는 명령이 원리 카드에 글자 그대로 나오고 있었다.
// 실제로 쓰고 있는 명령을 모두 지원하도록 src/35-tex.js 를 넓힌다.
import fs from 'node:fs';
const P = 'src/35-tex.js';
let s = fs.readFileSync(P, 'utf8');

/* 1. 그리스 문자 */
{
  const a = "  Delta:'Δ',Sigma:'Σ',Omega:'Ω',Phi:'Φ',ell:'ℓ'};";
  const b = "  Delta:'Δ',Sigma:'Σ',Omega:'Ω',Phi:'Φ',ell:'ℓ',\n"
          + "  varphi:'φ',psi:'ψ',chi:'χ',eta:'η',nu:'ν',xi:'ξ',zeta:'ζ',kappa:'κ',\n"
          + "  iota:'ι',vartheta:'ϑ',varrho:'ϱ',\n"
          + "  Gamma:'Γ',Lambda:'Λ',Theta:'Θ',Pi:'Π',Psi:'Ψ',Xi:'Ξ'};";
  if (!s.includes(a)) throw new Error('그리스 문자 앵커 실패');
  s = s.replace(a, b);
}

/* 2. 연산·기호 */
{
  const a = "  sim:'∼',cong:'≅',forall:'∀',exists:'∃',setminus:'∖',land:'∧',lor:'∨'};";
  const b = "  sim:'∼',cong:'≅',forall:'∀',exists:'∃',setminus:'∖',land:'∧',lor:'∨',\n"
          + "  iff:'⇔',dots:'…',nRightarrow:'⇏',Longrightarrow:'⟹',longrightarrow:'⟶',\n"
          + "  Longleftarrow:'⟸',longleftarrow:'⟵',uparrow:'↑',downarrow:'↓',\n"
          + "  lceil:'⌈',rceil:'⌉',lfloor:'⌊',rfloor:'⌋',langle:'⟨',rangle:'⟩',\n"
          + "  oplus:'⊕',otimes:'⊗',ast:'∗',star:'⋆',prime:'′',nabla:'∇',\n"
          + "  simeq:'≃',ll:'≪',gg:'≫',subsetneq:'⊊',neg:'¬',top:'⊤',bot:'⊥'};";
  if (!s.includes(a)) throw new Error('연산 기호 앵커 실패');
  s = s.replace(a, b);
}

/* 3. 함수 이름 (곧게 세워 쓴다) */
{
  const a = "const TEX_FUNCS = ['sin','cos','tan','sec','csc','cot','log','ln','exp','max','min','arg','det','gcd','lcm'];";
  const b = "const TEX_FUNCS = ['sin','cos','tan','sec','csc','cot','log','ln','exp','max','min','arg','det','gcd','lcm',\n"
          + "  'sinh','cosh','tanh','arcsin','arccos','arctan','sup','inf','deg','dim','rank','tr'];";
  if (!s.includes(a)) throw new Error('함수 목록 앵커 실패');
  s = s.replace(a, b);
}

/* 4. \bmod — 앞뒤 사이를 띄운 곧은 글자 */
{
  const a = "    if(v==='pmod'){";
  const b = "    if(v==='bmod'){ return '<mspace width=\"0.22em\"/><mi mathvariant=\"normal\">mod</mi><mspace width=\"0.22em\"/>'; }\n"
          + "    if(v==='pmod'){";
  if (!s.includes(a)) throw new Error('pmod 앵커 실패');
  s = s.replace(a, b);
}

/* 5. 행렬 환경 — & 로 열을 나누고 환경 이름에 맞는 괄호를 씌운다.
      전에는 cases 만 가정해 pmatrix 가 중괄호와 & 기호로 그려졌다. */
{
  const i = s.indexOf("    if(v==='begin'){");
  const j = s.indexOf("    if(v==='sqrt'){");
  if (i < 0 || j < 0 || j < i) throw new Error('begin 블록 앵커 실패');
  const NEW = `    if(v==='begin'){
      /* \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} 처럼 쓴다.
         & 가 열을, \\\\ 가 행을 나눈다. cases 는 왼쪽 중괄호만 붙인다. */
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
        if(q.t==='cmd'&&q.v==='\\\\'){ p++; endCell(); rows.push(cur); cur=[]; continue; }
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
      return '<mrow>'
        + (f[0]?'<mo stretchy="true">'+xe(f[0])+'</mo>':'')
        + table
        + (f[1]?'<mo stretchy="true">'+xe(f[1])+'</mo>':'')
        + '</mrow>';
    }
`;
  s = s.slice(0, i) + NEW + s.slice(j);
}

/* 6. 문서 머리말의 지원 목록도 갱신 */
s = s.replace("   지원: \\frac \\sqrt(\\sqrt[n]) ^ _ \\sum(\\munderover) \\left \\right \\text",
              "   지원: \\frac \\sqrt(\\sqrt[n]) ^ _ \\sum(\\munderover) \\left \\right \\text\n         \\begin{pmatrix|bmatrix|vmatrix|cases} (& 로 열, \\\\ 로 행) \\bmod");

new Function(s.replace(/^const /gm, 'var '));   // 구문 검사
fs.writeFileSync(P, s, 'utf8');
console.log('35-tex.js 확장 완료');
