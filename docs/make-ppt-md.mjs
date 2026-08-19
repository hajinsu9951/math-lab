// 강의 PPT(pptx)를 읽어 마크다운 대본으로 옮긴다.
// 슬라이드 번호·제목·본문·표·발표자 노트를 그대로 뽑는다. 손으로 적는 내용은 없다.
// 사용: node docs/make-ppt-md.mjs        (docs/*.pptx 를 읽는다)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PPTX = join(HERE, '2026_대전_AI연수_수학_3시간_강의.pptx');
const OUT  = join(HERE, '2026_대전_AI연수_수학_3시간_강의.md');

if (!existsSync(PPTX)) { console.error('pptx 를 찾지 못했습니다: ' + PPTX); process.exit(1); }

/* ---------- zip 읽기 (외부 라이브러리 없이) ---------- */
const buf = readFileSync(PPTX);
const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const count = buf.readUInt16LE(eocd + 10);
const files = {};
{
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i++) {
    const nl = buf.readUInt16LE(p + 28), el = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32);
    files[buf.toString('utf8', p + 46, p + 46 + nl)] =
      { lho: buf.readUInt32LE(p + 42), cm: buf.readUInt16LE(p + 10), cs: buf.readUInt32LE(p + 20) };
    p += 46 + nl + el + cl;
  }
}
function read(name) {
  const f = files[name];
  if (!f) return null;
  const nl = buf.readUInt16LE(f.lho + 26), el = buf.readUInt16LE(f.lho + 28);
  const d = buf.subarray(f.lho + 30 + nl + el, f.lho + 30 + nl + el + f.cs);
  return (f.cm === 8 ? inflateRawSync(d) : d).toString('utf8');
}

const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

/* 도형 하나의 글을 문단 단위로 모은다 */
function shapes(xml) {
  const out = [];
  // <p:sp> … </p:sp> 단위로 자른다
  const sp = xml.split('<p:sp>').slice(1);
  sp.forEach(chunk => {
    const body = chunk.split('</p:sp>')[0];
    const paras = body.split('<a:p>').slice(1).map(pr => {
      const t = [...pr.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(m => unesc(m[1])).join('');
      return t.trim();
    }).filter(Boolean);
    if (paras.length) out.push(paras);
  });
  return out;
}
/* 표는 <a:tbl> 안에 행/셀로 들어 있다 */
function tables(xml) {
  return xml.split('<a:tbl>').slice(1).map(tb => {
    const body = tb.split('</a:tbl>')[0];
    return body.split('<a:tr ').slice(1).map(tr => {
      const row = tr.split('</a:tr>')[0];
      return row.split('<a:tc>').slice(1).map(tc => {
        const cell = tc.split('</a:tc>')[0];
        return [...cell.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(m => unesc(m[1])).join('').trim();
      });
    });
  });
}

const slides = Object.keys(files)
  .filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k))
  .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);

const L = [];
const p = (...x) => L.push(...x);

p('# 2026 대전 AI연수 (중등 수학) — 3시간 강의 대본',
  '',
  '2026 대전광역시교육청 「인공지능 활용 선도교사 연수」 주제4 · 중등 수학',
  '**AI·디지털 기반 교수학습 설계 및 자료 제작(수학)**',
  '강사: 대전대신고 하진수',
  '',
  `> \`docs/make-ppt-md.mjs\` 가 \`2026_대전_AI연수_수학_3시간_강의.pptx\` 에서 그대로 뽑은 것입니다.`,
  '> 슬라이드를 고친 뒤 다시 만들면 이 문서도 따라 바뀝니다.',
  '',
  '```bash',
  'npm run ppt && node docs/make-ppt-md.mjs',
  '```',
  '',
  `전체 **${slides.length}장**.`,
  '',
  '---',
  '');

let section = '';
slides.forEach((s, i) => {
  const xml = read(s);
  const sh = shapes(xml);
  const tbl = tables(xml);

  // 첫 도형의 첫 줄이 대체로 번호/구간, 그다음이 제목
  const flat = sh.flat();
  const head = flat.slice(0, 4);

  /* 교시 표지만 큰 제목으로 올린다.
     표지는 "1" + "15:00 – 16:00 · 체험 · 해체" 처럼 시각 사이에 공백이 있고,
     본문 슬라이드는 "15:00–15:05" 처럼 붙어 있다 — 이것으로 가른다. */
  const isDivider = /^[123]$/.test(flat[0] || '')
    && /^\d{2}:\d{2}\s+[–—-]\s+\d{2}:\d{2}/.test(flat[1] || '');
  if (isDivider) {
    section = flat.slice(0, 4).join(' · ');
    p(`## ${section}`, '');
  }

  p(`### ${String(i + 1).padStart(3, '0')}. ${head.filter(Boolean).slice(0, 3).join(' ｜ ')}`, '');

  sh.forEach(paras => {
    if (paras.length === 1) p('- ' + paras[0]);
    else { p('- ' + paras[0]); paras.slice(1).forEach(t => p('  - ' + t)); }
  });
  p('');

  tbl.forEach(rows => {
    if (!rows.length) return;
    const w = Math.max(...rows.map(r => r.length));
    p('| ' + rows[0].concat(Array(w - rows[0].length).fill('')).map(c => c || ' ').join(' | ') + ' |',
      '|' + Array(w).fill('---').join('|') + '|');
    rows.slice(1).forEach(r =>
      p('| ' + r.concat(Array(w - r.length).fill('')).map(c => c.replace(/\|/g, '\\|') || ' ').join(' | ') + ' |'));
    p('');
  });

  // 발표자 노트
  const rel = read(`ppt/slides/_rels/slide${i + 1}.xml.rels`) || '';
  const m = rel.match(/Target="\.\.\/(notesSlides\/notesSlide\d+\.xml)"/);
  if (m) {
    const nx = read('ppt/' + m[1]);
    if (nx) {
      // 노트 슬라이드에는 슬라이드 번호 자리표시가 함께 들어 있어 꼬리에 숫자가 붙는다
      const notes = [...nx.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(x => unesc(x[1])).join('')
        .replace(new RegExp(String(i + 1) + '\\s*$'), '').trim();
      if (notes && !/^\d+$/.test(notes)) {
        p('> **발표자 노트** — ' + notes.replace(/\s+/g, ' '), '');
      }
    }
  }
  p('---', '');
});

const text = L.join('\n');
writeFileSync(OUT, text, 'utf8');
console.log(`docs/2026_대전_AI연수_수학_3시간_강의.md  ${text.length.toLocaleString()} bytes  (${slides.length}장)`);
