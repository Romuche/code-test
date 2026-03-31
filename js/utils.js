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
  if (Object.keys(freq).length === 0) return '';

  const W = 400, H = 60;
  const n = theoryMax - theoryMin + 1;
  const maxCount = Math.max(...Object.values(freq));
  const gap = n > 1 ? 1 : 0;
  const barW = (W - gap * (n - 1)) / n;

  const bars = Array.from({ length: n }, (_, i) => {
    const v = theoryMin + i;
    const count = freq[v] || 0;
    const barH = count > 0 ? Math.max(1, (count / maxCount) * H) : 0;
    const x = i * (barW + gap);
    const y = H - barH;
    const color = scoreColor(v, theoryMin, theoryMax);
    return barH > 0
      ? `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barW.toFixed(2)}" height="${barH.toFixed(2)}" fill="${color}" rx="1"/>`
      : '';
  }).join('');

  const midVal = Math.round((theoryMin + theoryMax) / 2);

  return `
    <div class="dist-chart-wrapper">
      <svg class="dist-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${bars}</svg>
      <div class="dist-labels">
        <span>${theoryMin}</span>
        <span>${midVal}</span>
        <span>${theoryMax}</span>
      </div>
    </div>
  `;
}
