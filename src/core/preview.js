function normalizeReactSource(source) {
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

export function resolveRuntimeMode(mode, codes) {
    if (mode === 'auto') {
        if ((codes.js || '').trim()) return 'vanilla';
        if ((codes.jsx || '').trim()) return 'jsx';
        if ((codes.tsx || '').trim()) return 'tsx';
        return 'vanilla';
    }
    return mode;
}

function getScriptForMode(runtimeMode, codes) {
    if (runtimeMode === 'tsx') return normalizeReactSource(codes.tsx || '');
    if (runtimeMode === 'jsx') return normalizeReactSource(codes.jsx || '');
    return codes.js || '';
}

export function renderProject(frame, workspace, options = {}) {
    const runtimeMode = options.forcedRuntimeMode || resolveRuntimeMode(workspace.mode, workspace.codes);
    const cssSource = workspace.codes.css || '';
    const htmlSource = (workspace.codes.html || '').trim() || '<div id="root"></div>';
    const scriptSource = getScriptForMode(runtimeMode, workspace.codes);

    const modeLiteral = JSON.stringify(runtimeMode);
    const scriptLiteral = JSON.stringify(scriptSource);
    const cssLiteral = JSON.stringify(cssSource);
    const htmlLiteral = JSON.stringify(htmlSource);

    frame.srcdoc = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        html, body { width: 100%; min-height: 100%; margin: 0; padding: 0; }
        * { box-sizing: border-box; }
    </style>
    <style id="__user_css"></style>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="__user_html"></div>
    <script>
        (function () {
            window.__RUNTIME_MODE__ = ${modeLiteral};
            window.__USER_SCRIPT__ = ${scriptLiteral};
            window.__USER_CSS__ = ${cssLiteral};
            window.__USER_HTML__ = ${htmlLiteral};

            const userStyle = document.getElementById('__user_css');
            if (userStyle) userStyle.textContent = window.__USER_CSS__ || '';

            const htmlContainer = document.getElementById('__user_html');
            if (htmlContainer) htmlContainer.innerHTML = window.__USER_HTML__ || '<div id="root"></div>';

            const post = (type, args) => {
                try {
                    const msg = args.map((item) => {
                        if (typeof item === 'string') return item;
                        try { return JSON.stringify(item); } catch { return String(item); }
                    }).join(' ');
                    window.parent.postMessage({ type, msg }, '*');
                } catch {}
            };

            const ignored = (msg) => msg && msg.includes('in-browser Babel transformer');
            const log = console.log.bind(console);
            const warn = console.warn.bind(console);
            const error = console.error.bind(console);

            console.log = (...args) => { log(...args); post('log', args); };
            console.warn = (...args) => {
                const msg = args.map(String).join(' ');
                if (ignored(msg)) return;
                warn(...args);
                post('warn', args);
            };
            console.error = (...args) => { error(...args); post('error', args); };

            window.addEventListener('error', (ev) => {
                const stack = ev && ev.error && ev.error.stack ? String(ev.error.stack) : '';
                const msg = ev && ev.message ? String(ev.message) : 'Runtime error';
                post('error', [stack || msg]);
            });

            window.addEventListener('unhandledrejection', (ev) => {
                const reason = ev && ev.reason ? ev.reason : 'Unhandled promise rejection';
                const detail = reason && reason.stack ? reason.stack : String(reason);
                post('error', [detail]);
            });
        })();
    </script>
    <script>
        try {
            if (window.__RUNTIME_MODE__ === 'vanilla') {
                (new Function(window.__USER_SCRIPT__ || ''))();
            } else {
                let transformed = '';
                const babelOptions = window.__RUNTIME_MODE__ === 'tsx'
                    ? {
                        filename: 'App.tsx',
                        sourceType: 'script',
                        presets: [
                            ['typescript', { isTSX: true, allExtensions: true }],
                            'react',
                            'env'
                        ]
                    }
                    : {
                        filename: 'App.jsx',
                        sourceType: 'script',
                        presets: ['env', 'react']
                    };

                try {
                    transformed = Babel.transform(window.__USER_SCRIPT__ || '', babelOptions).code || '';
                } catch (babelErr) {
                    if (window.__RUNTIME_MODE__ === 'tsx') {
                        // Fallback for environments that reject preset option objects.
                        transformed = Babel.transform(window.__USER_SCRIPT__ || '', {
                            filename: 'App.tsx',
                            sourceType: 'script',
                            presets: ['env', 'react', 'typescript']
                        }).code || '';
                    } else {
                        throw babelErr;
                    }
                }

                if (!transformed.trim()) {
                    throw new Error('Babel no pudo transpilar el codigo del modo actual.');
                }
                (new Function(transformed))();

                const AppCandidate =
                    (typeof App !== 'undefined' && App) ||
                    (typeof Welcome !== 'undefined' && Welcome) ||
                    (typeof window !== 'undefined' && window.App) ||
                    (typeof window !== 'undefined' && window.__defaultExport);

                if (AppCandidate) {
                    let rootContainer = document.getElementById('root');
                    if (!rootContainer) {
                        rootContainer = document.createElement('div');
                        rootContainer.id = 'root';
                        document.body.appendChild(rootContainer);
                    }
                    if (ReactDOM && typeof ReactDOM.createRoot === 'function') {
                        const root = ReactDOM.createRoot(rootContainer);
                        root.render(React.createElement(AppCandidate));
                    } else if (ReactDOM && typeof ReactDOM.render === 'function') {
                        ReactDOM.render(React.createElement(AppCandidate), rootContainer);
                    } else {
                        throw new Error('ReactDOM no disponible para renderizar el componente.');
                    }
                }
            }
        } catch (err) {
            const detail = err && err.stack ? err.stack : String(err);
            window.parent.postMessage({ type: 'error', msg: detail }, '*');
        }
    </script>
</body>
</html>`;
}

export function createPreviewMessageHandler(frame, appendConsoleLine) {
    return (event) => {
        if (event.source !== frame.contentWindow) return;
        const data = event.data || {};
        if (!data.type || typeof data.msg !== 'string') return;

        if (data.type === 'log' || data.type === 'warn' || data.type === 'error') {
            appendConsoleLine(data.type, data.msg);
        }
    };
}

export function buildDownloadHtml(workspace) {
    const runtimeMode = resolveRuntimeMode(workspace.mode, workspace.codes);
    const css = workspace.codes.css || '';
    const html = (workspace.codes.html || '').trim() || '<div id="root"></div>';

    if (runtimeMode === 'vanilla') {
        const js = workspace.codes.js || '';
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OpnCode Export</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`;
    }

    const source = runtimeMode === 'tsx'
        ? normalizeReactSource(workspace.codes.tsx || '')
        : normalizeReactSource(workspace.codes.jsx || '');

    const presets = runtimeMode === 'tsx' ? 'env,react,typescript' : 'env,react';
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OpnCode Export</title>
  <style>${css}</style>
  <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
</head>
<body>
  ${html}
  <script type="text/babel" data-presets="${presets}">${source}<\/script>
</body>
</html>`;
}
