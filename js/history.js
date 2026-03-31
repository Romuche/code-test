function addHistory(type, results, total, multiData) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (type === 'single') {
    const breakdown = results.map(r => `<strong>${r.value}</strong> (D${r.faces})`).join(' + ');
    history.unshift({ time, type: 'single', breakdown, total });
  } else {
    const summary = dice.map(d => `D${d.faces}`).join('+');
    history.unshift({ time, type: 'multi', summary, count: multiData.count, avg: multiData.avg });
  }

  if (history.length > 20) history.pop();
  renderHistory();
}

function clearHistory() {
  history = [];
  renderHistory();
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
        <div class="history-item">
          <span class="hist-time">${h.time}</span>
          <span class="hist-desc">${h.count}x [${h.summary}]</span>
          <span class="hist-total">avg ${h.avg.toFixed(1)}</span>
        </div>
      `;
    }
  }).join('');
}
