# Estructura del Proyecto OpnCode

## Raiz
- `index.html`: shell de la interfaz.
- `app.css`: puente de compatibilidad (importa `src/styles/app.css`).
- `legacy/`: archivos antiguos preservados.

## Codigo fuente (`src/`)
- `src/main.js`: orquestacion general de la app.
- `src/core/`: logica principal.
  - `constants.js`: valores base, defaults y labels.
  - `storage.js`: persistencia en `localStorage`.
  - `editor.js`: inicializacion y manejo de Monaco.
  - `layout.js`: split/fallback y modos de layout.
  - `preview.js`: render en iframe + captura de consola.
- `src/ui/`: helpers de interfaz DOM.
  - `dom.js`: estado visual, consola, status bar y tabs.
- `src/styles/`: estilos de la aplicacion.
  - `app.css`

## Legacy
- `legacy/app.legacy.js`
- `legacy/interpreter.legacy.js`

## Flujo
1. `index.html` carga `src/main.js`
2. `main.js` crea editor/layout y enlaza eventos
3. Cambios de codigo -> guardado en `localStorage`
4. Preview renderiza en iframe (manual, debounce y cada 5s)
