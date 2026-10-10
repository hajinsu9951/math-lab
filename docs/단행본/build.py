# -*- coding: utf-8 -*-
"""『일상 속 수학 실험실』 단행본 — 원고를 모아 인쇄용 HTML 과 MD 로 묶는다.

이 책의 규칙
  · 실험 화면에서 오는 것(미션 문구·탐구 노트 칸·적용 문제와 답)은 **손으로 옮겨 적지 않는다.**
    `extract.mjs` 가 완성된 페이지에서 뽑아 둔 재료(JSON)를 빌더가 그 자리에 끼운다.
    책과 화면이 어긋날 길을 아예 없애려는 것이다.
  · 원고 파일에는 «설명» 만 쓴다 — 수학의 원리, 화면을 따라가는 말, 풀이, 교사 이야기.

원고 형식 (docs/단행본/중1/ch01.txt 같은 파일)
  #lab 25            그 장이 다루는 실험실 번호
  #title …           장 제목
  #sub …             부제 (없으면 생략)
  #ask …             이 장이 답하는 질문 한 문장
  #link …            앞 장과의 연결 한 문장 (1장은 생략)

  @story 제목        이야기 — 서사 도입 (여러 쪽)
  @hook              이런 일이 있었다 — 생활 장면
  @fig N             재료의 N 번째 삽화 + 그림읽기 4단계 (축:/관찰:/수식:/연결: 네 줄)
  @chart 이름        docs/단행본/그림/<이름>.svg — 파이썬이 계산해 그린 그래프·도해
  @shot key | 캡션   docs/단행본/사진_중1.json 의 실제 화면 사진 (key 는 lab 또는 note)
  @qr                이 장의 실험실로 바로 가는 QR 코드와 여는 법
  @history 제목      역사 — 「1977 | …」 꼴의 줄은 연표가 된다
  @deep N 제목       더 깊이 — 심화 상자
  @extend            탐구 확장 — 「- 」 목록으로 적는다
  @read              더 읽고 싶다면 — 「- 」 목록으로 적는다
  @sec 제목          본문 절
  @sub 제목          본문 항
  @predict           재료의 예상 질문 셋 + 쓰는 줄 (본문 없음)
  @screen            실험 따라가기 머리말
  @m1 @m2 @m3        미션별 설명 (미션 문구·해볼 것·신호는 재료에서 온다)
  @note              탐구 노트 세 칸 (재료에서 온다, 본문 없음)
  @hand              손글씨 노트 — 「--」 로 학생 글씨와 교사 해설을 나눈다
  @apply             적용 문제 (재료) + 여기에 쓴 글이 풀이 뒤에 붙는다
  @ex 계산형|해석형|확장형   연습문제 — 「--」 로 문제와 풀이를 나눈다
  @term 이름 | 성취기준      용어 — 「--」 로 정의 / 유도 / 교육과정 연결을 나눈다
  @teacher           교사 이야기
  @career            진로 연결

  글 안에서  **굵게** · 한 줄에 「$$식 | 캡션$$」 은 식 상자 · 「- 」 로 시작하면 목록

사용: python docs/단행본/build.py docs/단행본/중1.json
"""
import html
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
import qr as QRMOD                                           # noqa: E402

# 판단 보기의 정답 자리 — 장을 만들며 쌓았다가 책 끝에 모아 싣는다
ANSWERS = []
NL = chr(10)
# 계산해 그린 그림 · 그 캡션 · 실제 화면 사진 — build() 가 채운다
CHARTS, CAPS, SHOTS = {}, {}, {}
PHOTOS, PCAPS = {}, {}      # 장 도입 삽화 (힉스필드 사진)
_QR = {}
# 사실 확인 대장 — 본문의 [^이름] 이 여기를 가리킨다
FACTS = {}          # 이름 → {claim, source, checked, note}
CHAP_CITES = []     # 지금 쓰는 장에서 불린 이름들 (차례대로)
ALL_CITES = []      # 권 전체 — 참고문헌을 만든다


def qr_url(title):
    return QRMOD.url(title)


def qr_svg(title):
    """같은 실험실의 QR 은 한 번만 만들어 쓴다 — 만드는 데 시간이 걸린다."""
    if title not in _QR:
        _QR[title] = QRMOD.svg(title)
    return _QR[title]


def load_facts(base):
    """사실 확인 대장을 읽는다 — 장마다 한 파일(docs/단행본/사실확인/ch01.json)."""
    d = os.path.join(base, '사실확인')
    if not os.path.isdir(d):
        return
    for fn in sorted(os.listdir(d)):
        if not fn.endswith('.json'):
            continue
        for item in json.load(open(os.path.join(d, fn), encoding='utf-8')):
            FACTS[item['id']] = item


def load_assets(base):
    """그림 폴더와 화면 사진을 읽어 둔다."""
    gdir = os.path.join(HERE, '그림')
    if os.path.isdir(gdir):
        cap = os.path.join(gdir, '_캡션.json')
        if os.path.exists(cap):
            CAPS.update(json.load(open(cap, encoding='utf-8')))
        for fn in os.listdir(gdir):
            if fn.endswith('.svg'):
                CHARTS[fn[:-4]] = open(os.path.join(gdir, fn), encoding='utf-8').read()
    pdir = os.path.join(HERE, '삽화')
    if os.path.isdir(pdir):
        import base64
        cp = os.path.join(pdir, '_캡션.json')
        if os.path.exists(cp):
            PCAPS.update(json.load(open(cp, encoding='utf-8')))
        for fn in sorted(os.listdir(pdir)):
            if fn.endswith('.webp'):
                b64 = base64.b64encode(open(os.path.join(pdir, fn), 'rb').read()).decode()
                PHOTOS[fn[:-5]] = 'data:image/webp;base64,' + b64
    for name in ('사진_중1.json', '사진.json'):
        p = os.path.join(base, name)
        if os.path.exists(p):
            SHOTS.update(json.load(open(p, encoding='utf-8')))
            break
TAG = re.compile(r'</?[A-Za-z][^<>]*>')


def esc(t):
    return html.escape(str(t if t is not None else ''), quote=False)


def inline(t):
    """원고의 짧은 표기를 HTML 로 — **굵게** 와 「」 만 쓴다."""
    t = esc(t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    # [red]…[/red] — 손글씨의 틀린 줄에 빨간 밑줄을 긋는다
    t = t.replace('[red]', '<span class="red">').replace('[/red]', '</span>')

    # [^이름] — 사실 확인 대장의 출처를 가리킨다. 장마다 번호를 매겨 윗첨자로 단다.
    def _cite(m):
        key = m.group(1)
        if key not in CHAP_CITES:
            CHAP_CITES.append(key)
        n = CHAP_CITES.index(key) + 1
        if key not in FACTS:
            return '<sup class="cite miss">?%s</sup>' % esc(key)
        return '<sup class="cite">%d</sup>' % n
    t = re.sub(r'\[\^([A-Za-z0-9_\-]+)\]', _cite, t)
    # 참고문헌의 책·학술지 이름은 기울임으로 적는다(APA) — 그 태그만 되살린다
    for tag in ('i', 'b'):
        t = t.replace('&lt;%s&gt;' % tag, '<%s>' % tag).replace('&lt;/%s&gt;' % tag, '</%s>' % tag)
    t = t.replace('&amp;amp;', '&amp;')
    return t


def plain(t):
    """화면 글에서 태그를 지워 책 본문에 넣는다 — 부등호는 살린다."""
    t = TAG.sub('', str(t or ''))
    t = t.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    return ' '.join(t.split())


def keep(t):
    """<b> 는 살리고 나머지 태그만 지운다 — 미션 문구의 강조를 책에서도 쓴다."""
    t = re.sub(r'</?(?!b>|/b>)[A-Za-z][^<>]*>', '', str(t or ''))
    t = t.replace('&nbsp;', ' ')
    return ' '.join(t.split())


# ── 원고 읽기 ────────────────────────────────────────────────────────────
def parse(path):
    meta, blocks = {}, []
    cur = None
    for raw in open(path, encoding='utf-8').read().splitlines():
        line = raw.rstrip()
        if line.startswith('#') and ' ' in line[:12]:
            k, v = line[1:].split(' ', 1)
            meta[k.strip()] = v.strip()
            continue
        if line.startswith('@'):
            parts = line[1:].split(' ', 1)
            cur = {'kind': parts[0].strip(), 'arg': (parts[1].strip() if len(parts) > 1 else ''),
                   'lines': []}
            blocks.append(cur)
            continue
        if cur is not None:
            cur['lines'].append(line)
    return meta, blocks


def paras(lines):
    """빈 줄로 나눈 문단 — 「- 」 목록과 「$$…$$」 식 상자를 알아본다."""
    out, buf = [], []
    for ln in lines + ['']:
        if ln.strip() == '':
            if buf:
                out.append(buf)
                buf = []
        else:
            buf.append(ln)
    return out


def body_html(lines):
    h = []
    for blk in paras(lines):
        first = blk[0].strip()
        if first.startswith('$$') and first.endswith('$$'):
            inner = first[2:-2]
            if '|' in inner:
                f, cap = inner.split('|', 1)
                h.append('<div class="eq">%s<span class="cap">%s</span></div>'
                         % (inline(f.strip()), inline(cap.strip())))
            else:
                h.append('<div class="eq">%s</div>' % inline(inner.strip()))
            continue
        if first.startswith('> '):
            txt = ' '.join(x.strip().lstrip('> ') for x in blk)
            h.append('<div class="kbox">%s</div>' % inline(txt))
            continue
        if first.startswith('- '):
            items = ''.join('<li>%s</li>' % inline(x.strip()[2:]) for x in blk
                            if x.strip().startswith('- '))
            h.append('<ul>%s</ul>' % items)
            continue
        h.append('<p>%s</p>' % inline(' '.join(x.strip() for x in blk)))
    return '\n'.join(h)


def split_on(lines, mark='--'):
    out, buf = [], []
    for ln in lines:
        if ln.strip() == mark:
            out.append(buf)
            buf = []
        else:
            buf.append(ln)
    out.append(buf)
    return out


# ── 장 만들기 ────────────────────────────────────────────────────────────
def chapter_html(no, meta, blocks, mat):
    H = []
    a = H.append
    a('<section class="chap" id="ch%02d">' % no)
    a('<div class="chead"><div class="cnum">제%d장 · 실험실 LAB %s</div>'
      % (no, meta.get('lab', '')))
    a('<div class="ctitle">%s</div>' % inline(meta.get('title', '')))
    if meta.get('sub'):
        a('<div class="csub">%s</div>' % inline(meta['sub']))
    a('</div>')

    ask = ['<div class="ask"><div class="l">이 장이 답하는 질문</div>']
    ask.append('<p>%s</p>' % inline(meta.get('ask', '')))
    if meta.get('link'):
        ask.append('<p>%s</p>' % inline(meta['link']))
    ask.append('</div>')
    a('\n'.join(ask))

    mi = 0
    for b in blocks:
        k, arg, lines = b['kind'], b['arg'], b['lines']

        if k == 'story':
            a('<h2 class="sec">%s</h2>' % inline(arg or '이야기'))
            a('<div class="story">%s</div>' % body_html(lines))

        elif k == 'hook':
            a('<h2 class="sec">이런 일이 있었다</h2>')
            a(body_html(lines))

        elif k == 'photo':
            name, cap = (arg.split('|', 1) + [''])[:2]
            name = name.strip()
            src = PHOTOS.get(name, '')
            cap = cap.strip() or PCAPS.get(name, '')
            if src:
                a('<figure class="photo"><img src="%s" alt="%s">'
                  '<figcaption>%s</figcaption></figure>'
                  % (src, esc(plain(cap)[:80]), inline(cap)))
            else:
                a('<div class="kbox">[삽화 %s 이 아직 없습니다]</div>' % esc(name))
            a(body_html(lines))

        elif k == 'chart':
            svg = CHARTS.get(arg, '')
            cap = CAPS.get(arg, '')
            if svg:
                a('<figure class="chart">%s<figcaption>%s</figcaption></figure>'
                  % (svg, inline(cap)))
            else:
                a('<div class="kbox">[그림 %s 이 아직 없습니다]</div>' % esc(arg))
            a(body_html(lines))

        elif k == 'shot':
            key, cap = (arg.split('|', 1) + [''])[:2]
            src = (SHOTS.get(str(meta['lab']), {}) or {}).get(key.strip(), '')
            if src:
                a('<figure class="shot"><img src="%s" alt="실험 화면">'
                  '<figcaption><b>실제 화면</b> — %s</figcaption></figure>'
                  % (src, inline(cap.strip())))
            else:
                a('<div class="kbox">[화면 사진 %s 이 아직 없습니다]</div>' % esc(key))

        elif k == 'qr':
            lab = int(meta['lab'])
            name = plain(mat['title'])          # 실험실 이름 — QR 은 번호가 아니라 이름으로 간다
            a('<div class="qrbox"><div class="qr">%s</div><div class="qrt">'
              '<div class="l">실험실 「%s」 로 바로 가기</div>'
              '<p>휴대전화 사진기로 왼쪽 네모를 비추면 <b>이 장의 실험실이 그대로 열립니다.</b> '
              '목록에서 번호를 찾을 필요가 없습니다.</p>'
              '<p class="u">%s</p>'
              '<p class="off">인터넷이 되지 않는 곳이라면 — 내려받아 둔 <b>index.html</b> 을 '
              '두 번 눌러 열고 <b>LAB %02d</b> 카드를 고르면 똑같습니다. '
              '서버도 로그인도 필요 없습니다.</p></div></div>'
              % (qr_svg(mat['title']), esc(name), esc(qr_url(mat['title'])), lab))
            a(body_html(lines))

        elif k == 'history':
            rows, prose = [], []
            for ln in lines:
                # 「연도 | 내용」 — 연도 자리는 14자 이하이고 숫자를 품고 있으면 된다
                # (「기원전 300」처럼 한글로 시작하는 연도도 연표로 잡히게 한다)
                m2 = re.match(r'^\s*([^|]{1,14}?)\s*\|\s*(.+)$', ln)
                if m2 and not re.search(r'[0-9]', m2.group(1)):
                    m2 = None
                if m2:
                    rows.append((m2.group(1).strip(), m2.group(2).strip()))
                else:
                    prose.append(ln)
            h2 = ['<div class="hist"><div class="l">%s</div>' % inline(arg or '역사')]
            h2.append(body_html(prose))
            if rows:
                h2.append('<div class="tl">')
                for when, what in rows:
                    h2.append('<div class="tli"><div class="when">%s</div>'
                              '<div class="what">%s</div></div>'
                              % (esc(when), inline(what)))
                h2.append('</div>')
            h2.append('</div>')
            a(NL.join(h2))

        elif k == 'deep':
            num, ttl = (arg.split(' ', 1) + [''])[:2]
            a('<div class="deep"><div class="l">더 깊이 %s · %s</div>%s</div>'
              % (esc(num), inline(ttl), body_html(lines)))

        elif k == 'extend':
            a('<div class="extend"><div class="l">탐구 확장 — 혼자서도, 모둠으로도</div>%s</div>'
              % body_html(lines))

        elif k == 'read':
            a('<div class="read"><div class="l">더 읽고 싶다면</div>%s</div>'
              % body_html(lines))

        elif k == 'fig':
            i = int(arg or 1) - 1
            figs = mat['problem']['figs']
            if 0 <= i < len(figs):
                f = figs[i]
                a('<figure><img src="%s" alt="%s"><figcaption>%s</figcaption></figure>'
                  % (f['src'], esc(plain(f['alt'])), keep(f['cap'])))
            rd = {}
            for ln in lines:
                if ':' in ln:
                    kk, vv = ln.split(':', 1)
                    rd[kk.strip()] = vv.strip()
            if rd:
                rows = ''.join('<div class="fr"><div class="k">%s</div><div>%s</div></div>'
                               % (esc(kk), inline(vv)) for kk, vv in rd.items())
                a('<div class="figread"><div class="l">그림 읽기</div>%s</div>' % rows)

        elif k == 'sec':
            a('<h2 class="sec">%s</h2>' % inline(arg))
            a(body_html(lines))

        elif k == 'sub':
            a('<h3 class="sub">%s</h3>' % inline(arg))
            a(body_html(lines))

        elif k == 'predict':
            qs = mat['predict']
            lab = ['<div class="predict"><div class="l">먼저 예상해 보세요 — 정답이 아니라 '
                   '지금 생각을 적습니다</div>']
            names = ['예상', '근거', '확인할 것']
            for i, q in enumerate(qs):
                lab.append('<div class="pq">%s. %s</div>'
                           % (names[i] if i < 3 else str(i + 1), keep(q)))
                lab.append('<div class="ln"><i></i><i></i></div>')
            lab.append('</div>')
            a('\n'.join(lab))

        elif k == 'screen':
            a('<h2 class="sec">실험실에서 — 화면을 따라가며</h2>')
            a(body_html(lines))
            a('<div class="howto"><div class="l">여는 법</div>'
              '단일 파일 <b>index.html</b> 을 브라우저로 열고 <b>LAB %s</b> 카드를 누릅니다. '
              '서버도 로그인도 필요 없습니다 — USB 로 받아 더블클릭해도 같습니다. '
              '「수업 모형으로 열기」를 누르면 <b>문제 → 예상 → 실험 → 기록·발견 → 원리 → 적용 → 정리</b> '
              '일곱 단계가 차례로 열립니다.</div>' % meta.get('lab', ''))

        elif k in ('m1', 'm2', 'm3'):
            mi = int(k[1]) - 1
            ms = mat['missions']
            if mi < len(ms):
                m = ms[mi]
                a('<div class="mstep"><div class="mh">미션 %d — %s</div>' % (mi + 1, keep(m['t'])))
                a(body_html(lines))
                if m['do']:
                    a('<p><b>이렇게</b> — %s</p>' % keep(m['do']))
                if m['re'] and m['re'] != '탐구 노트 통과':
                    a('<div class="sig">화면에 「%s」 가 뜨면 통과입니다</div>' % esc(m['re']))
                elif m['re']:
                    a('<div class="sig">아래 탐구 노트 세 칸을 모두 통과하면 열립니다</div>')
                if m['hand']:
                    a('<div class="hand">✍ 손으로 — %s</div>' % keep(m['hand']))
                a('</div>')

        elif k == 'note':
            n = mat.get('note')
            if n:
                nb = ['<div class="notebox"><div class="l">탐구 노트 — %s</div>' % keep(n['h'])]
                step = ['기록', '생각', '판단', '정리']
                for i, c in enumerate(n['cards']):
                    f = keep(c['f'])
                    f = re.sub(r'\{\d+\}', '<u>&nbsp;</u>', f)
                    nb.append('<div class="ncard"><div class="nt">%s. %s</div>'
                              % (step[i % 4], keep(c['t'])))
                    nb.append('<div class="nf">%s</div>' % f)
                    if c['opts']:
                        # 화면은 보기를 섞어 내보낸다. 책에서도 정답이 늘 첫 줄이면
                        # 읽는 사람이 내용을 보지 않고 ①을 고르게 되므로, 실험실 번호로
                        # 자리를 돌려 둔다. 돌린 결과는 책 끝의 「판단 보기 정답」에 모은다.
                        opts = c['opts']
                        off = int(meta['lab']) % len(opts)
                        rot = [opts[(k2 + off) % len(opts)] for k2 in range(len(opts))]
                        ANSWERS.append((no, meta['title'], (len(opts) - off) % len(opts) + 1))
                        os_ = ''.join('<span class="o">%s %s</span>'
                                      % ('①②③④'[k2] if k2 < 4 else '·', keep(o))
                                      for k2, o in enumerate(rot))
                        nb.append('<div class="no">%s</div>' % os_)
                    nb.append('</div>')
                nb.append('</div>')
                a('\n'.join(nb))
            a(body_html(lines))

        elif k == 'hand':
            segs = split_on(lines)
            hw = '<br>'.join(inline(x.strip()) for x in segs[0] if x.strip())
            tc = ' '.join(x.strip() for x in (segs[1] if len(segs) > 1 else []))
            a('<div class="hand2"><div class="l">학생의 손글씨 풀이</div>'
              '<div class="hw">%s</div>%s</div>'
              % (hw, ('<div class="tc">%s</div>' % inline(tc)) if tc else ''))

        elif k == 'apply':
            ap = mat['apply']
            a('<h2 class="sec">적용 문제 — 혼자 풀어 보기</h2>')
            a('<div class="probbox probox"><div class="l">문제</div>'
              '<div class="q">%s</div>' % keep(ap['q']))
            a('<div class="sol"><span class="sl">풀이</span>%s' % keep(ap['why']))
            if lines and any(x.strip() for x in lines):
                a(body_html(lines))
            a('</div>')
            a('<div class="sol" style="border:0;padding-top:1mm"><span class="sl">답</span> '
              '%s <span style="color:#5A6779">(허용오차 ±%s)</span></div>'
              % (esc(ap['a']), esc(ap['tol'])))
            a('</div>')

        elif k == 'ex':
            segs = split_on(lines)
            q = ' '.join(x.strip() for x in segs[0])
            s = ' '.join(x.strip() for x in (segs[1] if len(segs) > 1 else []))
            a('<div class="ex"><div class="eh">연습문제 · %s</div>'
              '<div class="eq2">%s</div>%s</div>'
              % (esc(arg or '문제'), inline(q),
                 ('<div class="sol">%s</div>' % inline(s)) if s else ''))

        elif k == 'term':
            name, code = (arg.split('|', 1) + [''])[:2]
            segs = split_on(lines)
            keys = ['정의', '유도', '교육과정']
            rows = []
            for i, seg in enumerate(segs[:3]):
                v = ' '.join(x.strip() for x in seg)
                if v:
                    rows.append('<div class="tr"><div class="k">%s</div><div>%s</div></div>'
                                % (keys[i], inline(v)))
            a('<div class="term"><div class="th">%s<span class="tcode">%s</span></div>%s</div>'
              % (inline(name.strip()), esc(code.strip()), ''.join(rows)))

        elif k == 'teacher':
            a('<div class="teach"><div class="l">교사 이야기</div>%s</div>' % body_html(lines))

        elif k == 'career':
            a('<div class="career"><div class="l">이 수학이 쓰이는 곳</div>%s</div>'
              % body_html(lines))

        else:
            a(body_html(lines))

    # ── 이 장에서 쓴 출처 ──────────────────────────────────────────────
    if CHAP_CITES:
        rows = []
        for i, key in enumerate(CHAP_CITES, 1):
            f = FACTS.get(key)
            if not f:
                rows.append('<div class="sr"><span class="n">%d</span>'
                            '<span class="t" style="color:#C0504D">출처 미등록 — %s</span></div>'
                            % (i, esc(key)))
                continue
            ALL_CITES.append(key)
            chk = (' <span class="chk">확인 %s</span>' % esc(f['checked'])) if f.get('checked') else ''
            note = (' <span class="nt">%s</span>' % inline(f['note'])) if f.get('note') else ''
            rows.append('<div class="sr"><span class="n">%d</span><span class="t">%s%s%s</span></div>'
                        % (i, inline(f['source']), chk, note))
        a('<div class="sources"><div class="l">이 장이 쓴 출처</div>%s</div>' % ''.join(rows))

    a('</section>')
    return '\n'.join(H)


# ── 권 묶기 ──────────────────────────────────────────────────────────────
def build(volpath):
    V = json.load(open(volpath, encoding='utf-8'))
    base = os.path.dirname(os.path.abspath(volpath))
    MAT = {x['n']: x for x in json.load(open(os.path.join(base, V['material']), encoding='utf-8'))}
    load_assets(base)
    load_facts(base)
    css = open(os.path.join(HERE, 'book.css'), encoding='utf-8').read()

    H = ['<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">',
         '<meta name="viewport" content="width=device-width,initial-scale=1">',
         '<title>%s</title>' % esc(V['title']),
         '<style>%s</style></head><body>' % css]

    # 표지
    H.append('<section class="cover"><span class="tag">%s</span>' % esc(V['series']))
    H.append('<h1>%s</h1><div class="vol">%s</div>' % (esc(V['title']), esc(V['volume'])))
    H.append('<div class="sub">%s</div>' % inline(V['cover_sub']))
    H.append('<div class="parts">')
    for p in V['parts']:
        H.append('<div class="pi"><div class="n">제%s부</div><div class="t">%s</div></div>'
                 % (esc(p['n']), esc(p['title'])))
    H.append('</div><div class="note">%s</div></section>' % inline(V['cover_note']))

    # 서문 · 읽는 법 · 목차
    for f in V.get('front', []):
        H.append('<section class="front"><h2>%s</h2>' % esc(f['h']))
        H.append(body_html(f['body'].splitlines()))
        if f.get('sign'):
            H.append('<div class="sign">%s</div>' % esc(f['sign']))
        if f.get('legal'):
            H.append('<div class="legal">%s</div>' % inline(f['legal']))
        H.append('</section>')

    chapters, no = [], 0
    toc = ['<section class="toc"><h2>목차</h2>']
    # 목차의 네모는 그 장의 실험실로 바로 가는 QR 이다 — 번호를 찾아 들어갈 일이 없다.
    toc.append('<p class="tnote">제목 옆의 네모를 휴대전화 사진기로 비추면 <b>그 장의 '
               '실험실이 바로 열립니다.</b> 목록에서 번호를 찾을 필요가 없습니다. '
               '인터넷이 되지 않으면 내려받아 둔 <b>index.html</b> 을 열고 같은 이름을 '
               '찾으면 됩니다.</p>')
    for p in V['parts']:
        toc.append('<div class="tp">제%s부 · %s</div>' % (esc(p['n']), esc(p['title'])))
        for lab in p['chapters']:
            no += 1
            src = os.path.join(base, V['dir'], 'ch%02d.txt' % no)
            if not os.path.exists(src):
                toc.append('<div class="tc"><div class="q tbd"></div><div class="tt">'
                           '<div class="n">제%d장</div>'
                           '<div class="t" style="color:#9AA6B8">(집필 예정 · LAB %d)</div>'
                           '</div></div>' % (no, lab))
                continue
            meta, blocks = parse(src)
            assert int(meta['lab']) == lab, (src, meta.get('lab'), lab)
            chapters.append((p, no, chapter_html(no, meta, blocks, MAT[lab])))
            labname = plain(MAT[lab]['title'])
            toc.append('<div class="tc"><div class="q">%s</div><div class="tt">'
                       '<div class="n">제%d장</div><div class="t">%s</div>%s'
                       '<div class="lab">%s</div></div></div>'
                       % (QRMOD.svg(labname, 16), no, esc(meta['title']),
                          ('<div class="ts">%s</div>' % esc(meta['sub']))
                          if meta.get('sub') else '',
                          esc('실험실 「%s」'
                              % re.split(r'[—–]', labname)[0].strip())))
    toc.append('</section>')
    H.append('\n'.join(toc))

    # 부 구분지 + 장
    seen = set()
    for p, n, body in chapters:
        if p['n'] not in seen:
            seen.add(p['n'])
            H.append('<section class="pdiv"><div class="wm">%s</div><div class="in">'
                     '<div class="pn">제%s부</div><h2>%s</h2><div class="ps">%s</div>'
                     '<div class="po">%s</div>'
                     % (esc(p['n']), esc(p['n']), esc(p['title']), esc(p.get('sub', '')),
                        inline(p.get('intro', ''))))
            if p.get('labs_note'):
                H.append('<div class="pl">%s</div>' % inline(p['labs_note']))
            H.append('</div></section>')
        H.append(body)

    # 부록
    for ax in V.get('back', []):
        H.append('<section class="appx"><h2>%s</h2>' % esc(ax['h']))
        if ax.get('gen') == 'refs':
            H.append(body_html(ax.get('body', '').splitlines()))
            # 같은 자료를 여러 사실이 인용하면 참고문헌에는 «한 번만» 싣는다.
            # (대장 항목이 아니라 «출처 문자열» 로 추린다 — 전에는 같은 책이 두 줄로 나왔다)
            seen, items = set(), []
            for key in ALL_CITES:
                f = FACTS[key]
                sig = ' '.join(plain(f['source']).split())
                if sig in seen:
                    continue
                seen.add(sig)
                items.append(f)
            items.sort(key=lambda f: f['source'])
            H.append('<div class="refs">%s</div>'
                     % ''.join('<div class="r">%s%s</div>'
                               % (inline(f['source']),
                                  (' <span class="chk">확인 %s</span>' % esc(f['checked']))
                                  if f.get('checked') else '')
                               for f in items))
            H.append('<p style="font-size:9.2pt;color:#5A6779;margin-top:4mm">'
                     '모두 %d 편입니다. 본문의 윗첨자 번호는 그 장의 「이 장이 쓴 출처」 '
                     '목록을 가리킵니다.</p>' % len(items))
        elif ax.get('gen') == 'answers':
            H.append(body_html(ax.get('body', '').splitlines()))
            rows = ''.join('<tr><td>제%d장 %s</td><td>%s</td></tr>'
                           % (n, esc(t), '①②③④'[p - 1]) for n, t, p in ANSWERS)
            H.append('<table><tr><th>장</th><th>판단 보기의 정답</th></tr>%s</table>' % rows)
        else:
            H.append(body_html(ax.get('body', '').splitlines()))
        H.append('</section>')

    H.append('</body></html>')
    out = os.path.join(base, V['out'])
    open(out, 'w', encoding='utf-8').write('\n'.join(H))
    size = os.path.getsize(out) / 1048576
    sys.stdout.write('%s  장 %d개 · %.2f MB\n' % (out, len(chapters), size))
    return out


if __name__ == '__main__':
    build(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '중1.json'))
