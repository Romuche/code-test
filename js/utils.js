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

  const mid = entries[Math.floor(n / 2)];

  return `
    <div class="dist-chart-wrapper">
      <svg class="dist-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${bars}</svg>
      <div class="dist-labels">
        <span>${entries[0].v}</span>
        <span>${mid.v}</span>
        <span>${entries[n - 1].v}</span>
      </div>
    </div>
  `;
}
