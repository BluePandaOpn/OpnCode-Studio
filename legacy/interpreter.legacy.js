/**
 * INTERPRETER.JS
 * Este archivo interpreta JSX directamente en el cliente.
 */

// 1. Definimos un componente como ejemplo de que JSX funciona
const App = () => {
    const [contador, setContador] = React.useState(0);

    const estilos = {
        container: {
            textAlign: 'center',
            fontFamily: 'sans-serif',
            background: '#1e1e1e',
            color: 'white',
            minHeight: '100vh',
            width: '100%'
        },
        boton: {
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            background: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
        }
    };

    return (
        <div style={estilos.container}>
            <h1>Intérprete JSX Activo 🚀</h1>
            <p>Este código no usa Node.js, es interpretado por Babel en el navegador.</p>
            <div style={{ margin: '20px' }}>
                <h2>Contador: {contador}</h2>
                <button 
                    style={estilos.boton} 
                    onClick={() => setContador(contador + 1)}
                >
                    Incrementar
                </button>
            </div>
        </div>
    );
};

// 2. Renderizado en el DOM (Usando React si lo incluyes, o JS nativo)
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);