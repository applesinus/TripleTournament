let fogCallback = null;
let autosaveCallback = null;

function showAutosavePrompt(callback) {
    autosaveCallback = callback;
    const promptEl = document.getElementById('autosavePrompt');
    if (promptEl) {
        promptEl.classList.remove('hidden');
    }
}

function handleAutosaveChoice(shouldDownload) {
    const promptEl = document.getElementById('autosavePrompt');
    if (promptEl) {
        promptEl.classList.add('hidden');
    }
    if (autosaveCallback) {
        let cb = autosaveCallback;
        autosaveCallback = null;
        cb(shouldDownload);
    }
}

function showFog(msg, callback) {
    els.fogMessage.innerText = msg;
    els.fogScreen.classList.remove('hidden');
    fogCallback = callback;
}

function hideFog() {
    els.fogScreen.classList.add('hidden');
    if(fogCallback) {
        let cb = fogCallback;
        fogCallback = null;
        cb();
    }
}

function switchScreen(screenId) {
    els.setupPhase.classList.add('hidden');
    els.fillPhase.classList.add('hidden');
    els.gamePhase.classList.add('hidden');
    els.resultPhase.classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

function resetApp() {
    if(confirm(t('confirm_reset'))) {
        localStorage.removeItem('TripleTournament_state');
        location.reload();
    }
}

function applyLoadedState() {
    if (!appState.tournamentName) {
        appState.tournamentName = t('default_tour_name');
    }

    if(appState.phase === 'setup') {
        switchScreen('setupPhase');
        const tourNameInput = document.getElementById('tourNameInput');
        if (tourNameInput) tourNameInput.value = appState.tournamentName;
        document.getElementById('tourMode').value = appState.mode;
        document.getElementById('p1NameInput').value = appState.player1;
        document.getElementById('p2NameInput').value = appState.player2;
        els.contenderCount.value = appState.participants.filter(p=>p.active).length;
        updateListLength();
    } else if (appState.phase.startsWith('fill')) {
        let pNum = appState.phase === 'fill_p1' ? 1 : 2;
        renderFillPhase(pNum);
    } else if (appState.phase === 'game') {
        switchScreen('gamePhase');
        const gameTitle = document.getElementById('gameTournamentTitle');
        if (gameTitle) gameTitle.innerText = appState.tournamentName;
        if (appState.isIntermediateResult) {
            let currentMatch = getNodeByPath(appState.currentMatchPath);
            if (currentMatch.p1Vote === currentMatch.p2Vote) {
                document.getElementById('interResultTitle').innerText = t('opinion_match_title');
                document.getElementById('interWinnerText').innerText = t('opinion_match_text');
            } else {
                document.getElementById('interResultTitle').innerText = t('opinion_diff_title');
                document.getElementById('interWinnerText').innerText = t('opinion_diff_text');
            }
            document.getElementById('intermediateResult').classList.remove('hidden');
        } else {
            document.getElementById('intermediateResult').classList.add('hidden');
            processTurn(); 
        }
    } else if (appState.phase === 'result') {
        document.getElementById('intermediateResult').classList.add('hidden');
        endTournament();
    }
}