import { DEFAULT_SPLIT, DEFAULT_WORKSPACE, STORAGE_KEYS } from './constants.js';

function safeJsonParse(raw, fallback) {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function loadWorkspace() {
    const stored = safeJsonParse(localStorage.getItem(STORAGE_KEYS.workspace), null);
    if (!stored || typeof stored !== 'object') {
        return {
            codes: { ...DEFAULT_WORKSPACE.codes },
            currentFile: DEFAULT_WORKSPACE.currentFile,
            consoleHidden: DEFAULT_WORKSPACE.consoleHidden
        };
    }

    const codes = {
        ...DEFAULT_WORKSPACE.codes,
        ...(stored.codes || {})
    };

    const currentFile = ['jsx', 'css', 'html'].includes(stored.currentFile)
        ? stored.currentFile
        : DEFAULT_WORKSPACE.currentFile;

    return {
        codes,
        currentFile,
        consoleHidden: Boolean(stored.consoleHidden)
    };
}

export function saveWorkspace(workspace) {
    localStorage.setItem(STORAGE_KEYS.workspace, JSON.stringify(workspace));
}

export function loadSplitSizes() {
    const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEYS.splitSizes), null);
    if (!Array.isArray(parsed) || parsed.length !== 2) return DEFAULT_SPLIT;

    const left = Number(parsed[0]);
    const right = Number(parsed[1]);
    if (!Number.isFinite(left) || !Number.isFinite(right)) return DEFAULT_SPLIT;
    if (left < 0 || right < 0 || left + right <= 0) return DEFAULT_SPLIT;

    return [left, right];
}

export function saveSplitSizes(sizes) {
    localStorage.setItem(STORAGE_KEYS.splitSizes, JSON.stringify(sizes));
}

export function clearWorkspaceStorage() {
    localStorage.removeItem(STORAGE_KEYS.workspace);
    localStorage.removeItem(STORAGE_KEYS.splitSizes);
}
