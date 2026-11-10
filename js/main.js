updateDOMTranslations();

if (!loadState()) {
    appState.tournamentName = t('default_tour_name');
    appState.player1 = t('default_p1');
    appState.player2 = t('default_p2');
    const tourNameInput = document.getElementById('tourNameInput');
    if (tourNameInput) tourNameInput.value = appState.tournamentName;
    document.getElementById('p1NameInput').value = appState.player1;
    document.getElementById('p2NameInput').value = appState.player2;
    updateListLength();
}

const currentYear = new Date().getFullYear();
document.getElementById('current-year').textContent = currentYear;