let appState = {
    phase: 'setup',
    mode: 'open', 
    tournamentName: "",
    player1: "", 
    player2: "",
    participants: [],
    tree: null, 
    currentMatchPath: null,
    turnOrder: [], 
    currentTurnIndex: 0,
    p1Pick: null,
    p2Pick: null,
    isIntermediateResult: false
};

const els = {
    setupPhase: document.getElementById('setupPhase'),
    fillPhase: document.getElementById('fillPhase'),
    gamePhase: document.getElementById('gamePhase'),
    resultPhase: document.getElementById('resultPhase'),
    contenderCount: document.getElementById('contenderCount'),
    partList: document.getElementById('participantsList'),
    errorBox: document.getElementById('errorBox'),
    btnConfirm: document.getElementById('btnConfirmSetup'),
    bracketVisualizer: document.getElementById('bracketVisualizer'),
    finalBracketContainer: document.getElementById('finalBracketContainer'),
    closedModeDescriptions: document.getElementById('closedModeDescriptions'),
    revealContainer: document.getElementById('revealContainer'),
    fogScreen: document.getElementById('fogScreen'),
    fogMessage: document.getElementById('fogMessage'),
    cardsContainer: document.getElementById('cardsContainer'),
    currentPlayerName: document.getElementById('currentPlayerName'),
    fillForm: document.getElementById('fillForm'),
    fillTitle: document.getElementById('fillTitle')
};

function saveState() {
    localStorage.setItem('TripleTournament_state', JSON.stringify(appState));
}

function loadState() {
    const saved = localStorage.getItem('TripleTournament_state');
    if (saved) {
        try {
            appState = JSON.parse(saved);
            if (!appState.tournamentName) {
                appState.tournamentName = t('default_tour_name');
            }
            applyLoadedState();
            return true;
        } catch (e) {
            console.error("Local storage load error", e);
        }
    }
    return false;
}

function exportState(filename = 'tournament_save.json') {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importState(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const loadedState = JSON.parse(e.target.result);
            appState = loadedState;
            if (!appState.tournamentName) {
                appState.tournamentName = t('default_tour_name');
            }
            saveState();
            applyLoadedState();
        } catch (err) {
            alert("Ошибка загрузки файла сохранения!");
        }
    };
    reader.readAsText(file);
}