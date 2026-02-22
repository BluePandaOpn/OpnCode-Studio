import {
    DEFAULT_CODES,
    PREVIEW_AUTO_REFRESH_MS,
    TEMPLATES,
    getGoalPreset,
    getModeConfig,
    getQuickCasesByMode
} from './core/constants.js';
import { createEditor } from './core/editor.js';
import { createLayout } from './core/layout.js';
import { buildDownloadHtml, createPreviewMessageHandler, renderProject, resolveRuntimeMode } from './core/preview.js';
import {
    clearWorkspaceStorage,
    createProject,
    deleteProject,
    exportStoragePayload,
    getActiveProjectIdSafe,
    importStoragePayload,
    listProjects,
    loadSplitSizes,
    loadWorkspace,
    saveSplitSizes,
    saveWorkspace,
    setActiveProject
} from './core/storage.js';
import {
    appendConsoleLine,
    clearConsole,
    getDom,
    renderProjectOptions,
    renderQuickCaseOptions,
    setActiveMode,
    setActiveTab,
    setConsoleVisibility,
    setStatus
} from './ui/dom.js';

const state = {
    workspace: loadWorkspace(),
    splitSizes: loadSplitSizes(),
    editor: null,
    switchLanguage: null,
    layout: null,
    messageHandler: null,
    autoRefreshEnabled: true,
    autoRefreshTimerId: null
};

const dom = getDom();

function getMode() {
    return getModeConfig(state.workspace.mode);
}

function getFileKey(tabKey = state.workspace.currentTab) {
    if (tabKey === 'primary') return getMode().primaryKey;
    return tabKey;
}

function persistWorkspace() {
    saveWorkspace(state.workspace);
}

function render() {
    clearConsole(dom);
    renderProject(dom.frame, state.workspace);
    setStatus(dom, `Preview updated (${getMode().id})`);
}

function runCurrentModeOnly() {
    clearConsole(dom);
    const runtimeMode = resolveRuntimeMode(state.workspace.mode, state.workspace.codes);
    renderProject(dom.frame, state.workspace, { forcedRuntimeMode: runtimeMode });
    setStatus(dom, `Run mode: ${runtimeMode}`);
}

function repairCurrentPrimaryCode() {
    const key = getMode().primaryKey;
    state.workspace.codes[key] = DEFAULT_CODES[key] || '';
    state.workspace.currentTab = 'primary';
    persistWorkspace();
    switchTab('primary');
    render();
    setStatus(dom, `Repair complete: ${getMode().primaryLabel}`);
}

function refreshProjectSelector() {
    renderProjectOptions(dom, listProjects(), getActiveProjectIdSafe());
}

function refreshQuickCaseSelector() {
    renderQuickCaseOptions(dom, getQuickCasesByMode(state.workspace.mode));
}

function updateAutoRefreshButton() {
    dom.toggleAutoRefreshBtn.textContent = state.autoRefreshEnabled ? 'Auto On' : 'Auto Off';
}

function startAutoRefresh() {
    if (state.autoRefreshTimerId) window.clearInterval(state.autoRefreshTimerId);
    state.autoRefreshTimerId = window.setInterval(() => {
        if (state.autoRefreshEnabled) render();
    }, PREVIEW_AUTO_REFRESH_MS);
}

function switchTab(tabKey) {
    state.workspace.currentTab = tabKey;
    const fileKey = getFileKey(tabKey);

    setActiveTab(dom, tabKey, getMode().primaryLabel);
    if (state.editor) {
        state.editor.setValue(state.workspace.codes[fileKey] || '');
        state.switchLanguage(fileKey);
    }

    persistWorkspace();
    setStatus(dom, `Editing ${dom.activeFileLabel.textContent}`);
}

function applyMode(modeId) {
    state.workspace.mode = modeId;
    setActiveMode(dom, modeId);
    if (state.workspace.currentTab !== 'primary') {
        state.workspace.currentTab = 'primary';
    }

    const primaryKey = getMode().primaryKey;
    if (!String(state.workspace.codes[primaryKey] || '').trim()) {
        state.workspace.codes[primaryKey] = DEFAULT_CODES[primaryKey] || '';
    }

    refreshQuickCaseSelector();
    switchTab('primary');
    render();
    setStatus(dom, `Mode active: ${getMode().label} (sin Node.js)`);
}

function applyQuickCase() {
    const cases = getQuickCasesByMode(state.workspace.mode);
    const selected = cases.find((item) => item.id === dom.quickCaseSelect.value);
    if (!selected) return;

    state.workspace.codes[getMode().primaryKey] = selected.code;
    state.workspace.currentTab = 'primary';
    persistWorkspace();
    switchTab('primary');
    render();
    setStatus(dom, `Quick case loaded: ${selected.label}`);
}

function buildGoalProject() {
    const goalId = dom.goalSelect.value;
    const preset = getGoalPreset(state.workspace.mode, goalId);

    state.workspace.codes[getMode().primaryKey] = preset.primary;
    state.workspace.codes.css = preset.css;
    state.workspace.codes.html = preset.html;
    state.workspace.currentTab = 'primary';

    persistWorkspace();
    switchTab('primary');
    render();
    setStatus(dom, `Goal loaded: ${goalId}`);
}

function downloadProject() {
    const file = buildDownloadHtml(state.workspace);
    const blob = new Blob([file], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `opncode-${getMode().id}-export.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setStatus(dom, 'Project downloaded');
}

function exportData() {
    const payload = exportStoragePayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `opncode-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(dom, 'Data exported');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', async () => {
        const file = input.files && input.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const payload = JSON.parse(text);
            const workspace = importStoragePayload(payload);
            state.workspace = workspace;
            refreshProjectSelector();
            setActiveMode(dom, state.workspace.mode);
            refreshQuickCaseSelector();
            switchTab(state.workspace.currentTab || 'primary');
            render();
            setStatus(dom, 'Data imported');
        } catch (error) {
            setStatus(dom, `Import failed: ${error.message || 'invalid file'}`);
        }
    });
    input.click();
}

function resetWorkspace() {
    const accepted = window.confirm('Se limpiara todo el almacenamiento avanzado y se reiniciara la plataforma. Continuar?');
    if (!accepted) return;

    clearWorkspaceStorage();
    window.location.reload();
}

async function copyCurrentCode() {
    const code = state.workspace.codes[getFileKey()] || '';
    try {
        await navigator.clipboard.writeText(code);
        setStatus(dom, 'Code copied');
    } catch {
        setStatus(dom, 'Copy failed');
    }
}

function applyTemplate() {
    const key = dom.templateSelect.value;
    const template = TEMPLATES[key];
    if (!template) return;

    state.workspace.codes = {
        ...DEFAULT_CODES,
        ...(template.codes || {})
    };
    state.workspace.currentTab = 'primary';
    persistWorkspace();
    switchTab('primary');
    render();
    setStatus(dom, `Template loaded: ${template.label}`);
}

function toggleAutoRefresh() {
    state.autoRefreshEnabled = !state.autoRefreshEnabled;
    updateAutoRefreshButton();
    setStatus(dom, state.autoRefreshEnabled ? 'Auto refresh enabled' : 'Auto refresh paused');
}

function createNewProject() {
    const name = window.prompt('Nombre del nuevo proyecto:');
    if (!name) return;

    const created = createProject(name, state.workspace);
    const loaded = setActiveProject(created.id);
    if (!loaded) return;

    state.workspace = loaded;
    refreshProjectSelector();
    setActiveMode(dom, state.workspace.mode);
    refreshQuickCaseSelector();
    switchTab(state.workspace.currentTab || 'primary');
    render();
    setStatus(dom, `Project created: ${name}`);
}

function saveCurrentProject() {
    persistWorkspace();
    refreshProjectSelector();
    setStatus(dom, 'Project snapshot saved');
}

function deleteCurrentProject() {
    const projectId = dom.projectSelect.value;
    const accepted = window.confirm('Eliminar proyecto seleccionado?');
    if (!accepted) return;

    const ok = deleteProject(projectId);
    if (!ok) {
        setStatus(dom, 'Cannot delete last project');
        return;
    }

    const activeId = getActiveProjectIdSafe();
    const loaded = setActiveProject(activeId);
    if (!loaded) return;

    state.workspace = loaded;
    refreshProjectSelector();
    setActiveMode(dom, state.workspace.mode);
    refreshQuickCaseSelector();
    switchTab(state.workspace.currentTab || 'primary');
    render();
    setStatus(dom, 'Project deleted');
}

function onProjectChange() {
    const loaded = setActiveProject(dom.projectSelect.value);
    if (!loaded) return;

    state.workspace = loaded;
    setActiveMode(dom, state.workspace.mode);
    refreshQuickCaseSelector();
    switchTab(state.workspace.currentTab || 'primary');
    render();
    setStatus(dom, 'Project loaded');
}

function bindEvents() {
    dom.runBtn.addEventListener('click', render);
    dom.repairBtn.addEventListener('click', repairCurrentPrimaryCode);
    dom.runModeBtn.addEventListener('click', runCurrentModeOnly);
    dom.copyCodeBtn.addEventListener('click', copyCurrentCode);
    dom.applyQuickCaseBtn.addEventListener('click', applyQuickCase);
    dom.buildGoalBtn.addEventListener('click', buildGoalProject);
    dom.applyTemplateBtn.addEventListener('click', applyTemplate);
    dom.toggleAutoRefreshBtn.addEventListener('click', toggleAutoRefresh);
    dom.resetBtn.addEventListener('click', resetWorkspace);

    dom.newProjectBtn.addEventListener('click', createNewProject);
    dom.saveProjectBtn.addEventListener('click', saveCurrentProject);
    dom.deleteProjectBtn.addEventListener('click', deleteCurrentProject);
    dom.exportDataBtn.addEventListener('click', exportData);
    dom.importDataBtn.addEventListener('click', importData);
    dom.projectSelect.addEventListener('change', onProjectChange);

    dom.clearConsoleBtn.addEventListener('click', () => {
        clearConsole(dom);
        setStatus(dom, 'Console cleared');
    });
    dom.downloadBtn.addEventListener('click', downloadProject);

    document.querySelectorAll('[data-layout]').forEach((button) => {
        button.addEventListener('click', () => {
            state.layout.setMode(button.dataset.layout);
            dom.togglePreviewBtn.textContent = 'Full View';
            setStatus(dom, `Layout: ${button.dataset.layout}`);
        });
    });

    dom.modeButtons.forEach((button) => {
        button.addEventListener('click', () => applyMode(button.dataset.mode));
    });

    dom.growPreviewBtn.addEventListener('click', () => state.layout.growPreview());
    dom.shrinkPreviewBtn.addEventListener('click', () => state.layout.shrinkPreview());

    dom.togglePreviewBtn.addEventListener('click', () => {
        const full = state.layout.toggleFullPreview();
        dom.togglePreviewBtn.textContent = full ? 'Exit Full' : 'Full View';
        setStatus(dom, full ? 'Preview full width' : 'Layout restored');
    });

    dom.toggleConsoleBtn.addEventListener('click', () => {
        state.workspace.consoleHidden = !state.workspace.consoleHidden;
        setConsoleVisibility(dom, state.workspace.consoleHidden);
        persistWorkspace();
    });

    document.querySelectorAll('.tab').forEach((tab) => {
        tab.addEventListener('click', () => switchTab(tab.dataset.file));
    });

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            render();
        }

        if (event.ctrlKey && event.key.toLowerCase() === 's') {
            event.preventDefault();
            saveCurrentProject();
        }

        if (event.ctrlKey && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            copyCurrentCode();
        }
    });
}

async function bootstrap() {
    try {
        const editorSetup = await createEditor({
            codes: state.workspace.codes,
            currentFile: getFileKey(state.workspace.currentTab),
            onCodeChange: (value) => {
                state.workspace.codes[getFileKey()] = value;
                persistWorkspace();
            },
            onCodeChangeDebounced: render
        });

        state.editor = editorSetup.editor;
        state.switchLanguage = editorSetup.switchLanguage;

        state.layout = createLayout({
            initialSizes: state.splitSizes,
            onSizesChange: (sizes) => {
                state.splitSizes = sizes;
                saveSplitSizes(sizes);
            },
            onEditorLayout: () => state.editor.layout()
        });

        if (state.workspace.consoleHidden) {
            setConsoleVisibility(dom, true);
        }

        state.messageHandler = createPreviewMessageHandler(dom.frame, (type, msg) => {
            appendConsoleLine(dom, type, msg);
            if (type === 'error') setStatus(dom, 'Render error');
        });
        window.addEventListener('message', state.messageHandler);

        bindEvents();
        refreshProjectSelector();
        refreshQuickCaseSelector();
        setActiveMode(dom, state.workspace.mode);
        switchTab(state.workspace.currentTab || 'primary');
        updateAutoRefreshButton();
        render();
        startAutoRefresh();
    } catch (error) {
        setStatus(dom, 'Bootstrap failed');
        appendConsoleLine(dom, 'error', error && error.message ? error.message : String(error));
    }
}

bootstrap();
