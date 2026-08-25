// 행렬 괄호가 늘어나지 않는다. MathML 의 stretchy 는 전용 수학 글꼴에 기대는데
// CDN 을 못 쓰니 글꼴을 들여올 수 없다. 괄호를 글자가 아니라 테두리로 그린다.
import fs from 'node:fs';

/* 1. 변환기 — 괄호 글자 대신 테두리를 입힐 mrow 로 감싼다 */
{
  const P = 'src/35-tex.js';
  let s = fs.readFileSync(P, 'utf8');
  const a = `      const mn=(rows.length*1.35).toFixed(2)+'em';   // 행 수에 맞춰 괄호를 늘린다
      const fence=c=>'<mo stretchy="true" symmetric="true" minsize="'+mn+'" maxsize="'+mn+'">'+xe(c)+'</mo>';
      return '<mrow>' + (f[0]?fence(f[0]):'') + table + (f[1]?fence(f[1]):'') + '</mrow>';`;
  if (!s.includes(a)) throw new Error('변환기 앵커 실패');
  const b = `      /* 괄호는 글자로 찍지 않고 styles.css 의 테두리로 그린다 — 글꼴에 기대지 않는다 */
      const cls = FENCE[env] ? 'mtx mtx-'+env : 'mtx';
      return '<mrow class="'+cls+'">'+table+'</mrow>';`;
  s = s.replace(a, b);
  new Function(s);
  fs.writeFileSync(P, s, 'utf8');
  console.log('35-tex.js — 괄호를 테두리로');
}

/* 2. 스타일 */
{
  const P = 'src/styles.css';
  let s = fs.readFileSync(P, 'utf8');
  if (s.includes('.mtx-pmatrix')) { console.log('styles.css — 이미 있음'); }
  else {
    const a = '.txf math{font-size:17px}';
    if (!s.includes(a)) throw new Error('스타일 앵커 실패');
    const b = a + `
/* 행렬 — MathML 의 늘어나는 괄호는 전용 수학 글꼴이 있어야 제대로 그려진다.
   단일 파일 원칙 때문에 글꼴을 들여올 수 없으므로 테두리로 괄호를 그린다. */
.mtx{padding:.12em .18em}
.mtx mtable{padding:.05em .34em}
.mtx-pmatrix mtable{border-left:1.6px solid currentColor;border-right:1.6px solid currentColor;
  border-radius:.62em/50%}
.mtx-bmatrix mtable{border:1.6px solid currentColor;border-top-width:0;border-bottom-width:0;
  box-shadow:inset .22em 0 0 -.18em currentColor, inset -.22em 0 0 -.18em currentColor}
.mtx-vmatrix mtable{border-left:1.4px solid currentColor;border-right:1.4px solid currentColor}
.mtx-Bmatrix mtable{border-left:1.6px solid currentColor;border-right:1.6px solid currentColor;
  border-radius:.9em/50%}
.mtx-cases mtable{border-left:1.6px solid currentColor;border-radius:.9em/50%;padding-left:.5em}
.mtx mtd{padding:.08em .42em}`;
    fs.writeFileSync(P, s.replace(a, b), 'utf8');
    console.log('styles.css — 행렬 테두리 규칙 추가');
  }
}
