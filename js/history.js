function addHistory(type, results, total, multiData) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (type === 'single') {
    const breakdown = results.map(r => `<strong>${r.value}</strong> (D${r.faces})`).join(' + ');
    history.unshift({ time, type: 'single', breakdown, total });
  } else {
    const summary = dice.map(d => `D${d.faces}`).join('+');
    history.unshift({ time, type: 'multi', summary, ...multiData });
  }

  if (history.length > 20) history.pop();
  renderHistory();
}

function clearHistory() {
  history = [];
  renderHistory();
}

function renderDistributionChart(freq, theoryMin, theoryMax) {
  const entries = Object.entries(freq)
    .map(([v, c]) => ({ v: parseInt(v), c }))
    .sort((a, b) => a.v - b.v);

  if (entries.length === 0) return '';

  const W = 400, H = 60;
  const maxCount = Math.max(...entries.map(e => e.c));
  const n = entries.length;
  const gap = n > 1 ? 1 : 0;
  const barW = (W - gap * (n - 1)) / n;

  const bars = entries.map((e, i) => {
    const barH = Math.max(1, (e.c / maxCount) * H);
    const x = i * (barW + gap);
    const y = H - barH;
    const color = scoreColor(e.v, theoryMin, theoryMax);
    return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barW.toFixed(2)}" height="${barH.toFixed(2)}" fill="${color}" rx="1"/>`;
  }).join('');

  // X-axis labels: show min, mid, max
  const mid = entries[Math.floor(n / 2)];
  const labelY = H + 12;
  const labels = [
    `<text x="0" y="${labelY}" text-anchor="start">${entries[0].v}</text>`,
    `<text x="${W / 2}" y="${labelY}" text-anchor="middle">${mid.v}</text>`,
    `<text x="${W}" y="${labelY}" text-anchor="end">${entries[n - 1].v}</text>`,
  ].join('');

  return `
    <svg class="dist-chart" viewBox="0 0 ${W} ${H + 16}" preserveAspectRatio="none">
      ${bars}
      ${labels}
    </svg>
  `;
}

function renderStatsRows({ min, max, avg, median, std, modeVal, modeCount, theoryMin, theoryMax }) {
  return `
    <table class="stats-table">
      <thead><tr><th>Stat</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td>Min rolled</td><td class="highlight">${min}</td></tr>
        <tr><td>Max rolled</td><td class="highlight">${max}</td></tr>
        <tr><td>Average</td><td class="highlight">${avg.toFixed(2)}</td></tr>
        <tr><td>Median</td><td class="highlight">${median}</td></tr>
        <tr><td>Std deviation</td><td class="highlight">${std.toFixed(2)}</td></tr>
        <tr><td>Most common total</td><td class="highlight">${modeVal} <span style="color:var(--muted);font-weight:400">(${modeCount}x)</span></td></tr>
        <tr><td>Theoretical min</td><td style="color:var(--muted)">${theoryMin}</td></tr>
        <tr><td>Theoretical max</td><td style="color:var(--muted)">${theoryMax}</td></tr>
      </tbody>
    </table>
  `;
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (history.length === 0) {
    list.innerHTML = '<span class="history-empty">No rolls yet.</span>';
    return;
  }

  list.innerHTML = history.map(h => {
    if (h.type === 'single') {
      return `
        <div class="history-item">
          <span class="hist-time">${h.time}</span>
          <span class="hist-desc">${h.breakdown}</span>
          <span class="hist-total">${h.total}</span>
        </div>
      `;
    } else {
      return `
        <details class="history-item history-item--multi">
          <summary class="hist-summary">
            <span class="hist-time">${h.time}</span>
            <span class="hist-desc">${h.count}x [${h.summary}]</span>
            <span class="hist-total">avg ${h.avg.toFixed(1)}</span>
            <span class="hist-chevron">▸</span>
          </summary>
          <div class="hist-detail">
            ${renderDistributionChart(h.freq, h.theoryMin, h.theoryMax)}
            ${renderStatsRows(h)}
          </div>
        </details>
      `;
    }
  }).join('');
}
