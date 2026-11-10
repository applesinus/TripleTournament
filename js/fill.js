function renderFillPhase(playerNum) {
    switchScreen('fillPhase');
    els.fillTitle.innerText = `${t('fill_cards_title')}: ${playerNum === 1 ? appState.player1 : appState.player2}`;
    els.fillForm.innerHTML = '';
    
    let activeParts = appState.participants.filter(p => p.active);
    activeParts.forEach((p, index) => {
        let div = document.createElement('div');
        let val = playerNum === 1 ? p.p1Desc : p.p2Desc;
        div.innerHTML = `
            <label><strong>#${index+1} ${p.name}</strong> - ${t('your_desc')}</label>
            <textarea onchange="updateDesc(${p.id}, ${playerNum}, this.value)">${val}</textarea>
        `;
        els.fillForm.appendChild(div);
    });
}

function updateDesc(id, playerNum, val) {
    let p = appState.participants.find(x => x.id === id);
    if(playerNum === 1) p.p1Desc = val;
    else p.p2Desc = val;
    saveState();
}

function finishFillPhase() {
    if(appState.phase === 'fill_p1') {
        appState.phase = 'fill_p2';
        saveState();
        showFog(`${t('waiting_for')} ${appState.player2}`, () => renderFillPhase(2));
    } else {
        startTournament();
    }
}