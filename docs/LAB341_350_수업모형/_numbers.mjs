// LAB 341 · 344 · 345 의 그림에 적을 수를 «데모와 똑같은 셈» 으로 뽑는다.
// 이 셋은 난수 씨앗이 JS 의 32 비트 자르기에 기대고 있어 파이썬에서 그대로 되풀이할 수 없다.
// 그래서 여기서 뽑아 적고, figs.py 는 그 수를 assert 로 묶어 둔다.
// 사용: node docs/LAB341_350_수업모형/_numbers.mjs

const out = {};

/* ── 341 과적합 — 차수별 훈련·검증 오차 ───────────────────────── */
{
  const rnd = (s => () => ((s = s * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff))(20260825);
  const f = x => 0.6 * Math.sin(1.6 * x) + 0.15 * x;
  const TR = [], VA = [];
  for (let i = 0; i < 10; i++) { const x = -2.4 + 4.8 * i / 9; TR.push([x, f(x) + (rnd() - 0.5) * 0.5]); }
  for (let i = 0; i < 9; i++) { const x = -2.4 + 4.8 * (i + 0.5) / 9; VA.push([x, f(x) + (rnd() - 0.5) * 0.5]); }
  function fit(deg) {
    const n = deg + 1, A = [], b = [];
    for (let r = 0; r < n; r++) {
      A.push(new Array(n).fill(0)); b.push(0);
      TR.forEach(([x, y]) => { for (let c = 0; c < n; c++) A[r][c] += Math.pow(x, r + c); b[r] += Math.pow(x, r) * y; });
    }
    for (let i = 0; i < n; i++) A[i][i] += 1e-9;
    for (let i = 0; i < n; i++) {
      let p = i;
      for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
      [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]];
      for (let r = i + 1; r < n; r++) {
        const m = A[r][i] / A[i][i];
        for (let c = i; c < n; c++) A[r][c] -= m * A[i][c];
        b[r] -= m * b[i];
      }
    }
    const w = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * w[c]; w[i] = s / A[i][i]; }
    return w;
  }
  const evl = (w, x) => w.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
  const rmse = (w, S) => Math.sqrt(S.reduce((s, [x, y]) => s + Math.pow(evl(w, x) - y, 2), 0) / S.length);
  out.ho = [];
  for (let d = 1; d <= 9; d++) { const w = fit(d); out.ho.push([d, +rmse(w, TR).toFixed(4), +rmse(w, VA).toFixed(4)]); }
}

/* ── 344 K-평균 — 단계마다 움직인 거리와 거리 제곱합 ──────────── */
{
  const rnd = (s => () => ((s = s * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff))(4242);
  const PTS = [];
  [[-1.4, 0.9], [1.5, 1.1], [0.2, -1.3]].forEach(([mx, my]) => {
    for (let i = 0; i < 14; i++) PTS.push([mx + (rnd() - 0.5) * 1.1, my + (rnd() - 0.5) * 1.1]);
  });
  for (const k of [2, 3]) {
    let C = [[-2.2, -1.8], [-1.9, -1.5], [-2.0, -1.2]].slice(0, k).map(p => p.slice());
    const near = p => { let b = 0, bd = 1e9; C.forEach((c, i) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2; if (d < bd) { bd = d; b = i; } }); return b; };
    const sse = () => { const a = PTS.map(near); return PTS.reduce((s, p, j) => s + ((p[0] - C[a[j]][0]) ** 2 + (p[1] - C[a[j]][1]) ** 2), 0); };
    const rows = [[0, 0, +sse().toFixed(3)]];
    for (let it = 1; it <= 8; it++) {
      const asg = PTS.map(near); let mv = 0;
      C.forEach((c, i) => {
        const g = PTS.filter((_, j) => asg[j] === i);
        if (!g.length) return;
        const nx = g.reduce((s, p) => s + p[0], 0) / g.length, ny = g.reduce((s, p) => s + p[1], 0) / g.length;
        mv += Math.hypot(nx - c[0], ny - c[1]); C[i] = [nx, ny];
      });
      rows.push([it, +mv.toFixed(4), +sse().toFixed(3)]);
    }
    out['km' + k] = rows;
  }
}

/* ── 345 ROC — 기준값별 잡아냄·헛경보, 떨어진 정도별 AUC ──────── */
{
  const rnd = (s => () => ((s = s * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff))(777);
  const U = []; for (let i = 0; i < 200; i++) U.push([rnd(), rnd()]);
  const scores = sep => [
    U.slice(0, 100).map(([a, b]) => Math.min(1, Math.max(0, 0.5 + 0.16 * (a + b - 1) * 3 - sep * 0.18))),
    U.slice(100).map(([a, b]) => Math.min(1, Math.max(0, 0.5 + 0.16 * (a + b - 1) * 3 + sep * 0.18))),
  ];
  const rate = (arr, t) => arr.filter(v => v >= t).length / arr.length;
  const auc = (neg, pos) => { let c = 0; pos.forEach(p => neg.forEach(n => { c += p > n ? 1 : (p === n ? 0.5 : 0); })); return c / (neg.length * pos.length); };
  const [n1, p1] = scores(1);
  out.roc = [0.2, 0.4, 0.5, 0.6, 0.8].map(t => [t, +(rate(p1, t) * 100).toFixed(1), +(rate(n1, t) * 100).toFixed(1)]);
  out.auc = [0, 0.25, 1, 2].map(s => { const [n, p] = scores(s); return [s, +auc(n, p).toFixed(3)]; });
}

console.log(JSON.stringify(out, null, 1));
