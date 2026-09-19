# -*- coding: utf-8 -*-
"""LAB 356 「논리 회로 탐정」 — 삽화 4장만 넣는다.

이 실험실은 식 검사(진리표 채우기)를 이미 갖추고 있어 수업 구조는 손대지 않는다.
작업지시 2절의 네 자리(문제·원리·탐침·적용)에 힉스필드 삽화만 붙인다.

사용: python docs/LAB356_고도화/patch_lab356.py dist/index.html
"""
import sys, os, base64

HERE = os.path.dirname(os.path.abspath(__file__))
IMGD = os.path.join(os.path.dirname(HERE), '썸네일_힉스필드', '상황삽화')

# PRINS[355] 는 줄머리 '{tex:[' 형식이 아니라 한 줄로 붙어 있어 원소 순서로 셀 수 없다.
# 그 원소만의 eq 문자열을 닻으로 삼는다.
PRIN_EQ = "Y = A·B  /  Y = A+B  /  (A·B)′ = A′+B′"


def img(name, alt):
    p = os.path.join(IMGD, name + '.webp')
    if not os.path.exists(p):
        return ''
    b = base64.b64encode(open(p, 'rb').read()).decode()
    return '<img class="lsimg" src="data:image/webp;base64,%s" alt="%s">' % (b, alt)


def main(path):
    h = open(path, encoding='utf-8').read()
    i = h.find('LESSON[356]={')
    assert i > 0, 'LESSON[356] 자리를 못 찾음'
    end = h.find('\n};', i)
    assert end > i
    block, done = h[i:end], []

    # 1) 문제 삽화
    t = img('b356_problem', '두 스위치와 전구가 달린 닫힌 상자, 그 위에 뜬 물음표')
    anchor = '  svg:`<svg viewBox="0 0 400 180"'
    if t and t not in block:
        assert block.count(anchor) == 1, '문제 svg 자리를 못 찾음'
        block = block.replace(anchor, '  svg:`' + t + '\n   <svg viewBox="0 0 400 180"', 1)
        done.append('문제')

    # 2) 적용 삽화
    t = img('b356_apply', '하나로 합쳐지지 않는 두 게이트 기호와 그 사이를 가로막은 벽')
    anchor = "  q:'새 문제 — 다섯 사람의"
    if t and t not in block:
        assert block.count(anchor) == 1, '적용 문제 자리를 못 찾음'
        block = block.replace(anchor, "  q:'" + t + "새 문제 — 다섯 사람의", 1)
        done.append('적용')

    h = h[:i] + block + h[end:]

    # 3) 원리·탐침 삽화 — PRINS[355]
    k = h.find(PRIN_EQ)
    assert k > 0, 'PRINS[355] 를 못 찾음 (eq 닻이 바뀌었는지 확인)'
    for key, name, alt in [
        ('what', 'b356_what', '채워진 원과 빈 원으로 된 표, 화살표, 그리고 논리 게이트 기호'),
        ('probe', 'b356_probe', '두 스위치 가운데 하나를 누르는 손과 한 줄씩 채워지는 표'),
    ]:
        t = img(name, alt)
        if not t:
            continue
        a = h.find(" %s:'" % key, k)
        assert 0 < a < k + 20000, 'PRINS[355].%s 자리를 못 찾음' % key
        if t in h[a:a + len(t) + 40]:
            continue
        h = h[:a] + (" %s:'" % key) + t + h[a + len(key) + 3:]
        done.append(key)

    open(path, 'w', encoding='utf-8').write(h)
    print('넣은 자리:', ' · '.join(done) if done else '(이미 다 들어 있음)',
          '| size MB', round(len(h.encode('utf-8')) / 1048576, 2))


if __name__ == '__main__':
    main(sys.argv[1])
