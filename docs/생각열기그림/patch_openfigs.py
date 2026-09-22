# -*- coding: utf-8 -*-
"""「생각 열기」 자리에 설명 그림을 넣는다 — 문제 화면과 「다시 보는 오늘의 문제」 블록 모두에.

왜
  문제 단계의 「생각 열기 ─ ①②③」은 글만 있어 무슨 말인지 잡히지 않는다.
  물음 하나에 그림 하나를 붙여, 읽지 않고 보아도 무엇을 묻는지 알게 한다.

어디에
  LESSON[n].problem.sit 뒤에 붙인다. sit 은 문제 단계와
  「📌 다시 보는 오늘의 문제」(예상·실험·기록 단계 머리)에 함께 나오므로 한 번만 넣으면 된다.

활동지와의 관계
  활동지(patch_worksheet.py)는 이 <figure> 들을 그대로 읽어 간다 — 그림을 두 군데 두지 않는다.

사용: python docs/생각열기그림/patch_openfigs.py src/40-demos.js
"""
import sys, os, base64

HERE = os.path.dirname(os.path.abspath(__file__))
IMGD = os.path.join(os.path.dirname(HERE), '썸네일_힉스필드', '상황삽화')

# 실험실 번호 → [(그림 파일, 설명 문구)]  — 문구는 「생각 열기」의 물음과 짝을 맞춘다
FIGS = {
    2: [
        ('m02_table',  '100통은 네 칸으로 나뉩니다 — <b>칸의 넓이가 곧 통수</b>입니다. 스팸은 적고 정상은 많습니다.'),
        ('m02_narrow', '<b>①</b> 「무료」가 든 것만 떼어 내면 분모가 100에서 20으로 <b>좁아집니다</b>. 그 안에서 스팸을 세면 됩니다.'),
        ('m02_twoway', '<b>②</b> 「스팸 중 무료의 비율」과 「무료 중 스팸의 비율」은 <b>방향이 반대</b>입니다 — 분모가 다르니 값도 다릅니다.'),
        ('m02_indep',  '<b>③</b> 「당첨」은 늘 「무료」와 함께 옵니다. <b>독립이 아니면</b> 두 확률을 그냥 곱할 수 없습니다.'),
    ],
    3: [
        ('m03_addmul', '<b>①</b> 같은 양을 <b>더하는</b> 것과 같은 비율을 <b>곱하는</b> 것은 다릅니다. 곱하기는 몇 걸음 만에 따라잡을 수 없게 벌어집니다.'),
        ('m03_double', '<b>②</b> 두 배가 되기까지 걸리는 시간은 <b>늘 같습니다</b>. 그 간격을 구하려면 지수에 있는 t 를 끌어내려야 합니다.'),
        ('m03_scurve', '<b>③</b> 천장이 있으면 끝에서 눕습니다. 격자에는 64명뿐이라 <b>모형의 가정이 깨지는 자리</b>가 생깁니다.'),
    ],
    4: [
        ('c04_parts',  '<b>①</b> 세로축에서 출발하는 높이가 <b>기본료</b>(상수), 기울어진 정도가 <b>분당 요금</b>(x 의 계수)입니다.'),
        ('m04_three',  '<b>②</b> 두 직선의 <b>교점</b> · 연립방정식의 <b>해</b> · 유불리가 갈리는 <b>경계</b> — 셋은 같은 하나입니다.'),
        ('m04_diff',   '<b>③</b> 차액 막대는 한 점에서 0이 되고 그 뒤로 <b>부호가 바뀝니다</b>. 기본료 차를 분당 요금 차가 메우는 데 걸리는 시간입니다.'),
    ],
    356: [
        ('d356_four',   '스위치 두 개의 조합은 <b>네 가지뿐</b>입니다. 한 줄로 이은 회로에서는 <b>둘 다 닫아야</b> 전구가 켜집니다 — 넷 중 한 가지뿐입니다.'),
        ('d356_series', '<b>직렬</b>(왼쪽)은 둘 다 닫아야 켜지고, <b>병렬</b>(오른쪽)은 하나만 닫아도 켜집니다. 전류가 지나갈 길이 있는지만 보면 됩니다.'),
        ('d356_table',  '켜지는 줄(맨 아래 한 줄)만 모으면 그것이 곧 논리식이고, 같은 것을 <b>게이트 기호 하나</b>로 씁니다.'),
        ('d356_same',   '위와 아래는 <b>생김새가 다른데 결과가 같습니다</b> — (A·B)′ 와 A′+B′. 이것이 드모르간 법칙입니다.'),
    ],
}

CSS = '''
/* 생각 열기 그림 — 물음 하나에 그림 하나 (2026-09-22) */
.lsnfigs{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:10px;margin-top:10px}
.lsnfigs figure{margin:0;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px}
.lsnfigs img{display:block;width:100%;height:auto;border-radius:6px}
.lsnfigs figcaption{font-size:11.8px;line-height:1.55;color:var(--ink2);margin-top:6px}
@media(max-width:560px){.lsnfigs{grid-template-columns:1fr 1fr}}
'''


def strip_tags(s):
    out, skip = [], False
    for ch in s:
        if ch == '<':
            skip = True
        elif ch == '>':
            skip = False
        elif not skip:
            out.append(ch)
    return ''.join(out)


def block(items):
    figs = []
    for name, cap in items:
        p = os.path.join(IMGD, name + '.webp')
        if not os.path.exists(p):
            continue
        b = base64.b64encode(open(p, 'rb').read()).decode()
        alt = strip_tags(cap).replace('"', '')
        figs.append('<figure><img src="data:image/webp;base64,%s" alt="%s"><figcaption>%s</figcaption></figure>'
                    % (b, alt, cap))
    return '<div class="lsnfigs">' + ''.join(figs) + '</div>' if figs else ''


def main(path):
    h = open(path, encoding='utf-8').read()
    done, skip = [], []
    for lab, items in sorted(FIGS.items()):
        i = h.find('LESSON[%d]={' % lab)
        if i < 0:
            skip.append('LAB %d (없음)' % lab)
            continue
        # problem.sit 은 problem 블록의 마지막 줄 — sit:'...'  뒤에 붙인다
        a = h.find("  sit:'", i)
        assert a > 0, 'LAB %d 의 sit 을 못 찾음' % lab
        # 닫는 따옴표 찾기 (이스케이프된 따옴표는 이 파일에 쓰지 않는다)
        b = h.index("'", a + len("  sit:'"))
        while h[b - 1] == '\\':
            b = h.index("'", b + 1)
        blk = block(items)
        cur = h[a:b]
        j = cur.find('<div class="lsnfigs">')
        if j >= 0:                      # 이미 있으면 통째로 갈아 끼운다
            if blk and blk in cur:
                skip.append('LAB %d' % lab)
                continue
            h = h[:a + j] + h[b:]
            b = a + j
        if not blk:
            skip.append('LAB %d (그림 없음)' % lab)
            continue
        h = h[:b] + blk + h[b:]
        done.append('LAB %d (%d장)' % (lab, blk.count('<figure>')))

    open(path, 'w', encoding='utf-8').write(h)
    print('넣음 :', ' · '.join(done) if done else '(없음)')
    print('건너뜀:', ' · '.join(skip) if skip else '(없음)')

    css = os.path.join(os.path.dirname(os.path.abspath(path)), 'styles.css')
    if os.path.exists(css):
        c = open(css, encoding='utf-8').read()
        if '.lsnfigs{' not in c:
            open(css, 'w', encoding='utf-8').write(c + CSS)
            print('styles.css 에 .lsnfigs 추가')
        else:
            print('styles.css 이미 반영됨')


if __name__ == '__main__':
    main(sys.argv[1])
