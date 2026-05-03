// === ПЕРЕВОДЫ ===
const translationsData = {
    ru: {
        title: "Career Compass",
        titleHighlight: "Compass",
        subtitle: "Отслеживай рост, анализируй навыки и найди профессию мечты.",
        startBtn: "Начать путь",
        loginTitle: "Вход",
        loginPlaceholder: "Логин",
        passwordPlaceholder: "Пароль",
        loginError: "Ошибка входа!",
        loginBtn: "Войти",
        backBtn: "← Вернуться",
        exportBtn: "📥 Экспорт",
        statsSkills: "Навыков",
        statsProjects: "Проектов",
        statsAchievements: "Достижений",
        profileTitle: "👤 Профиль",
        namePlaceholder: "Ваше имя",
        skillsTitle: "🛠 Навыки",
        skillPlaceholder: "Навык...",
        projectsTitle: "💼 Проекты",
        projectPlaceholder: "Проект...",
        achievementsTitle: "🏆 Достижения",
        achievementPlaceholder: "Достижение...",
        navigatorTitle: "🧭 Карьерный Навигатор",
        navigatorSubtitle: "Выберите профессию или посмотрите рекомендации.",
        tabRecommend: "Рекомендации",
        tabManual: "Выбрать цель",
        analyzeBtn: "Анализировать",
        matchLabel: "Совпадение:",
        missingLabel: "📉 Чего не хватает:",
        allGood: "🎉 Ты полностью готов к этой профессии!",
        errorEmpty: "Поле не может быть пустым",
        errorShort: "Минимум 3 символа",
        errorDuplicate: "Уже добавлено",
        errorNumbers: "Только буквы",
        notifySaved: "✓ Сохранено!",
        notifyAdded: "✓ Добавлено!",
        notifyDeleted: "✓ Удалено!",
        notifyExported: "✓ Данные экспортированы!",
        notifyReady: "🎉 Ты готов на 100%!",
        prof_frontend: "💻 Frontend Разработчик",
        prof_python: "🐍 Python Разработчик",
        prof_designer: "🎨 Веб-дизайнер",
        prof_manager: "📊 Project Manager"
    },
    en: {
        title: "Career Compass",
        titleHighlight: "Compass",
        subtitle: "Track growth, analyze skills and find your dream profession.",
        startBtn: "Start Journey",
        loginTitle: "Login",
        loginPlaceholder: "Username",
        passwordPlaceholder: "Password",
        loginError: "Login failed!",
        loginBtn: "Sign In",
        backBtn: "← Back",
        exportBtn: "📥 Export",
        statsSkills: "Skills",
        statsProjects: "Projects",
        statsAchievements: "Achievements",
        profileTitle: "👤 Profile",
        namePlaceholder: "Your name",
        skillsTitle: "🛠 Skills",
        skillPlaceholder: "Skill...",
        projectsTitle: "💼 Projects",
        projectPlaceholder: "Project...",
        achievementsTitle: "🏆 Achievements",
        achievementPlaceholder: "Achievement...",
        navigatorTitle: "🧭 Career Navigator",
        navigatorSubtitle: "Choose a profession or see recommendations.",
        tabRecommend: "Recommendations",
        tabManual: "Choose Goal",
        analyzeBtn: "Analyze",
        matchLabel: "Match:",
        missingLabel: "📉 What's missing:",
        allGood: "🎉 You're 100% ready!",
        errorEmpty: "Field cannot be empty",
        errorShort: "Minimum 3 characters",
        errorDuplicate: "Already added",
        errorNumbers: "Letters only",
        notifySaved: "✓ Saved!",
        notifyAdded: "✓ Added!",
        notifyDeleted: "✓ Deleted!",
        notifyExported: "✓ Data exported!",
        notifyReady: "🎉 You're 100% ready!",
        prof_frontend: "💻 Frontend Developer",
        prof_python: "🐍 Python Developer",
        prof_designer: "🎨 Web Designer",
        prof_manager: "📊 Project Manager"
    }
};

// Функция для получения перевода
function t(key) {
    return translationsData[currentLang]?.[key] || key;
}

// Основная функция перевода страницы
function translatePage() {
    const data = translationsData[currentLang];
    if (!data) return;
    
    // Элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data[key]) {
            if (key === 'title') {
                const highlight = data.titleHighlight || 'Compass';
                el.innerHTML = `${data.title} <span class="highlight">${highlight}</span>`;
            } else {
                el.innerHTML = data[key];
            }
        }
    });
    
    // Элементы с data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (data[key]) {
            el.placeholder = data[key];
        }
    });
    
    // Обновляем select профессий, если функция доступна
    if (typeof window.updateProfessionSelect === 'function') {
        window.updateProfessionSelect();
    }
}

// Экспортируем в глобальный объект window
window.translationsData = translationsData;
window.t = t;
window.translatePage = translatePage;

