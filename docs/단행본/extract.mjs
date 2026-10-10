// 단행본 집필용 재료 뽑기 — dist/index.html 을 실제로 열어 «그 실험실이 가진 전부» 를 JSON 으로 낸다.
//
// 왜 이렇게 하나
//   책의 「실험 따라가기」 는 화면과 한 글자도 어긋나면 안 된다. 독자가 책을 왼손에,
//   화면을 오른손에 두고 읽기 때문이다. 그래서 소스를 정규식으로 긁지 않고
//   **완성된 페이지를 열어 객체를 그대로 읽는다** — 미션 문구·노트 칸·적용 답·수학 원리·삽화까지.
//
// 사용: node docs/단행본/extract.mjs 25 44 docs/단행본/재료_중1.json
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');

const FROM = +(process.argv[2] || 25);
const TO = +(process.argv[3] || 44);
const OUT = resolve(process.argv[4] || join(ROOT, 'docs', '단행본', '재료.json'));
const FILE = resolve(join(ROOT, 'dist', 'index.html'));

const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1200);

const data = await p.evaluate(([FROM, TO]) => {
  /* 「생각 열기」 그림 묶음을 본문에서 떼어 낸다 — 책에서는 따로 배치한다 */
  const figsOf = sit => {
    const out = [];
    const re = /<figure>\s*<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>\s*<figcaption>([\s\S]*?)<\/figcaption>\s*<\/figure>/g;
    let m;
    while ((m = re.exec(String(sit || '')))) out.push({ src: m[1], alt: m[2], cap: m[3] });
    return out;
  };
  const sitText = sit => String(sit || '')
    .replace(/<div class="lsnfigs">[\s\S]*?<\/div>\s*$/, '');

  const books = [];
  for (let n = FROM; n <= TO; n++) {
    const L = LABS[n - 1], S = LESSON[n];
    if (!S) continue;
    const N = (typeof NOTE_SPECS !== 'undefined') ? NOTE_SPECS[n] : null;
    const P = (typeof PRINS !== 'undefined') ? PRINS[n - 1] : null;
    books.push({
      n,
      title: S.title,
      unit: (L && L.m) || [],
      ai: (L && L.a) || [],
      flow: (L && L.note) || '',
      thumb: (typeof THUMBS !== 'undefined') ? THUMBS[n - 1] : '',
      problem: {
        q: S.problem.q,
        sit: sitText(S.problem.sit),
        figs: figsOf(S.problem.sit),
        svg: S.problem.svg || '',
      },
      predict: (S.predict && S.predict.q) || [],
      missions: (S.missions || []).map(m => ({
        t: m.t, re: m.re || '', do: m.do || '', hand: m.hand || '',
      })),
      inquiry: S.inquiry ? {
        title: S.inquiry.title, q: S.inquiry.q, cols: S.inquiry.cols,
        hint: S.inquiry.hint || '',
      } : null,
      apply: {
        q: S.apply.q, a: S.apply.a, tol: S.apply.tol,
        why: S.apply.why || '', hint: S.apply.hint || '',
      },
      note: N ? {
        h: N.h,
        cards: N.c.map(c => ({
          t: c.t, f: c.f, opts: c.opts || null,
          chk: c.chk ? String(c.chk) : '',
        })),
      } : null,
      prin: P ? {
        what: P.what || '', eq: P.eq || '', probe: P.probe || '',
        tex: (P.tex || []).map(x => ({ t: x.t, s: x.s })),
      } : null,
    });
  }
  return books;
}, [FROM, TO]);

writeFileSync(OUT, JSON.stringify(data, null, 1), 'utf8');
const kb = (Buffer.byteLength(JSON.stringify(data)) / 1024).toFixed(0);
console.log(`LAB ${FROM}~${TO} · ${data.length}종 · ${kb} KB → ${OUT}`);
console.log('삽화 ' + data.reduce((s, x) => s + x.problem.figs.length, 0) + '장 · '
  + '탐구 노트 ' + data.filter(x => x.note).length + '종 · '
  + '수학 원리 ' + data.filter(x => x.prin && x.prin.tex.length).length + '종');
console.log('pageerrors ' + errs.length);
await b.close();
