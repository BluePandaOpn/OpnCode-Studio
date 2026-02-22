export function getDom() {
    return {
        frame: document.getElementById('output-frame'),
        runBtn: document.getElementById('run-btn'),
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
        activeFileLabel: document.getElementById('active-file-label')
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

export function setActiveTab(dom, file, labels) {
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.file === file);
    });

    dom.activeFileLabel.textContent = labels[file] || file;
}

export function setConsoleVisibility(dom, hidden) {
    dom.consoleOutput.classList.toggle('hidden', hidden);
    dom.toggleConsoleBtn.textContent = hidden ? 'Console Off' : 'Console';
}
