import { DEFAULT_SPLIT, DEFAULT_WORKSPACE, STORAGE_KEYS } from './constants.js';

function safeJsonParse(raw, fallback) {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeWorkspace(candidate) {
    const base = deepClone(DEFAULT_WORKSPACE);
    if (!candidate || typeof candidate !== 'object') return base;

    base.mode = typeof candidate.mode === 'string' ? candidate.mode : base.mode;
    base.codes = {
        ...base.codes,
        ...(candidate.codes || {})
    };

    const tab = candidate.currentTab;
    base.currentTab = tab === 'primary' || tab === 'css' || tab === 'html' ? tab : 'primary';
    base.consoleHidden = Boolean(candidate.consoleHidden);

    return base;
}

function loadProjectsRaw() {
    const projects = safeJsonParse(localStorage.getItem(STORAGE_KEYS.projects), []);
    return Array.isArray(projects) ? projects : [];
}

function saveProjectsRaw(projects) {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
}

function createProjectRecord(name, workspace) {
    const now = new Date().toISOString();
    return {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name,
        workspace: normalizeWorkspace(workspace),
        createdAt: now,
        updatedAt: now
    };
}

function loadLegacyWorkspace() {
    const raw = safeJsonParse(localStorage.getItem(STORAGE_KEYS.workspace), null);
    return normalizeWorkspace(raw);
}

function bootstrapProjects() {
    let projects = loadProjectsRaw();
    if (projects.length > 0) return projects;

    const seeded = createProjectRecord('Proyecto Principal', loadLegacyWorkspace());
    projects = [seeded];
    saveProjectsRaw(projects);
    localStorage.setItem(STORAGE_KEYS.activeProjectId, seeded.id);
    return projects;
}

function getActiveProjectId(projects) {
    const storedId = localStorage.getItem(STORAGE_KEYS.activeProjectId);
    if (storedId && projects.some((project) => project.id === storedId)) return storedId;

    const fallbackId = projects[0]?.id || null;
    if (fallbackId) localStorage.setItem(STORAGE_KEYS.activeProjectId, fallbackId);
    return fallbackId;
}

export function loadWorkspace() {
    const projects = bootstrapProjects();
    const activeId = getActiveProjectId(projects);
    const project = projects.find((item) => item.id === activeId);
    const workspace = normalizeWorkspace(project?.workspace);

    localStorage.setItem(STORAGE_KEYS.workspace, JSON.stringify(workspace));
    return workspace;
}

export function saveWorkspace(workspace) {
    const normalized = normalizeWorkspace(workspace);
    localStorage.setItem(STORAGE_KEYS.workspace, JSON.stringify(normalized));

    const projects = bootstrapProjects();
    const activeId = getActiveProjectId(projects);
    const updated = projects.map((project) => {
        if (project.id !== activeId) return project;
        return {
            ...project,
            workspace: normalized,
            updatedAt: new Date().toISOString()
        };
    });
    saveProjectsRaw(updated);
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
    localStorage.removeItem(STORAGE_KEYS.projects);
    localStorage.removeItem(STORAGE_KEYS.activeProjectId);
}

export function listProjects() {
    return bootstrapProjects();
}

export function createProject(name, workspace) {
    const projects = bootstrapProjects();
    const project = createProjectRecord(name || `Proyecto ${projects.length + 1}`, workspace);
    const next = [...projects, project];
    saveProjectsRaw(next);
    localStorage.setItem(STORAGE_KEYS.activeProjectId, project.id);
    return project;
}

export function setActiveProject(projectId) {
    const projects = bootstrapProjects();
    const project = projects.find((item) => item.id === projectId);
    if (!project) return null;

    localStorage.setItem(STORAGE_KEYS.activeProjectId, project.id);
    localStorage.setItem(STORAGE_KEYS.workspace, JSON.stringify(project.workspace));
    return normalizeWorkspace(project.workspace);
}

export function deleteProject(projectId) {
    const projects = bootstrapProjects();
    if (projects.length <= 1) return false;

    const filtered = projects.filter((item) => item.id !== projectId);
    if (filtered.length === projects.length) return false;

    saveProjectsRaw(filtered);
    const activeId = getActiveProjectId(filtered);
    localStorage.setItem(STORAGE_KEYS.activeProjectId, activeId);
    return true;
}

export function getActiveProjectIdSafe() {
    const projects = bootstrapProjects();
    return getActiveProjectId(projects);
}

export function exportStoragePayload() {
    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        projects: listProjects(),
        activeProjectId: getActiveProjectIdSafe(),
        splitSizes: loadSplitSizes()
    };
}

export function importStoragePayload(payload) {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Payload invalido');
    }
    if (!Array.isArray(payload.projects) || payload.projects.length === 0) {
        throw new Error('No hay proyectos para importar');
    }

    const normalizedProjects = payload.projects.map((project, index) => ({
        id: typeof project.id === 'string' ? project.id : `p_import_${Date.now()}_${index}`,
        name: typeof project.name === 'string' && project.name.trim()
            ? project.name.trim()
            : `Proyecto ${index + 1}`,
        workspace: normalizeWorkspace(project.workspace),
        createdAt: typeof project.createdAt === 'string' ? project.createdAt : new Date().toISOString(),
        updatedAt: typeof project.updatedAt === 'string' ? project.updatedAt : new Date().toISOString()
    }));

    saveProjectsRaw(normalizedProjects);

    const targetActiveId = typeof payload.activeProjectId === 'string'
        ? payload.activeProjectId
        : normalizedProjects[0].id;
    const safeActiveId = normalizedProjects.some((item) => item.id === targetActiveId)
        ? targetActiveId
        : normalizedProjects[0].id;
    localStorage.setItem(STORAGE_KEYS.activeProjectId, safeActiveId);

    const workspace = normalizeWorkspace(
        normalizedProjects.find((item) => item.id === safeActiveId)?.workspace
    );
    localStorage.setItem(STORAGE_KEYS.workspace, JSON.stringify(workspace));

    const sizes = Array.isArray(payload.splitSizes) && payload.splitSizes.length === 2
        ? payload.splitSizes
        : DEFAULT_SPLIT;
    saveSplitSizes(sizes);

    return workspace;
}
