# -*- coding: utf-8 -*-
"""책에 실린 «용어 정리» 를 한자리에 모아 기계가 먼저 센다.

이 책의 용어 토막은 한 장에 셋씩 들어가고 세 칸으로 되어 있다.
    @term 이름 | 2022 개정 · 중학교 「영역」
    정의            ← 무엇인가
    --
    유도            ← 왜 그런가 · 어떻게 나왔는가
    --
    교육과정 연결    ← 앞뒤 학년의 어디로 이어지는가

기계가 보는 것 (사람이 읽기 전에)
  · 세 칸이 다 있는가 · 칸이 너무 짧지 않은가
  · 같은 이름이 두 장에 겹쳐 있는가
  · 영역 이름이 그 장이 속한 «부» 와 맞는가 (다르면 사람이 판단할 자리로 띄운다)
  · 이름이 그 장의 본문에 실제로 나오는가 (쓰지도 않은 말을 정리해 두지 않았는가)
  · 「정의」가 제 이름을 그대로 되풀이하는 동어반복인가
  · 확인되지 않은 성취기준 코드가 남아 있는가

사용: python docs/단행본/scan_terms.py docs/단행본/중1.json
      python docs/단행본/scan_terms.py docs/단행본/중1.json --list   (전체 목록도 찍는다)
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
NL = chr(10)
sys.path.insert(0, HERE)
import build as B                                            # noqa: E402

CODE = re.compile(r'\[?9수\d{2}-\d{2}\]?')

# 성취기준 코드는 손으로 적지 않는다 — dist 의 실험실 주석에서 뽑아 둔 대장을 쓴다
STD = json.load(io.open(os.path.join(HERE, '성취기준.json'), encoding='utf-8'))
CH2LAB = {1: 25, 2: 35, 3: 26, 4: 27, 5: 43, 6: 28, 7: 44, 8: 29, 9: 30, 10: 36,
          11: 31, 12: 37, 13: 32, 14: 38, 15: 39, 16: 33, 17: 34, 18: 40,
          19: 41, 20: 42}
AREA = re.compile(r'「([^」]+)」')
MIN_DEF, MIN_WHY, MIN_LINK = 20, 30, 20


def plain(s):
    """표시용 기호를 떼고 글자만 남긴다."""
    s = re.sub(r'\*\*|«|»', '', str(s or ''))
    return re.sub(r'\s+', ' ', s).strip()


def main(volpath, show=False):
    V = json.load(io.open(volpath, encoding='utf-8'))
    base = os.path.dirname(os.path.abspath(volpath))
    labdir = os.path.join(base, V['dir'])

    # 장 번호 → (부 제목, 실험실 번호)
    where, no = {}, 0
    for p in V['parts']:
        for lab in p['chapters']:
            no += 1
            where[no] = (p['title'], lab)

    terms, bad = [], []
    chapters = 0
    for n in sorted(where):
        path = os.path.join(labdir, 'ch%02d.txt' % n)
        if not os.path.exists(path):
            continue
        chapters += 1
        part, lab = where[n]
        meta, blks = B.parse(path)
        whole = io.open(path, encoding='utf-8').read()
        body = plain(whole)
        got = [b for b in blks if b['kind'] == 'term']
        if len(got) != 3:
            bad.append((n, '용어 토막이 %d 개 — 장마다 셋이어야 한다' % len(got)))
        for b in got:
            name, code = (str(b['arg'] or '').split('|', 1) + [''])[:2]
            name, code = name.strip(), code.strip()
            segs = B.split_on(b['lines'])
            parts = [' '.join(x.strip() for x in seg).strip() for seg in segs[:3]]
            while len(parts) < 3:
                parts.append('')
            terms.append({'ch': n, 'lab': lab, 'part': part, 'name': name,
                          'code': code, 'def': parts[0], 'why': parts[1],
                          'link': parts[2]})
            # ── 세 칸이 다 있는가
            for key, val, least in (('정의', parts[0], MIN_DEF),
                                    ('유도', parts[1], MIN_WHY),
                                    ('교육과정 연결', parts[2], MIN_LINK)):
                if not val:
                    bad.append((n, '「%s」의 %s 칸이 비어 있음' % (name, key)))
                elif len(plain(val)) < least:
                    bad.append((n, '「%s」의 %s 칸이 너무 짧음 (%d자)'
                                % (name, key, len(plain(val)))))
            # ── 영역 이름이 그 장의 부와 맞는가
            outside = '교과서 밖' in code
            m = AREA.search(code)
            area = '' if outside else (m.group(1) if m else '')
            if not area and not outside:
                bad.append((n, '「%s」에 영역 이름이 없음: %s' % (name, code or '(빈칸)')))
            elif area and area != part and '연결' not in code:
                bad.append((n, '「%s」의 영역이 「%s」인데 이 장은 「%s」 부 '
                            '— 일부러 다르게 적었는지 사람이 볼 자리'
                            % (name, area, part)))
            # ── 성취기준 코드가 그 장의 실험실 것과 같은가
            got = set(CODE.findall(code))
            want = set(STD.get(str(CH2LAB.get(n, 0)), {}).get('codes', []))
            if outside and got:
                bad.append((n, '「%s」는 교과서 밖인데 성취기준 코드가 붙어 있음' % name))
            elif not outside and not got:
                bad.append((n, '「%s」에 성취기준 코드가 없음' % name))
            elif got - want:
                bad.append((n, '「%s」의 코드가 이 장의 실험실 것과 다름: %s (대장 %s)'
                            % (name, ' '.join(sorted(got - want)), ' '.join(sorted(want)))))
            # ── 이름이 본문에 쓰이는가
            head = plain(name).split('과')[0].split('와')[0].strip()
            if head and body.count(head) < 3:
                bad.append((n, '「%s」가 본문에 %d 번밖에 안 나옴 — 쓰지 않는 말을 '
                            '정리해 둔 것은 아닌지' % (name, body.count(head))))
            # ── 동어반복
            d = plain(parts[0])
            if head and d.startswith(head):
                bad.append((n, '「%s」의 정의가 제 이름으로 시작함 — 동어반복인지 확인'
                            % name))

    w = sys.stdout.write
    w('용어 점검 — 쓴 장 %d 개 · 용어 %d 개\n' % (chapters, len(terms)))
    w('\n기계가 잡은 것 %d 건\n' % len(bad))
    for n, msg in bad:
        w('   %d장  %s\n' % (n, msg))
    if not bad:
        w('   (없음)\n')

    # ── 같은 «정의» 를 두 번 적지 않았는가 (이름이 달라도 내용이 같으면 잡힌다)
    headmap = {}
    for t in terms:
        k = plain(t['def'])[:16]
        if k:
            headmap.setdefault(k, []).append('%d장 「%s」' % (t['ch'], t['name']))
    same = {k: v for k, v in headmap.items() if len(v) > 1}
    w('%s같은 말을 두 번 정의한 곳 %d 건%s' % (NL, len(same), NL))
    for k, v in sorted(same.items()):
        w('   %s … — %s%s' % (k, ' · '.join(v), NL))
    if not same:
        w('   (없음)%s' % NL)

    # ── 같은 이름이 겹치는가
    seen = {}
    for t in terms:
        key = plain(t['name'])
        seen.setdefault(key, []).append(t['ch'])
    dup = {k: v for k, v in seen.items() if len(v) > 1}
    w('\n이름이 겹치는 용어 %d 개\n' % len(dup))
    for k, v in sorted(dup.items()):
        w('   「%s」 — %s장\n' % (k, '·'.join(str(x) for x in v)))
    if not dup:
        w('   (없음)\n')

    # ── 영역별 분포
    w('\n영역별 용어 수\n')
    byarea = {}
    for t in terms:
        if '교과서 밖' in t['code']:
            key = '교과서 밖'
        else:
            m = AREA.search(t['code'])
            key = m.group(1) if m else '(없음)'
        byarea.setdefault(key, []).append(t['name'])
    for k in sorted(byarea):
        w('   %-10s %2d 개 — %s\n' % (k, len(byarea[k]),
                                     ' · '.join(byarea[k])))

    if show:
        w('\n── 전체 목록 ──\n')
        for t in terms:
            w('\n%2d장 (LAB %d · %s) 「%s」  %s\n'
              % (t['ch'], t['lab'], t['part'], t['name'], t['code']))
            for key, val in (('정의', t['def']), ('유도', t['why']),
                             ('연결', t['link'])):
                w('   %s %s\n' % (key, plain(val)[:150]))
    return len(bad)


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    vol = args[0] if args else os.path.join(HERE, '중1.json')
    main(vol, '--list' in sys.argv)
