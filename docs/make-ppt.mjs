/* =====================================================================
   2026 대전광역시교육청 「AI·디지털 기반 교육혁신 역량강화 연수」
   주제4  수학 AI·디지털 기반 교수학습 설계 및 자료 제작 (중등)
   3시간(180분) 강의용 PPT 생성기 — 대전대신고 하진수

     npm run ppt        →  docs/2026_대전_AI연수_수학_3시간_강의.pptx

   ● 슬라이드 양식은 충남대학교 제공 「디지털 활용 연수 슬라이드 마스터(중등)」를
     그대로 따릅니다 — 배경 #E4F0FD · 상단 띠 #839DD1 · 흰 본문 카드 · 우상단 로고.
     로고와 마스코트 그림은 docs/assets/ 에 마스터에서 추출해 두었습니다.
   ● 글꼴은 마스터가 지정한 Freesentation(프리젠테이션) 입니다.
     이 글꼴은 굵기별로 각각 하나의 패밀리이므로 bold 속성 대신 패밀리를 바꿔 씁니다.
       Freesentation 7 Bold      → 제목
       Freesentation 6 SemiBold  → 소제목·강조
       Freesentation 4 Regular   → 본문
     설치 파일: 슬라이드마스터(+글꼴)/폰트파일 (설치필요).zip
   ● 구성은 프로그램 계획서의 3개 세션(각 1시간)을 그대로 따릅니다.
       1교시 [체험·해체] “여기 어디지?” GPS 삼변측량
       2교시 [제작]     “이 문자, 스팸일까?” 생성형 AI로 만드는 웹자료
       3교시 [적용·나눔] “왜 순식간에 퍼질까?” 내 단원 리모델링과 공유·성찰
   ===================================================================== */
import PptxGenJS from 'pptxgenjs';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC  = path.join(HERE, '..', 'src');
const A    = (f) => path.join(HERE, 'assets', f);
const OUT  = path.join(HERE, '2026_대전_AI연수_수학_3시간_강의.pptx');

/* ---------------------------------------------------------------------
   종수는 손으로 적지 않습니다 — src 에서 실제 배열 길이를 읽어 씁니다.
   실험실이나 카탈로그를 늘리면 슬라이드 문구가 저절로 따라옵니다.
   (웹자료 화면도 같은 원칙입니다 → src/57-catalog-ui.js 의 catCounts)
   --------------------------------------------------------------------- */
const N = (() => {
  const count = (file, name) => {
    const src = readFileSync(path.join(SRC, file), 'utf8');
    const i = src.indexOf(`const ${name}`);
    if (i < 0) return 0;
    // 배열 리터럴만 잘라 최상위 원소 수를 센다 (문자열·중첩 괄호 무시)
    const s = src.indexOf('[', i);
    let depth = 0, n = 0, q = null;
    for (let k = s; k < src.length; k++){
      const c = src[k];
      if (q){ if (c === '\\') k++; else if (c === q) q = null; continue; }
      if (c === '"' || c === "'" || c === '`'){ q = c; continue; }
      if ('[{('.includes(c)) depth++;
      else if (']})'.includes(c)){ depth--; if (!depth) break; }
      else if (c === ',' && depth === 1) n++;
    }
    return n + 1;
  };
  const vlab = (() => {
    const src = readFileSync(path.join(SRC, '50-labs-spec.js'), 'utf8');
    return (src.match(/^[a-z0-9]+:\s*\{/gm) || []).length;
  })();
  const lab = count('40-demos.js', 'LABS');
  const cat = count('55-catalog.js', 'CATALOG');
  const grp = count('55-catalog.js', 'CAT_GROUPS');
  return { lab, cat, vlab, grp, sum: lab + cat };
})();
console.log(`실험실 ${N.lab}종 · 카탈로그 ${N.cat}종(${N.grp}묶음) · 7라운드 명세 ${N.vlab}종 · 합계 ${N.sum}종`);

/* ---------- 글꼴 (마스터 지정: 프리젠테이션 Freesentation) ---------- */
const FT = 'Freesentation 7 Bold';       // 제목
const FS = 'Freesentation 6 SemiBold';   // 소제목·강조
const FB = 'Freesentation 4 Regular';    // 본문

/* ---------- 색 (마스터에서 추출) ---------- */
const C = {
  bg:'E4F0FD', card:'FFFFFF', band:'839DD1', strip:'D5E1EE',
  blue:'839DD1', deep:'4A67A8', navy:'333F5A',
  green:'2F7D5B', orange:'C2662A', red:'B4453C', purple:'7B5EA7',
  ink:'22304A', body:'44506B', mute:'8894AE',
  line:'DCE4F2', soft:'F4F8FE'
};

/* ---------- 판형 ---------- */
const W = 13.333, H = 7.5;
const BAND = { x:0.42, y:0.55, w:12.23, h:0.43 };
const CARD = { x:0.92, y:0.98, w:11.73, h:5.97 };
const STRIP= { x:0.42, y:0.98, w:0.50, h:5.97 };
const ML = 1.28, MR = 12.38, CW = MR - ML;        // 본문 좌우
const TOP = 2.50, BOT = 6.28;                      // 본문 상하 (아래는 마무리 문구 자리)
const CH  = BOT - TOP;

const pres = new PptxGenJS();
pres.defineLayout({ name:'W16x9', width:W, height:H });
pres.layout = 'W16x9';
pres.author  = '대전대신고 하진수';
pres.company = '2026 대전광역시교육청 AI·디지털 기반 교육혁신 역량강화 연수';
pres.title   = '수학 AI·디지털 기반 교수학습 설계 및 자료 제작';

let page = 0;

/* ---------- 공통 뼈대 (마스터 크롬) ---------- */
function base({chrome = true, logos = true} = {}){
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.ShapeType.rect, { x:BAND.x, y:BAND.y, w:BAND.w, h:BAND.h, fill:{color:C.band} });
  s.addShape(pres.ShapeType.rect, { x:STRIP.x, y:STRIP.y, w:STRIP.w, h:STRIP.h, fill:{color:C.strip} });
  s.addShape(pres.ShapeType.rect, { x:CARD.x, y:CARD.y, w:CARD.w, h:CARD.h, fill:{color:C.card} });
  if (logos){
    s.addImage({ path:A('logo-dje.png'), x:8.34, y:1.20, w:2.26, h:0.437 });
    s.addImage({ path:A('logo-cnu.png'), x:10.75, y:1.16, w:1.66, h:0.553 });
  }
  if (chrome){
    page++;
    s.addText(String(page),
      { x:MR-0.7, y:6.62, w:0.7, h:0.26, fontSize:8.5, color:C.mute, align:'right', fontFace:FB });
  }
  return s;
}

function head(s, {time, kicker, title, accent = C.blue}){
  let x = ML;
  if (time){
    s.addShape(pres.ShapeType.roundRect, { x:ML, y:1.19, w:1.58, h:0.32, rectRadius:0.15,
      fill:{color:accent}, line:{color:accent} });
    s.addText(time, { x:ML, y:1.19, w:1.58, h:0.32, fontSize:11, color:'FFFFFF',
      align:'center', valign:'middle', fontFace:FS });
    x = ML + 1.76;
  }
  if (kicker) s.addText(kicker, { x, y:1.19, w:8.0-(x-ML), h:0.32, fontSize:11.5,
    color:accent, valign:'middle', fontFace:FS, charSpacing:0.5 });
  s.addText(title, { x:ML, y:1.60, w:CW, h:0.70, fontSize:27, color:C.navy,
    valign:'middle', fontFace:FT });
  s.addShape(pres.ShapeType.line, { x:ML, y:2.36, w:CW, h:0, line:{color:C.line, width:1.2} });
}

const note = (s, t) => { if (t) s.addNotes(t); };
const foot = (s, t, col) => { if (t) s.addText(t, { x:ML, y:BOT+0.06, w:CW-0.8, h:0.34,
  fontSize:11, color:col || C.deep, fontFace:FS, valign:'middle' }); };

/* ---------- 표지 ---------- */
function cover(){
  const s = base({chrome:false});
  s.addText('2026년 대전광역시교육청 AI·디지털 기반 교육혁신 역량강화 연수',
    { x:ML, y:1.95, w:9.5, h:0.36, fontSize:13, color:C.deep, fontFace:FS });
  s.addText('주제 4 ｜ 중등 수학', { x:ML, y:2.36, w:6, h:0.34, fontSize:12, color:C.mute, fontFace:FB });
  s.addText('수학 AI·디지털 기반\n교수학습 설계 및 자료 제작',
    { x:ML, y:2.72, w:8.4, h:1.55, fontSize:38, color:C.navy, fontFace:FT, lineSpacingMultiple:1.16 });
  s.addShape(pres.ShapeType.rect, { x:ML, y:4.42, w:2.6, h:0.06, fill:{color:C.band} });
  s.addText('실생활 맥락 → 수학 원리 → 디지털 도구 → 자료 제작 → 평가·윤리',
    { x:ML, y:4.62, w:8.2, h:0.36, fontSize:14, color:C.body, fontFace:FS });
  s.addText('3시간 실습 · 코딩 경험이 없어도 담당 단원용 웹자료 1종을 완성합니다',
    { x:ML, y:5.00, w:8.2, h:0.34, fontSize:12.5, color:C.mute, fontFace:FB });
  s.addText('대전대신고등학교  하진수',
    { x:ML, y:5.72, w:6, h:0.4, fontSize:16, color:C.navy, fontFace:FS });
  s.addImage({ path:A('kids-ai.png'), x:8.95, y:4.05, w:3.28, h:2.44 });
  note(s, '인사 → 오늘은 강의가 아니라 실습입니다. 3시간 뒤 여러분 손에 “작동하는 학습자료 1개”가 남습니다. 노트북을 켜 주세요.');
}

/* ---------- 세션 표지 ---------- */
function divider({num, time, kind, title, sub, accent = C.blue, img, note:nt}){
  const s = base({chrome:false});
  s.addShape(pres.ShapeType.roundRect, { x:ML, y:1.85, w:1.30, h:1.30, rectRadius:0.10,
    fill:{color:accent}, line:{color:accent} });
  s.addText(num, { x:ML, y:1.85, w:1.30, h:1.30, fontSize:52, color:'FFFFFF',
    align:'center', valign:'middle', fontFace:FT });
  s.addText(`${time}  ·  ${kind}`, { x:ML+1.62, y:1.90, w:7.4, h:0.34,
    fontSize:12.5, color:accent, fontFace:FS, charSpacing:0.5 });
  s.addText(title, { x:ML+1.62, y:2.26, w:7.6, h:0.92, fontSize:31, color:C.navy,
    fontFace:FT, valign:'middle' });
  s.addText(sub, { x:ML, y:3.55, w:8.6, h:1.5, fontSize:14, color:C.body,
    fontFace:FB, valign:'top', lineSpacingMultiple:1.34 });
  if (img) s.addImage({ path:A(img), x:9.55, y:2.60, w:2.6, h:2.6*(img==='robot-point.png'?1.33:0.78) });
  note(s, nt);
}

/* ---------- 카드형 ---------- */
function slideCards({time, kicker, title, accent = C.blue, cards, cols = 3,
                     h = 1.85, foot:ft, note:nt}){
  const s = base(); head(s, {time, kicker, title, accent});
  const gap = 0.24, cw = (CW - gap*(cols-1))/cols;
  cards.forEach((c, i) => {
    const r = Math.floor(i/cols), col = i%cols;
    const x = ML + col*(cw+gap), y = TOP + r*(h+0.20);
    s.addShape(pres.ShapeType.roundRect, { x, y, w:cw, h, rectRadius:0.05,
      fill:{color:C.soft}, line:{color:C.line, width:1} });
    s.addShape(pres.ShapeType.rect, { x, y, w:0.05, h, fill:{color:c[2] || accent} });
    s.addText(c[0], { x:x+0.24, y:y+0.12, w:cw-0.42, h:0.38, fontSize:13.5,
      color:C.navy, fontFace:FS, valign:'top', fit:'shrink' });
    s.addText(c[1], { x:x+0.24, y:y+0.52, w:cw-0.42, h:h-0.66, fontSize:11,
      color:C.body, fontFace:FB, valign:'top', lineSpacingMultiple:1.24, fit:'shrink' });
  });
  foot(s, ft, accent); note(s, nt);
  return s;
}

/* ---------- 목록형 ---------- */
function slideBullets({time, kicker, title, accent = C.blue, lead, items, foot:ft, note:nt}){
  const s = base(); head(s, {time, kicker, title, accent});
  let y = TOP;
  if (lead){
    s.addText(lead, { x:ML, y, w:CW, h:0.4, fontSize:13.5, color:C.body, fontFace:FB, valign:'top' });
    y += 0.52;
  }
  const two = items.filter(t => Array.isArray(t) && t[1]).length;
  const one = items.length - two;
  const pitch = Math.min(0.78, (BOT - y - one*0.48) / Math.max(two, 1));
  items.forEach((t, i) => {
    s.addShape(pres.ShapeType.roundRect, { x:ML, y:y+0.06, w:0.30, h:0.30, rectRadius:0.06,
      fill:{color:accent}, line:{color:accent} });
    s.addText(String(i+1), { x:ML, y:y+0.06, w:0.30, h:0.30, fontSize:10,
      color:'FFFFFF', align:'center', valign:'middle', fontFace:FS });
    const p = Array.isArray(t) ? t : [t, ''];
    s.addText(p[0], { x:ML+0.44, y, w:CW-0.46, h:0.32, fontSize:14,
      color:C.navy, fontFace:FS, valign:'middle' });
    if (p[1]) s.addText(p[1], { x:ML+0.44, y:y+0.31, w:CW-0.46, h:pitch-0.34, fontSize:11.5,
      color:C.body, fontFace:FB, valign:'top', lineSpacingMultiple:1.2 });
    y += p[1] ? pitch : 0.48;
  });
  foot(s, ft, accent); note(s, nt);
  return s;
}

/* ---------- 좌우 비교형 ---------- */
function slideCompare({time, kicker, title, accent = C.blue, left, right, foot:ft, note:nt}){
  const s = base(); head(s, {time, kicker, title, accent});
  const cw = (CW - 0.30)/2;
  [[left, ML], [right, ML+cw+0.30]].forEach(([d, x]) => {
    const c = d.color || accent;
    s.addShape(pres.ShapeType.roundRect, { x, y:TOP, w:cw, h:CH, rectRadius:0.05,
      fill:{color:C.soft}, line:{color:C.line, width:1} });
    s.addShape(pres.ShapeType.rect, { x, y:TOP, w:cw, h:0.44, fill:{color:c} });
    s.addText(d.head, { x:x+0.22, y:TOP, w:cw-0.38, h:0.44, fontSize:12.5,
      color:'FFFFFF', valign:'middle', fontFace:FS });
    const pitch = (CH - 0.62) / d.rows.length;
    let y = TOP + 0.58;
    d.rows.forEach(r => {
      s.addText(r[0], { x:x+0.22, y, w:cw-0.44, h:0.26, fontSize:10.5, color:c, fontFace:FS, valign:'top' });
      s.addText(r[1], { x:x+0.22, y:y+0.26, w:cw-0.44, h:pitch-0.30, fontSize:11.5,
        color:C.body, fontFace:FB, valign:'top', lineSpacingMultiple:1.2 });
      y += pitch;
    });
  });
  foot(s, ft, accent); note(s, nt);
  return s;
}

/* ---------- 실습 활동 카드 ---------- */
function slideActivity({no, time, title, accent = C.green, goal, min, rows, note:nt}){
  const s = base(); head(s, {time, kicker:`실습 활동 ${no}`, title, accent});
  const lw = 3.75;
  s.addShape(pres.ShapeType.roundRect, { x:ML, y:TOP, w:lw, h:CH, rectRadius:0.05,
    fill:{color:accent}, line:{color:accent} });
  s.addText(`활동 ${no}`, { x:ML+0.28, y:TOP+0.18, w:lw-0.56, h:0.34, fontSize:12,
    color:'FFFFFF', fontFace:FS, charSpacing:0.8 });
  s.addText(goal, { x:ML+0.28, y:TOP+0.58, w:lw-0.56, h:1.9, fontSize:15,
    color:'FFFFFF', fontFace:FS, valign:'top', lineSpacingMultiple:1.26 });
  s.addShape(pres.ShapeType.line, { x:ML+0.28, y:TOP+2.72, w:lw-0.56, h:0, line:{color:'FFFFFF', width:1.2} });
  s.addText('배정 시간', { x:ML+0.28, y:TOP+2.84, w:lw-0.56, h:0.26, fontSize:10.5, color:'E7EEFB', fontFace:FB });
  s.addText(min, { x:ML+0.28, y:TOP+3.08, w:lw-0.56, h:0.5, fontSize:24, color:'FFFFFF', fontFace:FT });

  const x = ML + lw + 0.30, rw = CW - lw - 0.30, rh = CH/rows.length;
  rows.forEach((r, i) => {
    const y = TOP + i*rh;
    if (i) s.addShape(pres.ShapeType.line, { x, y, w:rw, h:0, line:{color:C.line, width:1} });
    s.addText(r[0], { x, y:y+0.08, w:1.72, h:0.4, fontSize:11, color:accent, fontFace:FS, valign:'top' });
    s.addText(r[1], { x:x+1.76, y:y+0.06, w:rw-1.80, h:rh-0.12, fontSize:11.5,
      color:C.body, fontFace:FB, valign:'top', lineSpacingMultiple:1.22 });
  });
  note(s, nt);
  return s;
}

/* ---------- 표형 ---------- */
function slideTable({time, kicker, title, accent = C.blue, headRow, rows, colW, rowH,
                     foot:ft, note:nt}){
  const s = base(); head(s, {time, kicker, title, accent});
  const body = [
    headRow.map(t => ({ text:t, options:{ color:'FFFFFF', fill:{color:accent}, fontSize:11.5, fontFace:FS } })),
    ...rows.map(r => r.map((t, i) => ({
      text:t, options:{ fontSize:10.8, color: i===0 ? C.navy : C.body, fontFace: i===0 ? FS : FB } })))
  ];
  s.addTable(body, { x:ML, y:TOP, w:CW, colW, fontFace:FB,
    border:{type:'solid', color:C.line, pt:1},
    rowH: rowH || Math.min(0.40, (CH - 0.10)/(rows.length+1)),
    valign:'middle', autoPage:false });
  foot(s, ft, accent); note(s, nt);
  return s;
}

/* ---------- 한 문장 강조형 ---------- */
function slideQuote({time, kicker, big, sub, accent = C.blue, img, note:nt}){
  const s = base();
  let kx = ML;
  if (time){
    s.addShape(pres.ShapeType.roundRect, { x:ML, y:1.19, w:1.58, h:0.32, rectRadius:0.15,
      fill:{color:accent}, line:{color:accent} });
    s.addText(time, { x:ML, y:1.19, w:1.58, h:0.32, fontSize:11, color:'FFFFFF',
      align:'center', valign:'middle', fontFace:FS });
    kx = ML + 1.76;
  }
  if (kicker) s.addText(kicker, { x:kx, y:1.19, w:7.8-(kx-ML), h:0.32, fontSize:11.5,
    color:accent, fontFace:FS, charSpacing:0.5, valign:'middle' });
  const tw = img ? 7.9 : CW;
  s.addText(big, { x:ML, y:2.05, w:tw, h:2.15, fontSize:32, color:C.navy,
    fontFace:FT, valign:'middle', lineSpacingMultiple:1.2 });
  s.addShape(pres.ShapeType.rect, { x:ML, y:4.38, w:2.4, h:0.06, fill:{color:accent} });
  if (sub) s.addText(sub, { x:ML, y:4.60, w:tw, h:1.6, fontSize:13, color:C.body,
    fontFace:FB, valign:'top', lineSpacingMultiple:1.32 });
  if (img) s.addImage({ path:A(img), x:9.55, y:2.55, w:2.55, h:2.55*1.33 });
  note(s, nt);
  return s;
}

/* ---------- 진행 흐름형 (구성 과정) ---------- */
function slideFlow({time, kicker, title, accent = C.blue, steps, foot:ft, note:nt}){
  const s = base(); head(s, {time, kicker, title, accent});
  const n = steps.length, gap = 0.16, bw = (CW - gap*(n-1))/n;
  steps.forEach((st, i) => {
    const x = ML + i*(bw+gap);
    s.addShape(pres.ShapeType.roundRect, { x, y:TOP, w:bw, h:1.06, rectRadius:0.05,
      fill:{color: i%2 ? C.deep : accent}, line:{color: i%2 ? C.deep : accent} });
    s.addText(`STEP ${i+1}`, { x, y:TOP+0.10, w:bw, h:0.24, fontSize:9.5,
      color:'E7EEFB', align:'center', fontFace:FB, charSpacing:0.8 });
    s.addText(st[0], { x:x+0.08, y:TOP+0.34, w:bw-0.16, h:0.62, fontSize:12.5,
      color:'FFFFFF', align:'center', valign:'middle', fontFace:FS });
    s.addText(st[1], { x:x+0.02, y:TOP+1.16, w:bw-0.04, h:1.42, fontSize:10.5,
      color:C.body, fontFace:FB, valign:'top', lineSpacingMultiple:1.24 });
    s.addText(st[2], { x:x+0.02, y:TOP+2.88, w:bw-0.04, h:0.86, fontSize:10,
      color:accent, fontFace:FS, valign:'top', lineSpacingMultiple:1.22 });
  });
  s.addShape(pres.ShapeType.line, { x:ML, y:TOP+2.72, w:CW, h:0, line:{color:C.line, width:1} });
  s.addText('산출물', { x:ML, y:TOP+2.74, w:1.2, h:0.22, fontSize:9, color:C.mute, fontFace:FB });
  foot(s, ft, accent); note(s, nt);
  return s;
}

/* ---------- 라운드 상세형 ---------- */
function slideRound({n, name, time, accent = C.orange, ask, tips, watch, note:nt}){
  const s = base(); head(s, {time, kicker:`바이브 코딩 ROUND ${n}`, title:name, accent});
  s.addShape(pres.ShapeType.roundRect, { x:ML, y:TOP, w:CW, h:1.72, rectRadius:0.05,
    fill:{color:C.soft}, line:{color:accent, width:1.2} });
  s.addText('이렇게 말합니다', { x:ML+0.26, y:TOP+0.12, w:3, h:0.26, fontSize:10.5,
    color:accent, fontFace:FS });
  s.addText(`“${ask}”`, { x:ML+0.26, y:TOP+0.40, w:CW-0.52, h:1.2, fontSize:12.5,
    color:C.navy, fontFace:FB, valign:'top', lineSpacingMultiple:1.3 });
  let y = TOP + 1.94;
  tips.forEach(t => {
    s.addShape(pres.ShapeType.ellipse, { x:ML+0.04, y:y+0.07, w:0.15, h:0.15, fill:{color:accent} });
    s.addText(t[0], { x:ML+0.34, y, w:CW-0.36, h:0.28, fontSize:12.5, color:C.navy, fontFace:FS });
    s.addText(t[1], { x:ML+0.34, y:y+0.27, w:CW-0.36, h:0.34, fontSize:11, color:C.body,
      fontFace:FB, valign:'top' });
    y += 0.66;
  });
  s.addShape(pres.ShapeType.roundRect, { x:ML, y:BOT-0.44, w:CW, h:0.44, rectRadius:0.05,
    fill:{color:accent}, line:{color:accent} });
  s.addText('화면에서 확인할 것 · ' + watch, { x:ML+0.26, y:BOT-0.44, w:CW-0.52, h:0.44,
    fontSize:11.5, color:'FFFFFF', valign:'middle', fontFace:FS });
  note(s, nt);
  return s;
}

/* =====================================================================
   ■ 오프닝
   ===================================================================== */
cover();

slideBullets({
  kicker:'프로그램 계획서', title:'오늘 이 3시간이 목표로 하는 것', accent:C.deep,
  lead:'2026년 대전광역시교육청 AI·디지털 기반 교육혁신 역량강화 연수 — 주제4(중등 수학)의 교육 목표입니다.',
  items:[
    ['실생활 맥락에서 수학 원리를 끌어내어 AI·디지털 기반 교수학습 과정을 설계한다',
     'GPS 측위 · 스팸 필터 · 정보 확산 세 가지 맥락을 오늘 직접 다룹니다.'],
    ['생성형 AI와 디지털 도구로 학생이 조작하는 인터랙티브 웹자료를 제작한다',
     'GeoGebra · Desmos · 스프레드시트 · 단일 HTML — 수업에 바로 넣을 수 있는 형태로 만듭니다.'],
    ['만든 자료를 수업 지도안과 평가(루브릭)까지 이어 붙인다',
     '활동으로 끝나면 일회성입니다. 지도안·활동지·채점기준을 한 세트로 묶습니다.']
  ],
  foot:'세 가지 모두 “설명을 듣는 것”이 아니라 “직접 만드는 것”으로 진행합니다.',
  note:'계획서에 적힌 목표를 그대로 읽어 주되, 세 번째(지도안·평가)는 계획서의 3교시에 해당한다는 점을 강조하세요.'
});

slideCards({
  kicker:'기대 효과', title:'3시간 뒤 무엇이 달라지는가', accent:C.deep, cols:2, h:2.0,
  cards:[
    ['코딩 경험이 없어도 자료 1종을 완성합니다',
     '오늘 만든 인터랙티브 웹자료를 다음 수업에 즉시 투입할 수 있습니다.\n설치·서버·로그인이 없는 단일 HTML 파일이라 USB로도, 링크로도 그대로 배포됩니다.', C.deep],
    ['재사용 가능한 설계 절차를 몸에 익힙니다',
     '실생활 맥락 → 수학 원리 → 디지털 도구 → 자료 제작 → 평가·윤리.\n이 절차 하나로 담당 단원 어디에나 같은 방식으로 확장할 수 있습니다.', C.blue]
  ],
  foot:'“오늘 배운 것”이 아니라 “오늘 만든 것”과 “다음에도 쓸 절차”를 가지고 나갑니다.',
  note:'계획서의 기대 효과 두 줄입니다. 특히 “즉시 투입”을 강조하면 동기가 살아납니다.'
});

slideCards({
  kicker:'오늘의 산출물', title:'가지고 나가는 것 여섯 가지', accent:C.blue, cols:3, h:1.78,
  cards:[
    ['① 작동하는 학습자료 1개','담당 단원으로 만든 HTML 파일 하나. 설치·서버·로그인 없이 학생에게 그대로 배포됩니다.', C.blue],
    ['② 프롬프트 기록','7라운드에서 내가 쓴 말 그대로. 다음 자료를 만들 때 재활용하는 재료가 됩니다.', C.deep],
    ['③ 수업 지도안 초안','도입·전개·정리를 분 단위로 적은 한 장. 오늘 3교시에 직접 씁니다.', C.green],
    ['④ 채점기준표(루브릭)','활동의 판정 기준이 그대로 “상” 기준이 되므로 따로 만들 필요가 없습니다.', C.orange],
    ['⑤ 학생 활동지 · 교사 자료','탐구 과정을 단계별로 기록하는 문서. 한글·워드·구글 문서에서 바로 열립니다.', C.purple],
    ['⑥ 연수 모음집 · 공유 QR','참가자 전원의 산출물을 묶은 파일 하나. 학교로 돌아가 동교과에 그대로 공유합니다.', C.blue]
  ],
  foot:'여섯 개 모두 오늘 안에 실제로 만들어 저장합니다. 마지막에 하나씩 확인합니다.',
  note:'결과물을 먼저 보여 줍니다. 손가락으로 여섯을 세어 가며 말해 주세요.'
});

slideCards({
  kicker:'오늘 쓰는 자료', title:`세 층으로 준비되어 있습니다 — 합해서 ${N.sum}종`, accent:C.blue, cols:3, h:2.30,
  cards:[
    [`① 작동하는 실험실 ${N.lab}종`,
     `열면 바로 조작되는 완성 자료입니다.\n수학 원리 유도 · 조작 · 판정까지 다 붙어 있습니다.\n\n오늘 1교시에 이 중 하나를 학생처럼 조작하고 분해합니다.`, C.blue],
    [`② 7라운드 실습 명세 ${N.vlab}종`,
     `그 ${N.vlab}종을 AI와 7번 대화해 직접 만들어 보는 시뮬레이터입니다.\n\n2교시의 핵심 도구이며, 인터넷이 끊겨도 그대로 돌아갑니다.`, C.orange],
    [`③ 확장 카탈로그 ${N.cat}종`,
     `2022 개정 ${N.grp}개 과목의 단원을 덮는 후보 목록입니다.\n실생활 질문과 ROUND 4 결함 후보가 이미 적혀 있습니다.\n\n담당 단원을 여기서 고르면 됩니다.`, C.green]
  ],
  foot:'화면에 찍히는 “○○종”은 전부 실제 자료 수를 세어 표시합니다 — 늘어나면 저절로 따라 바뀝니다.',
  note:'세 층을 구분해 두면 “어디를 봐야 하나” 질문이 사라집니다. 카탈로그는 “고르는 곳”이라고 못 박아 주세요.'
});

slideBullets({
  kicker:'오늘의 약속', title:'세 시간을 편하게 보내는 세 가지 규칙', accent:C.green,
  items:[
    ['완벽하게 만들지 않습니다','오늘 목표는 “쓸 만한 초안 하나”입니다. 다듬는 것은 학교에 돌아가서 해도 됩니다.'],
    ['막히면 3분 안에 손을 듭니다','혼자 끙끙대는 3분이 3시간을 망칩니다. 강사와 모둠 튜터가 계속 순회합니다.'],
    ['옆 사람 화면을 봅니다','같은 화면을 두 사람이 보면 오류를 훨씬 빨리 찾습니다. 실습 내내 말을 걸어도 좋습니다.'],
    ['그리고 하나 더 — 저장','라운드가 끝날 때마다 저장하세요. 오늘 가장 흔한 사고는 “만들었는데 사라졌다”입니다.']
  ],
  foot:'이 네 가지는 그대로 학생에게도 적용됩니다 — 교실에서 AI를 쓸 때의 규칙이기도 합니다.',
  note:'분위기를 푸는 슬라이드입니다. 특히 “완벽 금지”를 강하게 말해 두면 뒤에서 시간이 훨씬 잘 지켜집니다.'
});

slideTable({
  kicker:'프로그램 계획서', title:'3시간 구성 — 한 시간에 하나씩', accent:C.deep,
  headRow:['시간','단계','실생활 질문','하는 일'],
  colW:[1.5, 1.5, 2.5, 5.6],
  rows:[
    ['15:00–16:00','체험 · 해체','“여기 어디지?”','GPS 삼변측량으로 좌표기하 수업 설계 — 완성 자료를 조작하고 4블록으로 해체'],
    ['16:00–17:00','제작','“이 문자, 스팸일까?”','조건부확률 손계산 → 생성형 AI 7라운드로 단일 HTML 자료 제작·검증'],
    ['17:00–18:00','적용 · 나눔','“왜 순식간에 퍼질까?”','확산 시뮬레이터를 내 단원으로 리모델링 → 지도안·루브릭·활동지 완성 → 갤러리 워크'],
    ['15:50 / 16:50','휴식 각 10분','—','자료 저장 · 접속 문제 해결 · 막힌 지점 개별 지원']
  ],
  rowH:0.62,
  foot:'세 시간이 각각 완결됩니다 — 늦게 오셔도, 한 시간만 들으셔도 가져갈 것이 있습니다.',
  note:'계획서의 세 세션 구조 그대로입니다. 인쇄해 책상마다 두면 “지금 어디쯤인가” 질문이 사라집니다.'
});

slideFlow({
  kicker:'오늘을 관통하는 것', title:'설계 절차 다섯 걸음 — 세 시간 내내 반복합니다',
  accent:C.blue,
  steps:[
    ['실생활 맥락', '학생이 이미 겪은 일에서 질문 한 줄을 뽑습니다. “±8 m는 어떻게 나올까?”',
     '→ 도입 질문'],
    ['수학 원리', '그 질문을 교과서 표기의 식으로 바꿉니다. (x−a)²+(y−b)²=r²',
     '→ 성취기준 연결'],
    ['디지털 도구', 'GeoGebra·Desmos·스프레드시트·웹자료 중 무엇이 이 원리에 맞는지 고릅니다.',
     '→ 도구 선정 근거'],
    ['자료 제작', '입력·계산·시각화·피드백 4블록으로 만들고, AI와 7라운드로 완성합니다.',
     '→ HTML 1개'],
    ['평가 · 윤리', '판정 기준을 루브릭으로 옮기고, 데이터 출처와 프라이버시를 점검합니다.',
     '→ 지도안·루브릭']
  ],
  foot:'1교시는 1~3걸음, 2교시는 4걸음, 3교시는 5걸음에 집중합니다. 절차는 늘 같습니다.',
  note:'이 다섯 걸음이 오늘의 뼈대입니다. 매 세션 시작에서 “지금 몇 걸음인지” 다시 짚어 주세요.'
});

slideQuote({
  kicker:'오늘의 원칙',
  big:'코드를 배우지 않습니다.\n말로 요청하고, 결과를 보고,\n다시 요청합니다.',
  sub:'필요한 것은 “무엇이 잘못됐는지 화면을 보고 말하는 능력”이고,\n그것은 수학 교사가 이미 매일 학생에게 하는 일입니다.',
  accent:C.blue, img:'robot-point.png',
  note:'“저는 코딩 못 해요”라는 불안을 여기서 정면으로 해소합니다. 오늘 아무도 코드를 타이핑하지 않습니다.'
});

slideBullets({
  kicker:'시작 전 3분', title:'준비사항 확인', accent:C.green,
  lead:'계획서에 안내된 준비물입니다. 없어도 진행은 됩니다 — 아래 대안을 확인하세요.',
  items:[
    ['개인 노트북 (크롬 브라우저 권장)','없으면 2인 1조로 진행합니다. 다만 “만드는 사람”을 번갈아 맡으세요.'],
    ['구글 계정','구글 문서로 활동지를 내려받을 때 씁니다. 없으면 한글·워드로 열면 됩니다.'],
    ['생성형 AI 사용 계정','2교시에 씁니다. 계정이 없거나 접속이 끊겨도 탭②의 7라운드 실습은 오프라인으로 그대로 돌아갑니다.'],
    ['담당 학년 · 단원 1개 사전 선정',`오늘 만들 자료의 주제입니다. 정하지 못했으면 확장 카탈로그 ${N.cat}종에서 고르면 됩니다.`],
    ['예시 자료 · 프롬프트 카드','QR/링크로 배포합니다. 무연결 대비로 USB도 함께 돌립니다.']
  ],
  foot:'접속 문제로 5분 이상 쓰지 마세요. 안 되면 USB → 그래도 안 되면 2인 1조.',
  note:'실제 배포 QR/주소를 이 슬라이드에 붙여 주세요. 시작 5분 안에 전원 접속을 끝내는 것이 3시간 성패를 가릅니다.'
});


slideTable({
  kicker:'대상과 수준', title:'이 연수는 누구를 위한 것인가', accent:C.deep,
  headRow:['이런 선생님', '오늘 얻어 가시는 것', '난이도'],
  colW:[3.30, 6.10, 1.70],
  rows:[
    ['프로그래밍을 해 본 적이 없다','코드를 한 줄도 쓰지 않습니다. 말로 요청하고 결과를 확인하는 것이 전부입니다.','★☆☆'],
    ['지오지브라·엑셀은 써 봤다','같은 활동을 학생 기기에서 바로 열리는 웹자료로 바꿉니다.','★★☆'],
    ['AI를 수업에 써 봤다','만든 자료를 성취기준·루브릭·활동지와 한 세트로 묶는 법을 배웁니다.','★★☆'],
    ['수행평가 설계가 부담이다','3교시가 통째로 평가 설계입니다. 실제 시행한 2건을 그대로 가져가십시오.','★★★'],
    ['담당 단원이 아직 없다',`확장 카탈로그 ${N.cat}종에서 고르면 됩니다. 질문과 결함 후보까지 적혀 있습니다.`,'★☆☆']
  ],
  foot:'수준이 달라도 같은 자리에서 진행됩니다 — 필수 과제와 도전 과제를 나눠 두었습니다.',
  note:'첫머리에서 “못 따라가면 어쩌지”를 없애는 슬라이드입니다. 특히 첫 줄을 강조해 주세요.'
});

slideCards({
  kicker:'오늘 쓰는 웹페이지', title:'다섯 개의 탭 — 어디에 무엇이 있는가', accent:C.blue,
  cols:5, h:3.46,
  cards:[
    ['① 수학 실험실',
     `작동하는 자료 ${N.lab}종과 확장 카탈로그 ${N.cat}종.\n\n카드를 누르면 조작 화면 · 수학 원리 · 확장 탐구가 열립니다.\n\n1교시에 씁니다.`, C.blue],
    ['② 바이브 코딩 실습',
     'AI와 7라운드 대화로 자료를 직접 만드는 시뮬레이터.\n\n오른쪽 미리보기가 단계마다 실제로 자랍니다.\n\n2교시의 핵심.', C.orange],
    ['③ 3시간 운영 흐름',
     '체험 → 개조 → 생성 3단 사다리와 15분 단위 타임라인.\n\n학교에서 동교과 연수를 열 때 그대로 씁니다.', C.deep],
    ['④ 수업 · 평가 설계',
     '성취기준 → 루브릭 → 학생 활동지 → 세특.\n\n수행평가 2건과 STEP별 실습 도구 · 손글씨 답안판.\n\n3교시에 씁니다.', C.green],
    ['⑤ 우리 연수 모음집',
     '만든 자료를 올리고 한 파일로 묶어 배포.\n\n우수작은 확장 카탈로그로 승격됩니다.', C.purple]
  ],
  foot:'설치도 로그인도 없습니다. 주소를 열거나 USB 파일을 더블클릭하면 그대로 동작합니다.',
  note:'이 한 장이 오늘의 지도입니다. 탭 번호를 계속 불러 주면 참가자가 길을 잃지 않습니다.'
});

slideFlow({
  kicker:'산출물이 만들어지는 길', title:'오늘 세 시간 동안 파일이 이렇게 흘러갑니다',
  accent:C.deep,
  steps:[
    ['담당 단원 선택', '학년 · 과목 · 단원 하나를 정합니다. 없으면 카탈로그에서 고릅니다.', '→ 메모 한 줄'],
    ['4블록 해체', '기존 자료를 입력 · 계산 · 시각화 · 피드백으로 분해합니다.', '→ 해체표 1장'],
    ['7라운드 제작', 'AI와 7번 주고받아 내 단원 자료를 만듭니다.', '→ HTML 파일 1개'],
    ['지도안 · 평가', '성취기준 · 루브릭 · 활동지를 붙입니다.', '→ 지도안 · 루브릭'],
    ['공유 · 배포', '모음집에 올리고 한 파일로 묶어 받습니다.', '→ 모음집 HTML']
  ],
  foot:'앞 단계의 산출물이 다음 단계의 재료가 됩니다 — 그래서 중간에 빠지면 뒤가 막힙니다.',
  note:'“왜 지금 이걸 하나”가 이 한 장으로 설명됩니다. 실습이 시작될 때마다 잠깐 되돌아와 주세요.'
});

/* =====================================================================
   ■ 1교시 [체험·해체] GPS 삼변측량
   ===================================================================== */
divider({
  num:'1', time:'15:00 – 16:00', kind:'체험 · 해체', accent:C.blue,
  title:'“여기 어디지?” — GPS 삼변측량으로\n여는 좌표기하 수업 설계',
  sub:'완성된 웹자료를 학생처럼 조작한 뒤, 교사의 눈으로 분해합니다.\n실생활 질문 하나가 어떻게 성취기준과 자료 구조로 바뀌는지 한 시간 안에 전부 봅니다.',
  img:'robot-point.png',
  note:'이 시간의 목표 두 가지 — 재미를 느끼게 하는 것, 그리고 자료의 구조가 단순하다는 것을 알게 하는 것.'
});

slideQuote({
  time:'15:00–15:05', kicker:'STEP 1 · 실생활 맥락',
  big:'“±8 m”\n이 숫자는 어떻게 나올까?',
  sub:'지도 앱의 파란 점 주변에는 늘 원이 하나 있습니다. 건물 안에서는 커지고 야외에서는 작아집니다.\n학생이 매일 보면서도 한 번도 묻지 않은 숫자입니다. 오늘 수업은 여기서 시작합니다.',
  accent:C.blue,
  note:'답을 말하지 마세요. 질문만 세우고 넘어갑니다. 답은 학생이 화면을 만지며 찾습니다.'
});

slideActivity({
  no:'①', time:'15:05–15:12', title:'내 폰은 나를 얼마나 정확히 아는가', accent:C.blue, min:'7분',
  goal:'지도 앱의 위치 정확도 숫자를 직접 확인하고,\n그 숫자가 어디서 나오는지 질문을 만든다',
  rows:[
    ['무엇을 하나','지도 앱을 켜고 파란 점 주변 원(정확도 반경)을 확인합니다. 창가 → 복도 → 야외로 옮기며 숫자를 세 번 적습니다.'],
    ['무엇을 보나','건물 안에서는 반경이 커지고 야외에서는 작아집니다. 왜 장소에 따라 달라지는지가 오늘의 첫 질문입니다.'],
    ['함께 나눌 질문','“위성은 나를 어떻게 찾을까?” 거리 정보 몇 개만으로 위치가 정해지려면 무엇이 필요할까?'],
    ['남는 것','칠판에 적힌 질문 한 줄. 이 질문이 그대로 학생 활동지 1번 문항이 됩니다.']
  ],
  note:'실측으로 엽니다. 첫 3분 안에 참가자가 스마트폰을 꺼내게 하세요.'
});

slideTable({
  time:'15:12–15:15', kicker:'활동 기록', title:'실측 기록표 — 학생이 그대로 쓰는 양식',
  accent:C.blue,
  headRow:['측정 장소','정확도 반경','보이는 위성 수(추정)','왜 그럴까 — 내 생각'],
  colW:[2.6, 2.2, 2.4, 3.9],
  rows:[
    ['실내 (창에서 먼 곳)','', '', ''],
    ['창가','', '', ''],
    ['야외','', '', ''],
    ['건물 사이 좁은 길','', '', '']
  ],
  rowH:0.62,
  foot:'빈칸이 있는 표를 그대로 띄워 두고 채우게 하십시오 — 이것이 학생 활동지의 첫 장입니다.',
  note:'참가자에게 직접 채우게 하세요. “내가 학생이면 이 칸을 쓸 수 있나?”를 확인하는 시간입니다.'
});

slideCompare({
  time:'15:15–15:20', kicker:'STEP 2 · 수학 원리', title:'학생의 말을 교사의 수학으로 옮기기',
  accent:C.blue,
  left:{ head:'학생이 던진 말', color:C.mute, rows:[
    ['현상','“건물 안에서는 위치가 부정확해요.”'],
    ['궁금증','“위성이 몇 개나 있어야 정해지나요?”'],
    ['직관','“원 세 개가 만나는 데가 나인가?”'],
    ['불만','“가끔 완전히 엉뚱한 데를 찍어요.”']
  ]},
  right:{ head:'교사가 꺼내는 수학', color:C.blue, rows:[
    ['원의 방정식','(x − a)² + (y − b)² = r²  — 위성 하나가 원 하나입니다'],
    ['연립','원 두 개의 교점은 둘, 세 개면 하나로 확정됩니다'],
    ['오차','거리에 오차가 있으면 교점이 한 점에 모이지 않습니다 — 정확도 반경의 정체'],
    ['배치','위성이 한쪽에 몰리면 교차각이 작아져 오차가 커집니다']
  ]},
  foot:'[10공수2-01-05] 좌표평면에서 원의 방정식을 구하고 활용할 수 있다 — 성취기준으로 그대로 이어집니다.',
  note:'왼쪽은 학생 말, 오른쪽은 교사 언어입니다. 이 옮기기가 교수학습 설계의 핵심 기술입니다.'
});

slideBullets({
  time:'15:20–15:24', kicker:'수학 원리 심기', title:'유도 과정을 네 단계로 보여 줍니다',
  accent:C.blue,
  lead:'실험실의 “수학 원리” 칸은 결과 식만 주지 않고 유도를 단계로 펼쳐 보여 줍니다.',
  items:[
    ['① 한 위성 — 거리 하나','(x − a₁)² + (y − b₁)² = r₁²  · 가능한 위치는 원 위 전부입니다.'],
    ['② 두 위성 — 두 식을 뺀다','제곱항이 소거되어 일차식이 남습니다. 두 원의 교점은 최대 두 개.'],
    ['③ 세 위성 — 하나로 확정','세 번째 원이 두 후보 중 하나를 지웁니다. 위치가 정해집니다.'],
    ['④ 오차가 있으면 — 영역이 된다','r 에 오차 ±δ 가 있으면 교점이 한 점이 아니라 작은 영역이 됩니다. 이것이 정확도 반경입니다.']
  ],
  foot:'각 단계에 “왜 이렇게 되나?” 토글이 붙어 있습니다. 학생이 스스로 펼쳐 보게 하십시오.',
  note:'②의 “제곱항 소거”가 학생이 가장 놀라는 지점입니다. 손으로 한 번 빼 보게 하면 좋습니다.'
});

slideCards({
  time:'15:24–15:28', kicker:'STEP 3 · 디지털 도구', title:'무엇으로 보여 줄 것인가 — 도구 고르기',
  accent:C.blue, cols:4, h:2.35,
  cards:[
    ['GeoGebra','원·직선·교점을 마우스로 끌며 즉시 확인.\n\n· 강점: 도형 조작이 가장 직관적\n· 한계: 학생 계정·설치 안내 필요', C.blue],
    ['Desmos','식을 치면 바로 그려집니다.\n\n· 강점: 식 ↔ 그래프 연결이 빠름\n· 한계: 도형 교점 다루기는 약함', C.deep],
    ['스프레드시트','값을 표로 바꿔 가며 계산.\n\n· 강점: 확률·통계·반복 계산\n· 한계: 시각적 조작감이 약함', C.green],
    ['단일 HTML 웹자료','오늘 만드는 것.\n\n· 강점: 설치·로그인 없음, 판정까지 붙임\n· 한계: 처음 한 번은 만들어야 함', C.orange]
  ],
  foot:'도구는 원리에 맞춰 고릅니다. “좋은 도구”가 아니라 “이 원리에 맞는 도구”가 기준입니다.',
  note:'계획서에 GeoGebra·Desmos·스프레드시트가 명시돼 있습니다. 넷을 다 쓰지 말고 고르는 기준을 주는 것이 요점입니다.'
});

slideActivity({
  no:'②', time:'15:28–15:42', title:'GPS 삼변측량 — 학생처럼 조작하기', accent:C.blue, min:'14분',
  goal:'완성 자료를 열어 다섯 가지 조작 미션을 수행하고,\n“무엇을 만지면 무엇이 바뀌는가”를 말로 정리한다',
  rows:[
    ['미션 5개','① 위성 하나만 켠다 ② 두 개 ③ 세 개 ④ 거리에 오차를 준다 ⑤ 위성을 한쪽으로 몰아 본다'],
    ['확인 질문','위성 2개일 때 후보가 몇 개인가? 3개면 왜 하나로 정해지나? 한쪽으로 몰면 왜 오차가 커지나?'],
    ['교사의 눈','학생이 “정답 맞히기”가 아니라 “왜 그런가”를 말하게 하려면 어떤 발문을 붙여야 할까?'],
    ['남는 것','조작–관찰–설명 3줄 메모. 그대로 학생 활동지 2번 문항이 됩니다.']
  ],
  note:'조작만 하면 놀이, 발문이 붙으면 수업입니다. 10분쯤에 “발문 한 줄 적어 보세요”를 반드시 넣으세요.'
});

slideTable({
  time:'15:42–15:45', kicker:'관찰을 수업으로', title:'조작 결과를 발문으로 바꾸는 표',
  accent:C.blue,
  headRow:['학생이 본 것','약한 발문 (그만두게 됨)','좋은 발문 (설명하게 됨)'],
  colW:[3.4, 3.5, 4.2],
  rows:[
    ['원이 두 개일 때 점이 둘','“몇 개예요?”','“왜 하나로 정해지지 않을까? 무엇이 더 있으면 될까?”'],
    ['세 원이 한 점에서 만남','“맞았죠?”','“세 번째 원이 한 일을 한 문장으로 말해 볼까?”'],
    ['오차를 주니 영역이 생김','“오차 때문이에요”','“±5 m 오차가 위치에서는 몇 m 로 커졌지? 왜 더 커졌을까?”'],
    ['위성을 한쪽에 몰았더니 흐려짐','“배치가 나빠서”','“위성을 어디에 두면 가장 정확할까? 이유를 그림으로 설명해 보자.”']
  ],
  rowH:0.66,
  foot:'오른쪽 칸이 그대로 학생 활동지의 서술형 문항이 됩니다.',
  note:'참가자 대부분이 왼쪽 칸의 발문을 씁니다. 오른쪽으로 바꾸는 연습을 한 번만 시켜도 효과가 큽니다.'
});

slideCards({
  time:'15:45–15:50', kicker:'STEP 4 · 구조 해체', title:'모든 실험실은 같은 뼈대 4블록입니다',
  accent:C.green, cols:4, h:2.35,
  cards:[
    ['① 입력','학생이 만지는 것.\n슬라이더 · 체크박스 · 선택 상자 · 숫자 칸.\n\n예) 위성 개수, 거리 오차', C.blue],
    ['② 계산','수학 원리가 들어가는 자리.\n교과서 그대로의 식.\n\n예) 원의 방정식 연립', C.deep],
    ['③ 시각화','계산 결과를 눈에 보이게.\n좌표평면 · 막대 · 점 · 색.\n\n예) 원 세 개와 교점', C.green],
    ['④ 피드백','잘했는지 알려 주는 자리.\n숫자로 된 판정 기준.\n\n예) 오차 5 m 이내면 “성공”', C.orange]
  ],
  foot:'AI에게 시킬 때도 이 순서로 말합니다. 순서를 지키면 한 번에 통하고, 뒤섞으면 엉뚱한 것이 나옵니다.',
  note:'이 4블록이 오늘 연수의 문법입니다. 이후 모든 슬라이드에서 “지금 몇 번 블록인가”를 짚어 주세요.'
});

slideTable({
  kicker:'블록별 예시', title:'네 블록은 실제로 이렇게 채워집니다',
  accent:C.green,
  headRow:['실험실','① 입력','② 계산','③ 시각화','④ 피드백'],
  colW:[2.5, 2.3, 2.6, 2.2, 1.5],
  rows:[
    ['GPS 삼변측량','위성 수·오차','원의 방정식 연립','원 3개와 교점','오차 5 m 이내'],
    ['스팸 분류기','단어 목록·가중치','조건부확률·베이즈','확률 막대','정답률 80%'],
    ['정보 확산','전파율·초기 감염','지수·로지스틱 모형','시간-인원 곡선','예측 오차 10%'],
    ['최소제곱 회귀','점 추가·직선 기울기','잔차 제곱합 최소화','산점도와 잔차','SSE 최소값'],
    ['급수의 부분합','급수 종류·항 수','부분합 수열의 극한','부분합 꺾은선','수렴/발산 판정'],
    ['회전체와 원판','원판 개수','πr²Δx 의 합','쌓인 원판','오차 0.1% 이내']
  ],
  rowH:0.46,
  foot:'가로로 읽으면 자료 하나, 세로로 읽으면 블록의 역할이 보입니다.',
  note:'참가자가 자기 단원을 이 표의 새 줄로 써 보게 하면 다음 활동이 훨씬 수월해집니다.'
});

slideCards({
  kicker:'수업 흐름 장치 ①', title:`실험 사다리 — ${N.lab}종 전부, 관찰에서 적용까지 다섯 단계`,
  accent:C.deep, cols:5, h:2.35,
  cards:[
    ['① 관찰','문턱이 낮은 첫 조작.\n누구나 1분 안에 넘습니다.', C.blue],
    ['② 실습 도전 A','목표가 있는 조작.\n달성하면 화면이 스스로\n감지해 ✓ 를 켭니다.', C.deep],
    ['③ 실습 도전 B','극단·반례 만들기.\n“안 되는 경우”가\n개념의 경계를 긋습니다.', C.deep],
    ['④ 기록 · 발견','표를 채우고 규칙을\n자기 말로 씁니다.\n탐구 보고서와 연결.', C.green],
    ['⑤ 적용','새 문제에 옮겨 풀기.\n손계산 → 화면 검산.', C.orange]
  ],
  foot:'앞 단계를 넘어야 다음이 열립니다. 자동 감지가 안 되는 단계는 「해냈어요」 자가 확인으로 넘어갑니다.',
  note:'“지금 몇 단계인가요?”만 물어도 교실 순회가 됩니다. 빠른 학생은 ⑤ 적용을 변형해 심화 과제로 쓰세요.'
});

slideCards({
  kicker:'수업 흐름 장치 ②', title:'먼저 쓰고, 그다음 연다 — 두 개의 잠금',
  accent:C.green, cols:3, h:2.35,
  cards:[
    ['예상 먼저 쓰기','실험 화면은 손글씨로 예상을\n쓰기 전에는 덮여 있습니다.\n\n조작이 “확인 작업”이 되려면\n예상이 먼저 있어야 합니다.', C.blue],
    ['원리 잠금','공식과 유도는 학생이 발견한\n규칙을 자기 말로 쓴 뒤에만\n열립니다.\n\n정답을 먼저 보여 주지 않습니다.', C.deep],
    ['나란히 견주기','열린 뒤에도 내 손글씨가 위에\n남아 교과서 설명과 나란히\n비교됩니다.\n\n“같은 말을 하고 있나?”가 발문.', C.green]
  ],
  foot:'마우스·태블릿 펜슬 어느 쪽으로도 쓸 수 있고, 답안판은 PNG 로 저장되어 과정 평가 자료가 됩니다.',
  note:'이 두 잠금이 “능동적 수학 학습”의 장치입니다. 시연에서 잠금을 건너뛰지 말고 실제로 써서 여는 모습을 보여 주세요.'
});

slideActivity({
  no:'③', time:'15:50–15:56', title:'내가 고른 실험실 해체하기', accent:C.green, min:'6분',
  goal:'담당 단원에 가까운 자료를 하나 골라\n입력·계산·시각화·피드백 네 칸을 직접 채운다',
  rows:[
    ['무엇을 하나',`실험실 ${N.lab}종 중 하나를 열어 조작한 뒤 네 칸을 종이에 적습니다. 막히면 “수학 원리” 칸의 유도를 펼쳐 보세요.`],
    ['막히면',`확장 카탈로그 ${N.cat}종에서 담당 단원으로 찾으세요. 실생활 질문과 결함 후보까지 이미 적혀 있습니다.`],
    ['확인 질문','내 자료의 “계산” 칸에 들어갈 식을 교과서 표기 그대로 한 줄로 쓸 수 있는가?'],
    ['남는 것','4칸 메모 한 장. 2교시 7라운드에서 이 메모를 그대로 AI에게 불러 줍니다.']
  ],
  note:'이 메모가 없으면 2교시에서 반드시 막힙니다. 순회하며 네 칸이 다 찼는지 눈으로 확인해 주세요.'
});

slideTable({
  kicker:'담당 단원 찾기 ①', title:'중학교 — 어느 자료를 쓰면 되나',
  accent:C.blue,
  headRow:['학년','단원','쓸 수 있는 자료','실생활 질문'],
  colW:[1.0, 2.6, 3.2, 4.3],
  rows:[
    ['중1','자료의 정리와 해석','대푯값과 이상치','반 평균이 왜 내 체감과 다를까?'],
    ['중2','일차함수','요금제 손익분기','어느 요금제가 유리할까?'],
    ['중2','확률','비밀번호와 경우의 수','내 비밀번호는 몇 번 만에 뚫릴까?'],
    ['중2','확률','뽑기 확률과 큰 수의 법칙','뽑기를 몇 번 해야 확률대로 나올까?'],
    ['중3','삼각비','드론으로 건물 높이 재기','저 건물은 몇 층일까?'],
    ['중3','통계','산점도와 상관계수','공부 시간과 성적은 정말 관계가 있을까?']
  ],
  rowH:0.46,
  foot:'중학교는 학년순으로 정렬되어 있습니다. 카탈로그에서 학년 필터로 바로 찾을 수 있습니다.',
  note:'중학교 선생님이 많으면 이 표에서 2분 정도 머무르세요.'
});

slideTable({
  kicker:'담당 단원 찾기 ②', title:'고등학교 — 과목별로 정리하면',
  accent:C.deep,
  headRow:['과목','단원','쓸 수 있는 자료','실생활 질문'],
  colW:[1.7, 2.4, 3.1, 3.9],
  rows:[
    ['공통수학2','도형의 방정식','GPS 삼변측량','내 위치는 어떻게 정해질까?'],
    ['공통수학2','함수와 그래프','y = x 대칭의 발견','무리함수는 무엇의 역함수일까?'],
    ['수학Ⅰ','지수와 로그','복리와 72의 법칙 / 로그 스케일','원금이 두 배 되는 데 몇 년?'],
    ['수학Ⅰ','삼각함수','소리와 삼각함수','악기 소리는 왜 다르게 들릴까?'],
    ['수학Ⅱ','미분','순간속도와 미분계수','과속 단속 카메라는 무엇을 재나?'],
    ['확률과 통계','조건부확률','스팸 문자 분류기','이 문자, 스팸일까?'],
    ['확률과 통계','통계적 추정','정규분포와 표준점수 / 몬테카를로 π','내 점수는 어느 위치일까?'],
    ['미적분Ⅱ','급수·정적분','급수의 부분합 / 테일러 / 회전체','계산기는 sin을 어떻게 알까?'],
    ['인공지능 수학','회귀·최적화','최소제곱 회귀 / 경사하강법 / 코사인 유사도','AI는 어떻게 학습할까?']
  ],
  rowH:0.40,
  foot:`실험실 ${N.lab}종 + 확장 카탈로그 ${N.cat}종 = ${N.sum}종. 담당 단원이 없는 선생님은 없습니다.`,
  note:'화면에서 과목 필터를 눌러 담당 과목을 찾아 주는 시연을 1분만 하세요.'
});

slideBullets({
  time:'15:56–16:00', kicker:'★ 수업 지도안', title:'자료가 아니라 수업을 설계합니다 — 지도안 여섯 칸',
  accent:C.purple,
  lead:'만든 자료를 어디에, 몇 분 동안, 무슨 발문과 함께 넣을지 적은 것이 지도안입니다.',
  items:[
    ['단원 · 차시','어느 단원의 몇 차시인가. 앞뒤 차시와의 연결을 한 줄로.'],
    ['성취기준','하나만 고릅니다. 두 개 이상 고르면 평가가 흐려집니다.'],
    ['학습 목표','학생이 수업 끝에 할 수 있어야 하는 것을 동사로 씁니다 (설명한다 · 구한다 · 판단한다).'],
    ['교수·학습 활동','도입–전개–정리를 분 단위로. 자료를 언제 켜고 언제 끄는지까지 적습니다.'],
    ['자료 · 유의점','쓸 자료(HTML·활동지)와 예상되는 어려움, 대비책.'],
    ['평가','무엇을 어떤 기준으로 볼 것인가. 3교시에서 루브릭으로 확장합니다.']
  ],
  foot:'다음 장에 오늘 다룬 GPS 자료로 쓴 지도안 견본이 있습니다.',
  note:'여섯 칸을 한 번에 다 채우려 하지 말라고 미리 말해 두세요. 오늘은 “교수·학습 활동” 칸만 씁니다.'
});

slideTable({
  kicker:'지도안 견본 ①', title:'GPS 삼변측량 — 공통수학2 도형의 방정식 (1차시)',
  accent:C.purple,
  headRow:['단계','시간','교수·학습 활동','자료 · 유의점'],
  colW:[1.2, 0.9, 6.0, 3.0],
  rows:[
    ['도입','5분','지도 앱의 정확도 반경 실측 → “±8 m는 어떻게 나올까?” 질문 세우기','스마트폰 / 실측 기록표'],
    ['전개 1','10분','위성 1·2·3개를 차례로 켜며 후보 위치의 개수를 관찰하고 표에 기록','웹자료 · 조작 미션 카드'],
    ['전개 2','12분','두 원의 식을 빼서 제곱항이 소거되는 것을 손으로 확인 → 연립으로 교점 구하기','학습지 2쪽 · 개인 풀이'],
    ['전개 3','10분','거리에 오차를 주고 교점이 “영역”으로 번지는 과정 관찰 → 정확도 반경의 의미 진술','웹자료 오차 슬라이더'],
    ['정리','8분','위성 배치를 바꿔 오차가 가장 작아지는 배치를 모둠별로 제안하고 근거 설명','모둠 발표 · 서술형 1문항']
  ],
  rowH:0.60,
  foot:'전개 2에서 “손으로 한 번 빼 보기”를 빼면 자료만 만지고 수학이 남지 않습니다.',
  note:'이 견본을 그대로 배포하십시오. 참가자는 자기 단원으로 칸만 바꿔 쓰면 됩니다.'
});



/* ---- 1교시 보강 ② : 맥락 선정 · 이식 · 미션 카드 ---- */

slideCards({
  kicker:'맥락 고르기', title:'좋은 실생활 맥락의 조건 네 가지', accent:C.blue,
  cols:4, h:2.44,
  cards:[
    ['① 학생이 이미 겪은 일',
     '설명이 필요 없어야 합니다.\n\n지도 앱, 문자 메시지, 요금제 — 어제 본 것이면 좋습니다.\n\n반대로 “선박 항로 최적화”는 설명에만 10분이 걸립니다.', C.blue],
    ['② 답이 하나로 정해지는 일',
     '수학이 실제로 답을 정해 주어야 합니다.\n\n“어느 진로가 좋을까”는 맥락은 좋지만 수학이 답하지 못합니다.', C.green],
    ['③ 값을 바꿔 볼 수 있는 일',
     '조건을 바꾸면 결과가 달라져야 조작할 거리가 생깁니다.\n\n고정된 사실만 있는 소재는 읽기 자료로 끝납니다.', C.orange],
    ['④ 틀릴 수 있는 일',
     '직관과 결과가 어긋나는 지점이 있어야 합니다.\n\n스팸 분류, 평균의 함정, 조화급수 — 모두 “어? ”가 나오는 소재입니다.', C.red]
  ],
  foot:'네 조건 중 ④가 있으면 수업이 살아납니다 — 직관이 깨지는 순간이 학습이 일어나는 순간입니다.',
  note:'담당 단원의 소재를 고를 때 이 네 가지로 걸러 보라고 안내하세요.'
});

slideTable({
  kicker:'같은 틀, 다른 단원', title:'GPS 자료의 구조를 그대로 옮긴 세 가지 예', accent:C.deep,
  headRow:['옮긴 단원', '바꾼 것', '그대로 둔 것'],
  colW:[3.00, 4.20, 3.90],
  rows:[
    ['중3 · 피타고라스 정리','원 대신 직각삼각형, 거리 계산만 남김','조작 → 관찰 → 설명의 흐름'],
    ['확률과 통계 · 신뢰구간','거리 오차 대신 표본오차, 원 대신 구간','오차가 커지면 답이 흐려진다는 구조'],
    ['인공지능 수학 · 최소제곱','교점 대신 오차 제곱합이 최소인 점','“조건이 많을수록 정확해진다”는 결론']
  ],
  foot:'구조를 옮기는 것이 자료를 새로 만드는 것보다 훨씬 빠릅니다 — 3교시 리모델링이 바로 이 작업입니다.',
  note:'“내 단원에는 이런 게 없다”는 말이 나오면 이 표를 보여 주세요.'
});

slideTable({
  kicker:'인쇄용', title:'학생 조작 미션 카드 — 그대로 잘라 쓰십시오', accent:C.blue,
  headRow:['미션', '학생이 하는 일', '적어야 할 것'],
  colW:[1.70, 5.00, 4.40],
  rows:[
    ['미션 1','위성을 하나만 켠다','내 위치의 후보는 몇 곳인가?'],
    ['미션 2','위성을 두 개 켠다','후보가 몇 곳으로 줄었는가?'],
    ['미션 3','위성을 세 개 켠다','왜 하나로 정해지는가? (문장으로)'],
    ['미션 4','거리에 오차를 준다','세 원이 한 점에서 만나는가? 안 만나면 왜?'],
    ['미션 5','위성을 한쪽으로 몬다','정확도가 어떻게 달라지는가? 예상하고 확인하라']
  ],
  foot:'미션 3과 5에서만 문장을 쓰게 하십시오 — 다섯 개 모두 서술하게 하면 시간이 부족합니다.',
  note:'실제 수업에서 그대로 쓸 수 있게 만든 표입니다. 인쇄용이라고 안내하세요.'
});

slideCompare({
  kicker:'오개념 대응', title:'설명으로 고칠 것과 조작으로 고칠 것', accent:C.red,
  left:{ head:'설명이 필요한 것', color:C.deep, rows:[
    ['정의와 약속','기호의 뜻, 표기 규칙 — 조작해도 저절로 알게 되지 않습니다'],
    ['증명의 논리','왜 그 단계가 정당한지 — 교사의 설명이 필요합니다'],
    ['용어','“정의역”, “치역” 같은 말은 알려 주어야 합니다']
  ]},
  right:{ head:'조작이 빠른 것', color:C.green, rows:[
    ['부호·계수의 역할','중심의 부호, 계수의 크기 — 움직여 보면 5초입니다'],
    ['경우의 구분','만난다·접한다·안 만난다 — 직접 만들어 보게 하십시오'],
    ['극단의 경우','값을 0이나 아주 크게 — 말로 설명하기 어려운 것들']
  ]},
  foot:'모든 것을 조작으로 해결하려 하지 마십시오 — 도구는 설명을 대신하는 것이 아니라 줄여 주는 것입니다.',
  note:'“디지털 도구 만능주의”를 경계하는 슬라이드입니다. 균형 잡힌 메시지로 신뢰가 올라갑니다.'
});

slideTable({
  kicker:'산출물 예시', title:'1교시가 끝나면 손에 이것이 남습니다', accent:C.blue,
  headRow:['산출물', '형태', '어디에 쓰이는가'],
  colW:[3.00, 3.40, 4.70],
  rows:[
    ['실측 기록표','종이 1장','도입 질문의 근거 자료'],
    ['4블록 해체표','종이 1장','2교시 7라운드의 재료 — 가장 중요합니다'],
    ['발문 한 줄','메모','지도안의 “교사 발문” 칸에 그대로'],
    ['담당 단원 확정','메모',`카탈로그 ${N.cat}종에서 고른 주제 1개`],
    ['조작 미션 카드','인쇄물','다음 주 수업에 그대로 사용']
  ],
  foot:'두 번째 항목이 비어 있으면 2교시에서 반드시 막힙니다 — 쉬는 시간에 채워 주십시오.',
  note:'산출물을 눈으로 확인시키면 참가자의 성취감이 올라갑니다.'
});

/* ---- 1교시 보강 : 단원 계열 · 손계산 · 화면 사용법 · 점검 ---- */

slideTable({
  kicker:'단원 계열', title:'좌표기하는 6년에 걸쳐 이렇게 이어집니다', accent:C.blue,
  headRow:['학년 · 과목', '단원', '이 자료로 다룰 수 있는 것'],
  colW:[2.60, 3.10, 5.40],
  rows:[
    ['중1 · 수학','좌표평면과 그래프','순서쌍으로 위치를 나타낸다는 감각 — 원 없이 점만 다뤄도 됩니다'],
    ['중2 · 수학','일차함수','두 점 사이의 거리를 좌표로 계산하는 첫 경험'],
    ['중3 · 수학','피타고라스 정리','√((x−a)²+(y−b)²) 이 왜 거리인지 — 이 자료의 뿌리'],
    ['고1 · 공통수학2','도형의 방정식','원의 방정식, 두 원의 교점, 연립 — 정면으로 다루는 단원'],
    ['고2 · 기하','이차곡선','거리 조건이 곡선을 정의한다는 관점으로 확장'],
    ['고2~3 · 인공지능 수학','최적화와 예측','오차를 줄이는 위치 찾기 — 최소제곱으로 이어집니다']
  ],
  foot:'같은 화면 하나로 중1부터 고3까지 씁니다. 무엇을 묻느냐만 달라집니다.',
  note:'중학교 선생님이 “이건 고등학교 것 아닌가” 하실 때 이 표를 보여 주세요. 중3 피타고라스가 핵심입니다.'
});

slideTable({
  kicker:'손계산', title:'삼변측량 — 연립으로 푸는 네 걸음', accent:C.blue,
  headRow:['걸음', '식', '무엇을 하는가'],
  colW:[1.50, 5.20, 4.40],
  rows:[
    ['①','(x−a₁)² + (y−b₁)² = r₁²','위성 1에서 잰 거리 → 원 하나. 후보는 원 위 무한히 많습니다'],
    ['②','(x−a₂)² + (y−b₂)² = r₂²','위성 2를 더하면 두 원의 교점 → 후보가 둘로 줄어듭니다'],
    ['③','①−② 를 빼면 x, y 의 일차식','제곱항이 소거되어 직선이 나옵니다 — 두 교점을 지나는 직선'],
    ['④','일차식을 ① 에 대입','한 문자만 남아 이차방정식 → 교점의 좌표가 나옵니다'],
    ['확인','위성 3을 더한다','세 원이 한 점에서 만나면 그 점이 답. 만나지 않으면 오차가 있는 것입니다']
  ],
  foot:'③에서 제곱항이 사라지는 것이 이 계산의 급소입니다 — 학생에게 직접 빼 보게 하십시오.',
  note:'화면을 만지기 전에 손으로 한 번 풀립니다. 이 순서가 뒤바뀌면 “버튼 누르는 활동”으로 끝납니다.'
});

slideCards({
  kicker:'오개념', title:'원의 방정식에서 학생이 자주 넘어지는 세 곳', accent:C.red,
  cols:3, h:2.44,
  cards:[
    ['① 반지름과 r² 를 혼동',
     '(x−2)²+(y−3)²=16 에서 반지름을 16 이라고 답합니다.\n\n대응: 화면에서 r 슬라이더를 움직이며 식의 우변이 r² 로 변하는 것을 같이 보게 합니다.', C.red],
    ['② 중심의 부호를 반대로',
     '(x−2)² 를 보고 중심을 −2 라고 읽습니다.\n\n대응: 중심을 (2,3) → (−2,3) 으로 옮겨 보고 식이 (x+2)² 로 바뀌는 것을 확인시킵니다.', C.red],
    ['③ 교점이 항상 두 개라고 생각',
     '두 원은 늘 두 점에서 만난다고 믿습니다.\n\n대응: 반지름을 줄여 접하는 경우와 만나지 않는 경우를 직접 만들게 합니다.', C.red]
  ],
  foot:'세 오개념 모두 “화면에서 값을 바꿔 보면” 그 자리에서 깨집니다 — 설명보다 조작이 빠릅니다.',
  note:'선생님들이 가장 반가워하는 슬라이드입니다. 각 오개념마다 실제로 화면을 조작해 보이세요.'
});

slideBullets({
  kicker:'발문 설계', title:'조작을 수업으로 바꾸는 발문 사다리 다섯 칸', accent:C.deep,
  lead:'같은 화면을 놓고도 무엇을 묻느냐에 따라 활동의 수준이 완전히 달라집니다.',
  items:[
    ['1단 · 관찰','“위성을 하나 더 켜면 무엇이 달라지나요?” — 본 것을 말하게 합니다.'],
    ['2단 · 기술','“원이 몇 개일 때 위치가 하나로 정해지나요?” — 규칙을 문장으로 만들게 합니다.'],
    ['3단 · 설명','“왜 두 개로는 부족한가요?” — 근거를 수학 용어로 대게 합니다.'],
    ['4단 · 예측','“위성을 한쪽으로 몰면 정확도가 어떻게 될까요?” — 조작 전에 답하게 합니다.'],
    ['5단 · 설계','“정확도를 가장 높이려면 위성을 어디에 두어야 할까요?” — 조건을 스스로 만들게 합니다.']
  ],
  foot:'4단(예측)을 꼭 넣으십시오 — 조작 전에 답을 적게 하면 활동이 확인 작업으로 바뀝니다.',
  note:'실습에서 “발문 한 줄 적어 보세요”라고 할 때 이 사다리를 화면에 띄워 두면 수준이 확 올라갑니다.'
});

slideTable({
  kicker:'도구 선택', title:'같은 활동, 세 가지 도구 — 무엇을 쓸 것인가', accent:C.deep,
  headRow:['도구', '잘하는 것', '한계', '언제 쓰나'],
  colW:[2.10, 3.30, 3.10, 2.60],
  rows:[
    ['지오지브라','정확한 작도와 자취, 수식 연동','학생 계정·접속 필요, 화면 구성이 고정','작도·자취를 정밀하게 볼 때'],
    ['스프레드시트','표와 수식, 값의 변화 추적','시각화가 제한적, 상호작용이 약함','값을 늘려 가며 규칙을 찾을 때'],
    ['웹 실험실(HTML)','조작·시각화·판정을 한 화면에, 배포가 자유','작도 정밀도는 지오지브라보다 낮음','수업에 그대로 배포할 때'],
    ['셋을 함께','손계산 → 스프레드시트 → 웹자료','—','오늘 2교시가 정확히 이 순서입니다']
  ],
  foot:'웹 실험실의 장점은 기능이 아니라 배포입니다 — 파일 하나면 학생 기기 어디서든 열립니다.',
  note:'“지오지브라 두고 왜 이걸 쓰나”라는 질문이 반드시 나옵니다. 답은 배포와 판정입니다.'
});

slideCompare({
  kicker:'화면 사용법 ①', title:'카드를 누르면 무엇이 열리는가', accent:C.blue,
  left:{ head:'왼쪽 — 조작 화면', color:C.blue, rows:[
    ['그래프/캔버스','슬라이더와 체크박스를 움직이면 즉시 다시 그려집니다'],
    ['결과 칸','계산값과 판정이 숫자로 표시됩니다 — 루브릭의 재료입니다'],
    ['안내 문구','학생에게 그대로 읽힐 수 있는 문장으로 되어 있습니다']
  ]},
  right:{ head:'오른쪽 — 교사용 정보', color:C.green, rows:[
    ['수학 원리','대수식 4단계와 「왜 이렇게 되나?」 해설 토글'],
    ['무엇을 보게 할까','이 자료로 학생이 발견해야 할 것 한 문단'],
    ['확장 탐구','바로 · 심화 · 프로젝트 세 단계 후속 과제']
  ]},
  foot:'왼쪽은 학생용, 오른쪽은 교사용입니다. 수업에서는 왼쪽만 띄우면 됩니다.',
  note:'실제로 카드를 하나 열어 좌우를 손가락으로 짚어 주세요. 말로만 하면 전달되지 않습니다.'
});

slideBullets({
  kicker:'화면 사용법 ②', title:'「수학 원리」 칸 — 네 단계로 유도가 보입니다', accent:C.green,
  lead:'공식을 던지지 않습니다. 식이 어디서 왔는지 단계마다 이유가 붙어 있습니다.',
  items:[
    ['1단계 — 출발이 되는 정의','거리의 정의, 확률의 정의처럼 학생이 이미 아는 것에서 시작합니다.'],
    ['2단계 — 조건을 식으로','문제 상황을 등식이나 부등식으로 옮깁니다.'],
    ['3단계 — 변형','전개·소거·대입 등 실제 계산 과정입니다. 여기서 가장 많이 막힙니다.'],
    ['4단계 — 결론과 의미','나온 식이 무엇을 뜻하는지, 특수한 경우에 어떻게 되는지 확인합니다.'],
    ['「왜 이렇게 되나?」 토글','각 단계 아래에 접혀 있습니다. 수업에서는 학생이 먼저 말한 뒤 펼치십시오.']
  ],
  foot:'이 네 단계를 그대로 판서 순서로 쓰셔도 됩니다 — 지도안의 전개 부분이 절반은 채워집니다.',
  note:'토글을 먼저 펼치지 말라고 강조하세요. 순서만 지켜도 수업의 질이 달라집니다.'
});

slideCards({
  kicker:'화면 사용법 ③', title:'「확장 탐구」 세 단계 — 수준별 과제가 준비되어 있습니다',
  accent:C.purple, cols:3, h:2.44,
  cards:[
    ['바로 — 다음 수업에',
     '10분 안에 끝나는 확인 과제입니다.\n\n예) 위성 개수를 바꿔 가며 후보 지점의 수를 표로 정리하기.\n\n숙제나 형성평가로 그대로 씁니다.', C.blue],
    ['심화 — 사고를 한 겹 더',
     '조건을 바꾸거나 반례를 찾는 과제입니다.\n\n예) 위성을 한쪽에 몰았을 때 오차가 커지는 이유를 그림으로 설명하기.\n\n수행평가 “상” 기준의 재료입니다.', C.orange],
    ['프로젝트 — 학기 단위',
     '실제 데이터를 모아 스스로 설계하는 과제입니다.\n\n예) 학교 안 세 지점에서 거리를 재어 특정 위치를 추정하고 오차를 보고하기.\n\n동아리·주제탐구에 적합합니다.', C.green]
  ],
  foot:'세 단계가 그대로 수행평가의 난이도 층이 됩니다 — 따로 문항을 만들 필요가 없습니다.',
  note:'“과제 만들 시간이 없다”는 선생님께 가장 실용적인 부분입니다. 여기서 시간을 조금 더 쓰세요.'
});

slideTable({
  kicker:'실험실 목록 ①', title:`완성 실험실 ${N.lab}종 — 중학교·공통 영역`, accent:C.blue,
  headRow:['자료', '학교급 · 단원', '학생이 발견하는 것'],
  colW:[3.20, 3.20, 4.70],
  rows:[
    ['요금제 손익분기','중2 · 일차함수','두 직선이 만나는 점이 선택을 바꾸는 경계'],
    ['드론으로 건물 높이','중3 · 삼각비','각 하나와 거리 하나면 높이가 정해진다'],
    ['산점도와 상관계수','중3 · 상관관계','점이 흩어진 정도를 숫자 하나로 요약한다'],
    ['대푯값과 이상치','중3 · 대푯값','평균은 한 사람 때문에 통째로 흔들린다'],
    ['비밀번호와 경우의 수','중2~고1 · 경우의 수','자리 하나가 늘면 후보가 몇 배로 늘어난다'],
    ['카드번호 검증기','중3~고1 · 나머지','나머지 하나로 오타를 잡아낸다'],
    ['뽑기 확률과 큰 수의 법칙','중2~고1 · 확률','횟수가 늘면 상대도수가 확률에 다가간다']
  ],
  foot:'중학교 자료는 계산이 가볍고 조작이 단순합니다 — 1차시 도입 5분용으로 좋습니다.',
  note:'중학교 선생님이 절반 이상이면 이 표에서 시간을 더 쓰세요.'
});

slideTable({
  kicker:'실험실 목록 ②', title:'완성 실험실 — 고등학교 과목별', accent:C.blue,
  headRow:['자료', '과목 · 단원', '학생이 발견하는 것'],
  colW:[3.20, 3.20, 4.70],
  rows:[
    ['GPS 삼변측량','공통수학2 · 도형의 방정식','원 세 개의 교점 하나가 위치를 정한다'],
    ['y = x 대칭의 발견','공통수학2 · 함수','역함수와 대칭이동은 같은 조작이다'],
    ['정규분포와 표준점수','확률과 통계 · 정규분포','서로 다른 시험의 점수를 견주는 법'],
    ['스팸 문자 분류기','확률과 통계 · 조건부확률','증거가 믿음을 얼마나 바꾸는가'],
    ['순간속도와 미분계수','미적분Ⅰ · 미분','평균변화율의 극한이 접선의 기울기'],
    ['급수의 부분합','미적분Ⅱ · 급수','항이 0으로 가도 합은 발산할 수 있다'],
    ['테일러 근사','미적분Ⅱ · 멱급수','계산기가 sin 을 구하는 실제 방법'],
    ['회전체와 원판','미적분Ⅱ · 정적분','원뿔 부피 공식이 적분에서 유도된다'],
    ['최소제곱 회귀 · 경사하강법','인공지능 수학','AI 학습은 오차를 줄여 가는 과정이다']
  ],
  foot:'고등학교는 과목순으로 정렬되어 있습니다 — 담당 과목만 펼쳐 보시면 됩니다.',
  note:'미적분Ⅱ 세 종은 이번에 새로 만든 것입니다. 급수의 결함 사례는 2교시에 다시 나옵니다.'
});

slideCards({
  kicker:'카탈로그 구조', title:`확장 카탈로그 ${N.cat}종은 ${N.grp}개 묶음으로 정리되어 있습니다`,
  accent:C.deep, cols:4, h:2.30,
  cards:[
    ['중학교 1~3학년','학년순으로 배열되어 있습니다. 수와 연산 · 문자와 식 · 함수 · 기하 · 자료와 가능성 전 영역.', C.blue],
    ['고등 공통·일반선택','공통수학1·2, 대수, 미적분Ⅰ, 확률과 통계, 기하, 미적분Ⅱ.', C.green],
    ['진로선택','인공지능 수학, 경제 수학, 직무 수학, 수학과 문화.', C.orange],
    ['과학계열 전문교과','고급 대수 · 고급 기하 · 고급 미적분 · 이산 수학 · 전문 수학.', C.purple]
  ],
  foot:`2022 개정 교육과정 132개 단원을 모두 덮습니다. 완성 실험실 ${N.lab}종과 합해 ${N.sum}종입니다.`,
  note:'전문교과까지 있다는 점이 과학고·영재학교 선생님께 의미가 큽니다.'
});

slideCompare({
  kicker:'카탈로그 읽는 법', title:'항목 하나에 네 가지가 적혀 있습니다', accent:C.deep,
  left:{ head:'그대로 쓰는 두 가지', color:C.green, rows:[
    ['실생활 질문','ROUND 1 의 도입 질문이자 학생에게 던질 첫 문장입니다'],
    ['R4 결함 후보','4라운드 결과에 심을 오류. 이것이 없으면 5라운드 실습이 성립하지 않습니다']
  ]},
  right:{ head:'확인용 두 가지', color:C.deep, rows:[
    ['학교급 · 단원','담당 학년과 성취기준을 맞추는 데 씁니다'],
    ['AI · 실생활 연결','왜 이 주제가 지금 의미 있는지 — 도입 설명의 재료입니다']
  ]},
  foot:'“아직 설계되지 않음”으로 표시된 항목은 결함 후보가 비어 있습니다 — 그 항목은 고르지 마십시오.',
  note:'결함 후보가 왜 필수인지 한 번 더 짚어 주세요. 2교시 ROUND 5 의 복선입니다.'
});

slideFlow({
  kicker:'승격 절차', title:'카탈로그 항목을 완성 실험실로 올리는 다섯 걸음', accent:C.green,
  steps:[
    ['질문 확정', '카탈로그의 실생활 질문을 내 학생의 말로 바꿉니다.', '→ 도입 질문'],
    ['원리 4단계', '식을 교과서 표기로 쓰고 유도를 네 단계로 나눕니다.', '→ 원리 카드'],
    ['조작 정하기', '무엇을 만지면 무엇이 바뀌는지 한 문장으로 씁니다.', '→ 조작 명세'],
    ['결함 심기', '카탈로그의 결함 후보를 4라운드 결과에 넣습니다.', '→ R4 결함'],
    ['판정 기준', '“무엇을 하면 성공”인지 숫자로 못 박습니다.', '→ 루브릭 상 기준']
  ],
  foot:'네 번째 걸음을 건너뛰면 자료는 완성되어도 연수·수업에서 쓸 수 없습니다.',
  note:'학교로 돌아가 스스로 만들 때의 절차입니다. 인쇄해 가시라고 안내하세요.'
});

slideTable({
  kicker:'수업 설계', title:'15분짜리 도입 활동으로 쓰는 법', accent:C.blue,
  headRow:['시간', '교사', '학생', '자료'],
  colW:[1.30, 3.60, 3.60, 2.60],
  rows:[
    ['0–3분','실생활 질문을 던지고 예상을 적게 한다','“위성 몇 개면 될까?” 를 종이에 적는다','질문 한 줄'],
    ['3–8분','자료를 띄우고 조작 미션 3개를 준다','직접 만지며 미션을 수행한다','실험실 화면'],
    ['8–12분','발문 사다리 3~4단으로 묻는다','근거를 수학 용어로 말한다','결과 칸의 숫자'],
    ['12–15분','원리 1·2단계만 함께 정리한다','예상과 결과의 차이를 적는다','수학 원리 칸']
  ],
  foot:'남은 30분은 평소 수업 그대로 하시면 됩니다 — 자료 하나가 수업 전체를 바꾸지 않아도 됩니다.',
  note:'“한 시간을 통째로 못 낸다”는 현실적 고민에 대한 답입니다. 15분만 쓰라고 말해 주세요.'
});

slideBullets({
  kicker:'교실 운영', title:'기기와 좌석 — 미리 정해 두면 편한 것들', accent:C.deep,
  items:[
    ['2인 1대도 충분','오히려 대화가 늘어 발견이 빨라집니다. 단 “만지는 사람”을 5분마다 바꾸게 하세요.'],
    ['화면 공유는 교사 화면만','학생 화면을 앞에 띄우면 조작이 멈춥니다. 확인은 순회로 하십시오.'],
    ['접속 실패 대비','USB 파일을 미리 나눠 두면 와이파이가 끊겨도 그대로 진행됩니다.'],
    ['기록은 종이로','조작은 화면에서, 기록은 종이에. 이렇게 나누면 산출물이 남습니다.'],
    ['끝나면 닫게 하기','다음 활동으로 넘어갈 때 화면을 닫게 해야 주의가 돌아옵니다.']
  ],
  foot:'이 다섯 가지는 오늘 연수에서도 그대로 적용됩니다 — 지금 여러분이 학생 자리에 앉아 계십니다.',
  note:'실제 수업 경험담을 한두 개 섞어 주면 신뢰가 올라갑니다.'
});

slideTable({
  kicker:'1교시 점검', title:'여기까지 하고 다음으로 넘어갑니다', accent:C.blue,
  headRow:['확인할 것', '되었나요?', '안 되었으면'],
  colW:[5.20, 2.30, 3.60],
  rows:[
    ['웹페이지가 열렸다','☐','USB 파일을 받아 더블클릭하세요'],
    ['실험실 카드를 하나 이상 조작해 봤다','☐','옆 사람 화면을 함께 보세요'],
    ['담당 학년·과목·단원을 정했다','☐',`확장 카탈로그 ${N.cat}종에서 고르세요`],
    ['4블록 해체표를 채웠다','☐','2교시에 이 표가 재료입니다 — 지금 채우세요'],
    ['발문 한 줄을 적었다','☐','발문 사다리 4단(예측)에서 하나 고르세요']
  ],
  foot:'네 번째 항목이 비어 있으면 2교시에서 반드시 막힙니다 — 쉬는 시간에 채워 주세요.',
  note:'쉬는 시간 직전에 띄웁니다. 강사는 이때 미완성인 분들을 개별 지원하세요.'
});

slideQuote({
  kicker:'1교시 정리',
  big:'실생활 질문 하나가\n성취기준 하나로,\n다시 조작 화면 하나로.',
  sub:'좌표기하 여섯 해의 계열을 한 화면으로 이었고, 조작을 발문으로 바꾸는 사다리를 만들었으며,\n모든 자료가 입력 · 계산 · 시각화 · 피드백 네 블록이라는 것을 확인했습니다.',
  accent:C.blue, img:'kids-desk.png',
  note:'짧게 정리하고 바로 쉬는 시간으로 넘어가세요. 2교시가 오늘의 핵심입니다.'
});

/* =====================================================================
   ■ 2교시 [제작] 스팸 분류기 · 생성형 AI
   ===================================================================== */
divider({
  num:'2', time:'16:00 – 17:00', kind:'제작', accent:C.orange,
  title:'“이 문자, 스팸일까?” — 생성형 AI로\n만드는 인터랙티브 수학 웹자료',
  sub:'조건부확률을 작은 표로 손계산한 뒤, 그 원리를 그대로 AI에게 넘겨 웹자료로 만듭니다.\n오늘의 핵심 구간입니다 — 특히 AI가 만든 결과를 검증하고 고치는 ROUND 5.',
  img:'robot-gear.png',
  note:'여기가 3시간의 심장입니다. 시간이 밀리면 다른 데를 줄이고 이 구간은 지키세요.'
});

slideQuote({
  time:'16:00–16:04', kicker:'STEP 1 · 실생활 맥락',
  big:'“택배 배송 조회는\n여기를 눌러 주세요”\n— 이 문자, 스팸일까?',
  sub:'학생 휴대폰에 매일 오는 문자입니다. 사람이 판단할 때 쓰는 단서(“무료”, 링크, 발신번호)를\n숫자로 바꾸면 그것이 곧 조건부확률입니다.',
  accent:C.orange,
  note:'실제 스팸 문자 하나를 화면에 띄우면 몰입도가 확 올라갑니다. 개인정보는 반드시 가려서.'
});

slideTable({
  time:'16:04–16:10', kicker:'STEP 2 · 수학 원리', title:'작은 표로 손계산부터 — 100통의 문자',
  accent:C.orange,
  headRow:['구분','“무료” 있음','“무료” 없음','합계'],
  colW:[3.2, 2.6, 2.6, 2.7],
  rows:[
    ['스팸','24','6','30'],
    ['정상','7','63','70'],
    ['합계','31','69','100']
  ],
  rowH:0.52,
  foot:'P(스팸 | “무료”) = 24 / 31 ≒ 0.77 — “무료”가 들어 있으면 스팸일 확률이 30% 에서 77% 로 뜁니다.',
  note:'이 표를 손으로 채우게 하세요. 베이즈 정리를 식으로 먼저 주면 학생 절반이 떨어져 나갑니다.'
});

slideBullets({
  kicker:'유도', title:'표에서 베이즈 정리로 — 네 걸음',
  accent:C.orange,
  lead:'학생이 표에서 읽은 값을 그대로 기호로 바꾸면 식이 저절로 나옵니다.',
  items:[
    ['① 표에서 읽은 것','P(스팸) = 0.30 ·  P(“무료” | 스팸) = 24/30 = 0.80 ·  P(“무료” | 정상) = 7/70 = 0.10'],
    ['② 구하고 싶은 것','P(스팸 | “무료”) — 조건이 뒤집혀 있습니다. 이것이 “역확률” 문제입니다.'],
    ['③ 곱셈정리','P(A∩B) = P(B)·P(A | B) 를 양쪽으로 쓰면 P(스팸 | “무료”) = P(“무료” | 스팸)·P(스팸) / P(“무료”)'],
    ['④ 분모 채우기','P(“무료”) = 0.80×0.30 + 0.10×0.70 = 0.31 → 답 0.24/0.31 ≒ 0.77. 표의 24/31 과 정확히 같습니다.']
  ],
  foot:'표와 식이 같은 답을 준다는 것을 확인하는 순간이 이 단원의 정점입니다.',
  note:'④에서 “표로 구한 값과 같네요”를 학생이 먼저 말하게 하세요.'
});

slideActivity({
  no:'④', time:'16:10–16:18', title:'단어를 늘리면 어떻게 되나 — 스프레드시트로 확장',
  accent:C.orange, min:'8분',
  goal:'단서가 하나일 때의 손계산을\n단어 여러 개(나이브 베이즈)로 넓혀 본다',
  rows:[
    ['무엇을 하나','스프레드시트에 단어 5개의 스팸/정상 빈도를 넣고, 각 단어의 우도비를 곱해 최종 확률을 구합니다.'],
    ['핵심 가정','단어들이 서로 독립이라고 “가정”합니다 — 이 가정이 “나이브(순진한)”라는 이름의 이유입니다.'],
    ['확인 질문','“무료”와 “이벤트”가 함께 오는 경우가 많다면 이 가정은 옳은가? 결과는 어느 쪽으로 치우칠까?'],
    ['남는 것','우도비 표 한 장. 곧 AI에게 “이 계산을 그대로 넣어 줘”라고 건넬 재료입니다.']
  ],
  note:'독립 가정의 한계를 학생이 지적하면 최고의 수업입니다. 여기서 “모형은 늘 가정 위에 있다”를 짚으세요.'
});

slideCards({
  time:'16:18–16:22', kicker:'STEP 3 · 프롬프트', title:'수학 자료용 프롬프트 3요소',
  accent:C.orange, cols:3, h:2.35,
  cards:[
    ['① 수학 원리','어떤 식을 쓸지 교과서 표기 그대로 지정합니다.\n\n“P(A|B) = P(B|A)P(A)/P(B) 를 쓰고, 분모는 전확률로 계산해 줘.”', C.orange],
    ['② 학생 조작 요소','무엇을 만지면 무엇이 바뀌는지 명시합니다.\n\n“단어별 가중치를 슬라이더로 조절하면 확률 막대가 즉시 바뀌게 해 줘.”', C.deep],
    ['③ 즉시 피드백','판정 기준을 숫자로 못 박습니다.\n\n“확률이 0.5 이상이면 빨간색으로 ‘스팸 가능성 높음’이라고 표시해 줘.”', C.green]
  ],
  foot:'셋 중 하나라도 빠지면 “예쁘지만 수업에 못 쓰는 자료”가 나옵니다.',
  note:'계획서에 명시된 3요소입니다. 이 세 가지를 카드로 인쇄해 나눠 주면 실습 속도가 크게 붙습니다.'
});

slideTable({
  time:'16:22–16:26', kicker:'전체 지도', title:'바이브 코딩 7라운드 — 무엇을 언제 말하는가',
  accent:C.orange,
  headRow:['라운드','요청하는 것','핵심 요령'],
  colW:[2.3, 3.9, 4.8],
  rows:[
    ['ROUND 1  뼈대','HTML 한 파일로 빈 화면 만들기','“외부 라이브러리 금지 · 지금 할 것만” 두 줄을 반드시 붙입니다'],
    ['ROUND 2  수학 원리','식을 교과서 형태 그대로 지정','y = a(x − p)² + q 처럼 우리 교육과정 표기로 씁니다'],
    ['ROUND 3  학생 조작','무엇을 만지면 무엇이 바뀌는지','“슬라이더를 움직이면 ○○가 바뀐다”까지 명시합니다'],
    ['ROUND 4  시각화','화면에 그리기 → 그리고 눌러 본다','반드시 직접 조작해 봅니다. 여기 결함이 숨어 있습니다'],
    ['ROUND 5  ★ 결함 수정','증상을 화면 기준으로 설명','이 연수의 핵심. 뒤에서 사례 다섯 개로 따로 다룹니다'],
    ['ROUND 6  활동·피드백','판정 기준을 숫자로','“오차 5% 이내면 성공”처럼 수치로 못 박습니다'],
    ['ROUND 7  교실 배포','모바일 · 안내문 3줄 · 학습 목표','학생에게 그대로 나가는 상태로 마무리합니다']
  ],
  rowH:0.46,
  foot:'한 라운드에 한 가지만 요청합니다. 한 번에 다 시키면 반드시 엉킵니다.',
  note:'표를 통째로 읽지 마세요. 1·2·3은 빠르게, 4와 5에서 멈춰 서세요.'
});

slideRound({
  n:1, name:'뼈대 만들기 — 빈 화면부터', time:'16:26–16:28', accent:C.orange,
  ask:'고등학교 확률과 통계 수업에 쓸 학습자료를 만들 거야. HTML 파일 하나로만 만들어 줘. 외부 라이브러리나 CDN은 절대 쓰지 마. 지금은 제목과 빈 화면만 만들고, 계산이나 그래프는 아직 넣지 마.',
  tips:[
    ['“파일 하나로”를 먼저 말합니다','여러 파일로 나오면 학교 PC에서 열리지 않습니다. 배포가 곧 실패합니다.'],
    ['“외부 라이브러리 금지”를 반드시','연수장·교실 와이파이가 끊기면 CDN을 쓰는 자료는 그 자리에서 죽습니다.'],
    ['“지금 할 것만”으로 범위를 자릅니다','한 번에 다 시키면 어디가 잘못됐는지 알 수 없게 됩니다.']
  ],
  watch:'제목만 있는 흰 화면이 열리면 성공입니다. 아직 아무것도 없어야 정상입니다.',
  note:'여기서 “이렇게 아무것도 없어도 되나요?” 질문이 나옵니다. 그것이 정답이라고 말해 주세요.'
});

slideRound({
  n:2, name:'수학 원리 심기 — 식을 교과서 표기로', time:'16:28–16:31', accent:C.orange,
  ask:'이 자료의 수학 원리는 베이즈 정리야. P(A|B) = P(B|A)·P(A) / P(B) 를 쓰고, 분모 P(B) 는 전확률 공식으로 계산해 줘. 계산 함수만 먼저 만들고 화면에 그리는 것은 아직 하지 마.',
  tips:[
    ['우리 교육과정 표기로 씁니다','∑ 대신 시그마 표기, log 밑 표시 등 교과서와 같은 형태로 지정해야 학생이 헷갈리지 않습니다.'],
    ['변수 이름도 지정합니다','“사전확률은 prior, 우도는 like 로 이름 붙여 줘”처럼 말하면 나중에 고치기 쉽습니다.'],
    ['화면은 아직 만들지 않습니다','원리와 표현을 분리해야 결함이 생겼을 때 어디를 고칠지 바로 알 수 있습니다.']
  ],
  watch:'화면은 그대로입니다. 코드 안에 식이 들어갔는지만 확인합니다.',
  note:'“화면이 안 바뀌는데요?”가 나오면 성공입니다. 원리와 표현이 분리됐다는 뜻입니다.'
});

slideTable({
  kicker:'ROUND 2 참고', title:'식을 말할 때 — 이렇게 쓰면 통합니다',
  accent:C.orange,
  headRow:['단원','흐린 표현 (오해가 생김)','정확한 표현 (그대로 통함)'],
  colW:[2.3, 4.2, 4.5],
  rows:[
    ['이차함수','“포물선 그려 줘”','“y = a(x − p)² + q 로 쓰고 a, p, q 를 슬라이더로 조절하게 해 줘”'],
    ['원의 방정식','“원 그려 줘”','“(x − a)² + (y − b)² = r² 세 개를 그리고 교점을 구해 줘”'],
    ['지수·로그','“빠르게 늘어나게”','“y = a·bˣ 로 하고 b 를 1.05~1.5 로 조절하게 해 줘”'],
    ['미분','“기울기 보여 줘”','“x = t 에서의 미분계수를 구해 접선을 함께 그려 줘”'],
    ['급수','“무한히 더해 줘”','“부분합 Sₙ = Σ(k=1..n) aₖ 를 n 까지 계산해 꺾은선으로 그려 줘”'],
    ['정적분','“넓이 구해 줘','“구간을 n 등분해 Σf(xᵢ)Δx 로 근사하고 n 을 슬라이더로 늘리게 해 줘”']
  ],
  rowH:0.46,
  foot:'오른쪽처럼 말하면 결과의 절반은 첫 번째 시도에서 맞습니다.',
  note:'참가자에게 자기 단원의 식을 오른쪽 형식으로 한 줄 써 보게 하세요. 2분이면 됩니다.'
});

slideRound({
  n:3, name:'학생이 만질 것 정하기', time:'16:31–16:34', accent:C.orange,
  ask:'학생이 만질 것은 단어별 가중치야. 단어 5개 각각에 슬라이더를 붙이고, 값의 범위는 0에서 5, 눈금은 0.1로 해 줘. 슬라이더를 움직이면 최종 확률이 즉시 다시 계산되게 해 줘.',
  tips:[
    ['범위와 눈금까지 말합니다','범위를 안 주면 학생이 의미 없는 값까지 넣게 되어 수업이 산으로 갑니다.'],
    ['“무엇을 만지면 무엇이 바뀐다”를 한 문장으로','이 문장이 그대로 학생 안내문이 되고, 활동지 지시문이 됩니다.'],
    ['만질 것은 3~5개로 제한합니다','조작 요소가 많을수록 학생은 아무거나 누르고 아무것도 관찰하지 않습니다.']
  ],
  watch:'슬라이더가 생기고 숫자가 바뀝니다. 아직 그림은 없어도 됩니다.',
  note:'“학생이 만질 것을 3개로 줄이세요”는 오늘 가장 실용적인 조언 중 하나입니다.'
});

slideRound({
  n:4, name:'눈에 보이게 — 그리고 반드시 눌러 본다', time:'16:34–16:38', accent:C.orange,
  ask:'이제 화면에 그려 줘. 최종 확률을 가로 막대로 그리고, 각 단어가 확률을 얼마나 밀어 올렸는지 단어별 막대도 함께 보여 줘. 결과 문장은 막대 아래에 한 줄로 써 줘.',
  tips:[
    ['그린 뒤 반드시 직접 조작합니다','보기만 하면 결함을 못 찾습니다. 슬라이더를 끝에서 끝까지 밀어 보세요.'],
    ['극단값을 넣어 봅니다','가중치를 0으로, 최대로. 값이 음수가 되거나 100%를 넘지 않는지 확인합니다.'],
    ['4라운드 결과에는 결함이 하나 있습니다','일부러입니다. 다음 라운드가 오늘의 핵심입니다.']
  ],
  watch:'막대가 그려지고 슬라이더에 반응합니다 — 그런데 어딘가 이상합니다.',
  note:'여기서 3분을 온전히 조작 시간으로 주세요. 결함을 스스로 찾은 사람이 있으면 발표시키면 좋습니다.'
});

slideRound({
  n:5, name:'잘못된 곳 고치기 — 이 연수의 핵심', time:'16:38–16:41', accent:C.red,
  ask:'막대 그래프에서 “클릭” 단어의 기여도가 음수인데도 막대가 위로 그려져 있어. ' +
      '기여도가 음수면 아래로, 양수면 위로 그려 줘. 0 을 기준선으로 표시하고 눈금도 넣어 줘.',
  tips:[
    ['먼저 눌러 보고 나서 말합니다', '4라운드 결과를 조작해 보지 않으면 결함을 못 찾습니다. 값을 극단으로 넣어 보십시오.'],
    ['세 칸으로 말합니다', '어디서(화면 위치) · 무엇이(보이는 증상) · 어떻게(수학적 기준). 이 셋이 다 있어야 한 번에 고쳐집니다.'],
    ['“이상해요”는 통하지 않습니다', '막연한 말에는 막연한 답이 옵니다. 숫자나 수학 용어를 반드시 넣으십시오.']
  ],
  watch:'고친 뒤 같은 값을 다시 넣어 결과가 바뀌었는지 확인합니다 — 말만 하고 넘어가면 안 됩니다.',
  note:'★ 오늘 연수에서 가장 중요한 슬라이드입니다. 여기서 시간을 넉넉히 쓰십시오. 실제로 강사가 한 번 시연해 보이면 가장 좋습니다.'
});

slideQuote({
  time:'16:38–16:41', kicker:'ROUND 5 · 이 연수의 핵심',
  big:'AI는 한 번에 맞히지 않습니다.\n증상을 화면 기준으로 말하면\n고쳐집니다.',
  sub:'4라운드 결과에는 반드시 눈에 보이는 결함이 하나 심어져 있습니다. 일부러입니다.\n“고장 난 것을 말로 고쳐 본 경험”이 있어야 학교에 돌아가서도 혼자 만들 수 있습니다.',
  accent:C.red,
  note:'가장 중요한 슬라이드입니다. 여기서 30초 침묵을 두어도 좋습니다. 이 문장 하나가 오늘의 메시지입니다.'
});

slideCompare({
  time:'16:41–16:45', kicker:'ROUND 5 사례 ①', title:'급수 — 발산인데 “수렴합니다”라고 뜹니다',
  accent:C.red,
  left:{ head:'ROUND 4 결과 (결함)', color:C.red, rows:[
    ['화면','조화급수 Σ1/k 를 골라도 “수렴합니다”라고 표시됩니다'],
    ['왜','y축이 마지막 부분합에 맞춰 자동으로 늘어나 어떤 급수든 곡선이 평평해 보이고, 판정도 “마지막 변화량이 작으면 수렴”으로 되어 있습니다'],
    ['교사가 할 말','“y축이 자동으로 늘어나서 다 평평해 보여. 판정을 변화량이 아니라 급수의 종류로 해 줘.”']
  ]},
  right:{ head:'ROUND 5 결과 (수정)', color:C.green, rows:[
    ['화면','y축을 6으로 고정하니 조화급수만 끝없이 올라갑니다'],
    ['수학','항이 0으로 가는 것은 수렴의 필요조건일 뿐입니다. Σ1/k 가 바로 그 반례입니다'],
    ['수업 연결','“느린 것”과 “수렴하는 것”은 다르다 — 수렴판정법이 왜 필요한지 학생이 스스로 말하게 됩니다']
  ]},
  foot:'결함을 고치는 과정이 곧 수학 개념을 정확히 말하는 과정이 됩니다.',
  note:'조화급수 발산은 눈으로는 절대 안 보인다는 점을 강조하세요.'
});

slideCompare({
  kicker:'ROUND 5 사례 ② ③', title:'분모 하나, 반지름 하나가 전부를 바꿉니다',
  accent:C.red,
  left:{ head:'테일러 근사 — 차수를 올릴수록 나빠진다', color:C.red, rows:[
    ['증상','5차인데 x = 2 에서 오차가 4.82. 차수를 올리면 곡선이 화면 밖으로 튑니다'],
    ['원인','계수의 분모에 계승 k! 대신 k 를 썼습니다'],
    ['고친 뒤','같은 5차에서 오차 0.024 — 분모 하나가 근사의 성패를 가릅니다']
  ]},
  right:{ head:'회전체 — 부피가 정확히 4배로 나온다', color:C.red, rows:[
    ['증상','원판을 60개로 늘려도 합이 112.7. 정확값은 28.27 입니다'],
    ['원인','원판의 반지름 자리에 지름을 넣었습니다'],
    ['고친 뒤','28.16 — 오차 0.39%. πr² 에서 r 이 무엇인지가 전부였습니다']
  ]},
  foot:'둘 다 원인이 “수학 개념 하나”였습니다. 코드를 읽을 필요가 없었습니다.',
  note:'빠르게 지나가되 “원인이 전부 수학 개념 하나였다”는 점을 짚어 주세요.'
});

slideCompare({
  kicker:'ROUND 5 사례 ④ ⑤', title:'정의역을 빠뜨리고, 이상치에 속습니다',
  accent:C.red,
  left:{ head:'역함수 — 포물선이 위아래로 다 그려진다', color:C.red, rows:[
    ['증상','역함수라며 그린 포물선이 위아래 모두 그려져 한 x 에 y 가 두 개씩 나옵니다'],
    ['원인','원함수의 치역을 역함수의 정의역으로 옮기지 않았습니다'],
    ['고친 뒤','정의역을 x ≥ 1 로 제한 → 위쪽 가지만 남고 y = x 대칭이 정확히 맞습니다']
  ]},
  right:{ head:'대푯값 — 사장 한 명이 중앙값까지 올린다', color:C.red, rows:[
    ['증상','연봉 하나를 6만으로 올렸더니 평균은 물론 중앙값까지 함께 뜁니다'],
    ['원인','정렬하지 않은 배열의 가운데 값을 중앙값으로 썼습니다'],
    ['고친 뒤','정렬 후 중앙값을 구하니 평균만 뛰고 중앙값은 그대로 — 대푯값 비교의 핵심이 살아납니다']
  ]},
  foot:'다섯 사례 모두 “화면에 보이는 이상한 점”을 말했더니 고쳐졌습니다.',
  note:'④는 공통수학2, ⑤는 중1 담당 선생님께 바로 와닿는 사례입니다.'
});

slideBullets({
  time:'16:45–16:48', kicker:'말하는 법', title:'증상을 말하는 문장 틀 — 이대로 쓰면 통합니다',
  accent:C.red,
  lead:'AI에게 “안 돼요”라고 하면 못 고칩니다. 아래 세 칸을 채워 말하면 거의 한 번에 고쳐집니다.',
  items:[
    ['① 어디서 — 화면의 위치를 말합니다','“오른쪽 그래프에서”, “결과 문구가 나오는 칸에서”, “슬라이더를 끝까지 올렸을 때”'],
    ['② 무엇이 — 눈에 보이는 것을 그대로','“빨간 곡선이 위아래로 튀어 화면을 벗어납니다”, “조화급수인데 수렴이라고 뜹니다”'],
    ['③ 어떻게 되어야 하는지 — 숫자나 수학 용어로','“y축을 6으로 고정해 줘”, “원판의 반지름은 f(x) 자체야”, “정의역을 x ≥ 1 로 제한해 줘”'],
    ['이것이 곧 수업 역량입니다','학생의 오답을 “틀렸어”가 아니라 “여기서 이렇게 되었으니 이렇게 보자”로 바꾸는 일과 똑같습니다.']
  ],
  foot:'실습 내내 이 문장 틀을 화면 옆에 띄워 두세요. 참가자가 가장 많이 다시 보는 슬라이드입니다.',
  note:'막연한 말은 일부러 반영되지 않는다는 점을 실제로 시연해 보이면 효과가 큽니다.'
});

slideTable({
  kicker:'ROUND 5 참고', title:'금지어와 대체 표현',
  accent:C.red,
  headRow:['이렇게 말하면 안 됩니다','왜 안 되나','이렇게 바꿔 말합니다'],
  colW:[3.0, 3.6, 4.4],
  rows:[
    ['“이상해요”','무엇이 어떻게 이상한지 정보가 0입니다','“막대가 100%를 넘어서 화면 밖으로 나갑니다”'],
    ['“예쁘게 해 주세요”','미적 기준이 사람마다 달라 반영할 수 없습니다','“글씨를 크게, 그래프를 초록색으로 해 줘”'],
    ['“좀 더 잘 되게”','기준이 없어 아무 변화도 일어나지 않습니다','“오차가 5% 이내일 때만 성공이라고 표시해 줘”'],
    ['“다시 만들어 줘”','고친 것까지 전부 날아갑니다','“지금 것에서 y축만 고정으로 바꿔 줘”'],
    ['“학생이 어려워해요”','어느 부분이 어려운지 알 수 없습니다','“슬라이더가 5개라 너무 많아. 3개로 줄이고 나머지는 고정해 줘”']
  ],
  rowH:0.50,
  foot:'왼쪽은 “예쁘게 해 줘”에 코치 문구만 뜨도록 실제로 설계해 두었습니다 — 실패를 겪게 하는 장치입니다.',
  note:'이 표는 학생에게도 그대로 쓸 수 있습니다. AI 리터러시 수업 자료가 됩니다.'
});

slideRound({
  n:6, name:'활동·피드백 붙이기 — 판정 기준을 숫자로', time:'16:48–16:50', accent:C.orange,
  ask:'학생이 잘했는지 알 수 있게 판정을 붙여 줘. 정답 확률과의 차이가 0.05 이내면 초록색으로 “성공”, 0.15 이내면 노란색으로 “거의”, 그보다 크면 빨간색으로 “다시 해 보세요”라고 표시해 줘.',
  tips:[
    ['판정 기준은 반드시 숫자로','“잘하면”이 아니라 “0.05 이내면”. 이 숫자가 그대로 루브릭의 “상” 기준이 됩니다.'],
    ['단계는 3단계면 충분합니다','성공/거의/다시. 5단계로 나누면 학생도 교사도 기준을 기억하지 못합니다.'],
    ['피드백 문구를 우리 반 말로','“오답입니다” 대신 “분모를 다시 보세요”처럼 다음 행동을 알려 주는 문장으로.']
  ],
  watch:'조작할 때마다 색과 문구가 바뀝니다. 여기서 정한 숫자를 메모해 두세요 — 3교시 루브릭에서 씁니다.',
  note:'“지금 정한 숫자를 적어 두세요”를 반드시 말하세요. 3교시가 훨씬 빨라집니다.'
});

slideRound({
  n:7, name:'교실에 내보내기', time:'16:50–16:52', accent:C.orange,
  ask:'휴대폰에서도 열리게 해 주고, 화면 맨 위에 학습 목표 한 줄과 학생 안내문 3줄을 넣어 줘. 안내문은 “무엇을 만지면 무엇이 보이는지”를 알려 주는 문장으로 써 줘.',
  tips:[
    ['모바일 확인은 필수','학생 절반은 휴대폰으로 엽니다. 글씨가 잘리는지 반드시 확인하세요.'],
    ['안내문 3줄이 곧 지시문','교사가 없어도 학생이 시작할 수 있어야 합니다. 이 3줄이 활동지 지시문이 됩니다.'],
    ['학습 목표를 화면에 박아 둡니다','자료 하나가 어느 성취기준을 겨냥하는지 학생에게도 보이게 합니다.']
  ],
  watch:'휴대폰 화면에서 안내문 3줄이 보이면 완성입니다. 파일을 저장하세요.',
  note:'여기서 반드시 “파일 저장”을 시키세요. 저장하지 않아 산출물을 잃는 사고가 가장 흔합니다.'
});

slideActivity({
  no:'⑤', time:'16:52–17:00 (핵심 실습)', title:'내 단원으로 7라운드 완주하기',
  accent:C.orange, min:'25분',
  goal:'1교시에 적은 4칸 메모를 재료로\n담당 단원 학습자료 하나를 7라운드로 완성한다',
  rows:[
    ['시작','내 단원과 가장 가까운 실험실을 고르고 ROUND 1부터. 모범 프롬프트를 넣은 뒤 그 뒤에 내 말을 덧붙이세요.'],
    ['덧붙이는 말이 실제로 반영됩니다','“그래프를 초록색으로” · “글씨를 크게” · 제목을 "우리 반 표본 조사"로 — 화면이 그만큼 달라집니다.'],
    ['ROUND 5에서 멈추세요','결함을 찾고, 세 칸 문장 틀로 말해 보세요. 여기서 오늘의 배움이 일어납니다.'],
    ['남는 것','완성된 HTML 1개 + 프롬프트 기록. 둘 다 저장하세요 — 다음 자료의 재료입니다.']
  ],
  note:'강사는 계속 순회하세요. 5분마다 “지금 몇 라운드인지” 손 들어 확인하면 속도가 맞춰집니다.'
});

slideTable({
  kicker:'실습 참고', title:'내가 덧붙인 말이 화면에 어떻게 반영되는가',
  accent:C.deep,
  headRow:['이렇게 쓰면','이렇게 바뀝니다','범위'],
  colW:[4.0, 4.6, 2.4],
  rows:[
    ['“…을 초록색으로”','그래프 선 색이 바뀝니다','빨강·파랑·초록·주황·보라·검정·회색'],
    ['“글씨를 크게 / 작게”','본문 글자 크기가 3px 단위로','11px ~ 24px'],
    ['“그래프를 크게 / 작게”','그림 영역 폭이 20%p 단위로','60% ~ 160%'],
    ['“배경을 어둡게”','어두운 화면으로 전환','—'],
    ['제목을 "○○"으로','화면 제목이 바뀝니다','따옴표 필수'],
    ['“예쁘게 해 줘”','반영되지 않고 코치 문구가 뜹니다','무엇을 어떻게까지 말해야 합니다']
  ],
  rowH:0.46,
  foot:'마지막 줄이 이 기능의 목적입니다 — 구체적으로 말해야 반영된다는 것을 실패로 직접 겪게 합니다.',
  note:'AI 접속 없이도 이 반영이 동작합니다. 규칙 기반이라 오프라인에서도 실습이 끊기지 않습니다.'
});

slideBullets({
  kicker:'생성 결과 검증', title:'AI가 만든 것을 그대로 쓰지 않습니다 — 다섯 가지 점검',
  accent:C.red,
  lead:'계획서의 “생성 결과 검증·수정” 단계입니다. 학생에게 내보내기 전에 반드시 확인하세요.',
  items:[
    ['수식이 교과서와 같은가','표기·기호·괄호를 눈으로 대조합니다. 한 글자만 달라도 학생이 혼란스러워합니다.'],
    ['극단값에서 무너지지 않는가','슬라이더를 최소·최대로. 0으로 나누거나 음수 확률이 나오지 않는지 확인합니다.'],
    ['정답 확인 기능이 맞게 도나','일부러 틀린 값을 넣어 “실패”가 제대로 뜨는지 봅니다.'],
    ['휴대폰에서 열리는가','글씨 잘림·버튼 겹침을 확인합니다. 학생 절반은 휴대폰으로 엽니다.'],
    ['외부 연결이 남아 있지 않은가','CDN·이미지 링크가 있으면 와이파이가 끊긴 교실에서 그대로 죽습니다.']
  ],
  foot:'다섯 가지를 통과해야 “수업에 쓸 수 있는 자료”입니다. 이 점검표를 그대로 인쇄해 쓰십시오.',
  note:'이 슬라이드는 참가자가 학교로 가져가는 체크리스트입니다. 사진을 찍게 하세요.'
});



/* ---- 2교시 보강 ② : 도구 선택 · 프롬프트 원칙 · 접근성 · 산출물 ---- */

slideTable({
  kicker:'도구 선택', title:'어떤 생성형 AI를 써도 됩니다 — 다만 차이는 있습니다', accent:C.orange,
  headRow:['확인할 점', '왜 중요한가', '오늘 실습에서는'],
  colW:[2.80, 4.60, 3.70],
  rows:[
    ['코드를 통째로 주는가','부분 수정본을 받으면 붙여 넣다 망가집니다','“전체 코드를 다시 줘”로 요청'],
    ['긴 대화를 기억하는가','7라운드 내내 앞의 내용을 유지해야 합니다','한 대화창에서 끝까지 진행'],
    ['한국어 지시를 잘 따르는가','수학 용어를 정확히 알아들어야 합니다','식은 교과서 표기로 그대로'],
    ['학교에서 접속되는가','차단되면 수업에 못 씁니다','탭②는 접속 없이도 동작합니다'],
    ['학생 계정이 필요한가','연령 제한이 있는 서비스가 많습니다','학생 활동은 교사 시연 위주로']
  ],
  foot:'네 번째와 다섯 번째는 학교 상황에 따라 다릅니다 — 미리 확인해 두십시오.',
  note:'특정 서비스를 권하지 않습니다. 판단 기준만 제시하는 것이 안전합니다.'
});

slideBullets({
  kicker:'프롬프트 원칙', title:'수학 자료를 만들 때의 다섯 가지 원칙', accent:C.orange,
  lead:'“좋은 프롬프트”는 길고 화려한 것이 아니라 검증 가능한 것입니다.',
  items:[
    ['한 번에 하나만','조작·시각화·판정을 한꺼번에 시키면 반드시 하나가 빠집니다.'],
    ['식은 교과서 표기 그대로','y = a(x−p)² + q 처럼 우리 교육과정 표기로 쓰면 그대로 나옵니다.'],
    ['수치 기준을 못 박는다','“적당히”가 아니라 “오차 5% 이내”, “소수 둘째 자리까지”로 씁니다.'],
    ['금지 조건을 함께 준다','“외부 라이브러리 금지”, “파일 하나로” — 이 두 줄이 배포 가능성을 지킵니다.'],
    ['검증 방법을 미리 정한다','손계산한 값 하나를 넣어 같은 답이 나오는지 확인합니다.']
  ],
  foot:'다섯 번째가 핵심입니다 — 검산할 수 없는 자료는 수업에 쓰지 마십시오.',
  note:'“프롬프트 잘 쓰는 법”을 묻는 질문에 대한 답입니다. 화려함이 아니라 검증 가능성.'
});

slideCards({
  kicker:'학생 안내문', title:'ROUND 7 의 안내문 세 줄 — 이렇게 씁니다', accent:C.green,
  cols:3, h:2.44,
  cards:[
    ['1줄 · 무엇을 하는지',
     '“위성 개수를 바꿔 가며 내 위치가 어떻게 정해지는지 확인해 봅시다.”\n\n동사로 끝내십시오. 명사로 끝나면 학생이 무엇을 할지 모릅니다.', C.blue],
    ['2줄 · 무엇을 보아야 하는지',
     '“원이 몇 개일 때 한 점으로 정해지는지 세어 보세요.”\n\n관찰 대상을 구체적으로 지정합니다.', C.green],
    ['3줄 · 무엇을 적어야 하는지',
     '“왜 두 개로는 부족한지 한 문장으로 적어 보세요.”\n\n산출물을 명시해야 활동이 기록으로 남습니다.', C.orange]
  ],
  foot:'세 줄이면 충분합니다 — 안내문이 길면 학생은 읽지 않습니다.',
  note:'실제로 학생용 자료를 만들 때 가장 많이 실수하는 부분입니다.'
});

slideBullets({
  kicker:'접근성', title:'모든 학생이 볼 수 있게 — 네 가지 점검', accent:C.deep,
  items:[
    ['글씨 크기','휴대폰에서 16px 이상. 작으면 뒷자리 학생이 아예 읽지 못합니다.'],
    ['색만으로 구분하지 않기','색약 학생을 위해 모양이나 이름표를 함께 씁니다 — 빨강·초록 조합은 특히 주의.'],
    ['대비','연한 회색 글씨는 프로젝터에서 사라집니다. 배경과 충분히 대비되게 하십시오.'],
    ['조작 대상 크기','손가락으로 누를 버튼은 충분히 크게. 슬라이더는 좌우 여백을 두십시오.']
  ],
  foot:'“빨간 곡선”이라고만 말하지 말고 “위쪽 굵은 곡선”처럼 함께 말하는 습관을 들이십시오.',
  note:'짧게 다루되 반드시 넣으세요. 실제 교실에서 문제가 되는 지점입니다.'
});

slideTable({
  kicker:'출처와 저작권', title:'자료에 데이터를 넣을 때 확인할 것', accent:C.red,
  headRow:['데이터 종류', '쓸 수 있나', '표시 방법'],
  colW:[3.00, 3.40, 4.70],
  rows:[
    ['교과서 예제 수치','수업 목적이면 가능','출처를 화면 하단에 한 줄'],
    ['공공데이터','대부분 가능 (이용허락 확인)','기관명과 자료명, 기준 연도'],
    ['뉴스 기사 수치','수치 인용은 가능, 전문 복제는 불가','언론사명과 보도 일자'],
    ['학생 실제 자료','이름·연락처는 절대 불가','가명 처리 후 “학급 조사 결과”로 표기'],
    ['AI가 만들어 낸 수치','수업에 쓰기 전 반드시 검증','“예시 데이터”임을 명시']
  ],
  foot:'마지막 줄이 새로운 문제입니다 — AI가 그럴듯하게 지어낸 수치를 사실처럼 쓰면 안 됩니다.',
  note:'AI 시대에 새로 생긴 유의사항입니다. 3교시 윤리 체크리스트와 이어집니다.'
});

slideTable({
  kicker:'산출물 예시', title:'2교시가 끝나면 손에 이것이 남습니다', accent:C.orange,
  headRow:['산출물', '형태', '어디에 쓰이는가'],
  colW:[3.00, 3.40, 4.70],
  rows:[
    ['손계산 표','스프레드시트 또는 종이','자료의 값이 맞는지 검산하는 기준'],
    ['프롬프트 기록','대화창 저장 또는 메모','다음 자료를 만들 때 그대로 재사용'],
    ['ROUND 5 수정 문장','메모 1~2줄','오늘 배운 것의 핵심 — 반드시 남기십시오'],
    ['학습자료 HTML','파일 1개','다음 주 수업에 그대로 배포'],
    ['학생 안내문 3줄','자료 안에 포함','활동지 1장의 머리말로도 사용']
  ],
  foot:'세 번째를 꼭 남기십시오 — 자료는 다시 만들 수 있지만 그때의 문장은 기억나지 않습니다.',
  note:'실습을 마무리하며 저장 여부를 함께 확인하세요.'
});

/* ---- 2교시 보강 : 조건부확률 · 프롬프트 · 실습 지원 · 점검 ---- */

slideCompare({
  kicker:'참고 · 조건부확률', title:'어른도 틀리는 문제 — 검사 결과를 믿어도 되나', accent:C.red,
  left:{ head:'직관이 말하는 것', color:C.red, rows:[
    ['상황','정확도 99% 인 검사에서 양성이 나왔습니다'],
    ['직관','“그러면 99% 확률로 병이 있는 것”'],
    ['빠뜨린 것','1000명 중 실제 환자가 몇 명인지 — 사전확률']
  ]},
  right:{ head:'표로 세어 보면', color:C.green, rows:[
    ['1000명 가정','환자 10명 · 정상 990명 (유병률 1%)'],
    ['양성 판정','환자 중 10명 · 정상 중 약 10명 → 합 20명'],
    ['실제 확률','10 ÷ 20 = 50% — 직관의 절반도 안 됩니다']
  ]},
  foot:'스팸 분류기도 같은 구조입니다. 단어 하나의 “정확도”보다 그 단어가 얼마나 흔한가가 중요합니다.',
  note:'이 예시 하나로 조건부확률 단원의 도입이 끝납니다. 학생에게도 그대로 쓰십시오.'
});

slideTable({
  kicker:'손계산 확장', title:'단어를 둘로 늘리면 — 곱해서 비교합니다', accent:C.orange,
  headRow:['', '스팸 100통 중', '정상 100통 중', '비(스팸/정상)'],
  colW:[3.20, 2.70, 2.70, 2.50],
  rows:[
    ['“무료” 포함','60통','5통','12배'],
    ['“클릭” 포함','40통','2통','20배'],
    ['둘 다 포함 (독립 가정)','0.6 × 0.4 = 0.24','0.05 × 0.02 = 0.001','240배'],
    ['판정','스팸일 가능성이 240배 → 스팸','—','—'],
    ['주의','실제로는 두 단어가 함께 나올 때가 많아 독립 가정은 과장됩니다','—','—']
  ],
  foot:'“독립이라고 치자”가 나이브 베이즈의 나이브(순진한)입니다 — 이 이름의 뜻을 학생에게 알려 주세요.',
  note:'마지막 줄이 중요합니다. 모형의 한계를 같이 말해야 비판적 사고가 됩니다.'
});

slideBullets({
  kicker:'스프레드시트 실습', title:'표 계산으로 먼저 확인하는 세 개의 수식', accent:C.orange,
  lead:'AI에게 넘기기 전에 값이 맞는지 표에서 확인합니다. 이 순서를 지키면 결과를 믿을 수 있습니다.',
  items:[
    ['① 단어별 비율','=스팸포함수/스팸전체  → 각 단어가 스팸에서 나타나는 비율'],
    ['② 우도비','=스팸비율/정상비율  → 이 단어가 스팸 쪽으로 얼마나 끌어당기는가'],
    ['③ 전체 판정','=PRODUCT(우도비 범위)  → 1보다 크면 스팸 쪽, 작으면 정상 쪽'],
    ['확인','단어를 하나 지웠을 때 판정이 뒤집히는 경계를 찾아 적어 두세요.'],
    ['다음 단계','이 표의 논리를 그대로 말로 옮기면 그것이 ROUND 2 프롬프트가 됩니다.']
  ],
  foot:'표에서 맞은 값이 화면에서 다르게 나오면, 틀린 것은 표가 아니라 AI가 만든 코드입니다.',
  note:'“검산할 수 있는 상태로 만들고 AI에게 시킨다” — 오늘 연수에서 가장 실용적인 원칙입니다.'
});

slideTable({
  kicker:'프롬프트 카드 ①', title:'그대로 읽어도 되는 문장 — 1~4라운드', accent:C.orange,
  headRow:['라운드', '이대로 말하십시오'],
  colW:[2.20, 8.90],
  rows:[
    ['ROUND 1','“HTML 파일 하나로 만들어 줘. 외부 라이브러리는 쓰지 마. 지금은 제목과 빈 화면만.”'],
    ['ROUND 2','“조건부확률로 스팸을 판정할 거야. P(스팸|단어) = P(단어|스팸)P(스팸)/P(단어) 를 쓰고, 값은 내가 준 표를 그대로 넣어 줘.”'],
    ['ROUND 3','“학생이 단어를 체크박스로 켜고 끌 수 있게 해 줘. 체크할 때마다 판정이 바로 다시 계산돼야 해.”'],
    ['ROUND 4','“판정 결과와 각 단어의 기여도를 막대로 그려 줘. 스팸이면 붉은색, 정상이면 파란색.”']
  ],
  foot:'한 라운드에 한 가지만 요청합니다. 두 개를 한꺼번에 시키면 반드시 하나가 빠집니다.',
  note:'인쇄해서 책상에 두면 실습 속도가 눈에 띄게 빨라집니다.'
});

slideTable({
  kicker:'프롬프트 카드 ②', title:'그대로 읽어도 되는 문장 — 5~7라운드', accent:C.orange,
  headRow:['라운드', '이대로 말하십시오'],
  colW:[2.20, 8.90],
  rows:[
    ['ROUND 5','“(화면에서 본 증상) + (수학적으로 무엇이 틀렸는지) + (어떻게 고쳐야 하는지)” 세 칸을 채워 말합니다.'],
    ['ROUND 6','“정답을 맞히면 ‘정확도 몇 %’ 로 알려 주고, 3번 이상 맞히면 축하 문구를 띄워 줘.”'],
    ['ROUND 7','“휴대폰에서도 보이게 해 줘. 맨 위에 학습 목표 한 줄과 학생 안내문 세 줄을 넣어 줘.”'],
    ['공통','“설명은 하지 말고 전체 코드를 다시 줘.” — 부분 수정본을 받으면 붙여 넣다 망가집니다.']
  ],
  foot:'마지막 줄을 꼭 기억하십시오. 오늘 실습에서 가장 흔한 사고가 “부분 코드 붙여넣기”입니다.',
  note:'전체 코드를 다시 받는 습관을 들이면 실패율이 크게 떨어집니다.'
});

slideCards({
  kicker:'실습 지원 ①', title:'AI가 엉뚱한 답을 줄 때 — 세 가지 대처', accent:C.red,
  cols:3, h:2.44,
  cards:[
    ['① 너무 많이 시켰다',
     '한 번에 조작·시각화·판정을 다 요구하면 일부가 빠집니다.\n\n→ 마지막 요청을 쪼개어 하나씩 다시 말하십시오.', C.red],
    ['② 화면 기준이 아니라 느낌으로 말했다',
     '“이상해요”, “좀 더 잘” 은 반영되지 않습니다.\n\n→ 어디서 · 무엇이 · 어떻게 되어야 하는지 세 칸으로 바꿔 말하십시오.', C.orange],
    ['③ 앞의 코드를 잃어버렸다',
     '부분 수정본을 붙이다 구조가 깨진 경우입니다.\n\n→ “전체 코드를 다시 줘”로 되돌리고, 잘 되던 시점의 파일로 복구하십시오.', C.deep]
  ],
  foot:'세 가지 모두 “다시 말하면” 해결됩니다. 처음부터 다시 만들 필요는 없습니다.',
  note:'실습 중 손이 올라가면 대부분 이 셋 중 하나입니다. 강사가 순회하며 이 슬라이드를 가리키면 됩니다.'
});

slideBullets({
  kicker:'실습 지원 ②', title:'코드를 읽지 않고 구조만 보는 법', accent:C.deep,
  lead:'코드를 이해할 필요가 없습니다. 네 덩어리가 있는지만 눈으로 확인하면 됩니다.',
  items:[
    ['<input> 이 보이면','학생이 만질 것이 있다는 뜻입니다 — 입력 블록'],
    ['function 안에 식이 보이면','계산이 들어 있다는 뜻입니다 — 계산 블록. 식이 내가 준 것과 같은지만 봅니다'],
    ['<canvas> 또는 그리기 문장이 보이면','화면에 그린다는 뜻입니다 — 시각화 블록'],
    ['“정답”, “정확도”, 색 이름이 보이면','판정이 있다는 뜻입니다 — 피드백 블록'],
    ['네 덩어리가 다 있으면 완성','없는 것이 있으면 그 블록만 다시 요청하십시오.']
  ],
  foot:'1교시의 4블록 해체가 여기서 쓰입니다 — 만들 때도, 검사할 때도 같은 틀입니다.',
  note:'“코드를 못 읽어서 불안하다”는 분께 이 슬라이드가 답입니다.'
});

slideTable({
  kicker:'결함 총정리', title:'ROUND 4 에 심어 둔 결함 다섯 가지와 고치는 말', accent:C.red,
  headRow:['자료', '화면에서 보이는 증상', '이렇게 말하면 고쳐집니다'],
  colW:[2.40, 4.40, 4.30],
  rows:[
    ['급수의 부분합','조화급수인데 “수렴합니다”라고 뜬다','“y축을 6으로 고정하고 판정을 급수 종류로 해 줘”'],
    ['테일러 근사','차수를 올릴수록 곡선이 화면 밖으로 튄다','“계수의 분모는 k 가 아니라 계승 k! 이야”'],
    ['회전체와 원판','부피가 정확값의 4배로 나온다','“원판의 반지름은 f(x) 자체야. 지름을 쓰지 마”'],
    ['y = x 대칭','역함수 포물선이 위아래로 다 그려진다','“원함수 치역이 y ≥ 1 이니 역함수 정의역을 x ≥ 1 로 제한해 줘”'],
    ['대푯값과 이상치','한 명 때문에 중앙값까지 크게 흔들린다','“평균과 중앙값을 함께 표시하고 이상치를 색으로 구분해 줘”']
  ],
  foot:'다섯 결함 모두 원인이 수학 개념 하나였습니다 — 코드를 몰라도 고칠 수 있는 이유입니다.',
  note:'표를 읽지 말고 “전부 수학 개념 문제였다”는 결론만 강조하세요.'
});

slideCards({
  kicker:'실습 지원 ③', title:'속도가 다른 분들을 위한 두 갈래', accent:C.deep,
  cols:2, h:2.62,
  cards:[
    ['빨리 끝내신 분 — 심화 세 가지',
     '① ROUND 6 의 판정 기준을 학생 수준별로 두 단계 만들기\n\n② 같은 자료를 다른 단원 데이터로 갈아끼우기 (예: 스팸 → 뉴스 분류)\n\n③ 모둠 튜터로 옆자리를 지원하기 — 설명해 보면 가장 깊이 남습니다', C.green],
    ['시간이 부족한 분 — 대체 경로',
     '① 7라운드를 다 돌지 말고 ROUND 4·5 만 해 보십시오 — 오늘의 핵심은 5라운드입니다\n\n② 완성본을 그대로 받아 제목과 데이터만 바꾸십시오\n\n③ 3교시 지도안·평가 설계는 완성본 기준으로 진행하면 됩니다', C.orange]
  ],
  foot:'“다 못 만들었다”가 실패가 아닙니다 — 오늘 가져갈 것은 절차이지 완성품이 아닙니다.',
  note:'실습 중반에 띄우세요. 뒤처진 분들의 부담을 덜어 주는 것이 완주율을 높입니다.'
});

slideBullets({
  kicker:'배포 준비', title:'학생에게 내보내기 전 다섯 가지 확인', accent:C.green,
  items:[
    ['휴대폰에서 열어 본다','글씨가 잘리거나 버튼이 겹치지 않는지 — ROUND 7 의 목적입니다.'],
    ['값을 극단으로 넣어 본다','0, 음수, 아주 큰 수를 넣었을 때 화면이 깨지지 않는지 확인합니다.'],
    ['정답을 일부러 틀려 본다','틀렸을 때 안내가 학생에게 상처를 주지 않는 문구인지 봅니다.'],
    ['개인정보가 없는지 본다','실제 학생 이름·성적·연락처가 예시 데이터에 들어가 있지 않은지 확인합니다.'],
    ['파일 하나로 열리는지 본다','다른 폴더에 옮겨 더블클릭해 보십시오. 열리면 배포 준비가 끝난 것입니다.']
  ],
  foot:'다섯 가지를 통과하면 QR 하나로 학급 전체에 배포할 수 있습니다.',
  note:'네 번째 항목은 3교시 윤리 체크리스트와 이어집니다. 여기서 미리 한 번 짚어 주세요.'
});

slideTable({
  kicker:'자주 나오는 질문', title:'실습 중 가장 많이 받는 다섯 가지', accent:C.deep,
  headRow:['질문', '답'],
  colW:[4.10, 7.00],
  rows:[
    ['어떤 AI를 써야 하나요?','무엇이든 됩니다. 오늘 실습은 접속이 안 돼도 그대로 진행되도록 만들어 두었습니다.'],
    ['만든 자료가 사라지면요?','라운드마다 저장하십시오. 모음집은 새로고침하면 사라지니 반드시 내려받으세요.'],
    ['학생에게 AI를 쓰게 해도 되나요?','됩니다. 단, 프롬프트 기록을 남기게 하고 결과를 검증하게 하십시오 — 그것이 평가 자료가 됩니다.'],
    ['수업 시간이 부족한데요?','15분 도입 활동으로 쓰십시오. 자료 하나가 수업 전체를 바꾸지 않아도 됩니다.'],
    ['우리 학교는 기기가 부족합니다','2인 1대로 충분합니다. 오히려 대화가 늘어 발견이 빨라집니다.']
  ],
  foot:'같은 질문이 반복되면 이 슬라이드로 돌아오십시오 — 개별 응답보다 전체 공유가 빠릅니다.',
  note:'강사용 슬라이드입니다. 질문이 없으면 빠르게 넘겨도 됩니다.'
});

slideCompare({
  kicker:'학생에게 시킬 때', title:'교사가 만드는 것과 학생이 만드는 것은 다릅니다', accent:C.purple,
  left:{ head:'교사가 만들 때', color:C.deep, rows:[
    ['목표','수업에 쓸 도구를 얻는 것'],
    ['평가 대상','없음 — 결과물만 쓰면 됩니다'],
    ['시간','한 시간 안에 완성']
  ]},
  right:{ head:'학생이 만들 때', color:C.purple, rows:[
    ['목표','수학 개념을 설명할 수 있게 되는 것'],
    ['평가 대상','프롬프트 기록 · 결함을 찾아 고친 과정 · 최종 설명'],
    ['시간','2~3차시 + 과제. 완성보다 과정을 봅니다']
  ]},
  foot:'학생 활동에서는 “잘 만든 것”이 아니라 “왜 그렇게 고쳤는지 말할 수 있는 것”을 평가하십시오.',
  note:'3교시 수행평가 설계의 복선입니다. 프롬프트 기록이 평가 자료라는 점을 강조하세요.'
});

slideBullets({
  kicker:'평가로 잇기', title:'프롬프트 기록을 평가 자료로 쓰는 네 가지 방법', accent:C.purple,
  items:[
    ['횟수가 아니라 변화를 본다','몇 번 물었는지가 아니라, 요청이 구체적으로 바뀌었는지를 봅니다.'],
    ['결함을 찾은 지점을 본다','스스로 이상한 점을 발견했는지, 아니면 알려 줘야 했는지가 큰 차이입니다.'],
    ['수학 용어 사용을 본다','“이상해요”에서 “정의역을 제한해야 해요”로 바뀌면 개념을 이해한 것입니다.'],
    ['최종 설명을 본다','완성된 자료를 3분간 설명하게 하십시오 — 여기서 이해도가 드러납니다.']
  ],
  foot:'네 가지가 그대로 루브릭의 네 평가요소가 됩니다 — 3교시에서 이어서 다룹니다.',
  note:'“AI를 쓰면 평가를 못 한다”는 우려에 대한 정면 답입니다.'
});

slideTable({
  kicker:'2교시 점검', title:'여기까지 하고 다음으로 넘어갑니다', accent:C.orange,
  headRow:['확인할 것', '되었나요?', '안 되었으면'],
  colW:[5.20, 2.30, 3.60],
  rows:[
    ['손계산 표로 값을 확인했다','☐','스프레드시트 수식 세 개를 다시 보세요'],
    ['ROUND 4 까지 화면이 그려졌다','☐','완성본을 받아 그 지점부터 시작하세요'],
    ['ROUND 4 결과에서 결함을 찾았다','☐','결함 총정리 표에서 내 자료를 찾아보세요'],
    ['세 칸 문장 틀로 수정을 요청했다','☐','오늘의 핵심입니다 — 쉬는 시간에 꼭 해 보세요'],
    ['만든 파일을 저장했다','☐','지금 저장하세요. 3교시의 재료입니다']
  ],
  foot:'세 번째와 네 번째가 오늘 연수의 핵심입니다 — 나머지가 비어도 이 둘은 채우고 가십시오.',
  note:'쉬는 시간 직전에 띄웁니다. 4번을 못 한 분은 강사가 직접 옆에서 한 번 같이 해 주세요.'
});

slideQuote({
  kicker:'2교시 정리',
  big:'AI는 한 번에 맞히지 않고,\n우리는 그것을 고칠 수 있습니다.',
  sub:'손계산으로 검산할 수 있는 상태를 먼저 만들고, 한 라운드에 한 가지씩 요청했으며,\n결함을 화면 기준으로 설명해 고쳤습니다 — 이 절차는 어떤 단원에도 그대로 적용됩니다.',
  accent:C.orange, img:'robot-gear.png',
  note:'2교시의 결론입니다. 짧게 말하고 쉬는 시간으로 넘어가세요.'
});

/* =====================================================================
   ■ 3교시 [적용·나눔] 확산 시뮬레이터 · 지도안 · 평가 · 공유
   ===================================================================== */
divider({
  num:'3', time:'17:00 – 18:00', kind:'적용 · 나눔', accent:C.green,
  title:'“왜 순식간에 퍼질까?” — 내 단원으로\n갈아끼우고 공유·성찰하기',
  sub:'만든 자료를 담당 단원으로 리모델링하고, 수업 지도안 · 평가 루브릭 · 학습지를 한 세트로 묶습니다.\n마지막은 갤러리 워크와 AI 활용 윤리 체크리스트입니다.',
  img:'robot-chip.png',
  note:'여기서 “활동은 좋은데 평가를 못 해서 못 쓴다”는 현실적 장벽을 해결합니다.'
});

slideQuote({
  time:'17:00–17:04', kicker:'STEP 1 · 실생활 맥락',
  big:'“왜 순식간에 퍼질까?”\n— 소문, 유행, 그리고 감염',
  sub:'처음에는 아무 일도 없다가 갑자기 폭발하고, 어느 순간 더는 늘지 않습니다.\n지수 모형은 앞부분만 설명하고, 뒷부분을 설명하려면 로지스틱이 필요합니다.',
  accent:C.green,
  note:'“왜 끝없이 늘지 않을까?”가 로지스틱으로 넘어가는 결정적 발문입니다.'
});

slideCompare({
  time:'17:04–17:08', kicker:'STEP 2 · 수학 원리', title:'지수 모형이 설명하지 못하는 것',
  accent:C.green,
  left:{ head:'지수 모형  N = N₀·rᵗ', color:C.deep, rows:[
    ['가정','만나는 사람은 항상 새로운 사람이다'],
    ['맞는 구간','퍼지기 시작하는 초반에는 잘 맞습니다'],
    ['무너지는 지점','전체 인원을 넘어서까지 늘어납니다 — 반 학생이 40명인데 예측이 300명']
  ]},
  right:{ head:'로지스틱 모형  N′ = rN(1 − N/K)', color:C.green, rows:[
    ['가정','이미 아는 사람이 늘수록 새로 만날 사람이 줄어든다'],
    ['모양','S자 곡선. 처음엔 지수처럼, 나중엔 K 에 수렴합니다'],
    ['수업 연결','K(수용 한계)를 학생이 직접 정하게 하면 모형이 “가정 위에 있다”는 것을 스스로 말합니다']
  ]},
  foot:'같은 데이터, 다른 가정 — 모형을 고르는 일이 곧 수학적 판단입니다.',
  note:'반 인원을 K 로 두고 시뮬레이션하면 학생이 곧바로 이해합니다.'
});

slideActivity({
  no:'⑥', time:'17:08–17:18', title:'내 단원으로 리모델링하기', accent:C.green, min:'10분',
  goal:'확산 시뮬레이터를 담당 단원 자료로 갈아끼운다\n— 데이터 · 변수 · 난이도 세 축만 바꿉니다',
  rows:[
    ['① 데이터 교체','예시 숫자를 우리 학교·우리 반의 실제 값으로 바꿉니다. 학생이 자기 데이터를 볼 때 몰입도가 달라집니다.'],
    ['② 변수 교체','감염자 수 → 조회 수, 중고 거래 가격, 관중 수 등 단원에 맞는 양으로 이름과 단위를 바꿉니다.'],
    ['③ 난이도 조절','조작 요소를 줄이거나(하위) 판정 기준을 좁히고 서술 문항을 붙입니다(상위).'],
    ['확인 질문','바꾼 뒤에도 원래 수학 원리가 그대로 남아 있는가? 이름만 바뀐 것은 아닌가?']
  ],
  note:'“세 축만 바꾼다”가 요점입니다. 처음부터 새로 만들려는 참가자를 말려 주세요.'
});

slideFlow({
  time:'17:18–17:22', kicker:'★ 자료 구성 과정', title:'하나의 자료가 만들어지는 여섯 걸음',
  accent:C.green,
  steps:[
    ['질문 고르기','학생이 이미 겪은 일에서 “왜 그럴까?” 한 줄을 뽑습니다.', '→ 도입 발문 1줄'],
    ['원리 확정','그 질문에 답하는 데 필요한 식 하나를 교과서 표기로 적습니다.', '→ 성취기준 1개'],
    ['4블록 설계','입력·계산·시각화·피드백 네 칸을 종이에 먼저 채웁니다.', '→ 설계 메모 1장'],
    ['7라운드 제작','AI와 7번 주고받아 만들고, ROUND 5에서 결함을 고칩니다.', '→ HTML 1개'],
    ['수업에 배치','도입·전개·정리 중 어디에 몇 분 넣을지 지도안에 적습니다.', '→ 지도안 1장'],
    ['평가로 잇기','판정 기준을 루브릭으로 옮기고 활동지·윤리 점검을 붙입니다.', '→ 루브릭·활동지']
  ],
  foot:'3~4걸음은 2교시에 이미 했습니다. 지금부터는 5·6걸음 — 수업과 평가로 잇는 자리입니다.',
  note:'이 여섯 걸음이 계획서가 말하는 “재사용 가능한 설계 절차”입니다. 사진을 찍게 하세요.'
});

slideBullets({
  time:'17:22–17:26', kicker:'★ 수업 지도안', title:'교수·학습 활동 칸 쓰는 법 — 세 덩어리로',
  accent:C.purple,
  lead:'지도안에서 실제로 어려운 칸은 하나뿐입니다. 도입·전개·정리를 이렇게 나눕니다.',
  items:[
    ['도입 (5분) — 질문을 세운다','실측·사진·실물로 시작합니다. 자료는 아직 켜지 않습니다. “오늘 무엇을 알아낼 것인가”만 남기세요.'],
    ['전개 1 (10분) — 조작하고 관찰한다','자료를 켜고 미션을 줍니다. 관찰한 것을 반드시 표나 문장으로 “기록”하게 합니다.'],
    ['전개 2 (12분) — 손으로 확인한다','화면에서 본 것을 식으로 확인합니다. 이 단계를 빼면 자료만 만지고 수학이 남지 않습니다.'],
    ['전개 3 (10분) — 조건을 바꿔 본다','값이나 가정을 바꿔 결과가 어떻게 달라지는지 예측하고 확인합니다.'],
    ['정리 (8분) — 말로 설명하게 한다','모둠별로 한 문장 진술을 만들고 발표합니다. 이 진술이 평가의 근거가 됩니다.']
  ],
  foot:'“조작 → 기록 → 손계산 → 변형 → 진술” 다섯 동작이면 어떤 단원이든 45분이 짜입니다.',
  note:'전개 2(손으로 확인)를 빠뜨리는 지도안이 가장 많습니다. 여기를 강조하세요.'
});

slideTable({
  kicker:'지도안 견본 ②', title:'스팸 문자 분류기 — 확률과 통계 조건부확률 (1차시)',
  accent:C.purple,
  headRow:['단계','시간','교수·학습 활동','자료 · 유의점'],
  colW:[1.2, 0.9, 6.0, 3.0],
  rows:[
    ['도입','5분','실제 스팸 문자 3건 제시 → “사람은 무엇을 보고 판단하나” 단서 나열','문자 캡처(개인정보 가림)'],
    ['전개 1','10분','100통 표를 손으로 채우고 P(스팸|“무료”) 를 분수로 구하기','학습지 1쪽 · 개인 활동'],
    ['전개 2','12분','표에서 읽은 값을 기호로 옮겨 베이즈 정리 유도 → 표와 식이 같은 답인지 확인','판서 · 짝 설명하기'],
    ['전개 3','10분','웹자료에서 단어 가중치를 조절해 판정이 뒤집히는 경계값 찾기','웹자료 · 모둠별 기록'],
    ['정리','8분','“가중치를 조금 바꿨는데 결과가 뒤집혔다면 자료의 문제인가 모형의 문제인가” 토론','서술형 1문항 · 제출']
  ],
  rowH:0.60,
  foot:'전개 3의 “경계값 찾기”가 그대로 수행평가 문항이 됩니다.',
  note:'참가자에게 이 견본의 칸만 자기 단원으로 바꿔 보라고 하면 활동 ⑦이 빨리 끝납니다.'
});

slideActivity({
  no:'⑦', time:'17:26–17:34', title:'내 수업 지도안 초안 쓰기', accent:C.purple, min:'8분',
  goal:'2교시에 만든 자료를 넣어\n도입·전개·정리를 분 단위로 적는다',
  rows:[
    ['채울 칸','단원/차시 · 성취기준 1개 · 학습 목표 1줄 · 교수·학습 활동(45분) · 자료·유의점'],
    ['시간 배분 기준','도입 5 · 전개 32 · 정리 8. 자료를 켜는 시간은 전개 안에서 최대 20분을 넘기지 마세요.'],
    ['반드시 넣을 것','“손으로 확인하는” 단계 한 번. 화면 조작만으로 끝나면 수학이 남지 않습니다.'],
    ['남는 것','지도안 초안 1장. 학교에서 결재용 양식에 옮기면 그대로 쓸 수 있습니다.']
  ],
  note:'완벽한 지도안을 쓰려다 아무도 못 끝냅니다. “전개 칸만 채우세요”라고 못 박으세요.'
});

slideBullets({
  time:'17:34–17:38', kicker:'평가 설계', title:'만든 자료를 수행평가로 바꾸는 다섯 단계',
  accent:C.orange,
  items:[
    ['① 성취기준 고르기','내 자료가 실제로 평가하는 것 하나만. 두 개 이상 고르면 루브릭이 흐려집니다.'],
    ['② 평가 장면 정하기','조작 결과를 “설명하게” 할 것인가, “예측하게” 할 것인가, “설계하게” 할 것인가.'],
    ['③ 루브릭 쓰기','ROUND 6에서 정한 판정 기준이 그대로 “상” 기준입니다. 새로 만들 필요가 없습니다.'],
    ['④ 학생 활동지 만들기','탐구 과정을 단계별로 기록하게 합니다. 손글씨 답안판으로 풀이까지 저장됩니다.'],
    ['⑤ 세특 문장 준비','활동에서 관찰할 수 있는 행동을 미리 문장으로 적어 둡니다.']
  ],
  foot:'③이 핵심입니다 — 자료를 만들 때 이미 루브릭의 절반을 쓴 것입니다.',
  note:'참가자 대부분이 ③에서 “아, 그러네”라고 반응합니다. 이 지점을 놓치지 마세요.'
});

slideCards({
  kicker:'평가 장면', title:'무엇을 시키느냐에 따라 평가가 달라집니다',
  accent:C.orange, cols:3, h:2.25,
  cards:[
    ['설명하게 하기','조작 결과가 왜 그런지 수학 용어로 진술.\n\n예) “세 번째 원이 한 일을 한 문장으로 설명하시오.”\n\n· 난이도 보통 · 채점 쉬움', C.blue],
    ['예측하게 하기','조건을 바꾸면 어떻게 될지 먼저 말하고 확인.\n\n예) “가중치를 2배로 하면 판정이 뒤집힐까? 근거와 함께.”\n\n· 난이도 상 · 오개념이 드러남', C.orange],
    ['설계하게 하기','조건을 만족하는 상황을 학생이 만든다.\n\n예) “오차가 가장 작아지는 위성 배치를 제안하시오.”\n\n· 난이도 최상 · 변별력 큼', C.green]
  ],
  foot:'세 장면을 한 평가에 다 넣지 마세요. 하나를 골라 깊게 묻는 편이 훨씬 낫습니다.',
  note:'“예측 → 확인” 구조가 오개념을 가장 잘 드러냅니다. 추천해 주세요.'
});

slideTable({
  time:'17:38–17:42', kicker:'루브릭', title:'채점기준표 견본 — 활동 판정 기준을 그대로 옮깁니다',
  accent:C.orange,
  headRow:['수준','판정 기준 (자료의 숫자를 그대로)','서술 · 설명'],
  colW:[1.4, 4.6, 5.0],
  rows:[
    ['상','오차 5% 이내로 맞춘다','왜 그 값이 나오는지 수학 용어로 정확히 설명하고, 조건을 바꿨을 때의 변화도 예측한다'],
    ['중','오차 15% 이내로 맞춘다','결과는 맞았으나 설명이 직관에 머물고, 조건 변화의 이유를 부분적으로만 말한다'],
    ['하','조작은 했으나 기준에 못 미친다','결과를 읽을 수 있으나 수학적 근거를 제시하지 못한다']
  ],
  rowH:0.72,
  foot:'“상” 칸의 숫자는 여러분이 ROUND 6에서 직접 정한 그 숫자입니다.',
  note:'루브릭을 3줄로 제한하는 것이 요령입니다. 5단계로 나누면 아무도 못 끝냅니다.'
});

slideBullets({
  kicker:'배점 주의', title:'수행평가 배점에서 자주 나는 실수',
  accent:C.red,
  items:[
    ['기본점수는 더하는 점수가 아닙니다','기본점수 8점, 만점 20점이면 채점 결과가 아무리 낮아도 8점 아래로 내려가지 않는다는 뜻입니다. 채점 20점에 8점을 더해 28점이 되는 것이 아닙니다.'],
    ['미응시 처리 기준을 미리 적어 둡니다','결시·전출입 학생의 처리를 평가 계획에 명시해야 나중에 문제가 없습니다.'],
    ['채점 근거를 학생 산출물에 남깁니다','손글씨 답안판으로 저장한 파일이 그대로 근거 자료가 됩니다.'],
    ['성취기준 하나에 배점 하나','한 문항이 두 성취기준을 걸치면 재채점 요구가 들어왔을 때 방어가 어렵습니다.']
  ],
  foot:'평가 계획 결재 전에 이 네 가지만 확인해도 대부분의 민원이 사라집니다.',
  note:'실제 수행평가 양식에서 자주 틀리는 부분입니다. 짧고 단호하게 짚어 주세요.'
});

slideCards({
  time:'17:42–17:46', kicker:'학생 활동지', title:'탐구 과정을 그대로 기록하게 하는 네 장',
  accent:C.purple, cols:4, h:2.3,
  cards:[
    ['1장 · 질문 세우기','실측하거나 관찰한 것을 적고, 오늘 알아낼 질문을 자기 말로 씁니다.', C.blue],
    ['2장 · 조작하고 기록','미션별로 무엇을 만졌고 무엇이 바뀌었는지 표에 기록합니다.', C.deep],
    ['3장 · 손으로 확인','화면에서 본 것을 식으로 유도합니다. 손글씨 답안판에 풀이를 그대로 씁니다.', C.green],
    ['4장 · 설명과 성찰','한 문장 진술 + AI 활용 윤리 체크리스트 4항목을 채웁니다.', C.orange]
  ],
  foot:'네 장 모두 한 파일로 저장해 과제로 제출할 수 있습니다 — 채점 근거가 자동으로 남습니다.',
  note:'“하나씩 저장”이 아니라 “전체 단계 한 번에 저장”이라는 점을 시연으로 보여 주세요.'
});

slideTable({
  kicker:'세특', title:'관찰한 행동을 문장으로 — 견본 세 가지',
  accent:C.purple,
  headRow:['관찰한 행동','세특 문장 예시'],
  colW:[4.4, 6.6],
  rows:[
    ['오차를 준 뒤 교점이 영역으로 번지는 것을 스스로 발견하고 설명함',
     '삼변측량 탐구에서 거리 오차가 위치 오차로 확대되는 과정을 관찰하고, 정확도 반경의 의미를 원의 방정식과 연결해 설명함.'],
    ['단어 가중치를 조절하며 판정이 뒤집히는 경계값을 찾아 기록함',
     '조건부확률 탐구에서 가중치 변화에 따른 판정의 민감도를 스스로 조사하여 경계값을 찾고, 모형의 가정이 결과에 미치는 영향을 논리적으로 진술함.'],
    ['지수 모형이 반 인원을 넘어서는 것을 지적하고 로지스틱을 제안함',
     '확산 모형 탐구에서 지수 모형의 한계를 수용 인원 관점에서 지적하고, 대안으로 로지스틱 모형을 제안하여 두 모형의 가정 차이를 비교 설명함.']
  ],
  rowH:0.92,
  foot:'“무엇을 했다”가 아니라 “무엇을 발견하고 어떻게 설명했다”로 씁니다.',
  note:'세특 문장은 활동 설계 단계에서 미리 정해 두면 학기 말이 훨씬 수월합니다.'
});

slideCompare({
  kicker:'실제 수행평가 2건', title:'이미 학교에서 시행한 사례를 그대로 씁니다',
  accent:C.green,
  left:{ head:'우리 동네 최적 입지 (도형의 방정식)', color:C.blue, rows:[
    ['상황','구글 지도 위에 후보지를 찍고 거리 조건을 만족하는 지점을 찾습니다'],
    ['수학','두 점에서 같은 거리 → 수직이등분선 · 원의 방정식 · 연립'],
    ['평가','선정 근거를 수학적으로 설명 · 조건을 바꾸면 답이 어떻게 달라지는지 논술']
  ]},
  right:{ head:'y = x 대칭의 발견 (역함수)', color:C.green, rows:[
    ['상황','여러 함수의 역함수를 직접 구하고 그래프를 겹쳐 봅니다'],
    ['수학','(a, b) ∈ f ⟺ (b, a) ∈ f⁻¹ · 정의역과 치역의 교환'],
    ['평가','공통점을 학생이 스스로 진술 · 정의역 제한의 이유를 설명']
  ]},
  foot:'두 건 모두 채점기준표 · 학생 활동지 · 교사 안내 자료가 자료실에 그대로 들어 있습니다.',
  note:'실물 문서를 내려받아 보여 주세요. “이걸 그냥 쓰셔도 됩니다”가 반응이 가장 좋습니다.'
});

slideBullets({
  time:'17:46–17:50', kicker:'갤러리 워크', title:'서로의 자료를 직접 조작합니다',
  accent:C.green,
  items:[
    ['자리 배치','한 모둠 4~5명. 각자 자기 화면을 열어 둡니다.'],
    ['호스트 4분','한 사람은 자리에 남아 설명, 나머지는 다른 자리로 이동해 직접 만져 봅니다.'],
    ['포스트잇 2장','잘된 점 1장 · 묻고 싶은 것 1장. 손으로 써서 그 자리에 붙입니다.'],
    ['교대','4분마다 호스트를 바꿉니다. 4회 돌면 전원이 한 번씩 설명하게 됩니다.'],
    ['금지 사항','“잘 만드셨네요”만 쓰지 않기. 어디가 왜 좋았는지 구체적으로 한 줄.']
  ],
  foot:'이 방식은 그대로 교실에서 학생 산출물 공유에 쓸 수 있습니다 — 오늘 겪은 것이 곧 수업 기법입니다.',
  note:'타이머를 띄우세요. 4분을 넘기면 순회가 무너집니다.'
});

slideActivity({
  no:'⑧', time:'17:50–17:55', title:'모음집에 올리고 공유 QR 받기', accent:C.green, min:'5분',
  goal:'내 HTML을 모음집에 올리고,\n전원의 산출물을 파일 하나로 묶어 배포한다',
  rows:[
    ['업로드','학년 · 과목 · 단원 · 주제를 적고 파일을 올립니다. 넷 다 채워야 나중에 검색이 됩니다.'],
    ['우수작 승격','모둠에서 하나를 뽑아 확장 카탈로그로 옮깁니다. 다음 연수의 재료가 됩니다.'],
    ['★ 반드시 내려받기','모음집은 새로고침하면 사라집니다. 마무리 전에 하나로 묶어 전원에게 배포하세요.'],
    ['학교로 가져가기','받은 파일 하나를 동교과 협의회에서 열어 보여 주면 됩니다. 설치도 계정도 필요 없습니다.']
  ],
  note:'★ 내려받기를 빠뜨리면 오늘 산출물이 전부 사라집니다. 반드시 소리 내어 확인하세요.'
});

slideCards({
  time:'17:55–17:58', kicker:'AI 활용 윤리', title:'학생과 함께 확인할 네 가지',
  accent:C.deep, cols:4, h:2.3,
  cards:[
    ['데이터 출처','이 자료의 숫자는 어디서 왔는가. 실측인가, 공공데이터인가, 만들어 낸 값인가.\n\n출처를 밝히는 것 자체가 통계 단원의 성취기준입니다.', C.blue],
    ['개인정보','학생의 실제 위치·성적·연락처를 넣지 않습니다.\n\n필요하면 가명·가상 데이터로 바꿔 씁니다.', C.red],
    ['AI의 한계','AI가 만든 코드에 결함이 있었다는 것을 오늘 직접 보았습니다.\n\n확인하지 않고 쓰지 않는다 — 학생에게도 같은 기준을 요구합니다.', C.orange],
    ['저작권 · 표절','AI 산출물을 학생 과제로 그대로 내지 않습니다.\n\n“무엇을 AI에게 시켰고 무엇을 내가 판단했는지” 기록하게 합니다.', C.green]
  ],
  foot:'이 네 가지는 학생 활동지 마지막 장에 그대로 실려 있습니다.',
  note:'“AI의 한계”는 오늘 ROUND 5에서 직접 겪은 일이라 설득력이 큽니다. 그 경험과 연결하세요.'
});

slideBullets({
  time:'17:58–18:00', kicker:'다음 걸음', title:'2학기에 실제로 해 볼 하나를 지금 고르세요',
  accent:C.green,
  lead:'세 단계 중 하나에 동그라미를 치고 나가시면 됩니다. 하나면 충분합니다.',
  items:[
    ['바로 — 다음 수업에 그대로','오늘 만든 자료를 다음 주 수업 도입 5분에 씁니다. 활동지 없이 화면만 띄워도 됩니다.'],
    ['심화 — 수행평가로','오늘 쓴 3줄 루브릭을 다듬어 2학기 수행평가 1건으로 편성합니다.'],
    ['프로젝트 — 학생이 만들게','학생이 직접 AI와 7라운드로 자기 자료를 만들게 합니다. 프롬프트 기록이 평가 자료가 됩니다.'],
    ['동교과 공유','받은 모음집 파일을 교과협의회에서 열어 보여 주세요. 설명이 필요 없습니다 — 그냥 눌러 보면 됩니다.']
  ],
  foot:'오늘 만든 것을 쓰지 않으면 3시간은 사라집니다. 날짜를 지금 적어 두세요.',
  note:'실제로 손을 들게 하세요. “바로 하실 분?” — 손이 올라가면 그 자리에서 날짜를 적게 합니다.'
});

slideCards({
  kicker:'강사 참고', title:'운영 안전장치 — 무엇이 잘못돼도 멈추지 않습니다',
  accent:C.mute, cols:3, h:1.72,
  cards:[
    ['단일 HTML 파일 원칙','설치·서버·로그인이 없습니다. 파일 하나면 어디서든 동일하게 열립니다.', C.blue],
    ['USB · 인쇄 병행 배포','완성본과 프롬프트 카드를 종이로도 나눕니다. 무연결을 전제로 설계했습니다.', C.green],
    ['필수 · 도전 과제 분리','리모델링까지가 필수, 7라운드 완주는 도전입니다. 빠른 분은 모둠 튜터로.', C.orange],
    ['모음집은 반드시 내려받기','새로고침하면 사라집니다. 마무리 전에 묶어서 전원 배포합니다.', C.red],
    ['AI가 끊겨도 진행','7라운드 실습과 자료·평가 설계는 인터넷 없이 그대로 동작합니다.', C.deep],
    ['2인 1조 대비','노트북이 부족해도 진행됩니다. 단, “만드는 사람”을 번갈아 맡게 하세요.', C.purple]
  ],
  note:'강사용 슬라이드입니다. 참가자에게는 빠르게 넘겨도 되지만 공동 강사와는 반드시 공유하세요.'
});



/* ---- 3교시 보강 ② : 평가 계획서 · 운영 · 배려 · 성찰 ---- */

slideTable({
  kicker:'평가 계획서', title:'학교 양식에 그대로 옮겨 적는 여섯 칸', accent:C.purple,
  headRow:['칸', '무엇을 적나', '오늘 만든 것에서 가져오면'],
  colW:[2.30, 4.30, 4.50],
  rows:[
    ['평가명','활동을 그대로 이름으로','“우리 동네 최적 입지 탐구”'],
    ['성취기준','코드와 원문','자료의 “교육과정 연결” 칸'],
    ['평가요소','관찰 가능한 행동 3개','표현 · 절차 · 해석'],
    ['평가방법','산출물 · 관찰 · 서술 중 선택','활동지 + 논술'],
    ['배점','요소별 배점과 기본점수','핵심 요소에 더 많이, 기본점수는 하한'],
    ['채점기준','상·중·하 문장','활동의 판정 기준을 그대로']
  ],
  foot:'여섯 칸 중 다섯 칸이 오늘 만든 것에서 그대로 나옵니다 — 새로 쓸 것은 평가명뿐입니다.',
  note:'이 표 한 장이 3교시의 실용적 결론입니다. 인쇄해 가시라고 권하세요.'
});

slideBullets({
  kicker:'운영 계획', title:'한 학기 수행평가 배분 — 무리하지 않는 선', accent:C.deep,
  items:[
    ['한 학기 2~3건이면 충분','많이 하면 채점에 밀려 피드백이 사라집니다. 피드백 없는 평가는 의미가 적습니다.'],
    ['한 건은 과정 중심으로','활동지와 조작 기록을 보는 평가를 최소 하나 넣으십시오.'],
    ['시기는 단원 중간에','단원이 끝난 뒤보다 중간에 하면 결과를 수업에 되돌릴 수 있습니다.'],
    ['채점은 일주일 안에','늦어지면 학생이 무엇을 했는지 잊습니다 — 피드백 효과가 사라집니다.'],
    ['기록은 그때그때','채점하며 세특 문장을 함께 적어 두면 학기말에 몰리지 않습니다.']
  ],
  foot:'마지막 항목이 가장 실용적입니다 — 채점과 기록을 한 번에 끝내십시오.',
  note:'경력이 짧은 선생님께 특히 도움이 되는 슬라이드입니다.'
});

slideCompare({
  kicker:'배려가 필요한 학생', title:'같은 과제, 다른 접근', accent:C.green,
  left:{ head:'조정이 필요한 경우', color:C.deep, rows:[
    ['기기 조작이 어려운 학생','짝과 함께 조작하되 기록은 각자 하게 합니다'],
    ['한국어가 서툰 학생','안내문에 그림과 숫자를 함께 넣고, 발문을 짧게 나눕니다'],
    ['읽기·쓰기가 어려운 학생','구술로 설명하게 하고 교사가 받아 적어 기록합니다']
  ]},
  right:{ head:'그래도 지킬 것', color:C.green, rows:[
    ['평가요소는 같게','조정하는 것은 방법이지 기준이 아닙니다'],
    ['기록을 남길 것','어떤 조정을 했는지 적어 두어야 공정성이 설명됩니다'],
    ['사전에 안내할 것','조정 방식을 미리 알려 주면 학생이 준비할 수 있습니다']
  ]},
  foot:'디지털 도구는 오히려 조정에 유리합니다 — 글씨 크기, 속도, 반복을 학생마다 다르게 할 수 있습니다.',
  note:'통합학급을 맡고 계신 선생님께 중요한 슬라이드입니다.'
});

slideBullets({
  kicker:'기록 관리', title:'이의신청에 대비하는 네 가지', accent:C.red,
  items:[
    ['채점기준을 사전 공개','과제를 낼 때 루브릭을 함께 줍니다 — 이것만으로 이의가 크게 줍니다.'],
    ['경계 사례 메모','애매했던 답안과 판단 근거를 그때 적어 둡니다.'],
    ['원본 보관','활동지와 산출물 파일을 학기말까지 보관하십시오.'],
    ['재채점 절차 안내','이의신청 방법과 기한을 미리 알려 주면 절차가 깔끔해집니다.']
  ],
  foot:'첫 번째가 가장 효과적입니다 — 기준을 미리 주면 학생은 그 기준을 향해 공부합니다.',
  note:'짧게 다루되 반드시 넣으세요. 현장에서 실제로 겪는 문제입니다.'
});

slideCards({
  kicker:'연계', title:'학교 자율시간 · 주제탐구로 넓히기', accent:C.purple,
  cols:3, h:2.44,
  cards:[
    ['학교 자율시간',
     '2022 개정으로 확보된 시간입니다.\n\n자료 하나를 3~4차시 프로젝트로 늘려 “우리 동네 수학 지도 만들기”로 운영할 수 있습니다.', C.blue],
    ['주제탐구 · 동아리',
     '확장 탐구의 “프로젝트” 단계가 그대로 주제가 됩니다.\n\n실제 데이터를 모으고 오차를 보고하는 활동은 보고서로 이어집니다.', C.green],
    ['교과 융합',
     '정보(알고리즘) · 과학(측정과 오차) · 사회(공간 분석)와 자연스럽게 이어집니다.\n\n같은 자료를 두 교과가 나눠 쓰면 준비 부담이 절반이 됩니다.', C.orange]
  ],
  foot:'세 번째가 현실적으로 가장 강력합니다 — 옆 교과 선생님과 자료 하나를 나눠 쓰십시오.',
  note:'“시간이 없다”는 문제를 구조로 푸는 방법입니다.'
});

slideBullets({
  kicker:'교사 성찰', title:'오늘 수업을 되돌아보는 다섯 문항', accent:C.deep,
  lead:'자료를 쓴 뒤 5분만 적어 두면 다음 학기에 그대로 개선됩니다.',
  items:[
    ['학생이 실제로 발견했는가','내가 먼저 말해 버린 지점은 없었는가?'],
    ['조작에 시간이 얼마나 들었는가','예상보다 오래 걸린 부분은 어디였는가?'],
    ['어떤 발문이 잘 통했는가','학생의 말을 끌어낸 문장 하나를 적어 둡니다.'],
    ['평가와 이어졌는가','활동에서 관찰한 것이 루브릭의 칸으로 옮겨졌는가?'],
    ['다음에 바꿀 것 하나','한 가지만 정하십시오 — 여러 개를 바꾸면 무엇이 효과였는지 모릅니다.']
  ],
  foot:'다섯 문항을 활동지 뒷장에 인쇄해 두면 잊지 않고 적게 됩니다.',
  note:'마무리 직전에 배치했습니다. 짧게 소개하고 넘어가세요.'
});

slideQuote({
  kicker:'3교시 정리',
  big:'자료 하나가\n수업 하나가 되고,\n평가 하나가 됩니다.',
  sub:'성취기준을 관찰 가능한 행동으로 쪼갰고, 활동의 판정 기준을 루브릭으로 옮겼으며,\n탐구 과정을 그대로 기록하는 활동지 네 장을 확인했습니다 — 새로 쓸 것은 거의 없었습니다.',
  accent:C.green, img:'kids-ai.png',
  note:'3교시의 결론입니다. 이어서 갤러리 워크와 마무리로 넘어갑니다.'
});

/* ---- 3교시 보강 : 수행평가 설계 상세 · 사례 2건 · 공유 · 마무리 ---- */

slideFlow({
  kicker:'★ 수행평가 설계', title:'만든 자료를 수행평가로 바꾸는 전체 지도', accent:C.purple,
  steps:[
    ['성취기준 선택', '내 자료가 실제로 평가하는 것 하나만 고릅니다.', '→ 성취기준 1개'],
    ['평가요소 분해', '성취기준을 관찰 가능한 행동 3~4개로 나눕니다.', '→ 평가요소'],
    ['평가 장면 설계', '설명 · 예측 · 설계 중 무엇을 시킬지 정합니다.', '→ 과제 문항'],
    ['루브릭 작성', '활동의 판정 기준을 상·중·하로 옮깁니다.', '→ 채점기준표'],
    ['활동지 · 기록', '탐구 과정을 남기게 하고 세특 문장을 준비합니다.', '→ 활동지 · 세특']
  ],
  foot:'두 번째 걸음이 가장 많이 생략됩니다 — 성취기준을 행동으로 쪼개지 않으면 루브릭이 모호해집니다.',
  note:'3교시의 뼈대입니다. 다섯 걸음을 손가락으로 세어 가며 소개하세요.'
});

slideTable({
  kicker:'성취기준 읽기', title:'2022 개정 성취기준 코드는 이렇게 읽습니다', accent:C.purple,
  headRow:['부분', '뜻', '예시 [10공수2-01-07]'],
  colW:[2.00, 4.60, 4.50],
  rows:[
    ['10','학교급·학년군 (10 = 고1 공통)','고등학교 1학년 공통 과목'],
    ['공수2','과목 약칭','공통수학2'],
    ['01','영역 번호','01 = 도형의 방정식'],
    ['07','영역 안의 성취기준 순번','07 = 대칭이동 관련'],
    ['찾는 법','교육과정 문서의 영역별 표에서 순서대로','자료의 “교육과정 연결” 칸에 이미 적혀 있습니다']
  ],
  foot:'실험실마다 성취기준 코드가 붙어 있습니다 — 옮겨 적기만 하면 됩니다.',
  note:'코드 읽는 법을 모르는 선생님이 의외로 많습니다. 30초만 쓰고 넘어가세요.'
});

slideCompare({
  kicker:'평가요소 분해', title:'성취기준 한 줄을 관찰 가능한 행동으로', accent:C.purple,
  left:{ head:'성취기준 (그대로는 채점 불가)', color:C.deep, rows:[
    ['원문','“좌표평면에서 두 원의 위치 관계를 이해하고 이를 활용하여 문제를 해결할 수 있다”'],
    ['문제','“이해한다”를 어떻게 채점합니까? 관찰할 수 없습니다'],
    ['결과','채점자마다 기준이 달라지고 학생은 무엇을 해야 할지 모릅니다']
  ]},
  right:{ head:'평가요소 (관찰 가능한 행동)', color:C.green, rows:[
    ['① 표현','거리 조건을 원의 방정식으로 바르게 쓴다'],
    ['② 절차','두 식을 빼서 일차식을 얻고 교점을 구한다'],
    ['③ 해석','세 원이 한 점에서 만나지 않는 경우의 의미를 설명한다']
  ]},
  foot:'평가요소 셋이 그대로 루브릭의 세 행이 됩니다 — 여기까지 오면 채점기준표는 거의 완성입니다.',
  note:'이 슬라이드가 3교시에서 가장 실용적입니다. 참가자에게 자기 성취기준으로 해 보게 하세요.'
});

slideCards({
  kicker:'평가 장면', title:'무엇을 시키느냐에 따라 평가되는 것이 달라집니다', accent:C.purple,
  cols:4, h:2.44,
  cards:[
    ['설명하게 한다',
     '“왜 세 개가 필요한가요?”\n\n개념 이해를 봅니다.\n\n서술형 · 구술평가에 적합.\n채점이 비교적 쉽습니다.', C.blue],
    ['예측하게 한다',
     '“이 값을 바꾸면 어떻게 될까요?”\n\n원리의 내면화를 봅니다.\n\n조작 전에 답하게 하는 것이 핵심입니다.', C.green],
    ['설계하게 한다',
     '“정확도를 높이려면 어디에 두어야 할까요?”\n\n적용과 창의를 봅니다.\n\n난도가 높아 “상” 기준에 적합.', C.orange],
    ['비판하게 한다',
     '“이 모형이 놓친 것은?”\n\n한계 인식을 봅니다.\n\nAI 활용 수업에서 특히 중요한 요소입니다.', C.purple]
  ],
  foot:'네 가지를 다 넣으면 과제가 무거워집니다 — 한 차시에 둘까지가 적당합니다.',
  note:'“비판하게 한다”는 AI 시대의 평가에서 새로 중요해진 항목입니다. 강조해 주세요.'
});

slideCompare({
  kicker:'루브릭 설계', title:'3수준과 4수준 — 무엇을 쓸 것인가', accent:C.purple,
  left:{ head:'3수준 (상 · 중 · 하)', color:C.green, rows:[
    ['장점','쓰기 쉽고 채점이 빠릅니다. 처음이라면 이것으로 시작하십시오'],
    ['단점','중간에 몰립니다 — 변별이 잘 안 됩니다'],
    ['적합','형성평가, 활동 중심 수행평가']
  ]},
  right:{ head:'4수준 (매우 우수 ~ 미흡)', color:C.deep, rows:[
    ['장점','변별이 잘 됩니다. 상위권 학생의 노력이 드러납니다'],
    ['단점','두 중간 수준의 경계를 쓰기 어렵습니다'],
    ['적합','성적에 반영되는 정식 수행평가']
  ]},
  foot:'수준의 수보다 중요한 것은 각 칸에 “관찰 가능한 행동”이 적혀 있는가입니다.',
  note:'“몇 단계로 할까요”는 늘 나오는 질문입니다. 처음이면 3수준으로 시작하라고 권하세요.'
});

slideTable({
  kicker:'배점 설계', title:'배점과 기본점수 — 자주 나는 실수', accent:C.red,
  headRow:['항목', '흔한 실수', '바른 설계'],
  colW:[2.60, 4.20, 4.30],
  rows:[
    ['기본점수','채점 점수에 더해 준다 (20 + 8 = 28)','기본점수는 최저점의 바닥입니다 — 만점은 20 그대로'],
    ['미응시','0점 처리','기본점수를 부여하고 별도 사유를 기록합니다'],
    ['평가요소 배점','세 요소에 똑같이 배분','핵심 요소에 더 많이 — 성취기준의 무게를 반영'],
    ['부분점수','“어느 정도 했으면 반”','무엇을 했을 때 몇 점인지 행동으로 적어 둡니다'],
    ['재응시','인정하지 않음','학교 학업성적관리규정을 먼저 확인하십시오']
  ],
  foot:'첫 줄이 가장 흔한 실수입니다 — 기본점수를 더하면 만점이 규정을 넘어갑니다.',
  note:'실제 수행평가 문서에서 확인한 사항입니다. 담당 부장님과 한 번 더 확인하시라고 안내하세요.'
});

slideBullets({
  kicker:'채점 신뢰도', title:'같은 답안에 같은 점수가 나오게 하는 네 가지', accent:C.deep,
  items:[
    ['예시 답안을 먼저 만든다','상·중·하 각각의 예시를 하나씩 미리 씁니다. 채점 속도가 두 배가 됩니다.'],
    ['첫 다섯 장을 함께 채점한다','동교과 교사와 같은 답안을 채점해 기준을 맞춥니다.'],
    ['요소별로 세로로 채점한다','학생별이 아니라 평가요소별로 전체를 훑으면 기준이 흔들리지 않습니다.'],
    ['경계 사례를 기록해 둔다','애매했던 답안과 판단 근거를 남기면 이의신청에 그대로 답할 수 있습니다.']
  ],
  foot:'세 번째가 특히 효과가 큽니다 — 채점 시간도 줄고 기준도 일정해집니다.',
  note:'경력 교사도 잘 안 하는 방법입니다. 실제로 해 보시라고 권해 주세요.'
});

slideTable({
  kicker:'학생 활동지 ①', title:'1장 — 문제 만나기 (도입)', accent:C.green,
  headRow:['칸', '학생이 쓰는 것', '평가에 쓰이는가'],
  colW:[3.00, 5.60, 2.50],
  rows:[
    ['오늘의 질문','교사가 던진 실생활 질문을 옮겨 적는다','아니오'],
    ['내 예상','조작하기 전에 답을 예측해 적는다','예 — 예측과 결과의 비교에 씀'],
    ['필요한 정보','문제를 풀려면 무엇을 알아야 하는지 적는다','예 — 문제 파악 능력'],
    ['모르는 용어','낯선 낱말을 적고 수업 중 채운다','아니오 (형성 자료)']
  ],
  foot:'“내 예상” 칸이 핵심입니다 — 조작 전에 적게 해야 활동이 확인 작업으로 바뀝니다.',
  note:'활동지 네 장을 한 장씩 보여 줍니다. 실제 문서를 화면에서 내려받아 보여 주면 더 좋습니다.'
});

slideTable({
  kicker:'학생 활동지 ②', title:'2장 — 조작하고 기록하기 (탐구)', accent:C.green,
  headRow:['칸', '학생이 쓰는 것', '평가에 쓰이는가'],
  colW:[3.00, 5.60, 2.50],
  rows:[
    ['조작 기록표','바꾼 값과 그때의 결과를 표로 적는다','예 — 자료 수집의 정확성'],
    ['발견한 규칙','표에서 찾은 규칙을 문장으로 쓴다','예 — 일반화 능력'],
    ['수학적 표현','그 규칙을 식이나 기호로 옮긴다','예 — 표현 요소의 핵심'],
    ['막힌 지점','어디서 막혔고 어떻게 해결했는지 적는다','예 — 과정 중심 평가 자료']
  ],
  foot:'“막힌 지점” 칸을 넣으면 결과가 틀린 학생도 과정으로 평가받을 수 있습니다.',
  note:'과정 중심 평가를 실제로 가능하게 하는 칸입니다. 꼭 강조하세요.'
});

slideTable({
  kicker:'학생 활동지 ③', title:'3장 — 설명하고 확장하기 (정리)', accent:C.green,
  headRow:['칸', '학생이 쓰는 것', '평가에 쓰이는가'],
  colW:[3.00, 5.60, 2.50],
  rows:[
    ['왜 그런가','발견한 규칙이 왜 성립하는지 근거를 쓴다','예 — “상” 기준의 핵심'],
    ['조건을 바꾸면','조건이 달라질 때의 결과를 예측해 쓴다','예 — 적용 능력'],
    ['한계','이 모형이 설명하지 못하는 것을 적는다','예 — 비판적 사고'],
    ['확장 탐구 선택','바로 · 심화 · 프로젝트 중 하나를 고른다','아니오 (후속 과제)']
  ],
  foot:'“한계” 칸은 AI 활용 수업에서 특히 중요합니다 — 모형을 의심하는 훈련입니다.',
  note:'세 번째 칸이 다른 활동지와 가장 크게 다른 점입니다.'
});

slideTable({
  kicker:'학생 활동지 ④', title:'4장 — 되돌아보기와 윤리', accent:C.green,
  headRow:['칸', '학생이 쓰는 것', '평가에 쓰이는가'],
  colW:[3.00, 5.60, 2.50],
  rows:[
    ['배운 것 세 줄','오늘 알게 된 것을 자기 말로 쓴다','아니오 (자기평가)'],
    ['AI를 썼다면','무엇을 시켰고 무엇을 스스로 판단했는지 적는다','예 — AI 활용 윤리'],
    ['자료 출처','사용한 데이터의 출처를 적는다','예 — 통계 단원 성취기준'],
    ['동료에게 한마디','짝의 산출물에 대한 구체적 의견을 쓴다','예 — 동료평가']
  ],
  foot:'네 장을 모두 모으면 그대로 포트폴리오가 되고, 세특 문장의 근거 자료가 됩니다.',
  note:'“AI를 썼다면” 칸은 앞으로 모든 활동지에 넣으시라고 권해 주세요.'
});

slideCards({
  kicker:'기록 도구', title:'손글씨 답안판과 과제 제출 — 화면에서 바로', accent:C.blue,
  cols:3, h:2.44,
  cards:[
    ['① 손으로 씁니다',
     '마우스 · 손가락 · 펜으로 화면에 직접 풀이를 씁니다.\n\n식과 그림을 함께 쓸 수 있어 수학 과목에 특히 맞습니다.', C.blue],
    ['② 단계별로 남습니다',
     'STEP 마다 별도의 답안판이 있어 탐구 과정이 순서대로 남습니다.\n\n지운 흔적까지 과정 자료가 됩니다.', C.green],
    ['③ 한 장으로 저장',
     '전체 단계를 하나의 학생 활동지 이미지로 모아 내려받습니다.\n\n그대로 제출하면 수합이 끝납니다.', C.purple]
  ],
  foot:'별도 앱도 계정도 없습니다 — 같은 웹페이지 안에서 쓰고 저장하면 됩니다.',
  note:'실제로 화면에 한 글자 써 보이세요. 이 장면에서 반응이 가장 좋습니다.'
});

slideQuote({
  kicker:'수행평가 사례 A',
  big:'“우리 동네에 새 정류장을\n어디에 두어야 할까?”',
  sub:'공통수학2 도형의 방정식 · 2차시 수행평가. 구글 지도 위에 실제 후보지를 찍고,\n거리 조건을 만족하는 지점을 수학으로 찾아 근거를 논술합니다.',
  accent:C.blue, img:'kids-ai.png',
  note:'실제로 학교에서 시행한 과제입니다. 문서 일체가 탭④에 들어 있다고 안내하세요.'
});

slideTable({
  kicker:'사례 A · 단계', title:'우리 동네 최적 입지 — 학생이 하는 일', accent:C.blue,
  headRow:['단계', '학생 활동', '수학', '산출물'],
  colW:[1.60, 4.00, 3.00, 2.50],
  rows:[
    ['STEP 1','우리 동네 지도에서 후보지 3곳을 찍는다','좌표 설정','좌표 3쌍'],
    ['STEP 2','두 지점에서 같은 거리인 곳을 찾는다','수직이등분선','직선의 방정식'],
    ['STEP 3','일정 거리 안에 드는 영역을 표시한다','원의 방정식','부등식 영역'],
    ['STEP 4','조건을 모두 만족하는 지점을 정한다','연립','최종 좌표'],
    ['STEP 5','왜 그곳인지 근거를 들어 논술한다','해석·설명','논술 1쪽']
  ],
  foot:'STEP 5 가 배점의 절반입니다 — 계산이 아니라 설명을 평가하는 과제입니다.',
  note:'단계마다 웹 화면에 실습 도구가 붙어 있습니다. 화면에서 하나만 시연해 주세요.'
});

slideTable({
  kicker:'사례 A · 루브릭', title:'채점기준표 — 세 요소 × 세 수준', accent:C.blue,
  headRow:['평가요소', '상', '중', '하'],
  colW:[2.60, 3.10, 2.90, 2.50],
  rows:[
    ['표현','거리 조건을 원·직선의 방정식으로 정확히 쓴다','식은 세우나 일부 오류가 있다','조건을 식으로 옮기지 못한다'],
    ['절차','연립으로 교점을 구하고 검산까지 한다','계산 과정에 오류가 있으나 방법은 맞다','절차를 수행하지 못한다'],
    ['해석','조건을 바꿨을 때의 변화를 예측해 설명한다','결과를 설명하나 근거가 직관적이다','설명이 없거나 수학과 무관하다']
  ],
  foot:'“상” 기준의 문장이 곧 활동의 판정 기준입니다 — 자료를 만들 때 이미 절반을 쓴 셈입니다.',
  note:'루브릭을 새로 쓰지 않아도 된다는 점을 다시 한 번 강조하세요.'
});

slideCompare({
  kicker:'사례 A · 채점', title:'같은 답, 다른 점수 — 무엇이 갈랐나', accent:C.blue,
  left:{ head:'학생 ㄱ — 중', color:C.orange, rows:[
    ['답','최종 좌표가 정확합니다'],
    ['근거','“계산했더니 여기가 나왔습니다”'],
    ['판정','절차는 상, 해석은 중 — 왜 그 지점인지 설명이 없습니다']
  ]},
  right:{ head:'학생 ㄴ — 상', color:C.green, rows:[
    ['답','최종 좌표에 작은 오차가 있습니다'],
    ['근거','“두 조건이 만나는 영역이 좁아 오차가 커집니다”'],
    ['판정','절차는 중, 해석은 상 — 조건과 오차의 관계를 설명했습니다']
  ]},
  foot:'정답 여부가 아니라 설명의 질이 등급을 가릅니다 — 학생에게 이 기준을 미리 알려 주십시오.',
  note:'실제 채점에서 자주 나오는 대비입니다. 참가자들이 가장 고개를 끄덕이는 슬라이드입니다.'
});

slideQuote({
  kicker:'수행평가 사례 B',
  big:'“무리함수는 어떤 함수의\n역함수일까?”',
  sub:'공통수학2 함수 · 1차시 수행평가. 공식을 주지 않고 여러 함수의 역함수를 직접 구하게 한 뒤,\n학생이 스스로 “y = x 에 대칭”이라는 공통점을 진술하게 합니다.',
  accent:C.green, img:'robot-point.png',
  note:'발견 학습형 수행평가입니다. 앞의 사례 A(적용형)와 성격이 다르다는 점을 대비해 주세요.'
});

slideTable({
  kicker:'사례 B · 단계', title:'y = x 대칭의 발견 — 학생이 하는 일', accent:C.green,
  headRow:['단계', '학생 활동', '수학', '산출물'],
  colW:[1.60, 4.00, 3.00, 2.50],
  rows:[
    ['STEP 1','일차·이차·무리·유리 함수의 역함수를 구한다','역함수 계산','식 4개'],
    ['STEP 2','원함수와 역함수를 같은 좌표평면에 그린다','그래프','그래프 4쌍'],
    ['STEP 3','공통점을 스스로 찾아 문장으로 쓴다','일반화','진술 1문장'],
    ['STEP 4','정의역이 제한되는 이유를 설명한다','정의역·치역','설명 1문단'],
    ['STEP 5','합성으로 서로 역함수임을 검증한다','합성함수','검증 계산']
  ],
  foot:'STEP 3 에서 교사가 답을 먼저 말하면 이 과제는 성립하지 않습니다 — 기다려 주십시오.',
  note:'“기다리기”가 이 과제의 전부입니다. 이 말을 꼭 해 주세요.'
});

slideTable({
  kicker:'사례 B · 학생 답안', title:'STEP 3 에서 실제로 나오는 진술들', accent:C.green,
  headRow:['학생 진술', '수준', '교사의 다음 발문'],
  colW:[4.60, 1.80, 4.70],
  rows:[
    ['“모양이 비슷해요”','하','“어떤 선을 기준으로 비슷한지 손으로 짚어 볼까요?”'],
    ['“대각선을 기준으로 뒤집힌 것 같아요”','중','“그 대각선의 식을 써 볼 수 있나요?”'],
    ['“y = x 에 대칭입니다”','중상','“왜 그런지 좌표로 설명할 수 있나요?”'],
    ['“(a,b) 가 있으면 (b,a) 가 있으니까요”','상','“그럼 정의역과 치역은 어떻게 되나요?”']
  ],
  foot:'네 단계 모두 정답으로 가는 길입니다 — 하 수준의 진술도 발문 하나로 올라갑니다.',
  note:'평가가 아니라 발문의 자료로 쓰라고 안내하세요. 이것이 과정 중심 평가입니다.'
});

slideTable({
  kicker:'사례 B · 루브릭', title:'발견형 과제의 채점기준표', accent:C.green,
  headRow:['평가요소', '상', '중', '하'],
  colW:[2.60, 3.10, 2.90, 2.50],
  rows:[
    ['계산','네 함수의 역함수를 모두 정확히 구한다','일부 오류가 있다','역함수를 구하지 못한다'],
    ['일반화','대칭 관계를 좌표의 교환으로 설명한다','“y = x 대칭”까지 진술한다','모양이 비슷하다는 수준에 머문다'],
    ['정의역','정의역 제한의 이유를 치역으로 설명한다','제한이 필요함을 안다','언급하지 않는다']
  ],
  foot:'발견형 과제에서는 “계산”보다 “일반화”에 배점을 더 주십시오 — 그래야 발견이 목적이 됩니다.',
  note:'배점 배분이 과제의 성격을 결정한다는 점을 강조하세요.'
});

slideTable({
  kicker:'공유 활동', title:'갤러리 워크 관찰 기록표 — 그대로 인쇄해 쓰십시오', accent:C.purple,
  headRow:['보는 사람이 적는 것', '예시'],
  colW:[4.30, 6.80],
  rows:[
    ['어느 단원인가','고1 공통수학2 · 도형의 방정식'],
    ['학생이 만지는 것은 무엇인가','위성 개수 슬라이더, 거리 오차 체크박스'],
    ['가장 잘된 점 (구체적으로)','오차를 주었을 때 교점이 흩어지는 것이 눈에 보인다'],
    ['묻고 싶은 것','오차가 클 때 학생에게 무엇을 묻나요?'],
    ['내 수업에 가져갈 것','조작 전에 예상을 적게 하는 방식']
  ],
  foot:'“잘 만드셨네요”만 쓰지 않게 하는 장치입니다 — 다섯 칸을 채우면 반드시 구체적이 됩니다.',
  note:'포스트잇 대신 이 표를 인쇄해 나눠 주면 공유의 질이 크게 올라갑니다.'
});

slideCompare({
  kicker:'동료평가 · 자기평가', title:'학생용 두 가지 양식', accent:C.purple,
  left:{ head:'동료평가 — 세 칸만', color:C.deep, rows:[
    ['잘된 점','수학적으로 정확했던 부분을 하나 구체적으로'],
    ['궁금한 점','설명을 듣고도 이해되지 않은 부분 하나'],
    ['배울 점','내 과제에 적용하고 싶은 것 하나']
  ]},
  right:{ head:'자기평가 — 세 칸만', color:C.green, rows:[
    ['가장 어려웠던 곳','어디서 얼마나 오래 막혔는지'],
    ['해결한 방법','스스로 · 친구 · 자료 · AI 중 무엇으로 풀었는지'],
    ['다시 한다면','같은 과제를 다시 한다면 무엇을 바꿀지']
  ]},
  foot:'세 칸을 넘기지 마십시오 — 칸이 늘어나면 학생은 형식적으로 채웁니다.',
  note:'실제 운영 경험에서 나온 원칙입니다. “세 칸”을 강조하세요.'
});

slideBullets({
  kicker:'피드백', title:'점수 대신 문장으로 — 세 문장 피드백', accent:C.deep,
  lead:'점수만 돌려주면 학생은 등급만 봅니다. 세 문장이면 충분합니다.',
  items:[
    ['① 무엇을 했는지 (사실)','“두 원의 교점을 연립으로 정확히 구했습니다.”'],
    ['② 무엇이 부족했는지 (근거)','“다만 세 번째 조건을 확인하지 않아 답이 하나로 좁혀지지 않았습니다.”'],
    ['③ 다음에 무엇을 할지 (행동)','“세 번째 원을 그려 교점이 한 점인지 확인해 보세요.”'],
    ['시간이 없다면','③만이라도 쓰십시오 — 학생이 실제로 행동을 바꾸는 것은 세 번째 문장입니다.']
  ],
  foot:'이 세 문장은 그대로 세특 문장의 재료가 됩니다 — 두 번 쓰지 않아도 됩니다.',
  note:'“피드백 쓸 시간이 없다”는 현실에 대한 답입니다. 세 번째 문장만이라도.'
});

slideTable({
  kicker:'3교시 점검', title:'오늘 마치기 전에 확인합니다', accent:C.green,
  headRow:['확인할 것', '되었나요?', '안 되었으면'],
  colW:[5.20, 2.30, 3.60],
  rows:[
    ['내 단원 자료 파일을 저장했다','☐','지금 저장하세요 — 가장 흔한 사고입니다'],
    ['성취기준을 하나 골랐다','☐','자료의 “교육과정 연결” 칸에서 그대로 가져오세요'],
    ['평가요소를 3개로 쪼갰다','☐','표현 · 절차 · 해석 세 가지로 시작하세요'],
    ['루브릭 “상” 기준을 한 줄 썼다','☐','활동의 판정 기준을 그대로 옮기면 됩니다'],
    ['모음집에 올리고 내려받았다','☐','마무리 전에 꼭 — 새로고침하면 사라집니다']
  ],
  foot:'다섯 번째를 빠뜨리면 오늘 산출물이 전부 사라집니다 — 지금 확인해 주십시오.',
  note:'★ 반드시 소리 내어 확인하세요. 마지막 항목은 손을 들게 해서 전원 확인하십시오.'
});

slideTable({
  kicker:'돌아가서', title:'학교에서의 1주 · 1개월 · 1학기', accent:C.deep,
  headRow:['시점', '할 일', '걸리는 시간'],
  colW:[2.00, 6.60, 2.50],
  rows:[
    ['1주 안','오늘 만든 자료를 도입 5분에 한 번 써 본다','준비 10분'],
    ['2주 안','활동지 1~2장만 붙여 한 차시 활동으로 확장한다','준비 30분'],
    ['1개월 안','성취기준과 루브릭을 붙여 수행평가 1건으로 편성한다','준비 1시간'],
    ['1학기 안','동교과 협의회에서 모음집을 열어 함께 본다','협의회 20분'],
    ['다음 학기','학생이 직접 AI로 만들게 하는 프로젝트를 한 번 운영한다','2~3차시']
  ],
  foot:'첫 줄부터 하십시오. 1주 안에 한 번 쓰지 않으면 대개 영영 쓰지 않게 됩니다.',
  note:'구체적인 날짜를 지금 적게 하세요. 실행률이 크게 달라집니다.'
});

slideTable({
  kicker:'연수 후', title:'자주 묻는 질문 — 학교로 돌아가서', accent:C.deep,
  headRow:['질문', '답'],
  colW:[4.10, 7.00],
  rows:[
    ['자료를 학생에게 어떻게 주나요?','파일 하나를 클래스룸에 올리거나 QR로 배포하십시오. 설치도 로그인도 없습니다.'],
    ['학교 컴퓨터에서 안 열리면요?','브라우저만 있으면 열립니다. 안 되면 USB로 복사해 더블클릭하십시오.'],
    ['다른 단원 것도 만들 수 있나요?',`확장 카탈로그 ${N.cat}종에 질문과 결함 후보가 이미 있습니다. 그대로 7라운드를 돌리십시오.`],
    ['동교과와 나누고 싶습니다','모음집 파일 하나를 전달하면 끝입니다. 협의회에서 열어 함께 조작해 보십시오.'],
    ['평가 규정이 걱정됩니다','학업성적관리규정을 먼저 확인하고, 기본점수 처리 방식을 부장님과 맞추십시오.']
  ],
  foot:'문의는 언제든 주십시오 — 자료는 계속 늘어납니다.',
  note:'마지막 정리 직전에 씁니다. 질문이 많으면 여기서 시간을 쓰세요.'
});

(function last(){
  const s = base({chrome:false});
  s.addText('오늘 만든 것을 다음 주에 쓰시면\n이 3시간은 끝나지 않습니다.',
    { x:ML, y:2.30, w:8.6, h:1.7, fontSize:32, color:C.navy, fontFace:FT,
      valign:'middle', lineSpacingMultiple:1.22 });
  s.addShape(pres.ShapeType.rect, { x:ML, y:4.16, w:2.4, h:0.06, fill:{color:C.band} });
  s.addText('실생활 맥락 → 수학 원리 → 디지털 도구 → 자료 제작 → 평가·윤리',
    { x:ML, y:4.38, w:8.6, h:0.34, fontSize:13, color:C.body, fontFace:FS });
  s.addText('2026년 대전광역시교육청 AI·디지털 기반 교육혁신 역량강화 연수 · 주제4 중등 수학\n대전대신고등학교  하진수',
    { x:ML, y:5.30, w:8.6, h:0.9, fontSize:12.5, color:C.mute, fontFace:FB, lineSpacingMultiple:1.32 });
  s.addImage({ path:A('robot-point.png'), x:9.70, y:2.55, w:2.3, h:3.06 });
  s.addNotes('마무리 인사. 질문은 개별로 받습니다. 모음집 파일 배포 여부를 마지막으로 한 번 더 확인하세요.');
})();

await pres.writeFile({ fileName: OUT });
console.log('생성 완료:', OUT);
