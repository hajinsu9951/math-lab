// 사용법: node worklog-prepend.mjs <커밋해시>
// 주의: PowerShell 의 Get-Content/Out-File 로 이 파일을 편집하지 말 것 — 한글이 깨진다.
import fs from 'node:fs';
const HASH = process.argv[2];
if (!HASH) throw new Error('커밋 해시를 인자로 주세요');
const ADD = fs.readFileSync('C:/Users/user/claude-work/math-lab-326/worklog-add.md', 'utf8');
const G = 'G:/내 드라이브/2026_대전교육청_인공지능 연수 설계안 개발 연구회/WORKLOG.md';
const E = 'E:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/WORKLOG.md';
let base = fs.readFileSync(G, 'utf8').replace(/^\uFEFF/, '');
if (base.includes(HASH)) throw new Error('이미 기록됨: ' + HASH);
if (!ADD.includes(HASH)) throw new Error('worklog-add.md 에 해시가 없습니다: ' + HASH);
const out = ADD + base;
fs.writeFileSync(G, out, 'utf8');
fs.writeFileSync(E, out, 'utf8');
console.log('WORKLOG 갱신:', out.length, '자 / 첫 줄:', out.split('\n')[0]);
console.log('E 검증:', fs.readFileSync(E, 'utf8').split('\n')[0]);
