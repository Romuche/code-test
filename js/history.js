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
