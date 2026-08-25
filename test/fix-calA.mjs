// 미적분Ⅰ A 수리 — 127 극한 판정(값 비교 → 극한 비교), 130 이분법 정밀도(슬라이더 step 우회)
import fs from 'node:fs';

const EDITS = [
  /* 127 — 판정을 f(2∓h) 비교가 아니라 아주 작은 h 에서의 극한 비교로 */
  [`    const same=Math.abs(L-R)<1e-6;`,
   `    const e=1e-7;
    const LL=k==='park'?f.park(2-e):f[k](2-e), RR=k==='park'?f.park(2+e):f[k](2+e);
    const same=Math.abs(LL-RR)<1e-4;`],
  [`               : (fv===null ? \`<b style="color:#7C3AED">좌우가 같아 극한은 \${R.toFixed(2)} — 그런데 함숫값이 없는 구멍입니다.</b><br>\``,
   `               : (fv===null ? \`<b style="color:#7C3AED">좌우가 같아 극한은 \${LL.toFixed(2)} — 그런데 함숫값이 없는 구멍입니다.</b><br>\``],
  [`      return [{cont:'이어진',park:'계단',hole:'구멍'}[k],h.toFixed(4),L.toFixed(3),R.toFixed(3),
        k==='hole'?'없음':(k==='park'?f.park(2):f.cont(2)).toFixed(2), Math.abs(L-R)<1e-6?'있음':'없음']; } });`,
   `      const e=1e-7, LL=k==='park'?f.park(2-e):f[k](2-e), RR=k==='park'?f.park(2+e):f[k](2+e);
      return [{cont:'이어진',park:'계단',hole:'구멍'}[k],h.toFixed(4),L.toFixed(3),R.toFixed(3),
        k==='hole'?'없음':(k==='park'?f.park(2):f.cont(2)).toFixed(2), Math.abs(LL-RR)<1e-4?'있음':'없음']; } });`],

  /* 130 — 구간을 상태로 들고 간다 (range 의 step 0.1 이 이분법을 막던 문제) */
  [`  const S={ cuts:0 };
  function draw(){
    const a=+$('#ivA').value, b=+$('#ivB').value;
    $('#ivAv').textContent=a.toFixed(2); $('#ivBv').textContent=b.toFixed(2);`,
   `  const S={ a:0, b:1, cuts:0 };
  function draw(){
    const a=S.a, b=S.b;
    $('#ivAv').textContent=a.toFixed(2); $('#ivBv').textContent=b.toFixed(2);`],
  [`  $('#ivHalf').onclick=()=>{
    let a=+$('#ivA').value, b=+$('#ivB').value; const mid=(a+b)/2;
    if(f(a)*f(mid)<=0) b=mid; else a=mid;
    $('#ivA').value=a; $('#ivB').value=b; S.cuts++; draw(); };
  $('#ivReset').onclick=()=>{ $('#ivA').value=0; $('#ivB').value=1; S.cuts=0; draw(); };
  ['ivA','ivB'].forEach(i=>$('#'+i).oninput=()=>{ S.cuts=0; draw(); }); draw();`,
   `  $('#ivHalf').onclick=()=>{
    const mid=(S.a+S.b)/2;
    if(f(S.a)*f(mid)<=0) S.b=mid; else S.a=mid;
    S.cuts++; draw(); };
  $('#ivReset').onclick=()=>{ $('#ivA').value=0; $('#ivB').value=1; S.a=0; S.b=1; S.cuts=0; draw(); };
  ['ivA','ivB'].forEach(i=>$('#'+i).oninput=()=>{ S.a=+$('#ivA').value; S.b=+$('#ivB').value; S.cuts=0; draw(); }); draw();`],
  [`      hint:'힌트 — [1, 2] 에서 시작해 보세요. f(1) = −1, f(2) = 5 입니다.',
    read:()=>{ const a=+$('#ivA').value,b=+$('#ivB').value;`,
   `      hint:'힌트 — [1, 2] 에서 시작해 보세요. f(1) = −1, f(2) = 5 입니다.',
    read:()=>{ const a=S.a,b=S.b;`],
];

for (const f of ['src/40-demos.js', 'algD-demos.txt']) {
  let s = fs.readFileSync(f, 'utf8');
  let n = 0, miss = [];
  EDITS.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else miss.push(i + 1); });
  fs.writeFileSync(f, s);
  console.log(f, '교체', n, '건', miss.length ? '/ 실패 ' + miss.join(',') : '');
}
