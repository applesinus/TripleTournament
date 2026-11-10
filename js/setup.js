function updateListLength() {
    let count = parseInt(els.contenderCount.value) || 0;
    
    let minNeeded = Math.max(count, 3);
    while (appState.participants.length < minNeeded) {
        let i = appState.participants.length;
        appState.participants.push({ id: i+1, name: `${t('contender_prefix')} ${i+1}`, p1Desc: '', p2Desc: '', active: false });
    }
    
    if (count < 3 || count % 2 === 0) {
        els.errorBox.classList.remove('hidden');
        els.btnConfirm.disabled = true;
        els.bracketVisualizer.innerHTML = `<p style="color: #ff5252">${t('error_grid')}</p>`;
    } else {
        els.errorBox.classList.add('hidden');
        els.btnConfirm.disabled = false;
    }

    for (let i = 0; i < appState.participants.length; i++) {
        appState.participants[i].active = (i < count);
    }

    els.partList.innerHTML = '';
    for(let i=0; i<Math.max(count, 3); i++) {
        let p = appState.participants[i];
        let div = document.createElement('div');
        div.className = `participant-item ${p.active ? '' : 'inactive'}`;
        div.innerHTML = `
            <span>#${i+1}</span>
            <input type="text" value="${p.name}" oninput="appState.participants[${i}].name = this.value; renderVisualTree(); saveState();" ${p.active ? '' : 'disabled'}>
        `;
        els.partList.appendChild(div);
    }

    if (count >= 3 && count % 2 !== 0) {
        renderVisualTree();
    }

    saveState();
}

function addContender() {
    let countInput = document.getElementById('contenderCount');
    let currentCount = parseInt(countInput.value) || 3;
    countInput.value = currentCount + 1;
    updateListLength();
}

function subContender() {
    let countInput = document.getElementById('contenderCount');
    let currentCount = parseInt(countInput.value) || 3;
    countInput.value = currentCount - 1;
    updateListLength();
}

function renderVisualTree() {
    let activeParts = appState.participants.filter(p => p.active);
    let previewTree = buildTournamentTree(activeParts);
    els.bracketVisualizer.innerHTML = '';
    els.bracketVisualizer.appendChild(renderBracketNode(previewTree));
}

function renderBracketNode(node) {
    if (node.type === 'leaf') {
        let div = document.createElement('div');
        div.className = 'bracket-node';
        div.innerText = node.data ? node.data.name : t('empty');
        return div;
    }

    let wrapper = document.createElement('div');
    wrapper.className = 'bracket-match';

    let childrenCol = document.createElement('div');
    childrenCol.className = 'bracket-children';

    for (let child of node.children) {
        let childEl = renderBracketNode(child);
        childrenCol.appendChild(childEl);
    }

    let connector = document.createElement('div');
    connector.className = 'bracket-connector';

    let winnerBox = document.createElement('div');
    winnerBox.className = 'bracket-winner-box';
    winnerBox.innerText = node.winner ? node.winner.name : "?";

    wrapper.appendChild(childrenCol);
    wrapper.appendChild(connector);
    wrapper.appendChild(winnerBox);

    return wrapper;
}

function confirmSetup() {
    const tourNameInput = document.getElementById('tourNameInput');
    appState.tournamentName = (tourNameInput && tourNameInput.value.trim()) || t('default_tour_name');
    appState.player1 = (document.getElementById('p1NameInput').value || '').trim() || t('default_p1');
    appState.player2 = (document.getElementById('p2NameInput').value || '').trim() || t('default_p2');
    
    let activeParts = appState.participants.filter(p => p.active);
    activeParts.forEach((p, idx) => {
        if (!p.name || !p.name.trim()) {
            p.name = `${t('contender_prefix')} ${p.id || (idx + 1)}`;
        }
    });
    
    if(appState.mode === 'closed') {
        appState.phase = 'fill_p1';
        saveState();
        showFog(`${t('waiting_for')} ${appState.player1}`, () => renderFillPhase(1));
    } else {
        activeParts.forEach(p => {
            p.p1Desc = p.name;
            p.p2Desc = p.name;
        });
        saveState();
        startTournament();
    }
}