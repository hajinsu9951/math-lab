// 단행본에 실을 «실험 화면 사진» 을 실제 페이지에서 찍는다.
//
// 왜
//   책의 「실험 따라가기」는 글로만 적으면 독자가 화면의 어디를 봐야 할지 모른다.
//   그린 그림이 아니라 **진짜 화면**이어야 한다 — 책과 화면이 다르면 그 자리에서 막힌다.
//
// 무엇을 찍나
//   ① 실험 화면(#lsLab 에서 탐구 노트를 뺀 부분) — 조작판과 그림이 있는 자리
//   ② 탐구 노트(.lsnnote) — 세 칸이 보이는 자리
//   실험실마다 PREP 에 적어 둔 조작을 먼저 하고 찍는다. 적어 두지 않으면 붙자마자의 화면이다.
//
// 사용: node docs/단행본/shots.mjs 25 44 docs/단행본/사진_중1.json
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
const OUT = resolve(process.argv[4] || join(ROOT, 'docs', '단행본', '사진.json'));
const FILE = resolve(join(ROOT, 'dist', 'index.html'));

/* 실험실마다 «책에 싣기 좋은 상태» 로 만들어 두고 찍는다.
   값은 페이지 안에서 실행할 코드 문자열이다 (하나의 식이 아니라 문장 묶음). */
const PREP = {
  // 61 과 53 을 고르고 끝까지 나눠 본 상태 — 책 본문이 드는 바로 그 예다
  25: `const bs=[...root.querySelectorAll('button')];
       const pick=t=>{ const b=bs.find(x=>x.textContent.trim()===t); if(b) b.click(); };
       pick('61'); pick('53');
       const tryb=root.querySelector('#pfTry');
       if(tryb) for(let i=0;i<60;i++) tryb.click();`,
  // 12 와 18 — 본문의 톱니바퀴 예
  35: `const r=[...root.querySelectorAll('input[type=range]')];
       const set=(e,v)=>{ if(e){ e.value=String(v); e.dispatchEvent(new Event('input',{bubbles:true})); } };
       set(r[0],12); set(r[1],18);`,
  // n = 5 로 늘리고 「칸마다 ⊐ 세 개」로 묶어 둔 상태 — 본문이 드는 바로 그 장면
  27: `const add=root.querySelector('#ltAdd');
       if(add) for(let i=0;i<4;i++) add.click();
       const f=root.querySelector('#ltf');
       if(f){ const o=[...f.options].find(x=>/3n/.test(x.textContent));
              if(o){ f.value=o.value; f.dispatchEvent(new Event('change',{bubbles:true})); } }`,
  // 뺄셈을 고른 상태 — 화살표가 뒤집히는 자리
  26: `const sel=root.querySelector('#izop');
       if(sel){ const o=[...sel.options].find(x=>/−|-/.test(x.textContent)&&/b/.test(x.textContent));
                if(o){ sel.value=o.value; sel.dispatchEvent(new Event('change',{bubbles:true})); } }`,
};

const b = await chromium.launch();
/* 좁게 찍는다. 1280 px 로 찍어 17 cm 단 안에 넣으면 글씨가 너무 작아져
   「해상도가 낮다」고 느껴진다. 1000 px 로 찍으면 같은 자리에서 글씨가 1.3 배 커진다.
   거기에 3 배 해상도 · PNG — JPEG 는 글자 테두리를 뭉갠다. */
const p = await b.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 3 });
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1200);

/* 찍는 동안만 쓰는 흰 무대 — 모달이 아니라 깨끗한 바탕에서 찍는다 */
await p.evaluate(() => {
  const st = document.createElement('div');
  st.id = 'bookStage';
  st.style.cssText = 'position:absolute;left:0;top:0;width:990px;background:#fff;'
    + 'z-index:99999;padding:14px 16px 26px;';
  document.body.prepend(st);
  document.body.style.overflow = 'visible';
});

const out = {};
for (let n = FROM; n <= TO; n++) {
  const has = await p.evaluate(no => !!(typeof LESSON !== 'undefined' && LESSON[no]), n);
  if (!has) continue;
  await p.evaluate(([no, prep]) => {
    const st = document.getElementById('bookStage');
    st.innerHTML = '';
    lessonFlow(st, LESSON[no], (typeof PRINS !== 'undefined' ? PRINS[no - 1] : null));
    /* 실험 단계만 보이게 — 책에 필요한 것은 ③ 실험 화면이다 */
    const phs = [...st.querySelectorAll('.lsnph')];
    phs.forEach((x, i) => { x.hidden = (i !== 2); });
    const bar = st.querySelector('.lsnbar'); if (bar) bar.style.display = 'none';
    const root = st.querySelector('#lsLab');
    if (prep && root) { try { (new Function('root', prep))(root); } catch (e) { } }
  }, [n, PREP[n] || '']);
  await p.waitForTimeout(500);

  const shots = {};
  for (const [key, sel] of [['lab', '#lsLab'], ['note', '.lsnnote']]) {
    const el = await p.$(`#bookStage ${sel}`);
    if (!el) continue;
    if (key === 'lab') {
      /* 실험 화면에서 탐구 노트와 사다리는 잠시 감춘다 — 따로 찍는다 */
      await p.evaluate(() => {
        const r = document.querySelector('#bookStage #lsLab');
        if (!r) return;
        r.querySelectorAll('.lsnnote,.ldr').forEach(x => { x.dataset.wasHidden = '1'; x.style.display = 'none'; });
      });
    }
    const box = await el.boundingBox();
    if (!box || box.width < 40 || box.height < 40) continue;
    /* 요소 상자를 조금 넓혀 찍는다 — 데모가 상자 밖으로 흘린 글이 잘리지 않게 */
    const pad = 10;
    const buf = await p.screenshot({
      type: 'png',
      clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad),
              width: box.width + pad * 2, height: box.height + pad * 2 },
    });
    shots[key] = 'data:image/png;base64,' + buf.toString('base64');
    if (key === 'lab') {
      await p.evaluate(() => {
        document.querySelectorAll('#bookStage [data-was-hidden], #bookStage .lsnnote, #bookStage .ldr')
          .forEach(x => { x.style.display = ''; });
      });
      await p.waitForTimeout(150);
    }
  }
  out[n] = shots;
  const kb = Object.values(shots).reduce((s, v) => s + v.length, 0) / 1365;
  console.log(`LAB ${n}  ${Object.keys(shots).join(' + ') || '(없음)'}  ${kb.toFixed(0)} KB`);
}

writeFileSync(OUT, JSON.stringify(out), 'utf8');
const mb = (Buffer.byteLength(JSON.stringify(out)) / 1048576).toFixed(2);
console.log(`→ ${OUT}  ${mb} MB · pageerrors ${errs.length}`);
await b.close();
