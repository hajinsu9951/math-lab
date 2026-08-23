function bayesDemo(root){
  const W={'무료':0.92,'당첨':0.95,'클릭':0.88,'쿠폰':0.90,'대출':0.90,'광고':0.85,
           '엄마':0.03,'회의':0.10,'과제':0.08,'전화':0.30,'감사':0.15,'내일':0.25};
  root.innerHTML=`<div class="row"><div class="col">
    <label class="ctl">문자 내용을 입력하세요</label>
    <textarea id="bt" rows="3"></textarea>
    <div class="btns">
      <button class="b" id="bgo">스팸 확률 계산</button>
      <button class="b g" id="bq1" data-s="[Web발신] 무료 쿠폰 지급, 지금 클릭">문자① 불러오기</button>
      <button class="b g" id="bq2" data-s="엄마 : 무료할 때 전화해">문자② 불러오기</button>
    </div>
    <div class="out" id="bout"></div></div>
    <div class="col"><label class="ctl">단어별 P(스팸 | 단어) 사전</label>
    <table class="t"><tr><th>단어</th><th>P</th><th>단어</th><th>P</th></tr>
    ${Object.keys(W).reduce((a,k,i)=>{const v=W[k];
      return a+(i%2===0?`<tr><td>${k}</td><td>${v}</td>`:`<td>${k}</td><td>${v}</td></tr>`);},'')}</table>
    <div class="note">이 확률은 지금까지 받은 문자 수만 통에서 학습된 값입니다. 0.5보다 크면 스팸 쪽 증거, 작으면 정상 쪽 증거.</div>
    </div></div>`;
  function calc(){
    const s=$('#bt').value.trim();
    if(!s){$('#bout').innerHTML='문자를 입력하거나, 버튼으로 오늘의 문제의 두 문자를 불러오세요.';return;}
    const hits=Object.keys(W).filter(k=>s.includes(k));
    if(!hits.length){$('#bout').innerHTML=`판정 대상: 「${s}」<br>사전에 있는 단어가 없습니다 — 분류기는 판단 불능. 표의 단어를 넣어 보세요.`;return;}
    let num=1,den=1;
    hits.forEach(k=>{num*=W[k];den*=(1-W[k]);});
    const p=num/(num+den);
    const bar=Math.round(p*100);
    const rows=hits.map(k=>`<tr><td>${k}</td><td class="mono">${W[k].toFixed(2)}</td><td>${W[k]>0.5?'스팸 쪽 ↑':'정상 쪽 ↓'}</td></tr>`).join('');
    $('#bout').innerHTML=`판정 대상: 「${s}」
      <table class="t" style="margin-top:6px"><tr><th>발견 단어</th><th>P(스팸|단어)</th><th>증거 방향</th></tr>${rows}</table>
      <span class="mono">P(스팸|문자) = Πp / (Πp + Π(1−p)) = ${num.toFixed(4)} / (${num.toFixed(4)} + ${den.toFixed(4)})</span>
      <div style="margin-top:10px;height:22px;border-radius:6px;background:#F3F4F6;overflow:hidden">
        <div style="height:100%;width:${bar}%;background:${p>0.8?'#BE123C':p>0.5?'#B45309':'#0E9384'}"></div></div>
      <div style="margin-top:6px;font-size:17px;font-weight:800;color:${p>0.8?'#BE123C':p>0.5?'#B45309':'#0E9384'}">
        스팸 확률 ${bar}% → ${p>0.8?'스팸함으로 이동':p>0.5?'주의 표시':'정상 수신함'}</div>`;
  }
  $('#bgo').onclick=calc;
  root.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{$('#bt').value=b.dataset.s;calc();});
  calc();
}
