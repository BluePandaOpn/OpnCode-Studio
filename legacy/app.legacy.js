let editor;
let splitInstance;
let isFullPreview = false;
let isConsoleHidden = false;
let currentFile = 'jsx';
const DEFAULT_SPLIT = [0, 100];
let preFullSizes = null;
const codes = {
    jsx: `const App = () => {\n  const [count, setCount] = React.useState(0);\n\n  return (\n    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', height: '100vh', width: '100%' }}>\n      <h1 style={{ color: '#007acc', margin: 0, padding: '20px 0' }}>React JSX en Tiempo Real</h1>\n      <p>Contador: <strong>{count}</strong></p>\n      <button \n        onClick={() => setCount(count + 1)}\n        style={{ background: '#007acc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}\n      >\n        Incrementar\n      </button>\n    </div>\n  );\n};`,
    css: `body { margin: 0; background: #f4f4f4; }`
};

// Configuración de Monaco
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});

require(['vs/editor/editor.main'], function() {
    // Definimos el lenguaje para que el autocompletado de JSX funcione
    editor = monaco.editor.create(document.getElementById('monaco-container'), {
        value: codes.jsx,
        language: 'javascript', // Usamos JS pero Babel lo tratará como JSX
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: 'Fira Code',
        minimap: { enabled: true },
        suggestOnTriggerCharacters: true,
        folding: true
    });

    // Evento de renderizado en tiempo real (Debounce)
    let timer;
    editor.onDidChangeModelContent(() => {
        codes[currentFile] = editor.getValue();
        clearTimeout(timer);
        timer = setTimeout(runProject, 800); // Renderiza 800ms después de dejar de escribir
    });

    initSplit();
    runProject();
});

function initSplit() {
    const saved = localStorage.getItem('splitSizes');
    const sizes = parseSplitSizes(saved) || DEFAULT_SPLIT;

    splitInstance = Split(['#editor-pane', '#preview-pane'], {
        direction: 'horizontal',
        sizes,
        minSize: [0, 200],
        gutterSize: 8,
        onDrag: () => {
            editor.layout();
        },
        onDragEnd: (currentSizes) => {
            localStorage.setItem('splitSizes', JSON.stringify(currentSizes));
            syncLayoutButtonsBySizes(currentSizes);
        }
    });
    syncLayoutButtonsBySizes(sizes);
}

function parseSplitSizes(raw) {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length !== 2) return null;
        const a = Number(parsed[0]);
        const b = Number(parsed[1]);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
        if (a < 0 || b < 0 || a + b <= 0) return null;
        return [a, b];
    } catch {
        return null;
    }
}

function saveCurrentSplit() {
    if (!splitInstance) return;
    localStorage.setItem('splitSizes', JSON.stringify(splitInstance.getSizes()));
}

function setPreviewWidth(previewPercent) {
    if (!splitInstance) return;
    const clampedPreview = Math.max(20, Math.min(100, previewPercent));
    const editorPercent = 100 - clampedPreview;
    splitInstance.setSizes([editorPercent, clampedPreview]);
    isFullPreview = false;
    const btn = document.getElementById('toggle-preview-btn');
    if (btn) btn.textContent = 'Full View';
    saveCurrentSplit();
    syncLayoutButtonsBySizes([editorPercent, clampedPreview]);
    editor.layout();
}

function markLayoutButton(mode) {
    const map = {
        editor: 'layout-editor-btn',
        balanced: 'layout-balanced-btn',
        preview: 'layout-preview-btn'
    };
    Object.values(map).forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    const activeId = map[mode];
    const activeBtn = activeId ? document.getElementById(activeId) : null;
    if (activeBtn) activeBtn.classList.add('active');
}

function syncLayoutButtonsBySizes(sizes) {
    if (!sizes || sizes.length !== 2) return;
    const editorSize = sizes[0];
    const previewSize = sizes[1];
    if (previewSize >= 70) {
        markLayoutButton('preview');
        return;
    }
    if (editorSize >= 70) {
        markLayoutButton('editor');
        return;
    }
    markLayoutButton('balanced');
}

function setLayoutMode(mode) {
    if (!splitInstance) return;
    if (mode === 'editor') {
        splitInstance.setSizes([90, 10]);
    } else if (mode === 'balanced') {
        splitInstance.setSizes([50, 50]);
    } else {
        splitInstance.setSizes([0, 100]);
    }
    isFullPreview = false;
    const btn = document.getElementById('toggle-preview-btn');
    if (btn) btn.textContent = 'Full View';
    saveCurrentSplit();
    syncLayoutButtonsBySizes(splitInstance.getSizes());
    editor.layout();
}

function growPreview() {
    if (!splitInstance) return;
    const current = splitInstance.getSizes();
    setPreviewWidth(current[1] + 10);
}

function shrinkPreview() {
    if (!splitInstance) return;
    const current = splitInstance.getSizes();
    setPreviewWidth(current[1] - 10);
}

function toggleConsole() {
    const consoleOut = document.getElementById('console-output');
    const btn = document.getElementById('toggle-console-btn');
    if (!consoleOut) return;
    isConsoleHidden = !isConsoleHidden;
    consoleOut.classList.toggle('hidden', isConsoleHidden);
    if (btn) btn.textContent = isConsoleHidden ? 'Console Off' : 'Console';
}

function toggleFullPreview() {
    if (!splitInstance) return;
    const btn = document.getElementById('toggle-preview-btn');

    if (!isFullPreview) {
        preFullSizes = splitInstance.getSizes();
        splitInstance.setSizes([0, 100]);
        isFullPreview = true;
        markLayoutButton('preview');
        if (btn) btn.textContent = 'Exit Full';
    } else {
        splitInstance.setSizes(preFullSizes || DEFAULT_SPLIT);
        isFullPreview = false;
        if (btn) btn.textContent = 'Full View';
        syncLayoutButtonsBySizes(splitInstance.getSizes());
    }
    saveCurrentSplit();
    editor.layout();
}

function runProject() {
    const frame = document.getElementById('output-frame');
    const consoleOut = document.getElementById('console-output');
    consoleOut.innerHTML = '';
    const jsxSource = normalizeJsxSource(codes.jsx);
    const cssSource = codes.css || '';
    const jsxLiteral = JSON.stringify(jsxSource);
    const cssLiteral = JSON.stringify(cssSource);

    const source = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                html, body, #root {
                    width: 100%;
                    height: 100%;
                    min-height: 100%;
                    margin: 0;
                    padding: 0;
                }
                * { box-sizing: border-box; }
            </style>
            <style id="__user_css"></style>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>
            <div id="root"></div>
            <script>
                (function () {
                    window.__USER_JSX__ = ${jsxLiteral};
                    window.__USER_CSS__ = ${cssLiteral};
                    const userStyle = document.getElementById('__user_css');
                    if (userStyle) userStyle.textContent = window.__USER_CSS__ || '';

                    const forward = (type, args) => {
                        try {
                            window.parent.postMessage({ type, msg: args.map(String).join(' ') }, '*');
                        } catch {}
                    };
                    const isIgnoredWarning = (msg) => {
                        if (!msg) return false;
                        return msg.includes('You are using the in-browser Babel transformer');
                    };
                    const _log = console.log.bind(console);
                    const _warn = console.warn.bind(console);
                    const _error = console.error.bind(console);
                    console.log = (...args) => { _log(...args); forward('log', args); };
                    console.warn = (...args) => {
                        const msg = args.map(String).join(' ');
                        if (isIgnoredWarning(msg)) return;
                        _warn(...args);
                        forward('warn', args);
                    };
                    console.error = (...args) => { _error(...args); forward('error', args); };
                    window.addEventListener('error', (ev) => {
                        const msg = ev && ev.message ? String(ev.message) : 'Runtime error';
                        const filename = ev && ev.filename ? String(ev.filename) : '';
                        const line = ev && ev.lineno ? String(ev.lineno) : '';
                        const col = ev && ev.colno ? String(ev.colno) : '';
                        const where = filename
                            ? ' (' + filename + (line ? ':' + line : '') + (col ? ':' + col : '') + ')'
                            : '';
                        const stack = ev && ev.error && ev.error.stack ? String(ev.error.stack) : '';

                        // Cross-origin script failures frequently surface as plain "Script error." with no debug data.
                        if (msg === 'Script error.' && !filename && !stack) {
                            forward('error', ['Script error. No details from browser (possible CDN/CORS/network issue).']);
                            return;
                        }
                        forward('error', [stack || (msg + where)]);
                    });
                    window.addEventListener('unhandledrejection', (ev) => {
                        const reason = ev && ev.reason ? ev.reason : 'Unhandled promise rejection';
                        const detail = reason && reason.stack ? reason.stack : String(reason);
                        forward('error', [detail]);
                    });

                    // Reuse the same React root per container to avoid duplicate createRoot warnings.
                    const reactDomClient = window.ReactDOMClient || window.ReactDOM;
                    if (reactDomClient && typeof reactDomClient.createRoot === 'function') {
                        const nativeCreateRoot = reactDomClient.createRoot.bind(reactDomClient);
                        const patchedCreateRoot = (container, options) => {
                            if (!container) return nativeCreateRoot(container, options);
                            if (container.__jsxStudioRoot) return container.__jsxStudioRoot;
                            const root = nativeCreateRoot(container, options);
                            container.__jsxStudioRoot = root;
                            return root;
                        };
                        reactDomClient.createRoot = patchedCreateRoot;
                        if (window.ReactDOM) window.ReactDOM.createRoot = patchedCreateRoot;
                        if (window.ReactDOMClient) window.ReactDOMClient.createRoot = patchedCreateRoot;
                        window.__jsxStudioGetRoot = (container) => patchedCreateRoot(container);
                    }
                })();
            <\/script>
            <script>
                try {
                    const { useState, useEffect, useMemo, useCallback, useRef, useReducer, useContext } = React;
                    const transformed = Babel.transform(window.__USER_JSX__ || '', {
                        presets: ['env', 'react']
                    }).code;
                    (new Function(transformed))();
                    const AppCandidate =
                        (typeof App !== 'undefined' && App) ||
                        (typeof window !== 'undefined' && window.App) ||
                        (typeof window !== 'undefined' && window.__defaultExport);

                    if (AppCandidate) {
                        const rootContainer = document.getElementById('root');
                        const root = window.__jsxStudioGetRoot
                            ? window.__jsxStudioGetRoot(rootContainer)
                            : ReactDOM.createRoot(rootContainer);
                        root.render(React.createElement(AppCandidate));
                    } else if (!document.getElementById('root').hasChildNodes()) {
                        throw new Error('Define un componente App o usa export default App.');
                    }
                } catch (err) {
                    const detail = err && err.stack ? err.stack : (err && err.message ? err.message : String(err));
                    window.parent.postMessage({type: 'error', msg: detail}, '*');
                }
            <\/script>
        </body>
        </html>
    `;
    frame.srcdoc = source;
}

function normalizeJsxSource(source) {
    if (!source) return '';
    return source
        .replace(/^\s*import\s+React\s*,\s*\{([^}]+)\}\s+from\s+['"]react['"];?\s*$/gm, 'const {$1} = React;')
        .replace(/^\s*import\s+\*\s+as\s+React\s+from\s+['"]react['"];?\s*$/gm, 'const React = window.React;')
        .replace(/^\s*import\s+React\s+from\s+['"]react['"];?\s*$/gm, 'const React = window.React;')
        .replace(/^\s*import\s+\{([^}]+)\}\s+from\s+['"]react['"];?\s*$/gm, 'const {$1} = React;')
        .replace(/^\s*import\s+ReactDOM\s+from\s+['"]react-dom\/client['"];?\s*$/gm, 'const ReactDOM = window.ReactDOM;')
        .replace(/^\s*import\s+\{([^}]+)\}\s+from\s+['"]react-dom\/client['"];?\s*$/gm, 'const {$1} = window.ReactDOM;')
        .replace(/^\s*import\s+.+?;?\s*$/gm, '')
        .replace(/^\s*export\s+function\s+/gm, 'function ')
        .replace(/^\s*export\s+const\s+/gm, 'const ')
        .replace(/^\s*export\s+class\s+/gm, 'class ')
        .replace(/^\s*export\s+default\s+/gm, 'window.__defaultExport = ')
        .replace(/^\s*export\s+\{[^}]+\};?\s*$/gm, '');
}

// Captura de errores del Iframe
window.addEventListener('message', (e) => {
    const out = document.getElementById('console-output');
    if (!out || !e.data || !e.data.type) return;
    const msg = String(e.data.msg || '');

    if (e.data.type === 'error') {
        out.innerHTML += `<div style="color: #f48771;">[Error]: ${msg}</div>`;
        return;
    }
    if (e.data.type === 'warn') {
        if (msg.includes('You are using the in-browser Babel transformer')) return;
        out.innerHTML += `<div style="color: #cca700;">[Warn]: ${msg}</div>`;
        return;
    }
    if (e.data.type === 'log') {
        out.innerHTML += `<div style="color: #9cdcfe;">[Log]: ${msg}</div>`;
    }
});

function switchFile(file, evt) {
    currentFile = file;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (evt && evt.target) evt.target.classList.add('active');
    editor.setValue(codes[file]);
    monaco.editor.setModelLanguage(editor.getModel(), file === 'jsx' ? 'javascript' : 'css');
}
