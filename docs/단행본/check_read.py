# -*- coding: utf-8 -*-
"""중학생이 읽기 쉬운 글인지 «기계로» 센다.

보는 것
  ① 장마다 본문 글자 수 — 너무 많으면 읽다 지친다
  ② 긴 문장 — 60 자가 넘으면 한 번에 들어오지 않는다
  ③ 긴 문단 — 300 자가 넘으면 벽처럼 보인다
  ④ 딱딱한 말 — 중학생이 쓰지 않는 한자말

  python docs/단행본/check_read.py          스무 장을 다 센다
  python docs/단행본/check_read.py 3        한 장만 센다

세는 것은 «본문» 뿐이다. 블록 이름(@sec …), 표, 손글씨(@hand), 답풀이는 뺀다.
숫자는 기준이지 규칙이 아니다 — 일부러 길게 쓴 자리가 있을 수 있다.
"""
import io
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '중1')

LONG_SENT = 60          # 이보다 긴 문장은 「긴 문장」으로 센다
LONG_PARA = 300         # 이보다 긴 문단은 「긴 문단」으로 센다

# 글 한가운데 나오면 중학생이 멈칫하는 말들
STIFF = ['불가피', '귀결', '유의미', '상정', '내포', '제반', '관건', '기실',
         '도출', '에 기인', '수반', '간주', '전제하', '부합', '상응', '요한다',
         '~에 다름', '일환', '소정의', '여하', '차치']

# 본문이 아닌 토막 — 세지 않는다
SKIP = {'hand', 'shot', 'photo', 'chart', 'fig', 'qr', 'screen', 'predict',
        'term', 'ex', 'm1', 'm2', 'm3'}


def blocks(path):
    """원고를 (블록 이름, 줄들) 로 자른다"""
    out, kind, buf = [], None, []
    for ln in io.open(path, encoding='utf-8').read().split('\n'):
        m = re.match(r'^@(\w+)', ln)
        if m:
            out.append((kind, buf))
            kind, buf = m.group(1), []
        elif ln.startswith('#'):
            continue
        else:
            buf.append(ln)
    out.append((kind, buf))
    return [(k, b) for k, b in out if k]


def paras(lines):
    """빈 줄로 갈라 문단을 만든다 — 표·인용·목록은 뺀다"""
    txt = '\n'.join(lines)
    out = []
    for p in re.split(r'\n\s*\n', txt):
        p = p.strip()
        if not p or p.startswith(('|', '>', '-', '$$', '```')):
            continue
        if '\n' in p and p.count('|') > 2:
            continue
        out.append(' '.join(p.split()))
    return out


def sentences(p):
    p = re.sub(r'\*\*|\[red\]|\[/red\]|\[\^[A-Za-z0-9_\-]+\]', '', p)
    return [s.strip() for s in re.split(r'(?<=[.!?다요])\s+', p) if len(s.strip()) > 1]


def look(no):
    path = os.path.join(SRC, 'ch%02d.txt' % no)
    if not os.path.exists(path):
        return None
    chars = 0
    longs, longp, stiff = [], 0, []
    for kind, lines in blocks(path):
        if kind in SKIP:
            continue
        for p in paras(lines):
            chars += len(p)
            if len(p) > LONG_PARA:
                longp += 1
            for s in sentences(p):
                if len(s) > LONG_SENT:
                    longs.append(s)
            for w in STIFF:
                if w in p:
                    stiff.append(w)
    return chars, longs, longp, sorted(set(stiff))


def main(argv):
    nos = [int(a) for a in argv] if argv else list(range(1, 21))
    tot = 0
    print('장   본문글자  긴문장  긴문단  딱딱한말')
    for no in nos:
        r = look(no)
        if not r:
            continue
        chars, longs, longp, stiff = r
        tot += chars
        flag = '  ←' if (len(longs) > 12 or chars > 9000) else ''
        print('%2d  %8d  %5d  %5d  %s%s'
              % (no, chars, len(longs), longp, ' '.join(stiff) or '-', flag))
    print('\n본문 합계 %d 자 · 장 평균 %d 자' % (tot, tot // max(len(nos), 1)))
    if len(nos) == 1:
        chars, longs, longp, stiff = look(nos[0])
        print('\n긴 문장 (%d 자 넘는 것) — 앞에서 10 개' % LONG_SENT)
        for s in longs[:10]:
            print('  %3d자 | %s' % (len(s), s[:96]))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
