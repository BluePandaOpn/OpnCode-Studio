export const STORAGE_KEYS = {
    workspace: 'opncode.workspace.v2',
    splitSizes: 'opncode.splitSizes.v2'
};

export const FILE_LABELS = {
    jsx: 'App.jsx',
    css: 'style.css',
    html: 'index.html'
};

export const DEFAULT_SPLIT = [45, 55];
export const PREVIEW_AUTO_REFRESH_MS = 5000;

export const DEFAULT_CODES = {
    jsx: `const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <main className="app-root">
      <h1>OpnCode Studio</h1>
      <p>Editor React + JSX en tiempo real.</p>
      <button onClick={() => setCount(count + 1)}>
        Clicks: {count}
      </button>
    </main>
  );
};`,
    css: `.app-root {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-content: center;
  gap: 12px;
  text-align: center;
  background: linear-gradient(120deg, #eef4ff 0%, #f8fafc 100%);
  color: #15243a;
}

button {
  border: 0;
  border-radius: 10px;
  padding: 10px 18px;
  background: #ff6b35;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}`,
    html: `<div id="root"></div>`
};

export const DEFAULT_WORKSPACE = {
    codes: DEFAULT_CODES,
    currentFile: 'jsx',
    consoleHidden: false
};

export const TEMPLATES = {
    starter: {
        label: 'Starter',
        codes: DEFAULT_CODES
    },
    dashboard: {
        label: 'Dashboard',
        codes: {
            jsx: `const data = [
  { label: 'Ventas', value: '$24,500' },
  { label: 'Usuarios', value: '1,203' },
  { label: 'Conversion', value: '4.8%' }
];

const App = () => {
  return (
    <main className="dash">
      <h1>Dashboard rapido</h1>
      <section className="grid">
        {data.map((item) => (
          <article className="card" key={item.label}>
            <h2>{item.label}</h2>
            <p>{item.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
};`,
            css: `.dash { padding: 32px; font-family: system-ui, sans-serif; background: #0f172a; min-height: 100vh; color: #e2e8f0; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
.card { background: linear-gradient(160deg, #1e293b, #0b1220); border: 1px solid #334155; border-radius: 14px; padding: 14px; }
.card h2 { margin: 0 0 8px; font-size: 14px; color: #94a3b8; }
.card p { margin: 0; font-size: 22px; font-weight: 700; }`,
            html: `<div id="root"></div>`
        }
    },
    landing: {
        label: 'Landing',
        codes: {
            jsx: `const App = () => {
  return (
    <main className="landing">
      <section className="hero">
        <p className="tag">Nueva version</p>
        <h1>Construye interfaces en segundos</h1>
        <p>Editor visual para React + JSX con preview instantaneo.</p>
        <button>Comenzar</button>
      </section>
    </main>
  );
};`,
            css: `.landing { min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at 15% 10%, #fef3c7, #fde68a 28%, #f8fafc 70%); font-family: system-ui, sans-serif; color: #1f2937; }
.hero { max-width: 640px; text-align: center; padding: 20px; }
.tag { display: inline-block; margin: 0; background: #1f2937; color: #fff; border-radius: 999px; padding: 4px 12px; font-size: 12px; }
h1 { margin: 14px 0 10px; font-size: clamp(28px, 6vw, 48px); line-height: 1.1; }
button { margin-top: 14px; border: 0; border-radius: 12px; padding: 10px 18px; background: #111827; color: #fff; font-weight: 700; }`,
            html: `<div id="root"></div>`
        }
    }
};
