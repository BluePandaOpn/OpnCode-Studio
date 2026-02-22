function markLayoutButton(mode) {
    const map = {
        editor: 'layout-editor-btn',
        balanced: 'layout-balanced-btn',
        preview: 'layout-preview-btn'
    };

    Object.values(map).forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.classList.remove('active');
    });

    const active = map[mode] ? document.getElementById(map[mode]) : null;
    if (active) active.classList.add('active');
}

function inferModeBySizes(sizes) {
    const [left, right] = sizes;
    if (right >= 70) return 'preview';
    if (left >= 70) return 'editor';
    return 'balanced';
}

export function createLayout({ initialSizes, onSizesChange, onEditorLayout }) {
    let splitInstance = null;
    let isFullPreview = false;
    let preFullSizes = initialSizes;
    const editorPane = document.getElementById('editor-pane');
    const previewPane = document.getElementById('preview-pane');
    let fallbackSizes = [...initialSizes];

    const applyFallbackSizes = (sizes) => {
        if (!editorPane || !previewPane) return;
        const [left, right] = sizes;
        editorPane.style.flex = `0 0 ${left}%`;
        previewPane.style.flex = `0 0 ${right}%`;
    };

    const getCurrentSizes = () => (splitInstance ? splitInstance.getSizes() : fallbackSizes);

    const setSizes = (sizes) => {
        if (splitInstance) {
            splitInstance.setSizes(sizes);
            return;
        }
        fallbackSizes = [...sizes];
        applyFallbackSizes(fallbackSizes);
    };

    if (typeof window.Split !== 'function') {
        applyFallbackSizes(fallbackSizes);
    } else {
        splitInstance = window.Split(['#editor-pane', '#preview-pane'], {
            direction: 'horizontal',
            sizes: initialSizes,
            minSize: [0, 220],
            gutterSize: 8,
            onDrag: onEditorLayout,
            onDragEnd: (sizes) => {
                onSizesChange(sizes);
                markLayoutButton(inferModeBySizes(sizes));
            }
        });
    }

    markLayoutButton(inferModeBySizes(initialSizes));

    const setMode = (mode) => {
        if (mode === 'editor') {
            setSizes([90, 10]);
        } else if (mode === 'balanced') {
            setSizes([50, 50]);
        } else {
            setSizes([20, 80]);
        }

        isFullPreview = false;
        markLayoutButton(mode);
        onSizesChange(getCurrentSizes());
        onEditorLayout();
    };

    const setPreviewWidth = (previewPercent) => {
        const clamped = Math.max(20, Math.min(100, previewPercent));
        setSizes([100 - clamped, clamped]);
        isFullPreview = false;
        onSizesChange(getCurrentSizes());
        markLayoutButton(inferModeBySizes(getCurrentSizes()));
        onEditorLayout();
    };

    const growPreview = () => {
        const current = getCurrentSizes();
        setPreviewWidth(current[1] + 10);
    };

    const shrinkPreview = () => {
        const current = getCurrentSizes();
        setPreviewWidth(current[1] - 10);
    };

    const toggleFullPreview = () => {
        if (!isFullPreview) {
            preFullSizes = getCurrentSizes();
            setSizes([0, 100]);
            isFullPreview = true;
            markLayoutButton('preview');
        } else {
            setSizes(preFullSizes || initialSizes);
            isFullPreview = false;
            markLayoutButton(inferModeBySizes(getCurrentSizes()));
        }

        onSizesChange(getCurrentSizes());
        onEditorLayout();
        return isFullPreview;
    };

    return {
        setMode,
        growPreview,
        shrinkPreview,
        toggleFullPreview
    };
}
