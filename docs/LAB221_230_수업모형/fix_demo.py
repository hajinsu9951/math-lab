# -*- coding: utf-8 -*-
"""LAB 224 qcChartDemo — 기록이 없을 때 「벗어난 날 0」 이라고 말하던 것을 고친다.

read() 의 마지막 열은 관리 한계를 벗어난 날의 수인데, 아직 기록을 만들지 않은
상태에서도 0 을 돌려주었다. 「0일 벗어났다」와 「아직 재지 않았다」는 전혀 다른
말이고, 탐구 보고서 표에도 0 이 쌓여 안정된 공정처럼 읽힌다.
기록이 없으면 그렇다고 말하게 바꾼다.

사용: python docs/LAB221_230_수업모형/fix_demo.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OLD = ("      return [(p*100).toFixed(1)+'%',n,mu.toFixed(2),ucl.toFixed(1),\n"
       "        S.data.filter(v=>v>ucl||v<lcl).length]; } });")
NEW = ("      return [(p*100).toFixed(1)+'%',n,mu.toFixed(2),ucl.toFixed(1),\n"
       "        S.data.length ? S.data.filter(v=>v>ucl||v<lcl).length : '기록 없음']; } });")


def main(path):
    h = open(path, encoding='utf-8').read()
    if "'기록 없음'" in h:
        sys.stdout.write('이미 반영됨\n')
        return
    assert h.count(OLD) == 1, '앵커가 %d곳 — 멈춘다' % h.count(OLD)
    h = h.replace(OLD, NEW, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('qcChartDemo read() — 기록이 없으면 「기록 없음」 으로\n')


if __name__ == '__main__':
    main(sys.argv[1])
