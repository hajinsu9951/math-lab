// 176 S3 신호가 데모 자체의 설명문과 겹쳐 열자마자 켜졌다 → 계산값이 드러나는 문구로 교체
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
if (M['176'][2].re !== '군더더기가 붙습니다') throw new Error('현재 신호: ' + M['176'][2].re);
M['176'][2].re = '비가 0\\.01745 로 갑니다';
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);

/* 데모 안 문구(설명문 포함)와 겹치는지 다시 확인 */
const demo = s.slice(s.indexOf('function sincLimitDemo'), s.indexOf('function sincLimitDemo') + 4000);
const hit = demo.split('비가 0.01745 로 갑니다').length - 1;
console.log('신호 교체 완료 — 데모 안 등장 횟수(출력 1회여야 정상):', hit);
