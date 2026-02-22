const LANGUAGE_BY_FILE = {
    jsx: 'javascript',
    css: 'css',
    html: 'html'
};

export function loadMonaco() {
    return new Promise((resolve, reject) => {
        if (typeof require === 'undefined') {
            reject(new Error('Monaco loader no disponible.'));
            return;
        }

        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], () => resolve(window.monaco), reject);
    });
}

export async function createEditor({ codes, currentFile, onCodeChange, onCodeChangeDebounced }) {
    const monaco = await loadMonaco();
    const container = document.getElementById('monaco-container');

    const editor = monaco.editor.create(container, {
        value: codes[currentFile] || '',
        language: LANGUAGE_BY_FILE[currentFile] || 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: 'JetBrains Mono',
        minimap: { enabled: true },
        folding: true,
        tabSize: 2
    });

    let debounceTimer;
    editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        onCodeChange(value);

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            onCodeChangeDebounced();
        }, 500);
    });

    const switchLanguage = (file) => {
        monaco.editor.setModelLanguage(editor.getModel(), LANGUAGE_BY_FILE[file] || 'javascript');
    };

    return {
        editor,
        switchLanguage
    };
}
