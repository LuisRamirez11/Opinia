import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Encuesta from './pages/Encuesta';
import Exportar from './pages/Exportar';

function App() {
  const location = useLocation();

  return (
    <>
      <nav className="opinia-nav">
        <div className="container">
          <div className="brand">
            <div className="brand-icon">O</div>
            <span>Opinia</span>
          </div>
          <ul>
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''}
              >
                📋 Realizar Encuesta
              </Link>
            </li>
            <li>
              <Link 
                to="/exportar"
                className={location.pathname === '/exportar' ? 'active' : ''}
              >
                📊 Reportes
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container opinia-main">
        <Routes>
          <Route path="/" element={<Encuesta />} />
          <Route path="/exportar" element={<Exportar />} />
        </Routes>
      </main>
    </>
  );
}

export default App;