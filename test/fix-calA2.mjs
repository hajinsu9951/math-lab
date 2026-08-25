// 130 기록표가 슬라이더가 아니라 실제 구간(S.a, S.b)을 읽도록
import fs from 'node:fs';
const A = `    read:()=>{ const a=+$('#ivA').value,b=+$('#ivB').value;
      return [a.toFixed(4),b.toFixed(4),f(a)<0?'−':'+',f(b)<0?'−':'+',Math.abs(b-a).toFixed(4),((a+b)/2).toFixed(4)]; } });`;
const B = `    read:()=>{ const a=S.a,b=S.b;
      return [a.toFixed(4),b.toFixed(4),f(a)<0?'−':'+',f(b)<0?'−':'+',Math.abs(b-a).toFixed(4),((a+b)/2).toFixed(4)]; } });`;
for (const f of ['src/40-demos.js', 'algD-demos.txt']) {
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes(A)) { console.log(f, '— 대상 없음(이미 수리됨?)'); continue; }
  fs.writeFileSync(f, s.replace(A, B));
  console.log(f, '교체 1건');
}
