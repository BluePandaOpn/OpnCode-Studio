export const STORAGE_KEYS = {
    workspace: 'opncode.workspace.v3',
    splitSizes: 'opncode.splitSizes.v3',
    projects: 'opncode.projects.v1',
    activeProjectId: 'opncode.activeProjectId.v1'
};

export const MODE_OPTIONS = [
    {
        id: 'vanilla',
        label: 'Preview HTML/CSS/JS',
        primaryKey: 'js',
        primaryLabel: 'app.js'
    },
    {
        id: 'jsx',
        label: 'JSX/CSS/HTML',
        primaryKey: 'jsx',
        primaryLabel: 'App.jsx'
    },
    {
        id: 'tsx',
        label: 'TSX/CSS/HTML',
        primaryKey: 'tsx',
        primaryLabel: 'App.tsx'
    },
    {
        id: 'auto',
        label: 'Auto Smart Mode',
        primaryKey: 'js',
        primaryLabel: 'app.js (auto)'
    }
];

export const DEFAULT_SPLIT = [45, 55];
export const PREVIEW_AUTO_REFRESH_MS = 5000;

export const DEFAULT_CODES = {
    js: `const root = document.getElementById('root');
let count = 0;

function render() {
  root.innerHTML = \`
    <main class="app-root">
      <h1>OpnCode Studio</h1>
      <p>Modo HTML/CSS/JS activo.</p>
      <button id="btn-counter">Clicks: \${count}</button>
    </main>
  \`;

  const btn = document.getElementById('btn-counter');
  if (btn) {
    btn.addEventListener('click', () => {
      count += 1;
      render();
    });
  }
}

render();`,
    jsx: `const Welcome = () => {
  return (
    <div style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bienvenido a OpnCode Studios</h1>
        <p style={styles.subtitle}>
          Donde las ideas toman forma, el codigo respira y la creatividad se vuelve real.
        </p>

        <button style={styles.btn}>Entrar al Estudio</button>
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
    cursor: 'pointer'
  },
  footer: {
    marginTop: '60px',
    fontSize: '13px',
    color: '#86868b'
  }
};

export default Welcome;`,
    tsx: `type StatsProps = { title: string; value: number };

const Stat = ({ title, value }: StatsProps) => (
  <article className="stat-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </article>
);

const App = () => {
  const items: StatsProps[] = [
    { title: 'Usuarios', value: 1240 },
    { title: 'Ventas', value: 485 },
    { title: 'Tickets', value: 91 }
  ];

  return (
    <main className="tsx-main">
      <h1>Modo TSX</h1>
      <section className="stat-grid">
        {items.map((item) => (
          <Stat key={item.title} title={item.title} value={item.value} />
        ))}
      </section>
    </main>
  );
};

export default App;`,
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
}

.tsx-main { padding: 24px; font-family: system-ui, sans-serif; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.stat-card { border: 1px solid #d1d5db; border-radius: 12px; padding: 12px; }`,
    html: `<div id="root"></div>`
};

export const DEFAULT_WORKSPACE = {
    mode: 'jsx',
    codes: DEFAULT_CODES,
    currentTab: 'primary',
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
            ...DEFAULT_CODES,
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
.card p { margin: 0; font-size: 22px; font-weight: 700; }`
        }
    },
    landing: {
        label: 'Landing',
        codes: {
            ...DEFAULT_CODES,
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
button { margin-top: 14px; border: 0; border-radius: 12px; padding: 10px 18px; background: #111827; color: #fff; font-weight: 700; }`
        }
    }
};

export function getModeConfig(mode) {
    return MODE_OPTIONS.find((item) => item.id === mode) || MODE_OPTIONS[1];
}

export const QUICK_CASES = {
    vanilla: [
        {
            id: 'todo',
            label: 'ToDo App',
            code: `const root = document.getElementById('root');
const todos = ['Aprender OpnCode', 'Construir una app'];

function render() {
  root.innerHTML = \`
    <main class="app-root">
      <h1>ToDo Rapido</h1>
      <form id="todo-form">
        <input id="todo-input" placeholder="Nueva tarea..." />
        <button type="submit">Agregar</button>
      </form>
      <ul id="todo-list">
        \${todos.map((item) => '<li>' + item + '</li>').join('')}
      </ul>
    </main>
  \`;

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    todos.push(value);
    render();
  });
}

render();`
        },
        {
            id: 'gallery',
            label: 'Image Gallery',
            code: `const root = document.getElementById('root');
const images = [
  'https://picsum.photos/seed/1/400/260',
  'https://picsum.photos/seed/2/400/260',
  'https://picsum.photos/seed/3/400/260'
];

root.innerHTML = \`
  <main class="app-root">
    <h1>Galeria Rapida</h1>
    <section class="gallery">
      \${images.map((src) => '<img src=\"' + src + '\" alt=\"img\" />').join('')}
    </section>
  </main>
\`;`
        }
    ],
    jsx: [
        {
            id: 'pricing',
            label: 'Pricing Cards',
            code: `const plans = [
  { name: 'Starter', price: '$9' },
  { name: 'Pro', price: '$29' },
  { name: 'Team', price: '$79' }
];

const App = () => (
  <main className="tsx-main">
    <h1>Planes</h1>
    <section className="stat-grid">
      {plans.map((plan) => (
        <article className="stat-card" key={plan.name}>
          <h3>{plan.name}</h3>
          <p>{plan.price}</p>
        </article>
      ))}
    </section>
  </main>
);`
        },
        {
            id: 'faq',
            label: 'FAQ Section',
            code: `const faqs = [
  { q: 'Que incluye?', a: 'Editor, preview y almacenamiento.' },
  { q: 'Necesita Node?', a: 'No, corre en navegador.' }
];

const App = () => (
  <main className="tsx-main">
    <h1>FAQ</h1>
    {faqs.map((item) => (
      <article className="stat-card" key={item.q}>
        <h3>{item.q}</h3>
        <p>{item.a}</p>
      </article>
    ))}
  </main>
);`
        }
    ],
    tsx: [
        {
            id: 'kanban',
            label: 'Mini Kanban',
            code: `type Task = { id: number; title: string; status: 'todo' | 'doing' | 'done' };

const tasks: Task[] = [
  { id: 1, title: 'Diseñar UI', status: 'todo' },
  { id: 2, title: 'Crear componentes', status: 'doing' },
  { id: 3, title: 'Publicar', status: 'done' }
];

const Column = ({ title, items }: { title: string; items: Task[] }) => (
  <article className="stat-card">
    <h3>{title}</h3>
    <ul>
      {items.map((task) => <li key={task.id}>{task.title}</li>)}
    </ul>
  </article>
);

const App = () => (
  <main className="tsx-main">
    <h1>Kanban TSX</h1>
    <section className="stat-grid">
      <Column title="ToDo" items={tasks.filter((t) => t.status === 'todo')} />
      <Column title="Doing" items={tasks.filter((t) => t.status === 'doing')} />
      <Column title="Done" items={tasks.filter((t) => t.status === 'done')} />
    </section>
  </main>
);

export default App;`
        },
        {
            id: 'stats',
            label: 'Stats Board',
            code: `type Metric = { label: string; value: number };
const metrics: Metric[] = [
  { label: 'Usuarios', value: 1280 },
  { label: 'Pedidos', value: 312 },
  { label: 'Tickets', value: 42 }
];

const App = () => (
  <main className="tsx-main">
    <h1>Estadisticas</h1>
    <section className="stat-grid">
      {metrics.map((item) => (
        <article className="stat-card" key={item.label}>
          <h3>{item.label}</h3>
          <p>{item.value}</p>
        </article>
      ))}
    </section>
  </main>
);

export default App;`
        }
    ]
};

export function getQuickCasesByMode(mode) {
    if (mode === 'auto') return QUICK_CASES.vanilla;
    return QUICK_CASES[mode] || QUICK_CASES.jsx;
}

export const GOAL_OPTIONS = [
    { id: 'landing', label: 'Landing Completa' },
    { id: 'dashboard', label: 'Dashboard Admin' },
    { id: 'ecommerce', label: 'Ecommerce Store' },
    { id: 'portfolio', label: 'Portfolio Pro' }
];

const GOAL_PRESETS = {
    landing: {
        css: `.page { min-height: 100vh; font-family: system-ui, sans-serif; color: #0f172a; background: linear-gradient(145deg,#fff7ed,#ffedd5 35%,#f8fafc); padding: 28px; }
.hero { max-width: 860px; margin: 0 auto; text-align: center; padding-top: 80px; }
.chip { display: inline-block; border-radius: 999px; background: #111827; color: #fff; padding: 6px 12px; font-size: 12px; }
h1 { font-size: clamp(34px, 7vw, 62px); margin: 16px 0 12px; line-height: 1.05; }
p { color: #475569; font-size: 18px; max-width: 700px; margin: 0 auto; }
.cta { margin-top: 22px; border: 0; background: #ff6b35; color: #fff; border-radius: 12px; padding: 12px 20px; font-weight: 700; }
.grid { margin: 40px auto 0; max-width: 900px; display: grid; gap: 12px; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); }
.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; }`,
        html: `<div id="root"></div>`,
        vanilla: `const root = document.getElementById('root');
root.innerHTML = [
  '<main class="page">',
  '  <section class="hero">',
  '    <span class="chip">Nueva plataforma</span>',
  '    <h1>Crea productos digitales mas rapido</h1>',
  '    <p>Plantilla completa de landing con hero, cards y llamado a la accion.</p>',
  '    <button class="cta">Comenzar Ahora</button>',
  '  </section>',
  '  <section class="grid">',
  '    <article class="card"><h3>Rapido</h3><p>Construccion inmediata.</p></article>',
  '    <article class="card"><h3>Escalable</h3><p>Arquitectura modular.</p></article>',
  '    <article class="card"><h3>Intuitivo</h3><p>UX orientada a productividad.</p></article>',
  '  </section>',
  '</main>'
].join('');`,
        jsx: `const App = () => (
  <main className="page">
    <section className="hero">
      <span className="chip">Nueva plataforma</span>
      <h1>Crea productos digitales mas rapido</h1>
      <p>Plantilla completa de landing con hero, cards y llamado a la accion.</p>
      <button className="cta">Comenzar Ahora</button>
    </section>
    <section className="grid">
      {['Rapido', 'Escalable', 'Intuitivo'].map((item) => (
        <article className="card" key={item}>
          <h3>{item}</h3>
          <p>Bloque editable para tu producto.</p>
        </article>
      ))}
    </section>
  </main>
);`,
        tsx: `type Feature = { title: string; detail: string };
const features: Feature[] = [
  { title: 'Rapido', detail: 'Construccion inmediata.' },
  { title: 'Escalable', detail: 'Arquitectura modular.' },
  { title: 'Intuitivo', detail: 'UX productiva.' }
];

const App = () => (
  <main className="page">
    <section className="hero">
      <span className="chip">Nueva plataforma</span>
      <h1>Crea productos digitales mas rapido</h1>
      <p>Plantilla completa de landing con hero, cards y llamado a la accion.</p>
      <button className="cta">Comenzar Ahora</button>
    </section>
    <section className="grid">
      {features.map((item) => (
        <article className="card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  </main>
);

export default App;`
    },
    dashboard: {
        css: `.dash { padding: 24px; font-family: system-ui, sans-serif; background: #0b1220; min-height: 100vh; color: #e2e8f0; }
.stats { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); }
.stat { background: #111b31; border: 1px solid #23314e; border-radius: 12px; padding: 14px; }
.table { margin-top: 16px; width: 100%; border-collapse: collapse; }
.table td,.table th { border-bottom: 1px solid #23314e; padding: 8px; text-align: left; }`,
        html: `<div id="root"></div>`,
        vanilla: `const root = document.getElementById('root');
const stats = [
  { title: 'Ventas', value: '$42,100' },
  { title: 'Usuarios', value: '1,820' },
  { title: 'Conversion', value: '5.2%' }
];
root.innerHTML = '<main class="dash"><h1>Dashboard</h1><section class="stats">'
  + stats.map((x) => '<article class="stat"><h3>' + x.title + '</h3><p>' + x.value + '</p></article>').join('')
  + '</section><table class="table"><tr><th>Canal</th><th>Valor</th></tr><tr><td>Web</td><td>63%</td></tr><tr><td>Ads</td><td>24%</td></tr><tr><td>Email</td><td>13%</td></tr></table></main>';`,
        jsx: `const stats = [
  { title: 'Ventas', value: '$42,100' },
  { title: 'Usuarios', value: '1,820' },
  { title: 'Conversion', value: '5.2%' }
];

const App = () => (
  <main className="dash">
    <h1>Dashboard</h1>
    <section className="stats">
      {stats.map((item) => (
        <article className="stat" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.value}</p>
        </article>
      ))}
    </section>
  </main>
);`,
        tsx: `type Stat = { title: string; value: string };
const stats: Stat[] = [
  { title: 'Ventas', value: '$42,100' },
  { title: 'Usuarios', value: '1,820' },
  { title: 'Conversion', value: '5.2%' }
];

const App = () => (
  <main className="dash">
    <h1>Dashboard</h1>
    <section className="stats">
      {stats.map((item) => (
        <article className="stat" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.value}</p>
        </article>
      ))}
    </section>
  </main>
);

export default App;`
    },
    ecommerce: {
        css: `.shop { padding: 24px; font-family: system-ui, sans-serif; background: #f8fafc; min-height: 100vh; }
.products { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); }
.product { border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; padding: 12px; }
.buy { border: 0; background: #0f172a; color: #fff; border-radius: 10px; padding: 8px 12px; }`,
        html: `<div id="root"></div>`,
        vanilla: `const items = [
  { name: 'Teclado', price: '$59' },
  { name: 'Mouse', price: '$35' },
  { name: 'Audifonos', price: '$89' }
];
document.getElementById('root').innerHTML = '<main class="shop"><h1>Tienda</h1><section class="products">'
 + items.map((x) => '<article class="product"><h3>' + x.name + '</h3><p>' + x.price + '</p><button class="buy">Comprar</button></article>').join('')
 + '</section></main>';`,
        jsx: `const items = [
  { name: 'Teclado', price: '$59' },
  { name: 'Mouse', price: '$35' },
  { name: 'Audifonos', price: '$89' }
];

const App = () => (
  <main className="shop">
    <h1>Tienda</h1>
    <section className="products">
      {items.map((item) => (
        <article className="product" key={item.name}>
          <h3>{item.name}</h3>
          <p>{item.price}</p>
          <button className="buy">Comprar</button>
        </article>
      ))}
    </section>
  </main>
);`,
        tsx: `type Product = { name: string; price: string };
const items: Product[] = [
  { name: 'Teclado', price: '$59' },
  { name: 'Mouse', price: '$35' },
  { name: 'Audifonos', price: '$89' }
];

const App = () => (
  <main className="shop">
    <h1>Tienda</h1>
    <section className="products">
      {items.map((item) => (
        <article className="product" key={item.name}>
          <h3>{item.name}</h3>
          <p>{item.price}</p>
          <button className="buy">Comprar</button>
        </article>
      ))}
    </section>
  </main>
);

export default App;`
    },
    portfolio: {
        css: `.folio { min-height: 100vh; padding: 26px; background: #0f172a; color: #e2e8f0; font-family: system-ui, sans-serif; }
.hero-name { font-size: clamp(34px,7vw,60px); margin: 0; }
.work-grid { margin-top: 18px; display: grid; gap: 10px; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); }
.work-item { background: #16243b; border: 1px solid #273a5a; border-radius: 12px; padding: 12px; }`,
        html: `<div id="root"></div>`,
        vanilla: `document.getElementById('root').innerHTML = [
  '<main class="folio">',
  '<p>Portfolio</p>',
  '<h1 class="hero-name">Tu Nombre</h1>',
  '<p>Frontend Developer + Product Builder</p>',
  '<section class="work-grid">',
  '<article class="work-item"><h3>Proyecto A</h3><p>Landing conversiva</p></article>',
  '<article class="work-item"><h3>Proyecto B</h3><p>Dashboard analytics</p></article>',
  '<article class="work-item"><h3>Proyecto C</h3><p>Ecommerce modular</p></article>',
  '</section>',
  '</main>'
].join('');`,
        jsx: `const works = [
  { name: 'Proyecto A', detail: 'Landing conversiva' },
  { name: 'Proyecto B', detail: 'Dashboard analytics' },
  { name: 'Proyecto C', detail: 'Ecommerce modular' }
];

const App = () => (
  <main className="folio">
    <p>Portfolio</p>
    <h1 className="hero-name">Tu Nombre</h1>
    <p>Frontend Developer + Product Builder</p>
    <section className="work-grid">
      {works.map((item) => (
        <article className="work-item" key={item.name}>
          <h3>{item.name}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  </main>
);`,
        tsx: `type Work = { name: string; detail: string };
const works: Work[] = [
  { name: 'Proyecto A', detail: 'Landing conversiva' },
  { name: 'Proyecto B', detail: 'Dashboard analytics' },
  { name: 'Proyecto C', detail: 'Ecommerce modular' }
];

const App = () => (
  <main className="folio">
    <p>Portfolio</p>
    <h1 className="hero-name">Tu Nombre</h1>
    <p>Frontend Developer + Product Builder</p>
    <section className="work-grid">
      {works.map((item) => (
        <article className="work-item" key={item.name}>
          <h3>{item.name}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  </main>
);

export default App;`
    }
};

export function getGoalPreset(mode, goalId) {
    const preset = GOAL_PRESETS[goalId] || GOAL_PRESETS.landing;
    const runtime = mode === 'auto' ? 'vanilla' : mode;
    return {
        primary: preset[runtime] || preset.jsx,
        css: preset.css,
        html: preset.html
    };
}
