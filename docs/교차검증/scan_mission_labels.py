# -*- coding: utf-8 -*-
"""미션이 「눌러라」고 가리킨 단추·메뉴가 화면에 정말 있는지 센다 — ① 교실 운영.

왜
  미션 문구는 「처음으로」·「도전③ 무채색 합성」 처럼 화면의 이름을 꺾쇠로 인용한다.
  그 이름이 화면에 없으면 학생은 없는 단추를 찾아 헤맨다 — 교실에서 바로 멈추는 종류의 결함이다.

무엇을 하는가
  미션 문구(t)와 해볼 것(do)에서 「…」 안의 짧은 이름을 뽑아,
  그 실험실의 데모 코드(태그를 지운 글)에 그 이름이 있는지 본다.
  수학 용어를 강조하려고 쓴 꺾쇠도 많으므로 «단추를 가리키는 말» 만 본다 —
  문구에 누르기·고르기·켜기 같은 동작이 함께 있을 때만 센다.

사용: python docs/교차검증/scan_mission_labels.py src/40-demos.js
"""
import importlib.util
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span                      # noqa: E402

_sp = importlib.util.spec_from_file_location(
    'ss', os.path.join(HERE, 'scan_signal_source.py'))
ss = importlib.util.module_from_spec(_sp)
_sp.loader.exec_module(ss)

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

Q = r"'((?:[^'\\]|\\.)*)'"
NAME = re.compile(r'「([^」]{2,24})」')
ACT = re.compile(r'(누르|눌러|클릭|고르|골라|켜|켜서|바꿔 누|선택)')
TAG = re.compile(r'</?[A-Za-z][^<>]*>')


def visible(t):
    """태그와 끼운 값을 지운 «화면에 보이는 글»"""
    t = TAG.sub('', t)
    return re.sub(r'\$\{[^{}]*\}', '', t)


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    NOT = blocks(src, r'\n (\d+):\{ h:')
    rows = []
    for no, b in sorted(LES.items()):
        i = b.find('missions:[')
        if i < 0:
            continue
        j = b.index('[', i)
        seg = b[j:_span(b, j) + 1]

        m = re.search(r'demo\s*\(\s*root\s*\)\s*\{', b)
        pool = ''
        if m:
            k = b.index('{', m.end() - 1)
            body = b[k:ss._tolerant(b, k) + 1]
            pool += body
            for nm in set(re.findall(r'([A-Za-z_$][\w$]*)\s*\(\s*root', body)):
                pool += ss.fn_body(src, nm)
        else:
            m2 = re.search(r'demo\s*:\s*([A-Za-z_$][\w$]*)', b)
            if m2:
                pool += ss.fn_body(src, m2.group(1))
        pool += NOT.get(no, '')
        pool = pool + '\n' + visible(pool)

        bad = []
        for key in ('t', 'do'):
            for mm in re.finditer(r"\b%s:" % key + Q, seg):
                txt = mm.group(1)
                if not ACT.search(txt):
                    continue
                for nm in NAME.findall(txt):
                    plain = TAG.sub('', nm).strip()
                    if len(plain) < 2:
                        continue
                    if plain not in pool and plain.replace(' ', '') not in pool.replace(' ', ''):
                        bad.append(plain)
        if bad:
            rows.append((no, sorted(set(bad))))

    sys.stdout.write('미션이 가리킨 이름이 화면에 없는 곳 — 실험실 %d종\n' % len(rows))
    for no, bad in rows:
        sys.stdout.write('  LAB %3d  %s\n' % (no, ' · '.join('「%s」' % x for x in bad)))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
