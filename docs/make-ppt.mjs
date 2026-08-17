/* =====================================================================
   2026 대전광역시교육청 인공지능 활용 선도교사 연수 (중등 수학)
   「일상 속 수학 실험실」 3시간(180분) 강의용 PPT 생성기

     node docs/make-ppt.mjs

   슬라이드 문구를 고치려면 아래 DECK 구성 부분만 손대면 됩니다.
   발표자 노트(진행 대본)까지 함께 들어갑니다.
   ===================================================================== */
import PptxGenJS from 'pptxgenjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT  = path.join(HERE, '2026_대전_AI연수_수학_3시간_강의.pptx');

const F = 'Freesentation';          // 연수 슬라이드 마스터 글꼴 (미설치 PC는 자동 대체)
const C = {
  blue:'2563EB', teal:'0E9384', amber:'B45309', rose:'BE123C',
  ink:'111827', body:'374151', mute:'6B7280',
  line:'E5E7EB', soft:'F5F7FA', bg:'FFFFFF', dark:'0F172A'
};
const W = 13.333, H = 7.5, M = 0.62, CW = W - M*2;

const pres = new PptxGenJS();
pres.defineLayout({ name:'W16x9', width:W, height:H });
pres.layout = 'W16x9';
pres.author = '대전대신고 하진수';
pres.title  = '일상 속 수학 실험실 — AI·디지털 기반 교수학습 설계 및 자료 제작(수학)';

let page = 0;

/* ---------- 공통 뼈대 ---------- */
function base(accent = C.blue, {chrome = true} = {}){
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.ShapeType.rect, { x:0, y:0, w:W, h:0.085, fill:{color:accent} });
  if (chrome){
    page++;
    s.addText('일상 속 수학 실험실 · 2026 대전광역시교육청 인공지능 활용 선도교사 연수(중등 수학) · 대전대신고 하진수',
      { x:M, y:7.02, w:10.6, h:0.3, fontSize:9, color:C.mute, fontFace:F });
    s.addText(String(page),
      { x:W-M-0.6, y:7.02, w:0.6, h:0.3, fontSize:9, color:C.mute, align:'right', fontFace:F });
  }
  return s;
}

function head(s, {time, kicker, title, accent = C.blue}){
  let x = M;
  if (time){
    s.addShape(pres.ShapeType.roundRect, {
      x:M, y:0.40, w:1.62, h:0.34, rectRadius:0.16,
      fill:{color:accent}, line:{color:accent} });
    s.addText(time, { x:M, y:0.40, w:1.62, h:0.34, fontSize:11.5, bold:true,
      color:'FFFFFF', align:'center', valign:'middle', fontFace:F });
    x = M + 1.82;
  }
  if (kicker) s.addText(kicker, { x, y:0.40, w:CW-(x-M), h:0.34, fontSize:12,
    bold:true, color:accent, valign:'middle', fontFace:F, charSpacing:0.6 });
  s.addText(title, { x:M, y:0.86, w:CW, h:0.72, fontSize:29, bold:true,
    color:C.ink, valign:'middle', fontFace:F });
  s.addShape(pres.ShapeType.line, { x:M, y:1.66, w:CW, h:0,
    line:{color:C.line, width:1} });
}

function note(s, txt){ if (txt) s.addNotes(txt); }

/* ---------- 표지 ---------- */
function cover(){
  const s = base(C.blue, {chrome:false});
  s.background = { color: C.dark };
  s.addShape(pres.ShapeType.rect, { x:0, y:0, w:W, h:0.085, fill:{color:C.blue} });
  s.addText('2026 대전광역시교육청 · 인공지능 활용 선도교사 연수 (중등 수학)',
    { x:M, y:1.55, w:CW, h:0.4, fontSize:14, bold:true, color:'93C5FD', fontFace:F, charSpacing:1 });
  s.addText('일상 속 수학 실험실',
    { x:M, y:2.05, w:CW, h:1.3, fontSize:60, bold:true, color:'FFFFFF', fontFace:F });
  s.addText('AI·디지털 기반 교수학습 설계 및 자료 제작 (수학) · 3시간 실습 연수',
    { x:M, y:3.35, w:CW, h:0.5, fontSize:19, color:'CBD5E1', fontFace:F });
  s.addShape(pres.ShapeType.line, { x:M, y:4.15, w:4.6, h:0, line:{color:C.blue, width:3} });
  const cells = [
    ['실험실', '24종', C.blue],
    ['확장 카탈로그', '303종', C.teal],
    ['바이브 코딩', '7라운드', C.amber],
    ['오늘 만드는 것', '내 단원 자료 1개', C.rose]
  ];
  cells.forEach(([k, v, col], i) => {
    const x = M + i*(CW/4);
    s.addText(k, { x, y:4.55, w:CW/4-0.3, h:0.3, fontSize:11, color:'94A3B8', fontFace:F });
    s.addText(v, { x, y:4.82, w:CW/4-0.3, h:0.5, fontSize:22, bold:true, color:'FFFFFF', fontFace:F });
    s.addShape(pres.ShapeType.rect, { x, y:5.35, w:0.5, h:0.05, fill:{color:col} });
  });
  s.addText('대전대신고등학교 하진수', { x:M, y:6.35, w:6, h:0.4, fontSize:16, bold:true, color:'FFFFFF', fontFace:F });
  s.addText('설치 · 서버 · 로그인 없이 파일 하나로 동작합니다',
    { x:W-M-6.5, y:6.35, w:6.5, h:0.4, fontSize:12, color:'94A3B8', align:'right', fontFace:F });
  note(s, '인사 → 오늘은 강의가 아니라 실습입니다. 3시간 뒤 여러분 손에 "작동하는 학습자료 1개"가 남습니다. 노트북을 켜 주세요.');
}

/* ---------- 구획 표지 ---------- */
function divider({num, time, title, sub, accent = C.blue, note:nt}){
  const s = base(accent, {chrome:false});
  s.background = { color: C.dark };
  s.addShape(pres.ShapeType.rect, { x:0, y:0, w:W, h:0.085, fill:{color:accent} });
  s.addText(num, { x:M, y:1.9, w:3, h:1.9, fontSize:130, bold:true, color:accent, fontFace:F });
  s.addText(time, { x:M+3.0, y:2.15, w:8, h:0.4, fontSize:15, bold:true, color:'94A3B8', fontFace:F, charSpacing:1 });
  s.addText(title, { x:M+3.0, y:2.55, w:8.8, h:0.95, fontSize:42, bold:true, color:'FFFFFF', fontFace:F });
  s.addText(sub, { x:M+3.0, y:3.6, w:8.8, h:0.9, fontSize:16, color:'CBD5E1', fontFace:F, lineSpacingMultiple:1.3 });
  note(s, nt);
}

/* ---------- 카드형 ---------- */
function slideCards({time, kicker, title, accent = C.blue, cards, cols = 3, y = 1.95,
                     h = 1.55, foot, note:nt}){
  const s = base(accent); head(s, {time, kicker, title, accent});
  const gap = 0.26, cw = (CW - gap*(cols-1))/cols;
  // 카드는 위에 붙인다 — 내용보다 큰 상자는 비어 보이므로 높이로 채우지 않는다
  const y0 = y;
  cards.forEach((c, i) => {
    const r = Math.floor(i/cols), col = i%cols;
    const x = M + col*(cw+gap), yy = y0 + r*(h+0.24);
    s.addShape(pres.ShapeType.roundRect, { x, y:yy, w:cw, h, rectRadius:0.06,
      fill:{color:C.soft}, line:{color:C.line, width:1} });
    s.addShape(pres.ShapeType.rect, { x, y:yy, w:0.055, h, fill:{color:c[2] || accent} });
    s.addText(c[0], { x:x+0.26, y:yy+0.14, w:cw-0.45, h:0.42, fontSize:14.5, bold:true,
      color:C.ink, fontFace:F, valign:'top' });
    s.addText(c[1], { x:x+0.26, y:yy+0.56, w:cw-0.45, h:h-0.7, fontSize:11.5,
      color:C.body, fontFace:F, valign:'top', lineSpacingMultiple:1.22 });
  });
  if (foot) s.addText(foot, { x:M, y:H-1.02, w:CW, h:0.42, fontSize:12.5, bold:true,
    color:accent, fontFace:F, valign:'middle' });
  note(s, nt);
  return s;
}

/* ---------- 목록형 ---------- */
function slideBullets({time, kicker, title, accent = C.blue, lead, items, foot, note:nt}){
  const s = base(accent); head(s, {time, kicker, title, accent});
  let y = 1.95;
  if (lead){
    s.addText(lead, { x:M, y, w:CW, h:0.5, fontSize:15, color:C.body, fontFace:F, valign:'top' });
    y += 0.62;
  }
  // 항목이 많으면 간격을 줄여 아래 마무리 문구와 겹치지 않게 한다
  const bot = foot ? H-1.16 : H-0.62;
  const two = items.filter(t => Array.isArray(t) && t[1]).length;
  const pitch2 = Math.min(0.82, (bot - y - (items.length-two)*0.56) / Math.max(two,1));
  items.forEach((t, i) => {
    s.addShape(pres.ShapeType.ellipse, { x:M+0.02, y:y+0.11, w:0.3, h:0.3,
      fill:{color:accent} });
    s.addText(String(i+1), { x:M+0.02, y:y+0.11, w:0.3, h:0.3, fontSize:10.5, bold:true,
      color:'FFFFFF', align:'center', valign:'middle', fontFace:F });
    const parts = Array.isArray(t) ? t : [t, ''];
    s.addText(parts[0], { x:M+0.48, y, w:CW-0.5, h:0.34, fontSize:15.5, bold:true,
      color:C.ink, fontFace:F, valign:'middle' });
    if (parts[1]) s.addText(parts[1], { x:M+0.48, y:y+0.33, w:CW-0.5, h:0.36, fontSize:12,
      color:C.body, fontFace:F, valign:'top' });
    y += parts[1] ? pitch2 : 0.56;
  });
  if (foot) s.addText(foot, { x:M, y:H-1.02, w:CW, h:0.42, fontSize:12.5, bold:true,
    color:accent, fontFace:F, valign:'middle' });
  note(s, nt);
  return s;
}

/* ---------- 좌우 비교형 ---------- */
function slideCompare({time, kicker, title, accent = C.blue, left, right, foot, note:nt}){
  const s = base(accent); head(s, {time, kicker, title, accent});
  const cw = (CW - 0.36)/2;
  [[left, M, C.rose], [right, M+cw+0.36, C.teal]].forEach(([d, x, col]) => {
    const c = d.color || col;
    s.addShape(pres.ShapeType.roundRect, { x, y:1.95, w:cw, h:4.28, rectRadius:0.06,
      fill:{color:C.soft}, line:{color:C.line, width:1} });
    s.addShape(pres.ShapeType.rect, { x, y:1.95, w:cw, h:0.5, fill:{color:c} });
    s.addText(d.head, { x:x+0.24, y:1.95, w:cw-0.4, h:0.5, fontSize:14, bold:true,
      color:'FFFFFF', valign:'middle', fontFace:F });
    const pitch = (4.28 - 0.72) / d.rows.length;   // 칸 안에서 고르게 나눈다
    let y = 2.60;
    d.rows.forEach(r => {
      s.addText(r[0], { x:x+0.24, y, w:cw-0.48, h:0.3, fontSize:11, bold:true,
        color:c, fontFace:F, valign:'top' });
      s.addText(r[1], { x:x+0.24, y:y+0.3, w:cw-0.48, h:pitch-0.34, fontSize:12,
        color:C.body, fontFace:F, valign:'top', lineSpacingMultiple:1.2 });
      y += pitch;
    });
  });
  if (foot) s.addText(foot, { x:M, y:H-1.02, w:CW, h:0.42, fontSize:12.5, bold:true,
    color:accent, fontFace:F, valign:'middle' });
  note(s, nt);
  return s;
}

/* ---------- 활동 카드형 ---------- */
function slideActivity({no, time, title, accent = C.teal, goal, min, rows, out, note:nt}){
  const s = base(accent); head(s, {time, kicker:`실습 활동 ${no}`, title, accent});
  const lw = 4.05;
  s.addShape(pres.ShapeType.roundRect, { x:M, y:1.95, w:lw, h:4.28, rectRadius:0.06,
    fill:{color:accent}, line:{color:accent} });
  s.addText(`활동 ${no}`, { x:M+0.3, y:2.15, w:lw-0.6, h:0.4, fontSize:13, bold:true,
    color:'FFFFFF', fontFace:F, charSpacing:1 });
  s.addText(goal, { x:M+0.3, y:2.6, w:lw-0.6, h:1.9, fontSize:17, bold:true,
    color:'FFFFFF', fontFace:F, valign:'top', lineSpacingMultiple:1.25 });
  s.addShape(pres.ShapeType.line, { x:M+0.3, y:4.68, w:lw-0.6, h:0, line:{color:'FFFFFF', width:1.5} });
  s.addText('배정 시간', { x:M+0.3, y:4.82, w:lw-0.6, h:0.3, fontSize:11, color:'E0F2F1', fontFace:F });
  s.addText(min, { x:M+0.3, y:5.08, w:lw-0.6, h:0.5, fontSize:26, bold:true, color:'FFFFFF', fontFace:F });
  if (out) s.addText(out, { x:M+0.3, y:5.62, w:lw-0.6, h:0.55, fontSize:11.5, color:'F1F5F9',
    fontFace:F, valign:'top', lineSpacingMultiple:1.2 });

  const x = M + lw + 0.34, rw = CW - lw - 0.34;
  const rh = 4.28/rows.length;
  rows.forEach((r, i) => {
    const y = 1.95 + i*rh;
    if (i) s.addShape(pres.ShapeType.line, { x, y, w:rw, h:0, line:{color:C.line, width:1} });
    s.addText(r[0], { x, y:y+0.1, w:1.86, h:0.4, fontSize:11.5, bold:true, color:accent,
      fontFace:F, valign:'top' });
    s.addText(r[1], { x:x+1.9, y:y+0.08, w:rw-1.95, h:rh-0.16, fontSize:12.5, color:C.body,
      fontFace:F, valign:'top', lineSpacingMultiple:1.24 });
  });
  note(s, nt);
  return s;
}

/* ---------- 표형 ---------- */
function slideTable({time, kicker, title, accent = C.blue, headRow, rows, colW, foot, note:nt}){
  const s = base(accent); head(s, {time, kicker, title, accent});
  const body = [
    headRow.map(t => ({ text:t, options:{ bold:true, color:'FFFFFF', fill:{color:accent}, fontSize:12.5 } })),
    ...rows.map(r => r.map((t, i) => ({
      text:t, options:{ fontSize:11.5, color: i===0 ? C.ink : C.body, bold: i===0 } })))
  ];
  s.addTable(body, { x:M, y:1.95, w:CW, colW, fontFace:F, border:{type:'solid', color:C.line, pt:1},
    rowH:0.42, valign:'middle', autoPage:false });
  if (foot) s.addText(foot, { x:M, y:H-1.02, w:CW, h:0.42, fontSize:12.5, bold:true,
    color:accent, fontFace:F, valign:'middle' });
  note(s, nt);
  return s;
}

/* ---------- 한 문장 강조형 ---------- */
function slideQuote({time, kicker, big, sub, accent = C.blue, note:nt}){
  const s = base(accent);
  s.background = { color: C.soft };
  let kx = M;
  if (time){
    s.addShape(pres.ShapeType.roundRect, { x:M, y:1.44, w:1.62, h:0.34, rectRadius:0.16,
      fill:{color:accent}, line:{color:accent} });
    s.addText(time, { x:M, y:1.44, w:1.62, h:0.34, fontSize:11.5, bold:true,
      color:'FFFFFF', align:'center', valign:'middle', fontFace:F });
    kx = M + 1.82;
  }
  if (kicker) s.addText(kicker, { x:kx, y:1.44, w:CW-(kx-M), h:0.34, fontSize:13, bold:true,
    color:accent, fontFace:F, charSpacing:1, valign:'middle' });
  s.addText(big, { x:M, y:2.0, w:CW, h:2.4, fontSize:40, bold:true, color:C.ink,
    fontFace:F, valign:'middle', lineSpacingMultiple:1.18 });
  s.addShape(pres.ShapeType.line, { x:M, y:4.6, w:3.4, h:0, line:{color:accent, width:3} });
  if (sub) s.addText(sub, { x:M, y:4.85, w:CW, h:1.2, fontSize:15, color:C.body,
    fontFace:F, valign:'top', lineSpacingMultiple:1.3 });
  note(s, nt);
  return s;
}

/* =====================================================================
   여기서부터 슬라이드 구성
   ===================================================================== */

cover();

slideCards({
  kicker:'오늘의 약속', title:'3시간 뒤, 빈손으로 나가지 않습니다',
  accent:C.blue, cols:3, h:1.85,
  cards:[
    ['① 작동하는 학습자료 1개','내 담당 단원으로 만든 HTML 파일 하나. 설치·서버·로그인 없이 학생에게 그대로 배포됩니다.', C.blue],
    ['② 프롬프트 기록','7라운드에서 내가 쓴 말 그대로. 다음 자료를 만들 때 재활용하는 재료가 됩니다.', C.teal],
    ['③ 학생 활동지 · 교사 자료','탭④에서 내려받는 문서. 구글 문서·한글·워드에서 바로 열립니다.', C.amber],
    ['④ 채점기준표(루브릭)','활동의 판정 기준이 그대로 “상” 기준이 되므로 따로 만들 필요가 없습니다.', C.rose],
    ['⑤ 연수 모음집 HTML','참가자 전원의 산출물이 담긴 파일 하나. 학교로 돌아가 동교과에 그대로 공유합니다.', C.blue],
    ['⑥ 2학기 실행 계획 1줄','확장 탐구 세 단계 중 실제로 해 볼 하나를 고르고 나갑니다.', C.teal]
  ],
  foot:'“오늘 배운 것”이 아니라 “오늘 만든 것”을 가지고 나가는 연수입니다.',
  note:'결과물을 먼저 보여 줍니다. 참가자가 3시간을 버티는 동기는 “무엇이 남는가”입니다. 여섯 개를 손가락으로 세어 가며 말해 주세요.'
});

slideCards({
  kicker:'왜 지금인가', title:'수학 수업의 세 가지 병목, AI는 어디를 뚫는가',
  accent:C.amber, cols:3, h:2.25,
  cards:[
    ['병목 ① 자료 제작 시간','지오지브라·엑셀로 활동 하나 만드는 데 반나절. 그래서 결국 교과서 예제로 돌아갑니다.\n\n→ AI는 이 시간을 30분으로 줄입니다.', C.amber],
    ['병목 ② 개별화의 한계','“이해한 학생”과 “놓친 학생”이 같은 활동지를 받습니다.\n\n→ 같은 자료의 난이도·데이터만 바꾼 변형을 몇 분 만에 만듭니다.', C.amber],
    ['병목 ③ 평가와의 단절','활동은 활동대로, 수행평가는 따로. 루브릭을 새로 씁니다.\n\n→ 활동의 판정 기준을 그대로 루브릭 “상” 기준으로 씁니다.', C.amber]
  ],
  foot:'오늘은 이 셋을 각각 한 번씩 직접 뚫어 봅니다 — 만들고, 바꾸고, 평가로 잇습니다.',
  note:'공감대 형성 구간입니다. “반나절”에서 고개가 끄덕여지면 성공. 여기서 3분 이상 쓰지 마세요.'
});

slideQuote({
  kicker:'오늘의 원칙',
  big:'코드를 배우지 않습니다.\n말로 요청하고, 결과를 보고,\n다시 요청합니다.',
  sub:'프로그래밍 지식이 필요 없습니다. 필요한 것은 “무엇이 잘못됐는지 화면을 보고 말하는 능력”이고,\n그것은 수학 교사가 이미 매일 학생에게 하는 일입니다.',
  accent:C.blue,
  note:'여기서 “저는 코딩 못 해요”라는 불안을 정면으로 해소합니다. 실제로 오늘 아무도 코드를 타이핑하지 않습니다.'
});

slideCards({
  kicker:'오늘의 사다리', title:'만들기 부담을 3단계로 나눕니다',
  accent:C.blue, cols:3, h:2.55,
  cards:[
    ['01  체험 — 써 보기','완성본을 열어 학생 입장에서 조작합니다.\n\n“이걸 오늘 내가 만든다”는 목표가 생깁니다.\n\n· 실패 위험 0\n· AI 접속 불필요', C.blue],
    ['02  개조 — 바꿔 보기','코드의 한 줄만 고쳐 저장·새로고침.\n\n결과가 바뀌는 순간 심리적 장벽이 무너집니다.\n\n· 첫 성공 경험\n· AI 접속이 안 돼도 진행', C.teal],
    ['03  생성 — 만들어 보기','AI와 7라운드 대화로 내 단원 자료를 완성합니다.\n\n프롬프트 기록이 다음 자료의 재료가 됩니다.\n\n· 오늘의 산출물\n· 학교로 가져갑니다', C.amber]
  ],
  foot:'핵심은 “처음부터 만들게 하지 않는 것”입니다. 빈 화면을 마주하게 하면 연수는 거기서 멈춥니다.',
  note:'이 세 단계가 오늘 전체의 뼈대입니다. 슬라이드마다 지금 몇 단계인지 계속 상기시켜 주세요.'
});

slideTable({
  kicker:'180분 타임라인', title:'어느 탭을 언제 쓰는가',
  accent:C.blue,
  headRow:['시간', '탭', '단계', '무엇을 하는가'],
  colW:[1.55, 0.95, 1.5, 8.11],
  rows:[
    ['15:00–15:15','①','도입','스마트폰 위치 정확도 실측 → “±8 m는 어떻게 나올까” · LAB 01 원리 1단계'],
    ['15:15–15:50','①','체험','GPS 삼변측량 조작 → 입력·계산·시각화·피드백 4블록으로 구조 해체'],
    ['15:50–16:00','—','휴식','자료 내려받기 · 접속 문제 해결'],
    ['16:00–16:20','①','개조','스팸 분류기 단어·가중치 한 줄 수정 → 결과 변화 확인'],
    ['16:20–16:55','②','생성','바이브 코딩 7라운드 — ROUND 5(결함 고치기)가 핵심'],
    ['16:55–17:05','—','휴식','만든 자료 저장 · 막힌 지점 개별 지원'],
    ['17:05–17:35','④','완성','성취기준 선택 → 루브릭 → 학생 활동지·교사 자료 내려받기'],
    ['17:35–17:55','⑤','공유','갤러리 워크(호스트 4분 교대) → 모음집 하나로 묶어 배포'],
    ['17:55–18:00','③','마무리','AI 윤리 체크리스트 · 2학기에 해 볼 확장 탐구 하나 고르기']
  ],
  foot:'휴식 10분 × 2회 포함. 빠른 참가자는 모둠 튜터로 배치하고, 늦는 참가자는 완성본을 그대로 씁니다.',
  note:'인쇄해서 책상마다 두면 좋습니다. “지금 어디쯤인지” 묻는 질문이 크게 줄어듭니다.'
});

slideBullets({
  kicker:'시작 전 3분', title:'접속 · 준비물 확인',
  accent:C.teal,
  lead:'셋 중 아무 방법으로나 열립니다. 하나만 되면 됩니다.',
  items:[
    ['① QR 또는 주소로 열기','배포 주소를 스마트폰·노트북 어느 쪽에서 열어도 동일하게 동작합니다.'],
    ['② USB로 받은 파일 더블클릭','인터넷이 끊겨도 탭①·④·⑤는 그대로 동작합니다. 오늘 와이파이가 불안하면 이 방법이 기본입니다.'],
    ['③ 옆 사람 화면 함께 보기','2인 1조도 괜찮습니다. 다만 “만드는 사람”을 반드시 번갈아 맡으세요.'],
    ['준비물','노트북(권장) · 담당 학년/과목/단원 하나를 미리 정해 오기 · 포스트잇 2장'],
    ['오늘 쓰는 AI','생성형 AI 계정이 없어도 진행됩니다. 탭②의 실습은 오프라인에서도 그대로 돌아갑니다.']
  ],
  foot:'접속 문제로 5분 이상 쓰지 마세요. 안 되면 USB → 그래도 안 되면 2인 1조.',
  note:'실제 배포 주소/QR을 이 슬라이드에 붙여 주세요. 시작 전 5분 안에 전원 접속을 끝내는 것이 3시간 성패를 가릅니다.'
});

/* ============ 1부 도입 ============ */
divider({
  num:'1', time:'15:00 – 15:15 · 15분', title:'도입 — 일상 질문에서 수학 꺼내기',
  sub:'스마트폰 하나로 시작합니다. 오늘 다룰 모든 자료가 “실생활 질문 한 줄”에서 출발한다는 것을 먼저 겪습니다.',
  accent:C.blue,
  note:'강의가 아니라 실측으로 엽니다. 참가자가 첫 3분 안에 스마트폰을 꺼내게 하세요.'
});

slideActivity({
  no:'①', time:'15:00–15:08', title:'내 폰은 나를 얼마나 정확히 아는가',
  accent:C.blue, min:'8분',
  goal:'지도 앱을 켜고 위치 정확도 숫자를 직접 확인한 뒤,\n그 숫자가 어디서 나오는지 질문을 만든다',
  rows:[
    ['무엇을 하나','지도 앱을 켜고 파란 점 주변의 원(정확도 반경)을 확인합니다. 건물 안 → 창가 → 야외로 이동하며 숫자가 어떻게 달라지는지 셋 다 적어 봅니다.'],
    ['무엇을 보나','건물 안에서는 반경이 커지고 야외에서는 작아집니다. 왜 장소에 따라 달라지는지가 오늘의 첫 질문입니다.'],
    ['함께 나눌 질문','“위성은 나를 어떻게 찾을까?” — 거리 정보 몇 개만으로 위치가 정해지려면 무엇이 필요할까?'],
    ['남는 것','칠판에 적힌 질문 한 줄. 이 질문이 LAB 01의 ROUND 1 도입 질문이 됩니다.']
  ],
  note:'답을 말해 주지 마세요. 질문만 세우고 넘어갑니다. 답은 다음 슬라이드에서 학생 스스로 화면을 만지며 찾습니다.'
});

slideCompare({
  time:'15:08–15:15', kicker:'수학이 등장하는 순간', title:'질문 한 줄이 성취기준으로 이어집니다',
  accent:C.blue,
  left:{ head:'학생이 던진 말', color:C.mute, rows:[
    ['현상','“건물 안에서는 위치가 부정확해요.”'],
    ['궁금증','“위성이 몇 개나 있어야 정해지나요?”'],
    ['직관','“원 세 개가 만나는 데가 나인가?”']
  ]},
  right:{ head:'교사가 꺼내는 수학', color:C.blue, rows:[
    ['원의 방정식','(x−a)² + (y−b)² = r²  — 위성 하나는 원 하나'],
    ['연립','원 두 개의 교점은 둘, 세 개면 하나로 확정됩니다'],
    ['오차','거리에 오차가 있으면 교점이 한 점에 모이지 않습니다 — 정확도 반경의 정체']
  ]},
  foot:'이 흐름이 오늘 만드는 모든 자료의 형태입니다 — 실생활 질문 → 수학 원리 → 조작 → 확인.',
  note:'여기서 LAB 01을 열어 “수학 원리” 칸의 1단계 식만 함께 봅니다. 나머지 단계는 체험 시간에 각자 봅니다.'
});

/* ============ 2부 체험 ============ */
divider({
  num:'2', time:'15:15 – 15:50 · 35분', title:'체험 — 학생 입장에서 만져 보기',
  sub:'완성된 실험실을 학생처럼 조작하고, 그다음 교사의 눈으로 분해합니다.\n“이 자료가 무엇으로 이루어져 있는가”를 알면 만드는 것은 그 조각을 채우는 일이 됩니다.',
  accent:C.teal,
  note:'이 구간의 목표는 두 가지입니다 — 재미를 느끼게 하는 것, 그리고 구조가 단순하다는 것을 알게 하는 것.'
});

slideActivity({
  no:'②', time:'15:15–15:32', title:'GPS 삼변측량 — 학생처럼 조작하기',
  accent:C.teal, min:'17분',
  goal:'LAB 01을 열어 다섯 가지 조작 미션을 수행하고,\n“무엇을 만지면 무엇이 바뀌는가”를 말로 정리한다',
  rows:[
    ['미션 5개','① 위성을 하나만 켜 본다 ② 두 개 ③ 세 개 ④ 거리에 오차를 준다 ⑤ 위성을 한쪽으로 몰아 본다'],
    ['확인 질문','위성 2개일 때 후보가 몇 개인가? 3개면 왜 하나로 정해지나? 위성을 한쪽으로 몰면 왜 오차가 커지나?'],
    ['교사의 눈','학생이 “정답 맞히기”가 아니라 “왜 그런가”를 말하게 하려면 어떤 발문을 붙여야 할까?'],
    ['남는 것','조작–관찰–설명 3줄 메모. 그대로 학생 활동지의 1번 문항이 됩니다.']
  ],
  note:'조작만 하면 놀이가 되고 발문이 붙으면 수업이 됩니다. 15분쯤에 “지금 발문 한 줄 적어 보세요”를 반드시 넣으세요.'
});

slideCards({
  time:'15:32–15:42', kicker:'구조 해체', title:'모든 실험실은 같은 뼈대 4블록입니다',
  accent:C.teal, cols:4, h:2.45,
  cards:[
    ['① 입력','학생이 만지는 것.\n슬라이더 · 체크박스 · 선택 상자 · 숫자 칸.\n\n예) 위성 개수, 거리 오차', C.blue],
    ['② 계산','수학 원리가 들어가는 자리.\n교과서 그대로의 식.\n\n예) (x−a)²+(y−b)²=r² 연립', C.teal],
    ['③ 시각화','계산 결과를 눈에 보이게.\n좌표평면 · 막대 · 점 · 색.\n\n예) 원 세 개와 교점', C.amber],
    ['④ 피드백','잘했는지 알려 주는 자리.\n숫자로 된 판정 기준.\n\n예) 오차 5 m 이내면 “성공”', C.rose]
  ],
  foot:'AI에게 시킬 때도 이 순서로 말합니다. 순서를 지키면 한 번에 통하고, 뒤섞으면 엉뚱한 것이 나옵니다.',
  note:'이 4블록이 오늘 연수의 문법입니다. 이후 모든 슬라이드에서 “지금 몇 번 블록인가”를 계속 짚어 주세요.'
});

slideActivity({
  no:'③', time:'15:42–15:50', title:'내가 고른 실험실 해체하기',
  accent:C.teal, min:'8분',
  goal:'실험실 24종 중 내 담당 단원에 가까운 것 하나를 골라\n입력·계산·시각화·피드백 네 칸을 직접 채운다',
  rows:[
    ['무엇을 하나','카드를 눌러 하나를 열고, 조작한 뒤 네 칸을 종이에 적습니다. 잘 모르겠으면 “수학 원리” 칸의 유도 과정을 펼쳐 봅니다.'],
    ['막히면','확장 카탈로그 303종에서 담당 단원으로 검색하세요. 실생활 질문과 결함 후보까지 이미 적혀 있습니다.'],
    ['확인 질문','내 자료의 “계산” 칸에 들어갈 식을 교과서 표기 그대로 한 줄로 쓸 수 있는가?'],
    ['남는 것','4칸 메모 한 장. 16:20 바이브 코딩에서 이 메모를 그대로 AI에게 불러 줍니다.']
  ],
  note:'이 메모가 없으면 뒤의 생성 단계에서 반드시 막힙니다. 순회하며 네 칸이 다 찼는지 눈으로 확인해 주세요.'
});

/* ============ 3부 개조 ============ */
divider({
  num:'3', time:'16:00 – 16:20 · 20분', title:'개조 — 한 줄만 고쳐 봅니다',
  sub:'만드는 것보다 훨씬 쉽고, 심리적 장벽은 여기서 무너집니다.\n“내가 고친 것이 화면에 나타났다”는 경험 하나면 충분합니다.',
  accent:C.amber,
  note:'AI 접속이 불안정해도 이 구간은 그대로 진행됩니다. 와이파이가 흔들리면 개조를 더 길게 가져가도 좋습니다.'
});

slideActivity({
  no:'④', time:'16:00–16:14', title:'스팸 분류기 — 단어 하나 바꾸기',
  accent:C.amber, min:'14분',
  goal:'베이즈 분류기의 단어 목록과 가중치를 고쳐\n판정 결과가 실제로 뒤집히는 것을 확인한다',
  rows:[
    ['초급 미션','스팸 단어 목록에 우리 학교에서 실제로 오는 문자의 단어를 하나 추가하고 결과를 다시 봅니다.'],
    ['중급 미션','가중치를 바꿔 “정상으로 분류되던 문자”가 스팸으로 뒤집히는 지점을 찾습니다. 그 경계값을 적어 두세요.'],
    ['도전 미션','판정 문구를 우리 반 학생에게 할 말로 바꿉니다. 예) “스팸일 확률 82% — 링크를 누르지 마세요”'],
    ['확인 질문','가중치를 조금 바꿨는데 결과가 크게 뒤집혔다면, 그것은 자료의 문제인가 모형의 문제인가?']
  ],
  note:'세 미션을 난이도별로 나눠 두면 빠른 사람도 늦은 사람도 각자 할 일이 있습니다. 도전 미션을 끝낸 사람은 모둠 튜터로 세우세요.'
});

slideCards({
  time:'16:14–16:20', kicker:'개조할 때 자주 나는 일', title:'세 가지 사고와 대처법',
  accent:C.amber, cols:3, h:2.25,
  cards:[
    ['화면이 하얗게 변했다','따옴표나 쉼표를 하나 지웠을 가능성이 큽니다.\n\n→ 되돌리기(Ctrl+Z)를 몇 번 누르고 새로고침. 그래도 안 되면 원본을 다시 받으세요.', C.rose],
    ['고쳤는데 안 바뀐다','저장을 안 했거나 새로고침을 안 한 경우입니다.\n\n→ 저장 → 새로고침 순서를 몸에 익히세요. 이 순서가 오늘 내내 반복됩니다.', C.amber],
    ['숫자가 이상하게 나온다','값의 범위를 벗어난 입력일 때가 많습니다.\n\n→ 오히려 좋은 재료입니다. “왜 이런 값이 나오나”가 학생에게 던질 최고의 발문이 됩니다.', C.teal]
  ],
  foot:'고장은 실패가 아니라 수업 재료입니다. 오늘 만난 고장 하나를 반드시 메모해 두세요.',
  note:'여기서 분위기가 풀립니다. 강사가 일부러 하나 고장 내 보이는 것도 좋습니다.'
});

/* ============ 4부 생성 ============ */
divider({
  num:'4', time:'16:20 – 16:55 · 35분', title:'생성 — AI와 7라운드 대화로 만들기',
  sub:'오늘의 핵심 구간입니다. 코드를 쓰지 않고 말로 7번 주고받으면\n내 단원 학습자료 하나가 완성됩니다.',
  accent:C.rose,
  note:'여기가 3시간의 심장입니다. 시간이 밀리면 다른 데를 줄이고 이 구간은 지키세요.'
});

slideTable({
  time:'16:20–16:26', kicker:'전체 지도', title:'7라운드 — 무엇을 언제 말하는가',
  accent:C.rose,
  headRow:['라운드','요청하는 것','핵심 요령'],
  colW:[2.3, 4.2, 5.61],
  rows:[
    ['ROUND 1  뼈대','HTML 한 파일로 빈 화면 만들기','“외부 라이브러리 금지 · 지금 할 것만” 두 줄을 반드시 붙입니다'],
    ['ROUND 2  수학 원리','식을 교과서 형태 그대로 지정','y = a(x−p)² + q 처럼 우리 교육과정 표기로 씁니다'],
    ['ROUND 3  학생 조작','무엇을 만지면 무엇이 바뀌는지','“슬라이더를 움직이면 ○○가 바뀐다”까지 명시합니다'],
    ['ROUND 4  시각화','화면에 그리기 → 그리고 눌러 본다','반드시 직접 조작해 봅니다. 여기 결함이 숨어 있습니다'],
    ['ROUND 5  ★ 결함 수정','증상을 화면 기준으로 설명','이 연수의 핵심. 다음 슬라이드에서 따로 다룹니다'],
    ['ROUND 6  활동·피드백','판정 기준을 숫자로','“오차 5% 이내면 성공”처럼 수치로 못 박습니다'],
    ['ROUND 7  교실 배포','모바일 · 안내문 3줄 · 학습 목표','학생에게 그대로 나가는 상태로 마무리합니다']
  ],
  foot:'한 라운드에 한 가지만 요청합니다. 한 번에 다 시키면 반드시 엉킵니다.',
  note:'표를 통째로 읽지 마세요. 1·2·3은 빠르게, 4와 5에서 멈춰 서세요.'
});

slideQuote({
  time:'16:26–16:34', kicker:'ROUND 5 · 이 연수의 핵심',
  big:'AI는 한 번에 맞히지 않습니다.\n증상을 화면 기준으로 말하면\n고쳐집니다.',
  sub:'4라운드 결과에는 반드시 눈에 보이는 결함이 하나 심어져 있습니다. 일부러입니다.\n“고장 난 것을 말로 고쳐 본 경험”이 있어야 학교에 돌아가서도 혼자 만들 수 있습니다.',
  accent:C.rose,
  note:'가장 중요한 슬라이드입니다. 여기서 30초 정도 침묵을 두어도 좋습니다. 이 문장 하나가 오늘의 메시지입니다.'
});

slideCompare({
  time:'16:34–16:40', kicker:'ROUND 5 실제 사례 ①', title:'급수 — 발산인데 “수렴합니다”라고 뜹니다',
  accent:C.rose,
  left:{ head:'ROUND 4 결과 (결함)', color:C.rose, rows:[
    ['화면','조화급수 Σ1/k 를 골라도 “수렴합니다”라고 표시됩니다'],
    ['왜','y축이 마지막 부분합에 맞춰 자동으로 늘어나 어떤 급수든 곡선이 평평해 보이고, 판정도 “마지막 변화량이 작으면 수렴”으로 되어 있습니다'],
    ['교사가 할 말','“y축이 자동으로 늘어나서 다 평평해 보여. 판정을 변화량이 아니라 급수의 종류로 해 줘.”']
  ]},
  right:{ head:'ROUND 5 결과 (수정)', color:C.teal, rows:[
    ['화면','y축을 6으로 고정하니 조화급수만 끝없이 올라갑니다'],
    ['수학','항이 0으로 가는 것은 수렴의 필요조건일 뿐입니다. Σ1/k 가 바로 그 반례입니다'],
    ['수업 연결','“느린 것”과 “수렴하는 것”은 다르다 — 수렴판정법이 왜 필요한지 학생이 스스로 말하게 됩니다']
  ]},
  foot:'결함을 고치는 과정이 곧 수학 개념을 정확히 말하는 과정이 됩니다.',
  note:'이 사례는 미적분Ⅱ 담당 선생님께 특히 잘 먹힙니다. 조화급수 발산은 눈으로는 절대 안 보인다는 점을 강조하세요.'
});

slideCompare({
  time:'16:40–16:44', kicker:'ROUND 5 실제 사례 ② ③', title:'같은 방식으로 고쳐지는 다른 결함들',
  accent:C.rose,
  left:{ head:'테일러 근사 — 차수를 올릴수록 나빠진다', color:C.rose, rows:[
    ['증상','5차인데 x = 2 에서 오차가 4.82. 차수를 올리면 곡선이 화면 밖으로 튑니다'],
    ['원인','계수의 분모에 계승 k! 대신 k 를 썼습니다'],
    ['고친 뒤','같은 5차에서 오차 0.024 — 분모 하나가 근사의 성패를 가릅니다']
  ]},
  right:{ head:'회전체 — 부피가 정확히 4배로 나온다', color:C.rose, rows:[
    ['증상','원판을 60개로 늘려도 합이 112.7. 정확값은 28.27입니다'],
    ['원인','원판의 반지름 자리에 지름을 넣었습니다'],
    ['고친 뒤','28.16 — 오차 0.39%. πr²에서 r 이 무엇인지가 전부였습니다']
  ]},
  foot:'세 사례 모두 “화면에 보이는 이상한 점”을 말했더니 고쳐졌습니다. 코드를 읽을 필요가 없었습니다.',
  note:'두 사례를 빠르게 지나가되, “원인이 전부 수학 개념 하나였다”는 점을 짚어 주세요.'
});

slideBullets({
  time:'16:44–16:47', kicker:'말하는 법', title:'증상을 말하는 문장 틀 — 이대로 쓰면 통합니다',
  accent:C.rose,
  lead:'AI에게 “안 돼요”라고 하면 못 고칩니다. 아래 세 칸을 채워 말하면 거의 한 번에 고쳐집니다.',
  items:[
    ['① 어디서 — 화면의 위치를 말합니다','“오른쪽 그래프에서”, “결과 문구가 나오는 칸에서”, “슬라이더를 끝까지 올렸을 때”'],
    ['② 무엇이 — 눈에 보이는 것을 그대로 말합니다','“빨간 곡선이 위아래로 튀어 화면을 벗어납니다”, “조화급수인데 수렴이라고 뜹니다”'],
    ['③ 어떻게 되어야 하는지 — 기준을 숫자나 수학 용어로','“y축을 6으로 고정해 줘”, “원판의 반지름은 f(x) 자체야”, “정의역을 x ≥ 1 로 제한해 줘”'],
    ['금지어','“이상해요”, “예쁘게 해 주세요”, “좀 더 잘” — 이런 말은 반영되지 않습니다'],
    ['이것이 수업 역량입니다','학생의 오답을 “틀렸어”가 아니라 “여기서 이렇게 되었으니 이렇게 보자”로 바꾸는 일과 똑같습니다']
  ],
  foot:'실습에서 이 문장 틀을 화면 옆에 띄워 두세요. 참가자가 가장 많이 다시 보는 슬라이드입니다.',
  note:'“막연한 말은 일부러 반영되지 않는다”는 점을 실제로 시연해 보이면 효과가 큽니다.'
});

slideActivity({
  no:'⑤', time:'16:47–16:55 (이후 계속)', title:'내 단원으로 7라운드 완주하기',
  accent:C.rose, min:'25분',
  goal:'15:42에 적은 4칸 메모를 재료로\n내 담당 단원 학습자료 하나를 7라운드로 완성한다',
  rows:[
    ['시작','탭②에서 내 단원과 가장 가까운 실험실을 고르고 ROUND 1부터 시작합니다. 모범 프롬프트를 넣은 뒤 그 뒤에 내 말을 덧붙이세요.'],
    ['덧붙이는 말이 실제로 반영됩니다','“그래프를 초록색으로” · “글씨를 크게” · “제목을 "우리 반 표본 조사"로” — 화면이 그만큼 실제로 달라집니다.'],
    ['ROUND 5에서 멈추세요','결함을 찾고, 앞 슬라이드의 세 칸 문장 틀로 말해 보세요. 여기서 오늘의 배움이 일어납니다.'],
    ['남는 것','완성된 HTML 파일 1개 + 내가 쓴 프롬프트 기록. 둘 다 저장해 두세요 — 다음 자료의 재료입니다.']
  ],
  note:'25분 개인 실습입니다. 강사는 계속 순회하세요. 5분마다 “지금 몇 라운드인지” 손 들어 확인하면 속도가 맞춰집니다.'
});

slideCards({
  kicker:'막힐 때', title:'주제가 안 떠오르면 카탈로그에서 고르세요',
  accent:C.blue, cols:3, h:2.1,
  cards:[
    ['확장 카탈로그 303종','2022 개정 19개 과목 132개 단원을 덮습니다. 중학교는 학년순, 고등학교는 과목순으로 정렬되어 있습니다.', C.blue],
    ['항목마다 재료가 이미 있습니다','실생활 질문(ROUND 1) · ROUND 4에 심을 결함 후보 · 학교급/단원 · AI 연결 지점. 그대로 복사해 쓰면 됩니다.', C.teal],
    ['결함 후보가 없으면 만들지 마세요','“아직 설계되지 않음”으로 표시된 항목은 결함이 비어 있습니다. ROUND 5가 성립하지 않으므로 다른 것을 고르세요.', C.amber]
  ],
  foot:'실험실 24종 + 카탈로그 303종 = 327종. 담당 단원이 없는 선생님은 없습니다.',
  note:'실제로 화면에서 과목 필터를 눌러 담당 과목을 찾아 주는 시연을 1분만 하세요.'
});

/* ============ 5부 완성 ============ */
divider({
  num:'5', time:'17:05 – 17:35 · 30분', title:'완성 — 수업과 평가로 잇기',
  sub:'자료를 만든 것으로 끝나면 일회성 활동입니다.\n성취기준 · 루브릭 · 학생 활동지까지 이어야 다음 학기에 실제로 씁니다.',
  accent:C.teal,
  note:'여기서 “활동은 좋은데 평가를 못 해서 못 쓴다”는 현실적 장벽을 해결합니다.'
});

slideBullets({
  time:'17:05–17:12', kicker:'설계 5단계', title:'만든 자료를 수행평가로 바꾸는 순서',
  accent:C.teal,
  items:[
    ['① 성취기준 고르기','내 자료가 실제로 평가하는 것 하나만 고릅니다. 두 개 이상 고르면 루브릭이 흐려집니다.'],
    ['② 평가 장면 정하기','조작 결과를 “설명하게” 할 것인가, “예측하게” 할 것인가, “설계하게” 할 것인가.'],
    ['③ 루브릭 쓰기','활동의 판정 기준이 그대로 “상” 기준입니다. 새로 만들 필요가 없습니다.'],
    ['④ 학생 활동지 만들기','탐구 과정을 단계별로 기록하게 합니다. 탭④에서 내려받아 내 단원에 맞게 고칩니다.'],
    ['⑤ 세특 문장 준비','활동에서 관찰할 수 있는 행동을 미리 문장으로 적어 둡니다.']
  ],
  foot:'③이 핵심입니다 — 활동을 만들 때 이미 루브릭의 절반을 쓴 것입니다.',
  note:'참가자 대부분이 ③에서 “아, 그러네”라고 반응합니다. 이 지점을 놓치지 마세요.'
});

slideCompare({
  time:'17:12–17:18', kicker:'실제 수행평가 2건', title:'이미 학교에서 시행한 사례를 그대로 씁니다',
  accent:C.teal,
  left:{ head:'우리 동네 최적 입지 (도형의 방정식)', color:C.blue, rows:[
    ['상황','구글 지도 위에 후보지를 찍고, 거리 조건을 만족하는 지점을 찾습니다'],
    ['수학','두 점에서 같은 거리 → 수직이등분선 · 원의 방정식 · 연립'],
    ['평가','후보지 선정 근거를 수학적으로 설명 · 조건을 바꾸면 답이 어떻게 달라지는지 논술']
  ]},
  right:{ head:'y = x 대칭의 발견 (역함수)', color:C.teal, rows:[
    ['상황','여러 함수의 역함수를 직접 구하고 그래프를 겹쳐 봅니다'],
    ['수학','(a,b) ∈ f ⟺ (b,a) ∈ f⁻¹ · 정의역과 치역의 교환'],
    ['평가','공통점을 학생이 스스로 진술 · 정의역 제한의 이유를 설명']
  ]},
  foot:'두 건 모두 채점기준표 · 학생 활동지 · 교사 안내 자료가 탭④에 그대로 들어 있습니다.',
  note:'실물 문서를 화면에서 내려받아 보여 주세요. “이걸 그냥 쓰셔도 됩니다”가 가장 반응이 좋습니다.'
});

slideActivity({
  no:'⑥', time:'17:18–17:35', title:'내 루브릭 3줄 쓰기',
  accent:C.teal, min:'17분',
  goal:'내가 만든 자료의 판정 기준을 그대로 옮겨\n상·중·하 3단계 채점기준을 완성한다',
  rows:[
    ['상 기준','ROUND 6에서 정한 숫자 기준을 그대로 씁니다. 예) “오차 5% 이내로 맞추고, 왜 그런지 수학적으로 설명한다”'],
    ['중 기준','결과는 맞았으나 설명이 부족한 경우를 씁니다. 조작은 했지만 근거가 직관에 머무는 상태입니다.'],
    ['하 기준','조작 자체가 이루어지지 않은 경우. 여기서 “기본 점수”가 최저점의 바닥이 됩니다.'],
    ['남는 것','3줄 루브릭 + 학생 활동지 초안. 탭④에서 문서로 내려받아 저장하세요.']
  ],
  note:'“3줄이면 됩니다”라고 못 박아 주세요. 완벽한 루브릭을 쓰려다 아무도 못 끝내는 것이 가장 흔한 실패입니다.'
});

/* ============ 6부 공유 ============ */
divider({
  num:'6', time:'17:35 – 17:55 · 20분', title:'공유 — 갤러리 워크와 모음집',
  sub:'각자 만든 것을 서로 조작해 봅니다.\n남의 자료를 만져 보는 20분이 오늘 배운 것을 두 배로 만듭니다.',
  accent:C.amber,
  note:'가장 활기찬 구간입니다. 시간이 밀렸다면 5부를 줄이고 여기는 지키세요.'
});

slideBullets({
  time:'17:35–17:40', kicker:'운영 방법', title:'갤러리 워크 — 호스트 4분 교대',
  accent:C.amber,
  items:[
    ['자리 배치','한 모둠에 4~5명. 각자 자기 화면을 열어 둡니다.'],
    ['호스트 4분','한 사람이 자기 자리에 남아 설명합니다. 나머지는 다른 자리로 이동해 직접 조작합니다.'],
    ['포스트잇 2장','잘된 점 1장 · 묻고 싶은 것 1장. 반드시 손으로 써서 그 자리에 붙입니다.'],
    ['교대','4분마다 호스트를 바꿉니다. 4회 돌면 모둠 전원이 한 번씩 설명하게 됩니다.'],
    ['금지 사항','“잘 만드셨네요”만 쓰지 않기. 구체적으로 어디가 왜 좋았는지 한 줄로 씁니다.']
  ],
  foot:'이 방식은 그대로 교실에서 학생 산출물 공유에 쓸 수 있습니다 — 오늘 겪은 것이 곧 수업 기법입니다.',
  note:'타이머를 화면에 띄우세요. 4분을 넘기면 순회가 무너집니다.'
});

slideActivity({
  no:'⑦', time:'17:40–17:55', title:'모음집에 올리고 우수작 승격하기',
  accent:C.amber, min:'15분',
  goal:'내 HTML을 모음집에 올리고,\n모둠에서 뽑은 우수작을 확장 카탈로그로 승격시킨다',
  rows:[
    ['업로드','탭⑤에서 학년·과목·단원·주제를 적고 내 파일을 올립니다. 넷 다 채워야 나중에 검색이 됩니다.'],
    ['우수작 승격','모둠에서 하나를 뽑아 “카탈로그로 옮기기”를 누릅니다. 다음 연수의 재료가 됩니다.'],
    ['반드시 내려받기','모음집은 새로고침하면 사라집니다. 마무리 전에 하나로 묶어 전원에게 배포하세요.'],
    ['학교로 가져가기','받은 파일 하나를 동교과 선생님께 그대로 전달하면 됩니다. 설치도 계정도 필요 없습니다.']
  ],
  note:'★ 내려받기를 빠뜨리면 오늘 산출물이 전부 사라집니다. 이 슬라이드에서 반드시 소리 내어 확인하세요.'
});

/* ============ 7부 마무리 ============ */
divider({
  num:'7', time:'17:55 – 18:00 · 5분', title:'마무리 — 윤리와 다음 걸음',
  sub:'AI를 쓰는 수업에는 반드시 따라붙는 질문이 있습니다.\n그리고 오늘 만든 것을 2학기에 실제로 쓰기 위한 한 줄을 적고 마칩니다.',
  accent:C.blue,
  note:'5분입니다. 빠르게, 그러나 윤리 항목은 빠뜨리지 마세요.'
});

slideCards({
  kicker:'AI 활용 수업 체크리스트', title:'학생과 함께 확인할 네 가지',
  accent:C.blue, cols:4, h:2.55,
  cards:[
    ['데이터 출처','이 자료의 숫자는 어디서 왔는가. 실측인가, 공공데이터인가, 만들어 낸 값인가.\n\n출처를 밝히는 것 자체가 통계 단원의 성취기준입니다.', C.blue],
    ['개인정보','학생의 실제 위치·성적·연락처를 넣지 않습니다.\n\n필요하면 가명·가상 데이터로 바꿔 씁니다.', C.rose],
    ['AI의 한계','AI가 만든 코드에 결함이 있었다는 것을 오늘 직접 보았습니다.\n\n확인하지 않고 쓰지 않는다 — 학생에게도 같은 기준을 요구합니다.', C.amber],
    ['저작권·표절','AI가 만든 산출물을 학생 과제로 그대로 내지 않습니다.\n\n“무엇을 AI에게 시켰고 무엇을 내가 판단했는지” 기록하게 합니다.', C.teal]
  ],
  foot:'이 네 가지는 학생 활동지 마지막 장에 그대로 실려 있습니다.',
  note:'“AI의 한계”는 오늘 ROUND 5에서 직접 겪은 일이므로 설득력이 큽니다. 그 경험과 연결해 말하세요.'
});

slideBullets({
  kicker:'다음 걸음', title:'2학기에 실제로 해 볼 하나를 지금 고르세요',
  accent:C.blue,
  lead:'세 단계 중 하나에 동그라미를 치고 나가시면 됩니다. 하나면 충분합니다.',
  items:[
    ['바로 — 다음 수업에 그대로','오늘 만든 자료를 다음 주 수업에서 도입 5분에 씁니다. 활동지 없이 화면만 띄워도 됩니다.'],
    ['심화 — 수행평가로','오늘 쓴 3줄 루브릭을 다듬어 2학기 수행평가 1건으로 편성합니다.'],
    ['프로젝트 — 학생이 만들게','학생이 직접 AI와 7라운드로 자기 자료를 만들게 합니다. 프롬프트 기록이 평가 자료가 됩니다.'],
    ['동교과 공유','받은 모음집 파일을 교과협의회에서 열어 보여 주세요. 설명이 필요 없습니다 — 그냥 눌러 보면 됩니다.']
  ],
  foot:'오늘 만든 것을 쓰지 않으면 3시간은 사라집니다. 날짜를 지금 적어 두세요.',
  note:'실제로 손을 들게 하세요. “바로 하실 분?” — 손이 올라가면 그 자리에서 날짜를 적게 합니다.'
});

slideCards({
  kicker:'운영 안전장치', title:'무엇이 잘못돼도 연수는 멈추지 않습니다',
  accent:C.mute, cols:3, h:1.7,
  cards:[
    ['단일 HTML 파일 원칙','설치·서버·로그인이 없습니다. 파일 하나면 어디서든 동일하게 열립니다.', C.blue],
    ['USB · 인쇄 병행 배포','완성본과 프롬프트 카드를 종이로도 나눕니다. 무연결 상황을 전제로 설계했습니다.', C.teal],
    ['필수·도전 과제 분리','개조까지가 필수, 생성은 도전입니다. 빠른 참가자는 모둠 튜터로 돌립니다.', C.amber],
    ['모음집은 반드시 내려받기','새로고침하면 사라집니다. 마무리 전에 묶어서 전원 배포합니다.', C.rose],
    ['AI가 끊겨도 진행','탭①·④·⑤는 인터넷 없이 그대로 동작합니다. 생성 구간만 개조로 대체합니다.', C.blue],
    ['2인 1조 대비','노트북이 부족해도 진행됩니다. 단, “만드는 사람”을 번갈아 맡게 하세요.', C.teal]
  ],
  note:'강사용 슬라이드입니다. 참가자에게는 빠르게 넘겨도 되지만, 공동 강사가 있다면 함께 확인하세요.'
});

/* ---------- 마지막 ---------- */
(function last(){
  const s = base(C.blue, {chrome:false});
  s.background = { color: C.dark };
  s.addShape(pres.ShapeType.rect, { x:0, y:0, w:W, h:0.085, fill:{color:C.blue} });
  s.addText('오늘 만든 것을 다음 주에 쓰시면\n이 3시간은 끝나지 않습니다.',
    { x:M, y:2.1, w:CW, h:2.0, fontSize:40, bold:true, color:'FFFFFF', fontFace:F,
      valign:'middle', lineSpacingMultiple:1.2 });
  s.addShape(pres.ShapeType.line, { x:M, y:4.3, w:4.2, h:0, line:{color:C.blue, width:3} });
  s.addText('일상 속 수학 실험실 · 실험실 24종 · 확장 카탈로그 303종 · 바이브 코딩 7라운드',
    { x:M, y:4.55, w:CW, h:0.4, fontSize:14, color:'94A3B8', fontFace:F });
  s.addText('2026 대전광역시교육청 인공지능 활용 선도교사 연수 (중등 수학)\n대전대신고등학교  하진수',
    { x:M, y:5.6, w:8, h:0.9, fontSize:15, color:'CBD5E1', fontFace:F, lineSpacingMultiple:1.3 });
  s.addNotes('마무리 인사. 질문은 남은 시간에 개별로 받습니다. 모음집 파일 배포 여부를 마지막으로 한 번 더 확인하세요.');
})();

await pres.writeFile({ fileName: OUT });
console.log('생성 완료:', OUT);
console.log('슬라이드 수:', page + 10, '(구획 표지·표지 포함)');
