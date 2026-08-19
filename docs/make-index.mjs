// 연수 자료 문서를 만든다. 손으로 적는 내용은 없다 — 두 곳에서 읽어 온다.
//   ① dist/index.html   실험실·카탈로그·7라운드 명세 (배열이 바뀌면 문서도 따라 바뀐다)
//   ② 상위 폴더의 원본 문서  연수설계안(docx)·프로그램 계획서(docx) 의 본문
// 사용: node docs/make-index.mjs        (사전에 node build.mjs 실행)
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, '..');                  // 연구회 폴더 — 원본 문서가 있는 곳
const URL  = 'file://' + join(ROOT, 'dist', 'index.html');
const OUT  = join(ROOT, 'docs', '실험실_목록.md');

/* ---------- docx 본문 읽기 (zip + XML, 외부 라이브러리 없이) ---------- */
function docxText(path) {
  if (!existsSync(path)) return null;
  const buf = readFileSync(path);
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) return null;
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16), doc = null;
  for (let i = 0; i < n; i++) {
    const nl = buf.readUInt16LE(p + 28), el = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32);
    const name = buf.toString('utf8', p + 46, p + 46 + nl);
    if (name === 'word/document.xml') doc = { lho: buf.readUInt32LE(p + 42), cm: buf.readUInt16LE(p + 10), cs: buf.readUInt32LE(p + 20) };
    p += 46 + nl + el + cl;
  }
  if (!doc) return null;
  const hl = buf.readUInt16LE(doc.lho + 26), he = buf.readUInt16LE(doc.lho + 28);
  const raw = buf.subarray(doc.lho + 30 + hl + he, doc.lho + 30 + hl + he + doc.cs);
  const xml = (doc.cm === 8 ? inflateRawSync(raw) : raw).toString('utf8');
  return xml
    .replace(/<w:p[ >]/g, '\n<w:p ')
    .replace(/<w:tab\/>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .split('\n').map(s => s.trim()).filter(Boolean);
}
// 시작 표시부터 끝 표시 직전까지 (표시는 '포함할지' 여부를 인자로)
function slice(lines, from, to, keepFrom = false) {
  if (!lines) return [];
  const i = lines.findIndex(l => l.startsWith(from));
  if (i < 0) return [];
  const rest = lines.slice(keepFrom ? i : i + 1);
  const j = to ? rest.findIndex(l => l.startsWith(to)) : -1;
  return j < 0 ? rest : rest.slice(0, j);
}

const PLAN = docxText(join(ROOT, 'docs', '중등_수학_AI디지털 기반 교수학습 설계 및 자료 제작_프로그램계획(약안)_하진수.docx'));
const DESIGN = docxText(join(BASE, '중등수학_AI디지털_연수설계안_3차시_실생활중심_하진수1.docx'));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(URL);

const D = await page.evaluate(() => {
  const strip = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  /* 탭①(LABS·THUMBS·PRINS)과 탭②(VLAB)는 서로 독립된 목록이다.
     인덱스가 같은 것을 같은 자료로 짝지으면 안 된다 — 순서가 어긋나 있다.
     각각 따로 뽑고, 연결이 확실한 것만 제목이 정확히 같은지로 판정한다. */
  const vk = Object.keys(VLAB);
  const byTitle = {};
  vk.forEach(k => { byTitle[VLAB[k].t] = k; });
  return {
    labs: LABS.map((L, i) => ({
      no: i + 1,
      core: !!L.core,
      t: L.t,
      q: L.q,
      m: L.m,
      a: L.a,
      note: strip(L.note),
      eq: PRINS[i] ? PRINS[i].eq : '',
      what: PRINS[i] ? strip(PRINS[i].what) : '',
      next: PRINS[i] ? PRINS[i].next.map(n => ({ lv: n.lv, t: n.t })) : [],
      iq: String(L.build).indexOf('inquiry(root') >= 0   // 탐구 보고서를 단 실험실인가
    })),
    vlab: vk.map(k => ({
      key: k,
      t: VLAB[k].t,
      q: VLAB[k].q,
      eq: VLAB[k].eq,
      grade: VLAB[k].grade,
      bug: strip(VLAB[k].bug),
      fixask: strip(VLAB[k].fixask),
      obj: VLAB[k].obj
    })),
    groups: CAT_GROUPS.map(g => ({
      k: g.k, n: g.n,
      items: CATALOG.filter(c => c.k === g.k).map(c => ({ t: c.t, g: c.g, q: c.q, b: c.b }))
    })),
    nLab: LABS.length,
    nCat: CATALOG.length,
    nDone: CATALOG.filter(c => c.b && c.b.trim()).length
  };
});
await browser.close();

/* 연속된 번호는 25~44 처럼 묶어 적는다 */
function ranges(ns){
  const out=[]; let s=null, p=null;
  ns.forEach(n=>{ if(s===null){s=p=n;return;} if(n===p+1){p=n;return;} out.push(s===p?String(s):s+'~'+p); s=p=n; });
  if(s!==null) out.push(s===p?String(s):s+'~'+p);
  return out.join(', ');
}

const esc = s => String(s || '').replace(/\|/g, '\\|');
const L = [];
const p = (...x) => L.push(...x);

p('# 일상 속 수학 실험실 — 자료 목록',
  '',
  '2026 대전광역시교육청 「인공지능 활용 선도교사 연수」 중등 수학',
  '**AI·디지털 기반 교수학습 설계 및 자료 제작(수학)** 3차시용 실습 웹자료.',
  '강사: 대전대신고 하진수.',
  '',
  '> 이 문서는 `docs/make-index.mjs` 가 두 곳에서 읽어 만듭니다.',
  '> **① `dist/index.html`** 의 실제 배열 — 실험실·카탈로그·7라운드 명세',
  '> **② 연구회 폴더의 원본 문서** — 연수설계안(docx)·프로그램 계획서(docx)',
  '> 숫자나 문구를 손으로 고치지 마십시오 — 원본을 고치고 다시 생성하면 됩니다.',
  '',
  '```bash',
  'node build.mjs && node docs/make-index.mjs',
  '```',
  '',
  '---',
  '');

/* ---------- 원본 문서에서 읽어 온 부분 ---------- */
const bullet = arr => arr.map(l => (/^[◦•·\-]/.test(l) ? '- ' + l.replace(/^[◦•·\-]\s*/, '') : l));

const goal = slice(PLAN, '□ 교육 목표', '□ 교육 효과');
const effect = slice(PLAN, '□ 교육 효과', '□ 교육 방법');
const how = slice(PLAN, '□ 교육 방법', '□ 주요 내용');
const outline = slice(PLAN, '□ 주요 내용', '[참고]');
const scenario = slice(PLAN, '● 시간 운영표(180분)', '● 운영 안전장치');
const safety = slice(PLAN, '● 운영 안전장치', null);
const ladder = slice(PLAN, '● 설계 원칙', '● 시간 운영표(180분)', true);

if (goal.length) {
  p('## 연수 개요',
    '',
    '> 아래는 제출한 **프로그램 계획서(약안)** 에서 그대로 읽어 온 것입니다.',
    '',
    '### 교육 목표', '', ...bullet(goal), '',
    '### 기대 효과', '', ...bullet(effect), '',
    '### 운영', '', ...bullet(how), '',
    '---', '');
}
if (outline.length) {
  p('## 3시간 구성', '', '```', ...outline, '```', '', '---', '');
}
if (ladder.length || scenario.length) {
  p('## 운영 시나리오 (강사용)', '',
    ...(ladder.length ? ['### 설계 원칙 — 3단 사다리', '', ...bullet(ladder), ''] : []),
    ...(scenario.length ? ['### 180분 시간 운영표', '', '| 시각 | 내용 |', '|---|---|',
      ...scenario.map(l => {
        const m = l.match(/^(\d{2}:\d{2}[~-]\d{2}:\d{2})\s*(.*)$/);
        return m ? `| ${m[1]} | ${esc(m[2])} |` : `| | ${esc(l)} |`;
      }), ''] : []),
    ...(safety.length ? ['### 운영 안전장치', '', ...bullet(safety), ''] : []),
    '---', '');
}

/* 차시별 설계 — 연수설계안에서 역량·목표·루브릭을 뽑는다 */
if (DESIGN) {
  p('## 차시별 설계안', '',
    '> **연수설계안(docx)** 에서 읽어 온 것입니다. 역량 코드는 「2026년 교원 AI·디지털 교육역량체계」를 따릅니다.',
    '');
  ['1차시', '2차시', '3차시'].forEach((cha, i) => {
    const next = ['2차시', '3차시', '〈제안서 평가 기준 대응〉'][i];
    const blk = slice(DESIGN, cha, next, true);
    if (!blk.length) return;
    const pick = (from, to) => slice(blk, from, to).join(' ');
    const sub = blk.find(l => l.startsWith('(소주제)')) || '';
    p(`### ${cha} · ${esc(sub.replace('(소주제)', '').trim())}`, '',
      '| | |', '|---|---|',
      `| 역량 | ${esc(pick('역량', '단계'))} |`,
      `| 교수학습 목표 | ${esc(pick('교수학습 목표', '교수학습 방법'))} |`,
      '');
    const ctx = slice(blk, '실생활 맥락', '차시');
    if (ctx.length) p('**맥락과 원리**', '', ...ctx.map(l => '- ' + l.replace(/^◾\s*/, '')), '');
    const method = slice(blk, '교수학습 방법', '교수학습 전략');
    if (method.length) p('**교수학습 방법**', '', ...method.map(l => '- ' + l), '');
    const act = slice(blk, '교수학습 활동', '평가 계획');
    if (act.length) p('**교수학습 활동**', '', ...act.map(l => '- ' + l), '');
    const rub = slice(blk, '평가 기준 (상 / 중 / 하)', '준비물');
    if (rub.length) {
      p('**평가 루브릭**', '', '| 평가 요소 | 상 / 중 / 하 |', '|---|---|');
      for (let k = 0; k + 1 < rub.length; k += 2) p(`| ${esc(rub[k])} | ${esc(rub[k + 1])} |`);
      p('');
    }
    const prep = slice(blk, '준비물', '특징 및 차별성');
    if (prep.length) p('**준비물** — ' + prep.join(' · '), '');
    p('---', '');
  });
}

p('',
  '## 한눈에',
  '',
  '| 구분 | 수 |',
  '|---|---|',
  `| 작동하는 실험실 | **${D.nLab}종** |`,
  `| 확장 카탈로그 | **${D.nCat}종** (결함 후보까지 설계된 것 ${D.nDone}종) |`,
  `| 합계 | **${D.nLab + D.nCat}종** |`,
  `| 자동 검증 | ${D.nLab}종 × 7라운드 = **${D.nLab * 7}개 상태** |`,
  '',
  '실험실 하나는 네 가지를 갖춥니다.',
  '',
  '1. **탭① 데모** — 학생이 직접 조작하는 화면',
  '2. **수학 원리** — 식이 어디서 나왔는지 단계별 유도',
  '3. **확장 탐구** — 바로 / 심화 / 프로젝트 3수준',
  '4. **탭② 7라운드** — AI와 대화로 그 자료를 직접 만들어 보는 명세 (ROUND 4에 심은 결함 포함)',
  '',
  `LAB ${ranges(D.labs.filter(l=>l.iq).map(l=>l.no))} 에는 여기에 **탐구 보고서**가 더해집니다 — 관찰 기록표, 손글씨 답안판,`,
  '그리고 표와 손글씨를 한 장의 PNG로 합쳐 내는 제출 기능입니다.',
  '',
  '---',
  '',
  '## 실험실 목록',
  '');

// 요약표
p('| # | 자료 | 수학 개념 | 실생활 질문 |',
  '|---|---|---|---|');
D.labs.forEach(l => p(`| ${String(l.no).padStart(2, '0')} | ${esc(l.t)} | ${esc(l.m.join(' · '))} | ${esc(l.q)} |`));
p('', '---', '');

// 상세
D.labs.forEach(l => {
  p(`### LAB ${String(l.no).padStart(2, '0')} · ${l.t}`,
    '',
    `> ${l.q}`,
    '',
    '| | |',
    '|---|---|',
    `| 수학 개념 | ${esc(l.m.join(' · '))} |`,
    `| AI · 실생활 | ${esc(l.a.join(' · '))} |`,
    `| 핵심 식 | ${esc(l.eq)} |`,
    '');
  if (l.what) p(`**무엇을 보는가** — ${l.what}`, '');
  if (l.note) p(`**조작 안내** — ${l.note}`, '');
  if (l.next.length) {
    p('**확장 탐구**', '');
    l.next.forEach(n => p(`- **${n.lv}** ${n.t}`));
    p('');
  }
  p('---', '');
});

// 탭② — 별개의 목록이다
p('## 탭② 바이브 코딩 실습실 — 7라운드 명세',
  '',
  '탭①과는 **별개의 목록**입니다. 순서도 개수도 따로 관리되므로 번호로 짝지어 읽지 마십시오.',
  '',
  '`ROUND 4 결함`은 일부러 심어 둔 “눈에 보이는 오류”이고, `고치는 말`은 ROUND 5에서',
  '학생(교사)이 AI에게 건네는 모범 문장입니다. **ROUND 5가 이 연수의 교육적 핵심입니다.**',
  '');
D.vlab.forEach((v, i) => {
  p(`### ${String(i + 1).padStart(2, '0')} · ${v.t}`,
    '',
    `> ${v.q}`,
    '',
    '| | |',
    '|---|---|',
    `| 단원 · 성취기준 | ${esc(v.grade)} |`,
    `| 핵심 식 | ${esc(v.eq)} |`,
    `| 학습 목표 | ${esc(v.obj)} |`,
    `| ROUND 4 결함 | ${esc(v.bug)} |`,
    `| ROUND 5 고치는 말 | ${esc(v.fixask)} |`,
    '');
});
p('---', '');

// 카탈로그
p('## 확장 카탈로그',
  '',
  `2022 개정 교육과정의 단원 체계를 따라 **${D.groups.length}개 묶음**으로 정리했습니다.`,
  '중학교는 학년순, 고등학교는 과목순, 과학계열 전문 교과가 마지막입니다.',
  '',
  '`결함` 칸이 비어 있는 항목은 아직 주제만 잡힌 상태입니다.',
  '**결함 후보 없이 실험실로 승격하지 마십시오** — ROUND 5가 이 연수의 핵심이기 때문입니다.',
  '');
D.groups.forEach(g => {
  if (!g.items.length) return;
  p(`### ${g.n} (${g.items.length}종)`, '',
    '| 주제 | 단원 | 실생활 질문 | 결함 후보 |',
    '|---|---|---|---|');
  g.items.forEach(c => p(`| ${esc(c.t)} | ${esc(c.g)} | ${esc(c.q) || '—'} | ${esc(c.b) || '—'} |`));
  p('');
});

writeFileSync(OUT, L.join('\n'), 'utf8');
console.log(`docs/실험실_목록.md  ${L.join('\n').length.toLocaleString()} bytes  (실험실 ${D.nLab} · 카탈로그 ${D.nCat})`);
