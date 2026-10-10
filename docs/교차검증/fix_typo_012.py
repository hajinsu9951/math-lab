# -*- coding: utf-8 -*-
"""LAB 12 탐구 노트 ②의 오타 — 「며 배」 → 「몇 배」 (② 교육과정과 평가).

학생이 그대로 읽고 활동지로 인쇄해 나가는 지시문이다.
docs/교차검증/scan_typos.py 가 356종·350종 전체에서 찾아낸 유일한 오타다.

사용: python docs/교차검증/fix_typo_012.py src/40-demos.js
"""
import io
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OLD = '값을 적고, 며 배가 되었는지 구하세요'
NEW = '값을 적고, 몇 배가 되었는지 구하세요'


def main(path):
    s = io.open(path, encoding='utf-8').read()
    if OLD not in s:
        sys.stdout.write('이미 고쳐져 있습니다\n')
        return 0
    assert s.count(OLD) == 1, s.count(OLD)
    io.open(path, 'w', encoding='utf-8').write(s.replace(OLD, NEW, 1))
    sys.stdout.write('LAB 12 노트 ②의 「며 배」 를 「몇 배」 로 고쳤습니다\n')
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
