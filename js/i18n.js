const translations = {
    ru: {
        title: "Тройной Турнир",
        export: "Скачать турнир",
        import: "Загрузить турнир",
        reset: "Сброс",
        ready_btn: "Я готов",
        continue_btn: "Продолжить турнир",
        setup_title: "Настройка турнира",
        tour_name_label: "Название:",
        tour_name_placeholder: "Турнир",
        default_tour_name: "Турнир",
        cards_count: "Количество карточек:",
        tour_mode: "Режим турнира:",
        mode_open: "Открытый (имена видны)",
        mode_closed: "Закрытый (описания)",
        p1_placeholder: "Имя Игрока 1:",
        p2_placeholder: "Имя Игрока 2:",
        error_odd: "Количество карточек должно быть нечетным (3, 5, 7, 9...)!",
        grid_preview: "Турнирная сетка",
        grid_preview_hint: "(Предпросмотр, порядок будет рандомизирован)",
        contenders: "Претенденты:",
        confirm_grid: "Подтвердить турнирную сетку",
        add_contender: "Добавить претендента",
        sub_contender: "Удалить претендента",
        fill_cards_title: "Заполнение карточек",
        save_desc_btn: "Сохранить описания (Начать турнир)",
        turn_of: "Ход делает:",
        tournament_over: "🎉 Турнир завершен! 🎉",
        final_tree: "Итоговое дерево решений:",
        revealed_cards: "Рассекреченные карточки претендентов:",
        
        default_p1: "Игрок 1",
        default_p2: "Игрок 2",
        contender_prefix: "Претендент",
        error_grid: "Невозможно построить сетку для заданного числа.",
        empty: "Пусто",
        waiting_for: "Ожидание",
        your_desc: "ваше описание:",
        opinion_match_title: "Мнение совпало!",
        opinion_match_text: "Выбран совпавший вариант",
        opinion_diff_title: "Мнение не совпало!",
        opinion_diff_text: "Выбран третий вариант",
        error: "Ошибка",
        desc_missing: "(описание отсутствует)",
        confirm_reset: "Вы уверены, что хотите сбросить весь прогресс?",
        error_load: "Ошибка загрузки файла сохранения!",
        autosave_prompt_title: "Скачать настройки турнира?",
        yes: "Да",
        no: "Нет"
    },
    en: {
        title: "Triple Tournament",
        export: "Download game",
        import: "Upload game",
        reset: "Reset",
        ready_btn: "I'm ready",
        continue_btn: "Continue tournament",
        setup_title: "Tournament Setup",
        tour_name_label: "Tournament:",
        tour_name_placeholder: "Tournament",
        default_tour_name: "Tournament",
        cards_count: "Number of cards:",
        tour_mode: "Tournament mode:",
        mode_open: "Open (names visible)",
        mode_closed: "Closed (descriptions)",
        p1_placeholder: "Player 1 Name:",
        p2_placeholder: "Player 2 Name:",
        error_odd: "Number of cards must be odd (3, 5, 7, 9...)!",
        grid_preview: "Bracket",
        grid_preview_hint: "(Preview, actual grid will be randomized)",
        contenders: "Contenders:",
        confirm_grid: "Confirm bracket",
        add_contender: "Add Contender",
        sub_contender: "Remove Contender",
        fill_cards_title: "Fill cards",
        save_desc_btn: "Save descriptions (Start Tournament)",
        turn_of: "Turn of:",
        tournament_over: "🎉 Tournament Over! 🎉",
        final_tree: "Final decision tree:",
        revealed_cards: "Revealed contender cards:",
        
        default_p1: "Player 1",
        default_p2: "Player 2",
        contender_prefix: "Contender",
        error_grid: "Impossible to build a bracket for the given number.",
        empty: "Empty",
        waiting_for: "Waiting for",
        your_desc: "your description:",
        opinion_match_title: "Opinion matched!",
        opinion_match_text: "Matched option selected",
        opinion_diff_title: "Opinion differed!",
        opinion_diff_text: "Third option selected",
        error: "Error",
        desc_missing: "(no description)",
        confirm_reset: "Are you sure you want to reset all progress?",
        error_load: "Error loading save file!",
        autosave_prompt_title: "Download tournament settings?",
        yes: "Yes",
        no: "No"
    }
};

let currentLang = localStorage.getItem('TripleTournament_lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en');

function t(key) {
    return translations[currentLang][key] || key;
}

function updateDOMTranslations() {
    document.title = t('title');
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    const langSelect = document.getElementById('langSwitch');
    if (langSelect) langSelect.value = currentLang;
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('TripleTournament_lang', currentLang);
    
    if (typeof appState !== 'undefined') {
        if (appState.participants) {
            appState.participants.forEach((p, i) => {
                let num = i + 1;
                let isDefaultName = false;
                for (let langKey in translations) {
                    let prefix = translations[langKey].contender_prefix;
                    if (p.name === `${prefix} ${num}`) {
                        isDefaultName = true;
                        break;
                    }
                }
                if (isDefaultName) {
                    p.name = `${translations[currentLang].contender_prefix} ${num}`;
                }
            });
        }

        const tourNameInput = document.getElementById('tourNameInput');
        let isTourNameDefault = !appState.tournamentName;
        for (let langKey in translations) {
            let def = translations[langKey].default_tour_name;
            if (appState.tournamentName === def || (tourNameInput && tourNameInput.value === def)) {
                isTourNameDefault = true;
                break;
            }
        }
        if (isTourNameDefault) {
            appState.tournamentName = translations[currentLang].default_tour_name;
            if (tourNameInput) tourNameInput.value = appState.tournamentName;
        }

        const p1Input = document.getElementById('p1NameInput');
        let isP1Default = false;
        for (let langKey in translations) {
            let def = translations[langKey].default_p1;
            if (appState.player1 === def || (p1Input && p1Input.value === def)) {
                isP1Default = true;
                break;
            }
        }
        if (isP1Default) {
            appState.player1 = translations[currentLang].default_p1;
            if (p1Input) p1Input.value = appState.player1;
        }

        const p2Input = document.getElementById('p2NameInput');
        let isP2Default = false;
        for (let langKey in translations) {
            let def = translations[langKey].default_p2;
            if (appState.player2 === def || (p2Input && p2Input.value === def)) {
                isP2Default = true;
                break;
            }
        }
        if (isP2Default) {
            appState.player2 = translations[currentLang].default_p2;
            if (p2Input) p2Input.value = appState.player2;
        }

        const gameTitle = document.getElementById('gameTournamentTitle');
        if (gameTitle) {
            gameTitle.innerText = appState.tournamentName || translations[currentLang].default_tour_name;
        }
    }

    updateDOMTranslations();
    
    if (typeof applyLoadedState === 'function') {
        applyLoadedState(); 
    }
    if (typeof updateListLength === 'function' && document.getElementById('setupPhase') && !document.getElementById('setupPhase').classList.contains('hidden')) {
        updateListLength();
    }
    if (typeof saveState === 'function') {
        saveState();
    }
}