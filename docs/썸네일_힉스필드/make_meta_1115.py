# -*- coding: utf-8 -*-
"""카드 그림 준비 (2026-11-15) — LAB 357~386(색인 356~385) 30종의 제목 · 생활 질문 · 수학 개념을 모아
labs_meta_1115.json 과 thumb_prompts_1115.json 을 만든다.

쓰는 법:  py -3 -X utf8 make_meta_1115.py          (두 파일을 쓴다)
          py -3 -X utf8 make_meta_1115.py --check  (쓰지 않고 확인만)

읽기만 하는 곳: ml-ws\\src · _vol7 · _extra · _stage386 · 외장하드 사본. 쓰는 곳: 이 폴더뿐.
40-demos.js 는 «const LABS=[» 부터 첫 «\\n];» 까지만 잘라 쓴다.

지시문 틀(작업 지시에 적힌 그대로):
  ... no people's faces. Subject: <t>. Everyday question it answers: <q>. Math idea to hint visually: <m 을 ' · ' 로 이음>.
  <t> 는 제목에서 따옴표(“ ” " ')를 뺀 것.
알아 둘 것: 기존 thumb_prompts.json(356개)은 질문 뒤에 마침표가 없다(«…알까? Math idea»).
  작업 지시의 틀은 «<q>. Math idea» 라서 Q_PERIOD = True 로 두었다. 기존 기록과 글자까지 같게 하려면 False 로 바꿔 다시 돌린다.
"""
import os, re, sys, json, time

H = os.path.dirname(os.path.abspath(__file__))
ML = os.path.dirname(os.path.dirname(H))          # ...\ml-ws
V7 = os.path.join(ML, '_vol7')
SCR = os.path.join(V7, '_merge1114_scratch')
EX = os.path.join(ML, '_extra')
STAGE = os.path.join(ML, '_stage386', 'src', '40-demos.js')
HDD = (r'E:\이것저것\수학관련\2026_AI+수업 우수사례+데이터 리터러시'
       r'\2026_대전교육청_인공지능 연수 설계안 개발 연구회\math-lab-출판 제작\src\40-demos.js')
HDD_ASKED = (r'E:\이것저것\수학관련\2026_AI+수업 우수사례+데이터 리터러시'
             r'\2026_AI융합교육 교사 연구회\math-lab-출판 제작\src\40-demos.js')

Q_PERIOD = True
HEAD = ("Flat minimal vector illustration for a math lab card, clean white background, thin navy (#16325c) line art "
        "with soft accents of blue (#2b5fd9), teal (#1b7f79), amber (#e07a1f) and rose (#b23a3a), lots of white space, "
        "one clear central object, no text, no letters, no numbers, no people's faces. ")

VOL7 = [  # (최종 번호, 묶음, 키, 데모 함수)
    (378, 'c3', 'G3', 'limitInfDemo'),
    (379, 'c8', 'G1', 'powerRuleDemo'),
    (380, 'c12', 'G8', 'signChartDemo'),
    (381, 'c16', 'G6', 'antiderivFamilyDemo'),
]
VOL9_BUILD = {382: 'shiftConicDemo', 383: 'tangentDiscDemo', 384: 'spaceLinesDemo', 385: 'lineVecDemo'}


def rel(p):
    return os.path.relpath(p, ML) if p.startswith(ML) else p


def mt(p):
    return time.strftime('%m-%d %H:%M', time.localtime(os.path.getmtime(p)))


def labs_block(path):
    with open(path, encoding='utf-8', errors='replace') as f:
        s = f.read()
    a = s.find('const LABS=[')
    if a < 0:
        return None
    return s[a:s.find('\n];', a)]


def entries(block):
    pos = [(int(m.group(1)), m.start()) for m in re.finditer(r'(?m)^\s*\{n:(\d+),', block)]
    return [(n, block[st:(pos[k + 1][1] if k + 1 < len(pos) else len(block))]) for k, (n, st) in enumerate(pos)]


def unq(x):
    return x.replace("\\'", "'").replace('\\\\', '\\')


def parse(seg):
    """LABS 항목 한 개(문자열)에서 t · q · m · build 를 읽는다. note 앞쪽만 본다."""
    cut = seg.find('note:')
    head = seg[:cut] if cut > 0 else seg
    t = re.search(r"[,{\s]t:'((?:[^'\\]|\\.)*)'", head)
    q = re.search(r"[,{\s]q:'((?:[^'\\]|\\.)*)'", head)
    m = re.search(r"[,{\s]m:\[((?:\s*'(?:[^'\\]|\\.)*'\s*,?)*)\s*\]", head)
    b = re.search(r"build:\s*([A-Za-z0-9_$]+)", seg)
    return {
        't': unq(t.group(1)) if t else None,
        'q': unq(q.group(1)) if q else None,
        'm': [unq(x) for x in re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1))] if m else None,
        'build': b.group(1) if b else None,
    }


def labs_of(path):
    blk = labs_block(path)
    if blk is None:
        return None
    out = {}
    order = []
    for n, seg in entries(blk):
        order.append(n)
        out.setdefault(n, []).append(parse(seg))
    return out, order


def same(a, b):
    return a and b and a['t'] == b['t'] and a['q'] == b['q'] and a['m'] == b['m']


def strip_quotes(t):
    return re.sub('[“”"\']', '', t)


def prompt_of(t, q, m):
    return (HEAD + 'Subject: ' + strip_quotes(t) + '. Everyday question it answers: ' + q
            + ('. ' if Q_PERIOD else ' ') + 'Math idea to hint visually: ' + ' · '.join(m) + '.')


def main():
    check_only = '--check' in sys.argv
    notes, missing, labs = [], [], {}

    # ── 가장 정확한 것: 스테이지 합본(있으면)
    stage = None
    if os.path.exists(STAGE):
        stage = labs_of(STAGE)
        notes.append('_stage386 있음(%s) — LABS %d개' % (mt(STAGE), len(stage[1]) if stage else -1))
    else:
        notes.append('_stage386\\src\\40-demos.js 없음 → 묶음 · 사본에서 읽음')

    # ── 357~377: 이미 뽑아 둔 것 + 사이트 원본과 대조
    src_path = os.path.join(ML, 'src', '40-demos.js')
    site, order = labs_of(src_path)
    dup = sorted(n for n in site if len(site[n]) > 1)
    gap = [n for n in range(1, max(site) + 1) if n not in site]
    notes.append('ml-ws\\src LABS: 줄 머리 항목 %d개 · 최대 %d · 겹친 번호 %s · 빈 번호 %s' % (len(order), max(site), dup, gap))
    old = json.load(open(os.path.join(H, 'labs_meta_357_377.json'), encoding='utf-8'))
    okc = 0
    for o in old:
        n = o['n']
        cur = site.get(n, [None])
        if len(cur) == 1 and same(cur[0], o) and o['i'] == n - 1:
            okc += 1
        else:
            notes.append('!! %d: labs_meta_357_377.json 이 사이트 원본과 다름' % n)
        labs[n] = {'i': n - 1, 'n': n, 't': o['t'], 'q': o['q'], 'm': list(o['m']),
                   'source': 'ml-ws\\src\\40-demos.js LABS n:%d (labs_meta_357_377.json 과 같음)' % n}
    notes.append('357~377: 21종 가운데 %d종이 사이트 원본 LABS 와 t · q · m 같음' % okc)

    # ── 378~381: 7권 묶음
    for n, grp, key, fn in VOL7:
        frag = os.path.join(V7, grp, key + '.lab.js')
        man = os.path.join(V7, grp, 'manifest.json')
        if not os.path.exists(frag):
            missing.append('%d (%s\\%s.lab.js 없음)' % (n, grp, key))
            continue
        d = parse(open(frag, encoding='utf-8').read())
        mj = json.load(open(man, encoding='utf-8'))
        mfn = mj['labs'][0]['demoFn']
        if not (d['t'] and d['q'] and d['m']):
            missing.append('%d (%s 조각에서 t · q · m 을 못 읽음)' % (n, grp))
            continue
        if d['build'] != fn or mfn != fn:
            notes.append('!! %d: 데모 함수가 어긋남 — 조각 %s · manifest %s · 기대 %s' % (n, d['build'], mfn, fn))
        seen = []
        for sb in sorted(x for x in os.listdir(V7) if x.startswith('sandbox_' + grp)):
            p = os.path.join(V7, sb, 'src', '40-demos.js')
            if not os.path.exists(p):
                continue
            got = labs_of(p)
            e = [x for x in (got[0].get(mj['base']) or []) if x['build'] == fn] if got else []
            seen.append('%s(%s) %s' % (sb, mt(p), '같음' if (e and same(e[0], d)) else ('다름' if e else '항목 없음')))
            if e and not same(e[0], d):
                notes.append('!! %d: %s 의 시험 항목이 조각과 다름 — t=%s' % (n, sb, e[0]['t']))
        labs[n] = {'i': n - 1, 'n': n, 't': d['t'], 'q': d['q'], 'm': d['m'],
                   'source': '_vol7\\%s\\%s.lab.js (%s · %s, 시험 번호 %d → 최종 %d) · 시험 사본 %s'
                             % (grp, key, fn, mt(frag), mj['base'], n, ' · '.join(seen) or '없음')}

    # ── 382~385: 9권(외장하드 사본 계열)
    cands = [('_merge1114_scratch\\merge\\hdd', os.path.join(SCR, 'merge', 'hdd', '40-demos.js')),
             ('_merge1114_scratch\\ws382\\src', os.path.join(SCR, 'ws382', 'src', '40-demos.js')),
             ('_merge1114_scratch\\trial\\src', os.path.join(SCR, 'trial', 'src', '40-demos.js')),
             ('_merge1114_scratch\\merge\\out', os.path.join(SCR, 'merge', 'out', '40-demos.js')),
             ('외장하드 src(대전교육청 연구회 폴더)', HDD)]
    got9 = []
    for name, p in cands:
        if os.path.exists(p):
            r = labs_of(p)
            if r:
                got9.append((name, p, r[0]))
    if not os.path.exists(HDD_ASKED):
        notes.append('지시에 적힌 «2026_AI융합교육 교사 연구회\\math-lab-출판 제작\\src» 에는 40-demos.js 가 없음 — '
                     '외장하드 사본은 «2026_대전교육청_인공지능 연수 설계안 개발 연구회\\math-lab-출판 제작\\src» 에 있음')
    for n in range(382, 386):
        vals = [(name, r[n][0]) for name, p, r in got9 if n in r and len(r[n]) == 1]
        if not vals:
            missing.append('%d (9권 사본 어디에도 없음)' % n)
            continue
        d = vals[0][1]
        diff = [name for name, v in vals[1:] if not same(v, d)]
        if diff:
            notes.append('!! %d: 사본마다 다름 — %s' % (n, diff))
        if d['build'] != VOL9_BUILD[n]:
            notes.append('!! %d: 데모 함수 %s (기대 %s)' % (n, d['build'], VOL9_BUILD[n]))
        labs[n] = {'i': n - 1, 'n': n, 't': d['t'], 'q': d['q'], 'm': d['m'],
                   'source': '%s\\40-demos.js LABS n:%d (%s) · 같은 내용 %d곳: %s'
                             % (vals[0][0], n, d['build'], len(vals) - len(diff), ' · '.join(v[0] for v in vals))}

    # ── 386: 행렬 × 탄소 꾸러미
    frag = os.path.join(EX, 'mc1', 'M1.lab.js')
    man = os.path.join(EX, 'mc1', 'manifest.json')
    if os.path.exists(frag):
        d = parse(open(frag, encoding='utf-8').read())
        mj = json.load(open(man, encoding='utf-8'))
        fin = mj.get('finalBase')
        seen = '없음'
        p = os.path.join(EX, 'sandbox_mc1', 'src', '40-demos.js')
        if os.path.exists(p):
            r = labs_of(p)
            e = [x for x in (r[0].get(mj['base']) or []) if x['build'] == 'matrixCarbonDemo'] if r else []
            seen = 'sandbox_mc1(%s) %s' % (mt(p), '같음' if (e and same(e[0], d)) else '다름')
            if e and not same(e[0], d):
                notes.append('!! 386: sandbox_mc1 의 시험 항목이 조각과 다름 — t=%s' % e[0]['t'])
        if fin != 386 or d['build'] != 'matrixCarbonDemo':
            notes.append('!! 386: manifest finalBase=%s · build=%s' % (fin, d['build']))
        if d['t'] and d['q'] and d['m']:
            labs[386] = {'i': 385, 'n': 386, 't': d['t'], 'q': d['q'], 'm': d['m'],
                         'source': '_extra\\mc1\\M1.lab.js (matrixCarbonDemo · %s, manifest base %d → finalBase %s) · 시험 사본 %s'
                                   % (mt(frag), mj['base'], fin, seen)}
        else:
            missing.append('386 (M1.lab.js 에서 t · q · m 을 못 읽음)')
    else:
        missing.append('386 (_extra\\mc1\\M1.lab.js 없음)')

    # ── 스테이지 합본이 있으면 그것이 우선
    if stage:
        st = stage[0]
        for n in range(357, 387):
            e = st.get(n)
            if not e:
                notes.append('스테이지 합본에 %d 없음' % n)
                continue
            if len(e) > 1:
                notes.append('!! 스테이지 합본에 %d 가 %d번' % (n, len(e)))
            if n in labs and not same(e[0], labs[n]):
                notes.append('!! %d: 스테이지 합본과 다름 → 합본을 따름 (옛 t=%s)' % (n, labs[n]['t']))
            if e[0]['t'] and e[0]['q'] and e[0]['m']:
                was = labs.get(n, {}).get('source', '')
                labs[n] = {'i': n - 1, 'n': n, 't': e[0]['t'], 'q': e[0]['q'], 'm': e[0]['m'],
                           'source': '_stage386\\src\\40-demos.js LABS n:%d (%s)' % (n, mt(STAGE)) + (' · 앞서 읽은 곳: ' + was if was else '')}

    # ── 어긋남 검사
    out = [labs[n] for n in sorted(labs)]
    for n in range(357, 387):
        if n not in labs and not any(x.startswith(str(n)) for x in missing):
            missing.append(str(n))
    ts = [x['t'] for x in out]
    if len(set(ts)) != len(ts):
        notes.append('!! 새 30종 안에 같은 제목이 있음: %s' % sorted({t for t in ts if ts.count(t) > 1}))
    oldt = {}
    for n, es in site.items():
        if n < 357:
            for e in es:
                if e['t']:
                    oldt.setdefault(e['t'], []).append(n)
    clash = [(x['n'], oldt[x['t']]) for x in out if x['t'] in oldt]
    if clash:
        notes.append('!! 기존 1~356 과 같은 제목: %s' % clash)

    def lead(t):
        m = re.match('“([^”]*)”', t)
        return m.group(1) if m else None
    oldlead = {}
    for t, ns in oldt.items():
        if lead(t):
            oldlead.setdefault(lead(t), []).extend(ns)
    lclash = [(x['n'], lead(x['t']), oldlead[lead(x['t'])]) for x in out if lead(x['t']) in oldlead]
    leads = [lead(x['t']) for x in out]
    notes.append('제목 검사: 새 %d종 번호 겹침 %s · 제목 겹침 %d · 따옴표 머리말 겹침(새끼리) %d · 기존 1~356 과 머리말 겹침 %s'
                 % (len(out), sorted({x['n'] for x in out if [y['n'] for y in out].count(x['n']) > 1}),
                    len(ts) - len(set(ts)), len(leads) - len(set(leads)), lclash))
    noq = [x['n'] for x in out if not x['q'].rstrip().endswith('?')]
    if noq:
        notes.append('질문이 «?» 로 끝나지 않는 것: %s' % noq)
    bad_i = [x['n'] for x in out if x['i'] != x['n'] - 1]
    if bad_i:
        notes.append('!! i ≠ n − 1: %s' % bad_i)

    prompts = [{'i': x['i'], 'n': x['n'], 'prompt': prompt_of(x['t'], x['q'], x['m'])} for x in out]
    left = [p['n'] for p in prompts if re.search('[“”"]', p['prompt'].split('Subject: ', 1)[1].split('. Everyday question', 1)[0])]
    if left:
        notes.append('!! 지시문 제목에 따옴표가 남음: %s' % left)

    if not check_only:
        with open(os.path.join(H, 'labs_meta_1115.json'), 'w', encoding='utf-8', newline='\n') as f:
            json.dump(out, f, ensure_ascii=False, indent=1)
            f.write('\n')
        with open(os.path.join(H, 'thumb_prompts_1115.json'), 'w', encoding='utf-8', newline='\n') as f:
            json.dump(prompts, f, ensure_ascii=False, indent=1)
            f.write('\n')
    print('labs', len(out), 'missing', missing, '(확인만)' if check_only else '(파일 씀)')
    for x in notes:
        print(' -', x)
    for x in out:
        if x['n'] >= 378:
            print('  ', x['n'], x['t'], '|', x['q'], '|', x['m'])
            print('      ', x['source'])
    print(prompts[0]['prompt'])
    print(prompts[-1]['prompt'])


if __name__ == '__main__':
    main()
