import { useState, useEffect } from 'react';

// Ajusta si tu puerto es diferente
const API_URL = 'http://localhost:3000/api';

export default function Encuesta() {
  // --- ESTADOS DE DATOS ---
  const [paises, setPaises] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [preguntas, setPreguntas] = useState([]);

  // --- SELECCIONES ---
  const [selectedPais, setSelectedPais] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedSede, setSelectedSede] = useState('');
  const [respuestas, setRespuestas] = useState({});

  // --- UI ---
  const [step, setStep] = useState(1); // 1: Filtros, 2: Encuesta, 3: Fin
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Cargar Países al inicio
  useEffect(() => {
    fetch(`${API_URL}/paises`)
      .then(res => res.json())
      .then(data => setPaises(data))
      .catch(err => setError("Error conectando al servidor"));
  }, []);

  // 2. Cambio País -> Cargar Empresas
  const handlePaisChange = async (e) => {
    const id = e.target.value;
    setSelectedPais(id);
    // Resetear cascada
    setSelectedEmpresa(''); setSelectedSede(''); setEmpresas([]); setSedes([]);
    
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/empresas?pais_id=${id}`);
      const data = await res.json();
      setEmpresas(data);
    } catch (e) { setError("Error cargando empresas"); }
    finally { setLoading(false); }
  };

  // 3. Cambio Empresa -> Cargar Sedes
  const handleEmpresaChange = async (e) => {
    const id = e.target.value;
    setSelectedEmpresa(id);
    // Resetear cascada
    setSelectedSede(''); setSedes([]);

    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/sedes?empresa_id=${id}`);
      const data = await res.json();
      setSedes(data);
    } catch (e) { setError("Error cargando sedes"); }
    finally { setLoading(false); }
  };

  // 4. Empezar -> Cargar Preguntas (Requiere empresa_id según tu backend)
  const startEncuesta = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/preguntas?empresa_id=${selectedEmpresa}`);
      const data = await res.json();
      
      if (data.length === 0) {
        alert("Esta empresa no tiene preguntas configuradas.");
        setLoading(false);
        return;
      }
      
      setPreguntas(data);
      setStep(2);
    } catch (e) { setError("Error obteniendo preguntas"); }
    finally { setLoading(false); }
  };

  // 5. Enviar -> POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      sede_id: selectedSede,
      respuestas: Object.entries(respuestas).map(([pid, val]) => ({
        pregunta_id: pid,
        valor_respuesta: val // Tu backend pide 'valor_respuesta'
      }))
    };

    try {
      const res = await fetch(`${API_URL}/encuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error en el servidor');
      setStep(3);
    } catch (e) { 
      setError("Error al guardar la encuesta. Intente de nuevo."); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- VISTAS ---
  if (step === 3) return (
    <article className="opinia-card fade-in">
      <div className="opinia-success">
        <div className="icon">✅</div>
        <h2>¡Encuesta Guardada Exitosamente!</h2>
        <p>Gracias por tomarse el tiempo de compartir su opinión.</p>
        <button onClick={() => window.location.reload()}>
          Nueva Encuesta
        </button>
      </div>
    </article>
  );

  return (
    <article className="opinia-card fade-in">
      <header>
        <h2>{loading ? '⏳ Cargando...' : '📋 Evaluación de Servicio'}</h2>
      </header>

      {loading && step === 1 && (
        <div className="opinia-loading">
          <progress />
        </div>
      )}

      {error && <mark>{error}</mark>}

      {step === 1 && !loading && (
        <form>
          <label>
            <span className="step-number">1</span>
            País
            <select value={selectedPais} onChange={handlePaisChange}>
              <option value="">Seleccione un país...</option>
              {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </label>

          <label>
            <span className="step-number">2</span>
            Empresa
            <select value={selectedEmpresa} onChange={handleEmpresaChange} disabled={!selectedPais}>
              <option value="">{selectedPais ? 'Seleccione una empresa...' : 'Primero seleccione un país'}</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </label>

          <label>
            <span className="step-number">3</span>
            Sede
            <select value={selectedSede} onChange={e => setSelectedSede(e.target.value)} disabled={!selectedEmpresa}>
              <option value="">{selectedEmpresa ? 'Seleccione una sede...' : 'Primero seleccione una empresa'}</option>
              {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </label>

          <button 
            type="button" 
            disabled={!selectedSede} 
            onClick={startEncuesta}
          >
            Comenzar Encuesta →
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <p><small>Por favor responda las siguientes preguntas sobre su experiencia:</small></p>
          
          {preguntas.map((p, i) => (
            <div key={p.id} className="question-item fade-in">
              <label>
                <strong>Pregunta {i+1}:</strong> {p.texto_pregunta}
                {p.tipo_respuesta === 'texto' ? (
                  <input 
                    required 
                    placeholder="Escriba su opinión aquí..."
                    onChange={e => setRespuestas({...respuestas, [p.id]: e.target.value})}
                  />
                ) : (
                  <select required onChange={e => setRespuestas({...respuestas, [p.id]: e.target.value})} defaultValue="">
                    <option value="" disabled>Seleccione una calificación...</option>
                    <option value="1">⭐ 1 - Muy insatisfecho</option>
                    <option value="2">⭐⭐ 2 - Insatisfecho</option>
                    <option value="3">⭐⭐⭐ 3 - Neutral</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Satisfecho</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Muy satisfecho</option>
                  </select>
                )}
              </label>
            </div>
          ))}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Respuestas ✓'}
          </button>
        </form>
      )}
    </article>
  );
}