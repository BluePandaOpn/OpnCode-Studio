export function getDom() {
    return {
        frame: document.getElementById('output-frame'),
        runBtn: document.getElementById('run-btn'),
        repairBtn: document.getElementById('repair-btn'),
        toggleAutoRefreshBtn: document.getElementById('toggle-auto-refresh-btn'),
        copyCodeBtn: document.getElementById('copy-code-btn'),
        templateSelect: document.getElementById('template-select'),
        applyTemplateBtn: document.getElementById('apply-template-btn'),
        resetBtn: document.getElementById('reset-btn'),
        clearConsoleBtn: document.getElementById('clear-console-btn'),
        downloadBtn: document.getElementById('download-btn'),
        togglePreviewBtn: document.getElementById('toggle-preview-btn'),
        toggleConsoleBtn: document.getElementById('toggle-console-btn'),
        growPreviewBtn: document.getElementById('grow-preview-btn'),
        shrinkPreviewBtn: document.getElementById('shrink-preview-btn'),
        consoleOutput: document.getElementById('console-output'),
        statusText: document.getElementById('status-text'),
        activeFileLabel: document.getElementById('active-file-label'),
        primaryTabLabel: document.getElementById('primary-tab-label'),
        modeButtons: Array.from(document.querySelectorAll('.mode-btn')),
        projectSelect: document.getElementById('project-select'),
        newProjectBtn: document.getElementById('new-project-btn'),
        saveProjectBtn: document.getElementById('save-project-btn'),
        deleteProjectBtn: document.getElementById('delete-project-btn'),
        exportDataBtn: document.getElementById('export-data-btn'),
        importDataBtn: document.getElementById('import-data-btn'),
        runModeBtn: document.getElementById('run-mode-btn'),
        quickCaseSelect: document.getElementById('quick-case-select'),
        applyQuickCaseBtn: document.getElementById('apply-quick-case-btn'),
        goalSelect: document.getElementById('goal-select'),
        buildGoalBtn: document.getElementById('build-goal-btn')
    };
}

export function setStatus(dom, text) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    dom.statusText.textContent = `${text} - ${hh}:${mm}`;
}

export function appendConsoleLine(dom, type, msg) {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = `[${type.toUpperCase()}] ${msg}`;
    dom.consoleOutput.appendChild(line);
    dom.consoleOutput.scrollTop = dom.consoleOutput.scrollHeight;
}

export function clearConsole(dom) {
    dom.consoleOutput.textContent = '';
}

export function setActiveTab(dom, tabKey, primaryLabel) {
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.file === tabKey);
    });

    if (dom.primaryTabLabel) {
        dom.primaryTabLabel.textContent = primaryLabel;
    }

    if (tabKey === 'primary') dom.activeFileLabel.textContent = primaryLabel;
    if (tabKey === 'css') dom.activeFileLabel.textContent = 'style.css';
    if (tabKey === 'html') dom.activeFileLabel.textContent = 'index.html';
}

export function setConsoleVisibility(dom, hidden) {
    dom.consoleOutput.classList.toggle('hidden', hidden);
    dom.toggleConsoleBtn.textContent = hidden ? 'Console Off' : 'Console';
}

export function setActiveMode(dom, modeId) {
    dom.modeButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.mode === modeId);
    });
}

export function renderProjectOptions(dom, projects, activeId) {
    if (!dom.projectSelect) return;

    dom.projectSelect.innerHTML = '';
    projects.forEach((project) => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        option.selected = project.id === activeId;
        dom.projectSelect.appendChild(option);
    });
}

export function renderQuickCaseOptions(dom, cases) {
    if (!dom.quickCaseSelect) return;

    dom.quickCaseSelect.innerHTML = '';
    cases.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.label;
        dom.quickCaseSelect.appendChild(option);
    });
}
