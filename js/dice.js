function addDie(faces) {
  dice.push({ id: nextId++, faces });
  renderTray();
}

function addCustomDie() {
  const input = document.getElementById('customFaces');
  const faces = parseInt(input.value);
  if (!faces || faces < 2) { input.focus(); return; }
  addDie(faces);
}

function removeDie(id) {
  dice = dice.filter(d => d.id !== id);
  renderTray();
}

function clearDice() {
  dice = [];
  renderTray();
  document.getElementById('singleResults').classList.remove('visible');
  document.getElementById('multiResults').classList.remove('visible');
}

function renderTray() {
  const tray = document.getElementById('diceTray');
  if (dice.length === 0) {
    tray.innerHTML = '<span class="dice-empty">No dice yet — add some above.</span>';
    return;
  }
  tray.innerHTML = dice.map(d => `
    <div class="die-chip">
      <div class="die-face" id="die-${d.id}">
        <span class="die-label">D${d.faces}</span>
        ?
      </div>
      <div class="die-chip-label">D${d.faces}</div>
      <div class="die-chip-actions">
        <button class="btn btn-danger" onclick="removeDie(${d.id})">Remove</button>
      </div>
    </div>
  `).join('');
}
