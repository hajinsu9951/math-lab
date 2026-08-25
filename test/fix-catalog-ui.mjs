// 확장 카탈로그 — ① 항목을 상단 20종 카드 형태(썸네일·태그·열기)로 ② 결함 후보 색 순화
import fs from 'node:fs';

/* ① 렌더 구조 교체 */
{
  const P = 'src/57-catalog-ui.js';
  let s = fs.readFileSync(P, 'utf8');
  const a = s.indexOf('      <div class="catgrid">${items.map(c=>`');
  const b = s.indexOf('        </article>`).join(\'\')}</div>');
  if (a < 0 || b < 0) throw new Error('카탈로그 카드 마크업 앵커 실패');
  const NEW = `      <div class="catgrid">\${items.map(c=>\`
        <article class="citem \${c.k}\${c.lab!=null?' made':''}"\${c.lab!=null?\` data-lab="\${c.lab}" tabindex="0" role="button"\`:''}>
          <div class="cno"><span class="cnum">\${String(c._no).padStart(3,'0')}</span>\${c.lab!=null?\`<span class="cmade">제작 완료 · LAB \${String(c.lab+1).padStart(2,'0')}</span>\`:\`<span class="cplan">설계 재료</span>\`}</div>
          \${c.lab!=null && typeof THUMBS!=='undefined' && THUMBS[c.lab] ? THUMBS[c.lab] : ''}
          <h5>\${c.t}</h5>
          <div class="cg">\${c.g}</div>
          \${c.q ? \`<p class="cq">\${c.q}</p>\` : ''}
          \${c.b ? \`<div class="cb"><span class="cbl">ROUND 4 · 심을 결함</span><span class="cbt">\${c.b}</span></div>\`
                : \`<div class="cb none"><span class="cbl">ROUND 4 · 심을 결함</span><span class="cbt">아직 설계되지 않음 — 만들기 전에 채울 것</span></div>\`}
          \${c.a ? \`<div class="ca">\${c.a}</div>\` : ''}
          \${c.lab!=null ? \`<div class="cgo">▶ 직접 조작해 보기</div>\` : ''}
`;
  s = s.slice(0, a) + NEW + s.slice(b);
  fs.writeFileSync(P, s);
  console.log('카탈로그 카드 구조 교체 (썸네일·번호칩·결함 블록)');
}

/* ② 스타일 — 붉은 글씨/바탕 순화 + 카드형 레이아웃 */
{
  const P = 'src/styles.css';
  let c = fs.readFileSync(P, 'utf8');
  const old = c.match(/\.cb\{margin:5px 0 0;font-size:12\.2px;color:var\(--rose,#BE123C\);line-height:1\.6;\r?\n  background:var\(--rose-s,#FFF1F4\);border-radius:7px;padding:6px 9px\}\r?\n\.cb span\{[^}]*\}\r?\n\.cb\.none\{[^}]*\}/);
  if (!old) throw new Error('.cb 스타일 앵커 실패');
  const NEW = `.cb{margin:6px 0 0;font-size:12.4px;line-height:1.62;color:#8A3348;
  background:#FFF7F8;border:1px solid #F3D9DF;border-left:3px solid #E4899C;
  border-radius:8px;padding:7px 10px}
.cb .cbl{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.2px;
  color:#A63A52;background:#FBE7EB;border-radius:999px;padding:1.5px 8px;margin-bottom:4px}
.cb .cbt{display:block;color:#7A3B49}
.cb.none{background:#F7F8FA;border-color:#E5E8EE;border-left-color:#C9CFDA;color:var(--ink3)}
.cb.none .cbl{color:#6B7280;background:#EEF1F5}
.cb.none .cbt{color:var(--ink3)}`;
  c = c.replace(old[0], NEW);

  if (!c.includes('/* 카탈로그 카드 — 상단 20종 카드와 같은 결 */')) {
    c += `
/* 카탈로그 카드 — 상단 20종 카드와 같은 결 */
.citem{padding:14px 15px 13px;border-radius:14px;gap:5px}
.citem:hover{transform:translateY(-2px)}
.citem .thumb{display:block;width:100%;height:auto;background:var(--bg);
  border:1px solid var(--line);border-radius:10px;margin:2px 0 4px}
.citem.made:hover .thumb{background:#fff;border-color:#C7D9FF}
.citem h5{font-size:15.5px}
.cno{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.cnum{font-variant-numeric:tabular-nums;color:var(--ink3)}
.cplan{display:inline-block;font-size:10.5px;font-weight:800;color:#5B6472;
  background:#EEF1F5;border-radius:999px;padding:1.5px 8px}
.cgo{font-size:12.5px;font-weight:800;color:var(--blue);margin-top:6px}
.ca{color:#0F766E}
`;
  }
  fs.writeFileSync(P, c);
  console.log('결함 후보 색 순화 + 카드형 스타일 추가');
}
console.log('완료');
