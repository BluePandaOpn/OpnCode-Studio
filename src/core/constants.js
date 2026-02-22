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
    jsx: `const Welcome = () => {
  return (
    <div style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bienvenido a OpnCode Studios</h1>
        <p style={styles.subtitle}>
          Donde las ideas toman forma, el codigo respira y la creatividad se vuelve real.
        </p>

        <button style={styles.btn}>
          Entrar al Estudio
        </button>
      </div>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} OpnCode Studios - Innovacion sin limites
      </footer>
    </div>
  );
};

const styles = {
  main: {
    minHeight: '100vh',
    background: '#f5f5f7',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    textAlign: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    padding: '60px 40px',
    borderRadius: '28px',
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
    maxWidth: '600px'
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    letterSpacing: '-1.5px',
    marginBottom: '20px',
    color: '#1d1d1f'
  },
  subtitle: {
    fontSize: '20px',
    color: '#86868b',
    marginBottom: '40px',
    lineHeight: '1.5'
  },
  btn: {
    padding: '16px 32px',
    backgroundColor: '#0071e3',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, opacity 0.2s ease'
  },
  footer: {
    marginTop: '60px',
    fontSize: '13px',
    color: '#86868b'
  }
};

export default Welcome;`,
    css: `/* Estilos globales opcionales para el ejemplo Welcome */`,
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
