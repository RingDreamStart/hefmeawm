// === БАЗА ДАННЫХ ПРОФЕССИЙ ===
const PROFESSIONS_DB = [
    {
        id: 'frontend',
        title: 'Frontend-разработчик',
        icon: '💻',
        reqSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
        reqProjects: ['Лендинг', 'Портфолио'],
        reqAchievements: ['GitHub', 'Сертификат']
    },
    {
        id: 'python',
        title: 'Python-разработчик',
        icon: '🐍',
        reqSkills: ['Python', 'SQL', 'Git'],
        reqProjects: ['Telegram Bot', 'Парсер'],
        reqAchievements: ['Hackathon', 'Pet Project']
    },
    {
        id: 'designer',
        title: 'UX/UI Дизайнер',
        icon: '🎨',
        reqSkills: ['Figma', 'Photoshop', 'UX/UI'],
        reqProjects: ['Макет сайта', 'Логотип'],
        reqAchievements: ['Behance профиль', 'Кейс']
    },
    {
        id: 'manager',
        title: 'IT-Менеджер',
        icon: '📊',
        reqSkills: ['Agile', 'Scrum', 'Trello'],
        reqProjects: ['Организация ивента', 'Стартап'],
        reqAchievements: ['Курс менеджмента', 'Лидерство']
    }
];

const STORAGE_KEY = 'careerAppData_v3';
const DEFAULT_DATA = {
    user: {
        name: "Студент",
        skills: ["HTML", "CSS"],
        projects: [],
        achievements: []
    },
    isAuth: false
};

let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;
let currentLang = localStorage.getItem('careerAppLang') || 'ru';

// === ФУНКЦИИ ДЛЯ РАБОТЫ С ПЕРЕВОДАМИ ===
function getTranslation(key) {
    if (window.translationsData && window.translationsData[currentLang]) {
        return window.translationsData[currentLang][key] || key;
    }
    return key;
}

function updateTexts() {
    const data = window.translationsData?.[currentLang];
    if (!data) return;
    
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
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (data[key]) {
            el.placeholder = data[key];
        }
    });
    
    if (typeof fillProfessionSelect === 'function') {
        fillProfessionSelect();
    }
    if (typeof renderRecommendations === 'function') {
        renderRecommendations();
    }
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('careerAppLang', lang);
    document.documentElement.lang = lang;
    
    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = lang;
    
    updateTexts();
    
    const dashboard = document.getElementById('dashboard-screen');
    if (dashboard && dashboard.classList.contains('active')) {
        if (typeof renderDashboard === 'function') renderDashboard();
        if (typeof renderRecommendations === 'function') renderRecommendations();
        if (typeof fillProfessionSelect === 'function') fillProfessionSelect();
    }
}

// === ВАЛИДАЦИЯ ===
function validateInput(value, type) {
    const emptyMsg = getTranslation('errorEmpty') || "Поле не может быть пустым";
    const shortMsg = getTranslation('errorShort') || "Минимум 3 символа";
    const numbersMsg = getTranslation('errorNumbers') || "Только буквы";
    
    if (!value || value.trim() === '') {
        return { valid: false, error: emptyMsg };
    }
    if (value.length < 3) {
        return { valid: false, error: shortMsg };
    }
    if (type === 'name' && /\d/.test(value)) {
        return { valid: false, error: numbersMsg };
    }
    return { valid: true, error: '' };
}

function checkDuplicate(array, value) {
    return array.some(item => item.toLowerCase() === value.toLowerCase());
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        const input = el.previousElementSibling;
        if (input && input.tagName === 'INPUT') {
            input.classList.add('error');
        }
    }
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        const input = el.previousElementSibling;
        if (input && input.tagName === 'INPUT') {
            input.classList.remove('error');
        }
    }
}

// === УВЕДОМЛЕНИЯ ===
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.classList.remove('hidden');
    if (type === 'error') {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// === ТЁМНАЯ ТЕМА ===
function initTheme() {
    const savedTheme = localStorage.getItem('careerAppTheme');
    const isDark = savedTheme === 'dark';
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('careerAppTheme', isDark ? 'dark' : 'light');
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

// === ЭКСПОРТ ===
function exportData() {
    const dataStr = JSON.stringify(appData.user, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(getTranslation('notifyExported') || "Данные экспортированы!");
}

// === РОУТИНГ ===
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => {
        el.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    if (screenId === 'dashboard-screen') {
        renderDashboard();
        renderRecommendations();
        fillProfessionSelect();
    }
    updateTexts();
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

// === ДАШБОРД ===
function renderDashboard() {
    const statSkills = document.getElementById('stat-skills');
    const statProjects = document.getElementById('stat-projects');
    const statAchievements = document.getElementById('stat-achievements');
    if (statSkills) statSkills.textContent = appData.user.skills.length;
    if (statProjects) statProjects.textContent = appData.user.projects.length;
    if (statAchievements) statAchievements.textContent = appData.user.achievements.length;
    
    const userDisplay = document.getElementById('user-display-name');
    const userNameInput = document.getElementById('user-name-input');
    if (userDisplay) userDisplay.textContent = appData.user.name;
    if (userNameInput) userNameInput.value = appData.user.name;
    
    const skillsContainer = document.getElementById('skills-list');
    if (skillsContainer) {
        skillsContainer.innerHTML = appData.user.skills.map((skill, i) => 
            `<div class="tag">${skill} <span onclick="window.removeItem('skills', ${i})">&times;</span></div>`
        ).join('');
    }
    
    renderList('projects-list', appData.user.projects, 'projects');
    renderList('achievements-list', appData.user.achievements, 'achievements');
}

function renderList(elementId, array, type) {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = array.map((item, i) => `
        <li>${item} <span class="delete-btn" onclick="window.removeItem('${type}', ${i})">&times;</span></li>
    `).join('');
}

// === ДОБАВЛЕНИЕ ===
function addItem(type, inputId, errorId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const value = input.value.trim();
    
    const validation = validateInput(value, 'text');
    if (!validation.valid) {
        showError(errorId, validation.error);
        return;
    }
    
    if (checkDuplicate(appData.user[type], value)) {
        showError(errorId, getTranslation('errorDuplicate') || "Уже добавлено");
        return;
    }
    
    clearError(errorId);
    appData.user[type].push(value);
    saveData();
    renderDashboard();
    renderRecommendations();
    input.value = '';
    showNotification(getTranslation('notifyAdded') || "Добавлено!");
}

// === УДАЛЕНИЕ ===
window.removeItem = function(type, index) {
    if (confirm('Удалить? / Delete?')) {
        appData.user[type].splice(index, 1);
        saveData();
        renderDashboard();
        renderRecommendations();
        showNotification(getTranslation('notifyDeleted') || "Удалено!");
    }
};

// === НАВИГАТОР ===
function fillProfessionSelect() {
    const select = document.getElementById('profession-select');
    if (!select) return;
    
    select.innerHTML = PROFESSIONS_DB.map(p => {
        const title = getTranslation(`prof_${p.id}`) || p.title;
        return `<option value="${p.id}">${p.icon} ${title}</option>`;
    }).join('');
}

window.switchTab = function(tabName) {
    const btns = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    const resultDiv = document.getElementById('analysis-result');
    
    btns.forEach(b => b.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    if (tabName === 'recommend') {
        if (btns[0]) btns[0].classList.add('active');
        const recTab = document.getElementById('tab-recommend');
        if (recTab) recTab.classList.add('active');
    } else {
        if (btns[1]) btns[1].classList.add('active');
        const manualTab = document.getElementById('tab-manual');
        if (manualTab) manualTab.classList.add('active');
    }
    if (resultDiv) resultDiv.style.display = 'none';
}

function analyzeProfession(profId) {
    const prof = PROFESSIONS_DB.find(p => p.id === profId);
    if (!prof) return;
    
    const matchSkills = prof.reqSkills.filter(s => appData.user.skills.includes(s));
    const matchProjects = prof.reqProjects.filter(p => appData.user.projects.includes(p));
    const matchAchievements = prof.reqAchievements.filter(a => appData.user.achievements.includes(a));
    
    const totalReq = prof.reqSkills.length + prof.reqProjects.length + prof.reqAchievements.length;
    const totalMatch = matchSkills.length + matchProjects.length + matchAchievements.length;
    const percent = totalReq === 0 ? 0 : Math.round((totalMatch / totalReq) * 100);
    
    const missingSkills = prof.reqSkills.filter(s => !appData.user.skills.includes(s));
    const missingProjects = prof.reqProjects.filter(p => !appData.user.projects.includes(p));
    const missingAchievements = prof.reqAchievements.filter(a => !appData.user.achievements.includes(a));
    
    const resultDiv = document.getElementById('analysis-result');
    if (resultDiv) resultDiv.style.display = 'block';
    
    const titleEl = document.getElementById('target-profession-title');
    if (titleEl) {
        titleEl.textContent = `${prof.icon} ${getTranslation(`prof_${prof.id}`) || prof.title}`;
    }
    
    const fill = document.getElementById('progress-fill');
    if (fill) {
        fill.style.width = `${percent}%`;
        fill.style.backgroundColor = percent > 70 ? 'var(--success)' : (percent > 30 ? '#f59e0b' : '#ef4444');
    }
    
    const percentEl = document.getElementById('match-percent');
    if (percentEl) percentEl.textContent = `${percent}%`;
    
    const renderMissing = (listId, items) => {
        const el = document.getElementById(listId);
        if (!el) return;
        el.innerHTML = items.length ? items.map(i => `<li>${i}</li>`).join('') : '<li style="color:var(--success); list-style:none">✓</li>';
    };
    
    renderMissing('missing-skills', missingSkills);
    renderMissing('missing-projects', missingProjects);
    renderMissing('missing-achievements', missingAchievements);
    
    const allGood = document.getElementById('all-good');
    if (allGood) allGood.style.display = percent === 100 ? 'block' : 'none';
    
    if (percent === 100) {
        showNotification(getTranslation('notifyReady') || "Ты готов на 100%!");
    }
}

function renderRecommendations() {
    const container = document.getElementById('recommendation-list');
    if (!container) return;
    
    const sortedProfs = PROFESSIONS_DB.map(p => {
        const matchSkills = p.reqSkills.filter(s => appData.user.skills.includes(s)).length;
        const total = p.reqSkills.length;
        const percent = total === 0 ? 0 : Math.round((matchSkills / total) * 100);
        return { ...p, percent };
    }).sort((a, b) => b.percent - a.percent);
    
    container.innerHTML = sortedProfs.map(p => {
        const title = getTranslation(`prof_${p.id}`) || p.title;
        return `
            <div class="rec-card" onclick="window.selectProfessionManual('${p.id}')">
                <span class="rec-title">${p.icon} ${title}</span>
                <span class="rec-match">${getTranslation('matchLabel') || "Совпадение:"} ${p.percent}%</span>
            </div>
        `;
    }).join('');
}

window.selectProfessionManual = function(id) {
    window.switchTab('manual');
    const select = document.getElementById('profession-select');
    if (select) select.value = id;
    analyzeProfession(id);
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
    
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    const loginError = document.getElementById('login-error');
    if (loginError) loginError.classList.add('hidden');
    
    if (appData.isAuth) {
        showScreen('dashboard-screen');
    } else {
        showScreen('home-screen');
    }
    
    updateTexts();
});

// === НАВИГАЦИЯ ===
const startBtn = document.getElementById('btn-start');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        showScreen('login-screen');
    });
}

const backBtn = document.getElementById('btn-back-home');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        const loginError = document.getElementById('login-error');
        if (loginError) loginError.classList.add('hidden');
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.reset();
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
        showScreen('home-screen');
    });
}

const logoutBtn = document.getElementById('btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        appData.isAuth = false;
        saveData();
        showScreen('home-screen');
    });
}

// === АВТОРИЗАЦИЯ ===
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const loginInput = document.getElementById('username');
        const passInput = document.getElementById('password');
        const errorMsg = document.getElementById('login-error');
        
        const loginValid = validateInput(loginInput?.value || '', 'text');
        const passValid = validateInput(passInput?.value || '', 'text');
        
        if (!loginValid.valid) {
            showError('username-error', loginValid.error);
            return;
        }
        clearError('username-error');
        
        if (!passValid.valid) {
            showError('password-error', passValid.error);
            return;
        }
        clearError('password-error');
        
        if (loginInput.value === 'admin' && passInput.value === '1234') {
            appData.isAuth = true;
            saveData();
            showScreen('dashboard-screen');
            if (errorMsg) errorMsg.classList.add('hidden');
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden');
        }
    });
}

// === КНОПКИ ДОБАВЛЕНИЯ ===
const saveNameBtn = document.getElementById('btn-save-name');
if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
        const input = document.getElementById('user-name-input');
        if (!input) return;
        const value = input.value.trim();
        
        const validation = validateInput(value, 'name');
        if (!validation.valid) {
            showError('name-error', validation.error);
            return;
        }
        
        clearError('name-error');
        appData.user.name = value;
        saveData();
        renderDashboard();
        showNotification(getTranslation('notifySaved') || "Сохранено!");
    });
}

const addSkillBtn = document.getElementById('btn-add-skill');
if (addSkillBtn) addSkillBtn.addEventListener('click', () => addItem('skills', 'new-skill', 'skill-error'));

const addProjectBtn = document.getElementById('btn-add-project');
if (addProjectBtn) addProjectBtn.addEventListener('click', () => addItem('projects', 'new-project', 'project-error'));

const addAchievementBtn = document.getElementById('btn-add-achievement');
if (addAchievementBtn) addAchievementBtn.addEventListener('click', () => addItem('achievements', 'new-achievement', 'achievement-error'));

// Очистка ошибок
['new-skill', 'new-project', 'new-achievement', 'user-name-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', function() {
            const errorId = this.id.replace('new-', '').replace('user-name', 'name') + '-error';
            clearError(errorId);
        });
    }
});

const analyzeBtn = document.getElementById('btn-analyze');
if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
        const select = document.getElementById('profession-select');
        if (select && select.value) analyzeProfession(select.value);
    });
}
