# -*- coding: utf-8 -*-
"""수업 모형을 실제 브라우저에서 띄워, 사다리가 켜자마자 통과되는지 센다.

정적 분석으로는 「늘 보이는 글」을 다 가려내지 못한다 (draw() 가 조건 없이 찍는 줄이 있다).
그래서 dist 를 띄워 lessonFlow 를 돌려 보고 진행도가 0/3 이 아닌 것을 찾는다.

사용: node 로 돌리는 test/verify.mjs 와 달리, 이 파일은 브라우저 콘솔에 붙여 넣을
      스크립트를 찍어 준다 (Playwright 없이도 확인할 수 있게).
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

SNIPPET = r"""
(() => {
  const bad = [];
  for (const k of Object.keys(LESSON)) {
    const no = +k;
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:900px';
    document.body.appendChild(host);
    let p = null;
    try { lessonFlow(host, LESSON[no], {}); p = host.querySelector('.ldp'); } catch (e) {}
    const t = p ? p.textContent.trim() : '';
    host.remove();
    if (t && t !== '0 / 3') bad.push(no + ':' + t);
  }
  return { 켜자마자통과: bad.length, 목록: bad };
})()
"""

if __name__ == '__main__':
    sys.stdout.write(SNIPPET)
