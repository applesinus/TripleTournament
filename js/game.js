function startTournament() {
    showAutosavePrompt((shouldDownload) => {
        if (shouldDownload) {
            let originalPhase = appState.phase;
            appState.phase = 'setup';
            exportState('autosave_tournament.json');
            appState.phase = originalPhase;
        }

        let activeParts = appState.participants.filter(p => p.active);
        let shuffledParts = shuffleArray(activeParts);

        appState.phase = 'game';
        appState.tree = buildTournamentTree(shuffledParts);

        prepareNextMatch();
    });
}

function findNextPlayableMatchPath(node, path = []) {
    if (!node || node.type === 'leaf' || node.winner || node.resolved) return null;
    
    for (let i = 0; i < node.children.length; i++) {
        let next = findNextPlayableMatchPath(node.children[i], [...path, i]);
        if (next) return next;
    }

    if (node.children.every(c => c.type === 'leaf' || c.resolved || c.winner)) {
        return path;
    }
    
    return null;
}

function prepareNextMatch() {
    appState.currentMatchPath = findNextPlayableMatchPath(appState.tree);
    
    if (!appState.currentMatchPath) {
        endTournament();
        return;
    }

    appState.turnOrder = Math.random() > 0.5 ? [1, 2] : [2, 1];
    appState.currentTurnIndex = 0;
    appState.p1Pick = null;
    appState.p2Pick = null;
    appState.isIntermediateResult = false;

    saveState();
    processTurn();
}

function processTurn() {
    if (appState.currentTurnIndex >= 2) {
        resolveMatch();
        return;
    }

    let currentPlayer = appState.turnOrder[appState.currentTurnIndex];
    let name = currentPlayer === 1 ? appState.player1 : appState.player2;
    
    showFog(`${name}`, () => renderMatch(currentPlayer));
}

function renderMatch(playerNum) {
    switchScreen('gamePhase');
    const gameTitle = document.getElementById('gameTournamentTitle');
    if (gameTitle) gameTitle.innerText = appState.tournamentName || t('default_tour_name');
    els.currentPlayerName.innerText = playerNum === 1 ? appState.player1 : appState.player2;
    els.cardsContainer.innerHTML = '';

    let currentMatch = getNodeByPath(appState.currentMatchPath);
    let children = currentMatch.children;
    
    let displayOrder = shuffleArray([0, 1, 2]);
    
    displayOrder.forEach((childIndex) => {
        let child = children[childIndex];
        let cardData = child.winner ? child.winner : child.data;
        
        let cardText = '';
        if(appState.mode === 'open') {
            cardText = cardData.name;
        } else {
            cardText = playerNum === 1 ? cardData.p2Desc : cardData.p1Desc;
        }

        let cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.innerHTML = `<h3>${cardText}</h3>`;
        cardEl.onclick = () => selectCard(childIndex, playerNum);
        els.cardsContainer.appendChild(cardEl);
    });
}

function selectCard(originalIndex, playerNum) {
    if(playerNum === 1) appState.p1Pick = originalIndex;
    else appState.p2Pick = originalIndex;

    appState.currentTurnIndex++;
    saveState();
    processTurn();
}

function resolveMatch() {
    let p1 = appState.p1Pick;
    let p2 = appState.p2Pick;
    let winnerIndex;

    if (p1 === p2) {
        winnerIndex = p1; 
        document.getElementById('interResultTitle').innerText = t('opinion_match_title');
        document.getElementById('interWinnerText').innerText = t('opinion_match_text');
    } else {
        let allIndices = [0, 1, 2];
        winnerIndex = allIndices.find(i => i !== p1 && i !== p2); 
        document.getElementById('interResultTitle').innerText = t('opinion_diff_title');
        document.getElementById('interWinnerText').innerText = t('opinion_diff_text');
    }

    let currentMatch = getNodeByPath(appState.currentMatchPath);

    currentMatch.p1Vote = p1;
    currentMatch.p2Vote = p2;
    currentMatch.winnerIndex = winnerIndex;

    let winningChild = currentMatch.children[winnerIndex];
    currentMatch.winner = winningChild.winner ? winningChild.winner : winningChild.data;
    currentMatch.resolved = true;
    
    appState.isIntermediateResult = true;
    saveState();

    els.gamePhase.classList.add('hidden');
    document.getElementById('intermediateResult').classList.remove('hidden');
}

function nextMatchClick() {
    appState.isIntermediateResult = false;
    saveState();
    document.getElementById('intermediateResult').classList.add('hidden');
    prepareNextMatch();
}