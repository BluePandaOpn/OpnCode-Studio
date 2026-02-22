# OpnCode Studio

Playground local para React + JSX con Monaco Editor, preview en vivo y consola integrada.

## Ejecucion
Abre `index.html` en el navegador.

## Atajos
- `Ctrl + Enter`: ejecutar preview
- `Ctrl + S`: descargar export HTML

## Mejoras incluidas
- Arquitectura modular en `src/core`, `src/ui`, `src/styles`
- Persistencia de workspace y layout
- Fallback si `Split.js` no carga
- Auto-refresh de preview cada 5 segundos
- Reset completo del workspace
- Panel principal con 4 modos: `HTML/CSS/JS`, `JSX`, `TSX`, `Auto`
- Sistema avanzado de almacenamiento: proyectos, proyecto activo y snapshots
- Casos rapidos por modo (`Quick Case`) para generar bases de proyecto en segundos

Ver estructura detallada en `docs/PROJECT_STRUCTURE.md`.
