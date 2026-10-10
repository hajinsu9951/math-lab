# -*- coding: utf-8 -*-
"""뽑아 둔 재료를 사람이 읽을 글로 펴 본다 — 집필 중에 참조하는 용도.

사용: python docs/단행본/read.py docs/단행본/재료_중1.json [번호…]
      python docs/단행본/read.py docs/단행본/재료_중1.json --목차
"""
import json
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

TAG = re.compile(r'</?[A-Za-z][^<>]*>')


def plain(t):
    t = TAG.sub('', str(t or ''))
    return ' '.join(t.split())


def main(argv):
    path = argv[0]
    rest = argv[1:]
    data = json.load(open(path, encoding='utf-8'))
    if rest and rest[0] == '--목차':
        for x in data:
            sys.stdout.write('LAB %3d  %-34s  %s\n'
                             % (x['n'], plain(x['title'])[:34], ' · '.join(x['unit'])))
        return 0
    want = set(int(v) for v in rest) if rest else None
    for x in data:
        if want and x['n'] not in want:
            continue
        w = sys.stdout.write
        w('\n' + '═' * 72 + '\n')
        w('LAB %d · %s\n' % (x['n'], plain(x['title'])))
        w('단원: %s\n' % ' · '.join(x['unit']))
        w('AI·실생활: %s\n' % ' · '.join(x['ai']))
        w('\n[오늘의 문제] %s\n' % plain(x['problem']['q']))
        w('[화면 안내] %s\n' % plain(x['problem']['sit']))
        for i, f in enumerate(x['problem']['figs']):
            w('  삽화%d: %s\n' % (i + 1, plain(f['cap'])[:150]))
        for i, t in enumerate(x['predict']):
            w('[예상%d] %s\n' % (i + 1, plain(t)))
        for i, m in enumerate(x['missions']):
            w('[미션%d] %s   ← 신호 「%s」\n' % (i + 1, plain(m['t']), m['re']))
            if m['do']:
                w('     해볼 것: %s\n' % plain(m['do']))
            if m['hand']:
                w('     손으로: %s\n' % plain(m['hand']))
        if x['inquiry']:
            q = x['inquiry']
            w('[탐구] %s\n' % plain(q['title']))
            for i, t in enumerate(q['q']):
                w('   %d) %s\n' % (i + 1, plain(t)))
            w('   기록표: %s\n' % ' | '.join(plain(c) for c in q['cols']))
            if q['hint']:
                w('   %s\n' % plain(q['hint']))
        if x['note']:
            w('[탐구 노트] %s\n' % plain(x['note']['h']))
            for i, c in enumerate(x['note']['cards']):
                w('   %d. %s\n      식: %s\n' % (i + 1, plain(c['t']), plain(c['f'])))
                if c['opts']:
                    for k, o in enumerate(c['opts']):
                        w('      %s %s\n' % ('✔' if k == 0 else '✗', plain(o)))
        a = x['apply']
        w('[적용] %s\n   답 %s (±%s)\n' % (plain(a['q']), a['a'], a['tol']))
        if a['hint']:
            w('   힌트: %s\n' % plain(a['hint']))
        w('   해설: %s\n' % plain(a['why']))
        if x['prin']:
            P = x['prin']
            w('[수학 원리] %s\n' % plain(P['what']))
            if P['eq']:
                w('   핵심 식: %s\n' % plain(P['eq']))
            for i, t in enumerate(P['tex']):
                w('   %d단계  %s\n        %s\n' % (i + 1, t['t'], plain(t['s'])))
            if P['probe']:
                w('   확인: %s\n' % plain(P['probe']))
    return 0


if __name__ == '__main__':
    main(sys.argv[1:])
