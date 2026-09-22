/* 탭③ — 연수에서 실제로 다루는 실습 과제(core:1)를 카드로 편다.
   종수도 제목도 손으로 적지 않는다. LABS 에서 읽으므로 실험실을 늘리면 여기도 따라 바뀐다. */
(function(){
  const host = $('#fcore');
  if(!host || typeof LABS === 'undefined') return;

  /* 어느 단계에서 쓰는지 — 위 타임라인과 같은 시각을 쓴다 */
  const ROLE = {
    1:  {when:'15:15 – 15:50', step:'①체험', d:'학생 입장에서 조작한 뒤 <b>입력–계산–시각화–피드백</b> 네 블록으로 해체합니다. 모든 자료가 같은 뼈대라는 것을 여기서 봅니다.'},
    2:  {when:'16:00 – 16:20', step:'②개조', d:'①에서 해체한 네 블록 중 <b>②번 「계산」 블록의 한 줄</b>(분할표의 한 칸)을 고쳐 판정이 뒤집히는 것을 확인합니다. 탭②의 7라운드 실습도 이 자료로 합니다.'},
    3:  {when:'16:20 – 16:55', step:'③생성', d:'②에서 한 줄만 고쳤던 <b>그 「계산」 블록을 이번엔 통째로 새로 씁니다.</b> 내 단원으로 리모델링할 때 뼈대로 삼는 자료이며, 지수·로지스틱 두 모형을 바꿔 끼우며 7라운드를 돕니다.'},
    21: {when:'17:05 – 17:35', step:'완성',   d:'③에서 만든 자료에 내가 적어 둔 <b>판정 기준(무엇을 갖추면 통과인가)이 그대로 루브릭의 「상」 기준</b>이 됩니다 — 제작과 평가를 잇는 다리가 이 한 줄입니다. 탭④ <b>수행평가 ②</b>의 원본입니다.'},
    356:{when:'17:55 – 18:00', step:'다음 걸음', d:'상자를 열지 않고 <b>입력을 모두 넣어 보고 출력만 기록해</b> 규칙을 알아냅니다 — 속을 볼 수 없는 모델을 다루는 방식 그대로입니다. 논리 게이트가 <b>퍼셉트론</b>으로 이어지는 자리라 「인공지능 수학」 진로선택과 곧장 닿습니다. 탭④에 3차시 <b>수업 구성 지도서</b>가 있습니다.'}
  };

  const core = LABS.map((L,i)=>({L, i, n:i+1})).filter(x=>x.L.core);
  $('#fcoreN').textContent = core.length + '종';

  core.forEach(({L,i,n})=>{
    const r = ROLE[n] || {when:'', step:'실습 과제', d:L.q};
    const c = el(`<div class="fci">
      <div class="fcth">${THUMBS[i]||''}</div>
      <div class="fcb">
        <div class="fcm"><span class="fcstep">${r.step}</span>
          ${r.when?`<span class="fcwhen">${r.when}</span>`:''}
          <span class="fcno">LAB ${String(n).padStart(2,'0')}</span></div>
        <h4>${L.t}</h4>
        <p class="fcq">${L.q}</p>
        <p class="fcd">${r.d}</p>
        <div class="fcgo">▶ 열어 보기</div>
      </div></div>`);
    c.onclick = ()=>open(L,i);
    host.appendChild(c);
  });
})();
