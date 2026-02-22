import { DEFAULT_CODES, FILE_LABELS, PREVIEW_AUTO_REFRESH_MS, TEMPLATES } from './core/constants.js';
import { createEditor } from './core/editor.js';
import { createLayout } from './core/layout.js';
import { buildDownloadHtml, createPreviewMessageHandler, renderProject } from './core/preview.js';
import { clearWorkspaceStorage, loadSplitSizes, loadWorkspace, saveSplitSizes, saveWorkspace } from './core/storage.js';
import { appendConsoleLine, clearConsole, getDom, setActiveTab, setConsoleVisibility, setStatus } from './ui/dom.js';

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

function render() {
    clearConsole(dom);
    renderProject(dom.frame, state.workspace.codes);
    setStatus(dom, 'Preview updated');
}

function updateAutoRefreshButton() {
    dom.toggleAutoRefreshBtn.textContent = state.autoRefreshEnabled ? 'Auto On' : 'Auto Off';
}

function startAutoRefresh() {
    if (state.autoRefreshTimerId) {
        window.clearInterval(state.autoRefreshTimerId);
    }
    state.autoRefreshTimerId = window.setInterval(() => {
        if (state.autoRefreshEnabled) {
            render();
        }
    }, PREVIEW_AUTO_REFRESH_MS);
}

function persistWorkspace() {
    saveWorkspace(state.workspace);
}

function switchFile(file) {
    state.workspace.currentFile = file;
    setActiveTab(dom, file, FILE_LABELS);

    if (state.editor) {
        state.editor.setValue(state.workspace.codes[file] || '');
        state.switchLanguage(file);
    }

    persistWorkspace();
    setStatus(dom, `Editing ${FILE_LABELS[file] || file}`);
}

function downloadProject() {
    const file = buildDownloadHtml(state.workspace.codes);
    const blob = new Blob([file], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'opncode-export.html';
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    setStatus(dom, 'Project downloaded');
}

function resetWorkspace() {
    const accepted = window.confirm('Se limpiara el proyecto guardado y se restaurara la plantilla inicial. Continuar?');
    if (!accepted) return;

    clearWorkspaceStorage();
    window.location.reload();
}

async function copyCurrentCode() {
    const code = state.workspace.codes[state.workspace.currentFile] || '';
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
        jsx: template.codes.jsx || DEFAULT_CODES.jsx,
        css: template.codes.css || DEFAULT_CODES.css,
        html: template.codes.html || DEFAULT_CODES.html
    };
    state.workspace.currentFile = 'jsx';

    persistWorkspace();
    switchFile('jsx');
    render();
    setStatus(dom, `Template loaded: ${template.label}`);
}

function toggleAutoRefresh() {
    state.autoRefreshEnabled = !state.autoRefreshEnabled;
    updateAutoRefreshButton();
    setStatus(dom, state.autoRefreshEnabled ? 'Auto refresh enabled' : 'Auto refresh paused');
}

function bindEvents() {
    dom.runBtn.addEventListener('click', render);
    dom.copyCodeBtn.addEventListener('click', copyCurrentCode);
    dom.applyTemplateBtn.addEventListener('click', applyTemplate);
    dom.toggleAutoRefreshBtn.addEventListener('click', toggleAutoRefresh);
    dom.resetBtn.addEventListener('click', resetWorkspace);

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
        tab.addEventListener('click', () => switchFile(tab.dataset.file));
    });

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            render();
        }

        if (event.ctrlKey && event.key.toLowerCase() === 's') {
            event.preventDefault();
            downloadProject();
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
            currentFile: state.workspace.currentFile,
            onCodeChange: (value) => {
                state.workspace.codes[state.workspace.currentFile] = value;
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
            if (type === 'error') {
                setStatus(dom, 'Render error');
            }
        });
        window.addEventListener('message', state.messageHandler);

        bindEvents();
        switchFile(state.workspace.currentFile);
        updateAutoRefreshButton();
        render();
        startAutoRefresh();
    } catch (error) {
        setStatus(dom, 'Bootstrap failed');
        appendConsoleLine(dom, 'error', error && error.message ? error.message : String(error));
    }
}

bootstrap();
