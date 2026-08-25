// 구문 오류가 난 줄 찾기 — 앞에서부터 조금씩 늘려 가며 파싱
import fs from 'node:fs';
const lines = fs.readFileSync('src/40-demos.js', 'utf8').split('\n');
let lo = 1, hi = lines.length;
const ok = n => { try { new Function(lines.slice(0, n).join('\n') + '\n});'.repeat(0)); return true; } catch (e) { return !/Unexpected string/.test(e.message); } };
for (let i = 1; i <= lines.length; i++) {
  try { new Function(lines.slice(0, i).join('\n')); }
  catch (e) {
    if (/Unexpected string/.test(e.message)) {
      console.log('의심 줄', i, ':', lines[i - 1].slice(0, 160));
      console.log('앞 줄', i - 1, ':', lines[i - 2] ? lines[i - 2].slice(0, 160) : '');
      break;
    }
  }
}
