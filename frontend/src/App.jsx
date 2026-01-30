import { Routes, Route } from 'react-router-dom';
import Encuesta from './pages/Encuesta';


function App() {

  return (
    <>
      <nav className="opinia-nav">
        <div className="container">
          <div className="brand">
            <div className="brand-icon">O</div>
            <span>Opinia</span>
          </div>
          <ul>

          </ul>
        </div>
      </nav>
      <main className="container opinia-main">
        <Routes>
          <Route path="/" element={<Encuesta />} />
        </Routes>
      </main>
    </>
  );
}

export default App;