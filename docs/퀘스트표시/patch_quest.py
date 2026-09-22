# -*- coding: utf-8 -*-
"""활성화되지 않은 칸은 잠겨 보이게, 지금 할 칸은 깜박이게 — 퀘스트 형식.

왜
  탐구 노트 세 칸이 모두 똑같이 열려 있어, 학생이 **무엇부터 해야 하는지** 알 수 없었다.
  「다음 단계로」 단추도 조건을 채우면 조용히 활성화될 뿐이어서 열린 줄 모르고 지나쳤다.

무엇을 하나
  ① 탐구 노트 — 앞 칸을 통과해야 다음 칸이 열린다. 잠긴 칸은 흐려지고 🔒 와 함께
     「① 을 먼저 통과하세요」가 뜬다. 지금 할 칸만 테두리가 살아나고 깜박인다.
  ② 탐구 사다리·단계 칩 — 지금 단계는 깜박이고, 잠긴 것에는 🔒 가 붙는다.
  ③ 「다음 단계로」 단추 — 조건을 채워 열리는 순간 깜박여 눈에 띈다.
  움직임에 불편한 사람을 위해 prefers-reduced-motion 에서는 깜박이지 않는다.

사용: python docs/퀘스트표시/patch_quest.py src/styles.css src/40-demos.js
"""
import sys

CSS = '''
/* 퀘스트 표시 — 지금 할 것은 깜박이고, 아직 못 여는 것은 잠겨 보인다 (2026-09-22) */
@keyframes qpulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.50)}
                  50%    {box-shadow:0 0 0 8px rgba(37,99,235,0)}}
@keyframes qglow{0%,100%{background:var(--blue-s)} 50%{background:#DBE8FF}}
.ldi.now{animation:qglow 1.7s ease-in-out infinite}
.ldi.now .ldk{animation:qpulse 1.7s ease-in-out infinite}
.ldi.lock .ldn::after{content:' 🔒'}
.lsnchip.now{animation:qglow 2s ease-in-out infinite}
.lsnchip.lock .lsnn{font-size:0}
.lsnchip.lock .lsnn::before{content:'🔒';font-size:9.5px}
.eqc.qlock{opacity:.45;filter:grayscale(.5)}
.eqc.qlock .eqi,.eqc.qlock .nek,.eqc.qlock .nopts{pointer-events:none}
.eqc.qlock .eqt::after{content:attr(data-need);display:inline-block;margin-left:6px;
  font-size:11px;font-weight:800;color:var(--warn,#B45309)}
.eqc.qnow{border-color:#93B4F5;box-shadow:0 0 0 3px rgba(37,99,235,.12);
  animation:qpulse 1.8s ease-in-out infinite}
.eqc.qnow .nek{animation:qpulse 1.8s ease-in-out infinite}
.eqc.qdone{border-color:#9CD9C9;background:#F6FEFA}
.qgo{animation:qpulse 1.6s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){
  .ldi.now,.ldi.now .ldk,.lsnchip.now,.eqc.qnow,.eqc.qnow .nek,.qgo{animation:none}
}
'''

NOTE_OLD = """  root.appendChild(box);
  const pass=N.c.map(()=>false), mem={};
  box.querySelectorAll('.eqc').forEach(el=>{"""

NOTE_NEW = """  root.appendChild(box);
  const pass=N.c.map(()=>false), mem={};
  const cards=[...box.querySelectorAll('.eqc')];
  /* 퀘스트 — 앞 칸을 통과해야 다음 칸이 열린다. 지금 할 칸만 깜박인다. */
  function qpaint(){
    const at=pass.indexOf(false);
    cards.forEach((el,k)=>{
      el.classList.remove('qnow','qlock','qdone');
      const t=el.querySelector('.eqt');
      if(pass[k]){ el.classList.add('qdone'); t.removeAttribute('data-need'); }
      else if(k===at){ el.classList.add('qnow'); t.removeAttribute('data-need'); }
      else { el.classList.add('qlock'); t.dataset.need='🔒 '+NUM[(k-1)%4]+' 칸을 먼저 통과하세요'; }
    });
  }
  cards.forEach(el=>{"""

NOTE_TAIL_OLD = """        : `<span style="color:#6B7280">탐구 노트 ${done} / ${N.c.length} 칸</span>`;
    };
  });
}"""

NOTE_TAIL_NEW = """        : `<span style="color:#6B7280">탐구 노트 ${done} / ${N.c.length} 칸</span>`;
      qpaint();
    };
  });
  qpaint();
}"""

FLOW_OLD = """  }).observe(box,{subtree:true,childList:true,characterData:true});
  show(0);
}"""

FLOW_NEW = """  }).observe(box,{subtree:true,childList:true,characterData:true});

  /* 퀘스트 — 조건을 채워 열린 「다음 단계」 단추를 깜박여 어디로 갈지 보이게 한다.
     class 는 감시 목록에 없으므로 스스로를 다시 부르지 않는다. */
  function qgo(){
    box.querySelectorAll('.lsnph button.b').forEach(b=>{
      const ph=b.closest('.lsnph');
      const go=/(go|open)$/.test(b.id||'');
      b.classList.toggle('qgo', !!(go && !b.disabled && ph && !ph.hidden));
    });
  }
  new MutationObserver(qgo).observe(box,
    {subtree:true,childList:true,attributes:true,attributeFilter:['disabled','hidden']});
  qgo();

  show(0);
}"""


def main(css_path, js_path):
    css = open(css_path, encoding='utf-8').read()
    if '퀘스트 표시' in css:
        print('styles.css 이미 반영됨')
    else:
        open(css_path, 'w', encoding='utf-8').write(css + CSS)
        print('styles.css 에 퀘스트 표시 규칙 추가')

    js = open(js_path, encoding='utf-8').read()
    if 'function qpaint' in js:
        print('40-demos.js 이미 반영됨')
        return
    for old, new, what in ((NOTE_OLD, NOTE_NEW, '탐구 노트 잠금'),
                           (NOTE_TAIL_OLD, NOTE_TAIL_NEW, '탐구 노트 다시 칠하기'),
                           (FLOW_OLD, FLOW_NEW, '다음 단계 단추 깜박임')):
        assert js.count(old) == 1, '%s — 자리를 못 찾음 (%d곳)' % (what, js.count(old))
        js = js.replace(old, new, 1)
    open(js_path, 'w', encoding='utf-8').write(js)
    print('40-demos.js 에 퀘스트 장치 삽입 — 탐구 노트 잠금 · 단추 깜박임')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
