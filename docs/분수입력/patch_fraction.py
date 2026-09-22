# -*- coding: utf-8 -*-
"""수학 노트의 칸에 분수로 적어도 통과하게 한다.

무엇이 문제였나
  노트의 숫자 칸은 parseFloat 로만 읽었다. 그래서 「16/20」 처럼 <b>분수로 적으면 16</b> 으로 읽혀 틀렸다고 나왔다.
  표에서 세어 온 값은 원래 분수 꼴이 자연스럽다 — 16/20 · 4/80 · 9/108 처럼.

어떻게 고치나
  다섯 실험실(LAB 01·02·03·04·21)의 `num()` 을 분수를 읽는 것으로 바꾼다.
  · 「16/20」 · 「4/5」 · 「0.8」 모두 0.8 로 읽는다
  · 「26,000」 처럼 쉼표가 있어도 읽는다
  · 분모가 0 이면 답이 없는 것으로 둔다

사용: python docs/분수입력/patch_fraction.py src/40-demos.js
"""
import sys

OLD = "const num=el=>{ const v=parseFloat(String(el.value).replace(/[^0-9.\\-]/g,'')); return isFinite(v)?v:NaN; };"

NEW = ("const num=el=>{ /* 분수로 적어도 읽는다 — 16/20 · 4/5 · 0.8 모두 같은 값 */\n"
       "    const t=String(el.value).replace(/[\\s,]/g,'').replace(/[^0-9.\\/\\-]/g,'');\n"
       "    if(!t) return NaN;\n"
       "    const f=t.match(/^(-?\\d+(?:\\.\\d+)?)\\/(-?\\d+(?:\\.\\d+)?)$/);\n"
       "    if(f){ const d=parseFloat(f[2]); return d===0?NaN:parseFloat(f[1])/d; }\n"
       "    const v=parseFloat(t); return isFinite(v)?v:NaN; };")


def main(path):
    h = open(path, encoding='utf-8').read()
    n = h.count(OLD)
    if n == 0:
        if '분수로 적어도 읽는다' in h:
            print('이미 반영됨 (', h.count('분수로 적어도 읽는다'), '곳 )')
            return
        raise AssertionError('num() 자리를 못 찾음 — 원본이 바뀌었는지 확인할 것')
    h = h.replace(OLD, NEW)
    open(path, 'w', encoding='utf-8').write(h)
    print('분수 입력 허용 —', n, '곳 고침')


if __name__ == '__main__':
    main(sys.argv[1])
