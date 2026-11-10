function renderFinalBracketNode(node, isWinnerCard = false, isAbsoluteWinner = false, votesStr = []) {
    function createCardWithBadge(name, isWinner, isAbsolute, votes) {
        let col = document.createElement('div');
        col.style.display = 'flex';
        col.style.flexDirection = 'column';
        col.style.alignItems = 'center';

        let card = document.createElement('div');
        card.className = 'bracket-node'; 
        card.innerText = name;
        
        if (isWinner) {
            card.style.border = '2px solid #4CAF50';
            card.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        }
        if (isAbsolute) {
            card.style.border = '3px solid #4CAF50';
            card.style.color = '#fff';
            card.style.fontWeight = 'bold';
        }
        col.appendChild(card);

        if (votes && votes.length > 0) {
            let badge = document.createElement('div');
            badge.className = 'vote-badge';
            badge.innerText = votes.join(' + ');
            col.appendChild(badge);
        }
        return col;
    }

    if (node.type === 'leaf') {
        let leafName = (node.data && node.data.name) ? node.data.name : t('empty');
        return createCardWithBadge(leafName, isWinnerCard, isAbsoluteWinner, votesStr);
    }

    let wrapper = document.createElement('div');
    wrapper.className = 'bracket-match';

    let childrenCol = document.createElement('div');
    childrenCol.className = 'bracket-children';

    node.children.forEach((child, idx) => {
        let childWrapper = document.createElement('div');
        childWrapper.className = 'final-child-wrapper';
        
        let isChildWinner = (node.winnerIndex === idx);
        
        let childVotesStr = [];
        if (node.p1Vote === idx) childVotesStr.push(appState.player1);
        if (node.p2Vote === idx) childVotesStr.push(appState.player2);
        
        let childEl = renderFinalBracketNode(child, isChildWinner, false, childVotesStr);
        childWrapper.appendChild(childEl);

        childrenCol.appendChild(childWrapper);
    });

    let connector = document.createElement('div');
    connector.className = 'bracket-connector';

    let winnerName = (node.winner && node.winner.name) ? node.winner.name : "?";
    let winnerCol = createCardWithBadge(winnerName, isWinnerCard, isAbsoluteWinner, votesStr);

    wrapper.appendChild(childrenCol);
    wrapper.appendChild(connector);
    wrapper.appendChild(winnerCol);

    return wrapper;
}

function endTournament() {
    appState.phase = 'result';
    saveState();
    switchScreen('resultPhase');
    
    els.finalBracketContainer.innerHTML = '';
    els.finalBracketContainer.appendChild(renderFinalBracketNode(appState.tree, false, true, []));

    if (appState.mode === 'closed') {
        els.closedModeDescriptions.classList.remove('hidden');
        els.revealContainer.innerHTML = '';

        let activeParts = appState.participants.filter(p => p.active);
        activeParts.forEach(p => {
            let revealCard = document.createElement('div');
            revealCard.className = 'revealed-card';
            revealCard.innerHTML = `
                <h4>${p.name}</h4>
                <p>
                    <strong style="color: #e86701;">${appState.player1}:</strong><br>
                    <i>${p.p1Desc || t('desc_missing')}</i>
                </p>
                <p>
                    <strong style="color: #2196F3;">${appState.player2}:</strong><br>
                    <i>${p.p2Desc || t('desc_missing')}</i>
                </p>
            `;
            els.revealContainer.appendChild(revealCard);
        });
    } else {
        els.closedModeDescriptions.classList.add('hidden');
    }
}