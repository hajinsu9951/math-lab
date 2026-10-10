# -*- coding: utf-8 -*-
"""주소 끝의 «실험실 이름» 으로 그 실험실을 바로 열게 한다 — 단행본의 QR 이 가리킬 자리.

왜 번호가 아니라 이름인가
  주소가 #lab25 이면 사람이 읽을 수 없다. 번호는 자료를 고칠 때 바뀔 수도 있다.
  주소가 #소인수분해와암호 이면 **주소만 보고도 무엇이 열릴지 안다.**
  책의 QR 아래에 주소를 함께 싣는데, 그 줄이 읽히는 글이어야 한다.

어떻게
  · 이름은 띄어쓰기·기호를 지우고 견준다 — 「소인수분해와 암호」 와 「소인수분해와암호」 가 같다.
  · 꼭 맞는 이름이 없으면 «앞부분이 맞는» 이름을 찾는다. 그런 것이 둘 이상이면 열지 않는다.
  · 예전 주소 #lab25 도 그대로 열린다 — 이미 나간 자료를 깨지 않는다.
  · 읽기만 한다. 실험실을 열 때 주소를 고쳐 쓰지 않으므로 되돌이가 생기지 않는다.
  · file:// 로 열어도 똑같이 된다. 단일 파일 원칙을 깨지 않는다.

사용: python docs/단행본/patch_qr_route.py src/40-demos.js
"""
import io
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ANCHOR = "$('#mX').onclick=()=>{$('#mask').classList.remove('on');audioStop();};"
S, E = '/* ══ QR-ROUTE start ══', '/* ══ QR-ROUTE end ══ */'

JS = r"""/* ══ QR-ROUTE start ══ 주소 끝의 «실험실 이름» 으로 그 실험실을 바로 연다 (2026-10-10)
   단행본의 QR 코드가 가리키는 자리다. #소인수분해와암호 처럼 이름을 적으면
   목록을 거치지 않고 그 실험실이 바로 열린다 — 수업 모형이 있으면 7단계가 곧바로 열린다.
   예전에 쓰던 #lab25 도 그대로 받는다. 읽기만 하므로 되돌이가 생기지 않는다. */
function labKey(s){
  return String(s == null ? '' : s)
    .replace(/<[^>]*>/g, '')
    .replace(/[^0-9A-Za-z가-힣]/g, '');
}
function labTitleOf(i){
  const L = LABS[i];
  const S = (typeof LESSON !== 'undefined') && LESSON[i + 1];
  return (S && S.title) || (L && L.t) || '';
}
function labFromHash(){
  const h = location.hash || '';
  if(h.length < 2) return 0;
  const m = /^#lab(\d{1,3})$/i.exec(h);
  if(m){ const n = +m[1]; return (n >= 1 && n <= LABS.length) ? n : 0; }
  let want = h.slice(1);
  try { want = decodeURIComponent(want); } catch(e) {}
  want = labKey(want);
  if(want.length < 2) return 0;
  let hit = 0, pre = 0, preCount = 0;
  for(let i = 0; i < LABS.length; i++){
    const full = labTitleOf(i);
    if(!full) continue;
    /* 책은 줄표 앞의 «앞이름» 만 주소에 싣는다 — 두 꼴을 모두 견준다.
       「부채꼴 — 원그래프의 각도」 는 #부채꼴 로도, 전체 이름으로도 열려야 한다. */
    const kFull = labKey(full);
    const kHead = labKey(String(full).split(/[—–]/)[0]);
    if(kFull === want || kHead === want){ hit = i + 1; break; }
    if(kFull.indexOf(want) === 0){ pre = i + 1; preCount++; }
  }
  /* 앞부분이 맞는 이름이 둘 이상이면 어느 것인지 알 수 없으므로 열지 않는다 */
  return hit || (preCount === 1 ? pre : 0);
}
function routeFromHash(){
  const n = labFromHash();
  if(!n) return;
  setTimeout(()=>{ try{ openLab(n-1); }catch(e){} }, 0);   /* 카드가 그려진 뒤에 연다 */
}
window.addEventListener('hashchange', ()=>{
  if(labFromHash()) routeFromHash();
  else $('#mask').classList.remove('on');
});
routeFromHash();
/* ══ QR-ROUTE end ══ */
"""


def main(path):
    s = io.open(path, encoding='utf-8').read()
    if S in s:                                   # 이미 있으면 통째로 갈아 끼운다
        a = s.index(S)
        b = s.index(E) + len(E)
        s = s[:a] + JS.strip() + s[b:]
        io.open(path, 'w', encoding='utf-8').write(s)
        sys.stdout.write('이름으로 여는 길로 갈아 끼웠습니다\n')
        return 0
    assert s.count(ANCHOR) == 1, s.count(ANCHOR)
    io.open(path, 'w', encoding='utf-8').write(s.replace(ANCHOR, JS + ANCHOR, 1))
    sys.stdout.write('이름으로 바로 여는 길을 붙였습니다\n')
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
