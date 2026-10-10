# -*- coding: utf-8 -*-
"""단행본 원고를 세 사람의 눈으로 미리 훑는다 — 사람이 읽기 전에 기계가 먼저 센다.

세 눈
  ① 수학 교사(교실 운영)   — 책이 「」로 부른 화면의 이름이 실제로 있는가
  ② 고교 교사(교육과정·평가) — 확인 안 된 성취기준 코드를 적지 않았는가 · 장의 짜임이 갖춰졌는가
  ③ 수학 교수(엄밀성)       — 사실 주장에 출처가 달렸는가 · 출처가 대장에 등록되었는가

소단원(@sec·@sub·@deep·@story 같은 블록) 단위로 세어, 어느 토막에서 빠졌는지까지 짚는다.

사용: python docs/단행본/check.py docs/단행본/중1.json
"""
import io
import json
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build as B                                            # noqa: E402

# 사실 주장으로 볼 신호 — 연도·인명·기관·수치가 든 문장
YEAR = re.compile(r'(기원전\s*)?\b1[0-9]{3}\b|\b20[0-2][0-9]\b|기원전\s*[0-9]{2,4}')
NAME = re.compile(r'(가우스|유클리드|브라마굽타|파스칼|데카르트|드 모르간|아르키메데스|'
                  r'나이팅게일|플레이페어|튜키|오일러|피어슨|갈릴레이|리베스트|쇼어|'
                  r'매서리스|슈티펠|셀시우스|메톤|알콰리즈미|브루넬레스키|프로클로스)')
CITE = re.compile(r'\[\^([A-Za-z0-9_\-]+)\]')
QUOTE = re.compile(r'「([^」]{2,30})」')
ACT = re.compile(r'(누르|눌러|클릭|고르|골라|켜|선택|끌어)')
CODE = re.compile(r'9수0[0-9]-[0-9]{2}')

# 장이 갖춰야 할 블록 (서사 중심 확장판)
NEED = ['story', 'predict', 'screen', 'm1', 'm2', 'm3', 'note', 'hand',
        'apply', 'ex', 'term', 'teacher', 'career', 'qr', 'history', 'deep', 'extend']


def blocks_of(path):
    meta, blks = B.parse(path)
    return meta, blks


def seg_name(b, i):
    k, arg = b['kind'], b['arg']
    if k in ('sec', 'sub', 'deep', 'story', 'history'):
        return '%s %s' % (k, arg[:26])
    return '%s' % k


def main(volpath):
    V = json.load(io.open(volpath, encoding='utf-8'))
    base = os.path.dirname(os.path.abspath(volpath))
    B.load_facts(base)
    labdir = os.path.join(base, V['dir'])

    # 실험실 화면의 이름 목록 — ①의 대조표
    screen = {}
    scr = os.path.join(base, '화면이름.json')
    if os.path.exists(scr):
        screen = json.load(io.open(scr, encoding='utf-8'))

    nos, no = [], 0
    for p in V['parts']:
        for lab in p['chapters']:
            no += 1
            nos.append((no, lab, os.path.join(labdir, 'ch%02d.txt' % no)))

    bad1, bad2, bad3, bad3b = [], [], [], []
    seen_chaps = 0
    for no, lab, path in nos:
        if not os.path.exists(path):
            continue
        seen_chaps += 1
        meta, blks = blocks_of(path)
        kinds = set(b['kind'] for b in blks)

        # ② 짜임 — 빠진 블록
        miss = [k for k in NEED if k not in kinds]
        if miss:
            bad2.append((no, '빠진 토막: ' + ' · '.join(miss)))
        # ② 확인 안 된 성취기준 코드
        whole = io.open(path, encoding='utf-8').read()
        if CODE.search(whole):
            bad2.append((no, '확인되지 않은 성취기준 코드가 있음: '
                         + ' '.join(sorted(set(CODE.findall(whole))))))

        for bi, b in enumerate(blks):
            txt = '\n'.join(b['lines'])
            where = seg_name(b, bi)

            # ③ 사실 주장에 출처가 달렸는가 — 문장 단위로 본다.
            #    사람 이름이 들어간 문장, 또는 이야기·역사·심화 토막의 연도 문장만 센다.
            #    계산을 적은 문장(=·×·÷ 가 든 줄)은 자기 셈이므로 빼고 본다 —
            #    이 거르개가 없으면 「1071 과 462 는 어떨까요」 같은 예시까지 걸린다.
            histish = b['kind'] in ('story', 'history', 'deep')
            for sent in re.split(r'(?<=[.!?다요])\s+', txt):
                if len(sent) < 12 or CITE.search(sent):
                    continue
                if sent.strip().startswith(('$$', '- ', '>')):
                    continue
                if re.search(r'[=×÷≒≈]', sent):
                    continue
                if not (NAME.search(sent) or (histish and YEAR.search(sent))):
                    continue
                bad3.append((no, where, ' '.join(sent.split())[:72]))

            # ③ 출처가 대장에 등록되었는가
            for key in CITE.findall(txt):
                if key not in B.FACTS:
                    bad3b.append((no, where, key))

            # ① 책이 「」로 부른 화면 이름이 실제로 있는가
            if b['kind'] in ('screen', 'm1', 'm2', 'm3', 'note', 'shot'):
                pool = screen.get(str(lab), '')
                if pool:
                    for nm in QUOTE.findall(txt):
                        if not ACT.search(txt):
                            continue
                        nm = nm.replace('**', '')          # 원고의 굵게 표시는 떼고 본다
                        flat = nm.replace(' ', '')
                        if flat and flat not in pool.replace(' ', ''):
                            bad1.append((no, where, nm))

    w = sys.stdout.write
    w('단행본 원고 점검 — 쓴 장 %d개\n\n' % seen_chaps)
    w('① 교실 운영 — 책이 부른 화면 이름이 화면에 없는 곳 %d곳\n' % len(bad1))
    for no, where, nm in bad1[:20]:
        w('   %d장 [%s] 「%s」\n' % (no, where, nm))
    if not screen:
        w('   (화면이름.json 이 없어 이 검사는 건너뜀 — controls.mjs 로 만들 것)\n')

    w('\n② 교육과정·평가 — 짜임과 표기 %d건\n' % len(bad2))
    for no, msg in bad2[:20]:
        w('   %d장 %s\n' % (no, msg))

    w('\n③ 엄밀성 — 출처가 없는 사실 주장 %d곳\n' % len(bad3))
    for no, where, sent in bad3[:30]:
        w('   %d장 [%s] %s…\n' % (no, where, sent))
    w('\n③ 엄밀성 — 대장에 없는 출처 이름 %d곳\n' % len(bad3b))
    for no, where, key in bad3b[:20]:
        w('   %d장 [%s] %s\n' % (no, where, key))
    return 0


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1
         else os.path.join(HERE, '중1.json'))
