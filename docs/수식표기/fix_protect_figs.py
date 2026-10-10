# -*- coding: utf-8 -*-
"""texify.py 가 「생각 열기 그림」 블록을 건드리지 않게 한다.

무엇이 문제였나
  problem.sit 끝에 붙는 <div class="lsnfigs">…</div> 는 patch_openfigs.py 가 소유한다.
  그런데 texify 가 그 안의 figcaption 에 든 m² 같은 글자를 수식으로 바꾸면,
  다음에 patch_openfigs 를 돌릴 때 「내가 넣은 것과 다르다」며 통째로 갈아 끼운다.
  두 도구가 서로의 결과를 되돌리는 꼴이라 빌드할 때마다 파일이 흔들린다.

고침
  그림 블록을 protected() 에 넣어 texify 가 손대지 않게 한다.
  figcaption 의 글은 짧은 안내문이라 수식 변환이 필요하지 않다.

사용: python docs/수식표기/fix_protect_figs.py docs/수식표기/texify.py
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OLD = """    sp = []
    for m in re.finditer(r'svg:`', seg):"""
NEW = """    sp = []
    for m in re.finditer(r'<div class="lsnfigs">', seg):   # patch_openfigs 가 소유한 블록
        k = seg.find('</div>', m.end())
        if k > 0:
            sp.append((m.start(), k + 6))
    for m in re.finditer(r'svg:`', seg):"""


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'lsnfigs' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    assert h.count(OLD) == 1, '앵커가 %d곳 — 멈춘다' % h.count(OLD)
    h = h.replace(OLD, NEW, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('texify 가 생각 열기 그림 블록을 건너뛴다\n')


if __name__ == '__main__':
    main(sys.argv[1])
