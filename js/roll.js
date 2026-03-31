function rollDie(faces) {
  return Math.floor(Math.random() * faces) + 1;
}

function rollOnce() {
  if (dice.length === 0) return;

  const rollBtn = document.getElementById('rollBtn');
  rollBtn.disabled = true;

  const results = dice.map(d => ({ ...d, value: rollDie(d.faces) }));

  dice.forEach(d => {
    const el = document.getElementById(`die-${d.id}`);
    if (el) {
      el.classList.remove('rolled');
      el.classList.add('rolling');
    }
  });

  setTimeout(() => {
    results.forEach(r => {
      const el = document.getElementById(`die-${r.id}`);
      if (el) {
        el.classList.remove('rolling');
        el.classList.add('rolled');
        el.innerHTML = `<span class="die-label">D${r.faces}</span>${r.value}`;
      }
    });

    const total = results.reduce((s, r) => s + r.value, 0);
    showSingleResults(results, total);
    addHistory('single', results, total);
    rollBtn.disabled = false;
  }, 500);
}

function scoreColor(total, theoryMin, theoryMax) {
  if (theoryMax === theoryMin) return '#60a5fa';
  const t = (total - theoryMin) / (theoryMax - theoryMin);
  if (t <= 0.5) {
    const r = Math.round(248 + (96 - 248) * (t * 2));
    const g = Math.round(113 + (165 - 113) * (t * 2));
    const b = Math.round(113 + (250 - 113) * (t * 2));
    return `rgb(${r},${g},${b})`;
  } else {
    const u = (t - 0.5) * 2;
    const r = Math.round(96 + (74 - 96) * u);
    const g = Math.round(165 + (222 - 165) * u);
    const b = Math.round(250 + (128 - 250) * u);
    return `rgb(${r},${g},${b})`;
  }
}

function showSingleResults(results, total) {
  const section = document.getElementById('singleResults');
  section.classList.add('visible');

  const theoryMin = results.length;
  const theoryMax = results.reduce((s, r) => s + r.faces, 0);
  const totalEl = document.getElementById('singleTotal');
  totalEl.textContent = total;
  totalEl.style.color = scoreColor(total, theoryMin, theoryMax);

  document.getElementById('singleMeta').textContent =
    `Total of ${results.length} ${results.length === 1 ? 'die' : 'dice'}`;

  document.getElementById('singleBreakdown').innerHTML = results.map(r => {
    let cls = '';
    if (r.value === r.faces) cls = 'max';
    if (r.value === 1) cls = 'min';
    return `
      <div class="result-row">
        <span class="die-type">D${r.faces}</span>
        <span class="die-val ${cls}">${r.value}</span>
      </div>
    `;
  }).join('');
}

function rollMulti() {
  if (dice.length === 0) return;
  const count = parseInt(document.getElementById('multiCount').value);
  if (!count || count < 1) return;

  const totals = [];
  for (let i = 0; i < count; i++) {
    let sum = 0;
    dice.forEach(d => { sum += rollDie(d.faces); });
    totals.push(sum);
  }

  const min = Math.min(...totals);
  const max = Math.max(...totals);
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  const sorted = [...totals].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  const variance = totals.reduce((s, v) => s + (v - avg) ** 2, 0) / totals.length;
  const std = Math.sqrt(variance);

  const freq = {};
  totals.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const modeVal = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  const modeCount = freq[modeVal];

  const theoryMin = dice.length;
  const theoryMax = dice.reduce((s, d) => s + d.faces, 0);

  showMultiResults({ count, min, max, avg, median, std, modeVal, modeCount, theoryMin, theoryMax });
  addHistory('multi', null, null, { count, min, max, avg });
}

function showMultiResults({ count, min, max, avg, median, std, modeVal, modeCount, theoryMin, theoryMax }) {
  const section = document.getElementById('multiResults');
  section.classList.add('visible');

  document.getElementById('multiMeta').textContent =
    `${count.toLocaleString()} simulated rolls with ${dice.length} ${dice.length === 1 ? 'die' : 'dice'}`;

  document.getElementById('statsBody').innerHTML = `
    <tr><td>Min rolled</td><td class="highlight">${min}</td></tr>
    <tr><td>Max rolled</td><td class="highlight">${max}</td></tr>
    <tr><td>Average</td><td class="highlight">${avg.toFixed(2)}</td></tr>
    <tr><td>Median</td><td class="highlight">${median}</td></tr>
    <tr><td>Std deviation</td><td class="highlight">${std.toFixed(2)}</td></tr>
    <tr><td>Most common total</td><td class="highlight">${modeVal} <span style="color:var(--muted);font-weight:400">(${modeCount}x)</span></td></tr>
    <tr><td>Theoretical min</td><td style="color:var(--muted)">${theoryMin}</td></tr>
    <tr><td>Theoretical max</td><td style="color:var(--muted)">${theoryMax}</td></tr>
  `;
}
