import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Encuesta() {
  const [data, setData] = useState({ paises: [], empresas: [], sedes: [], preguntas: [] });
  const [selection, setSelection] = useState({ pais: '', empresa: '', sede: '' });
  const [respuestas, setRespuestas] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    fetch(`${API_URL}/paises`)
      .then(res => res.json())
      .then(paises => setData(prev => ({ ...prev, paises })))
      .catch(() => setError("Error conectando al servidor"));
  }, []);

  const loadData = async (endpoint, updateKey, resetKeys = []) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${endpoint}`);
      const newData = await res.json();
      setData(prev => {
        const nextState = { ...prev, [updateKey]: newData };
        resetKeys.forEach(k => nextState[k] = []);
        return nextState;
      });
    } catch {
      setError(`Error cargando ${updateKey}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaisChange = (e) => {
    const id = e.target.value;
    setSelection({ pais: id, empresa: '', sede: '' });
    if (id) loadData(`empresas?pais_id=${id}`, 'empresas', ['sedes']);
  };

  const handleEmpresaChange = (e) => {
    const id = e.target.value;
    setSelection(prev => ({ ...prev, empresa: id, sede: '' }));
    if (id) loadData(`sedes?empresa_id=${id}`, 'sedes');
  };

  const startEncuesta = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/preguntas?empresa_id=${selection.empresa}`);
      const preguntas = await res.json();
      if (!preguntas.length) return alert("Sin preguntas configuradas.");
      setData(prev => ({ ...prev, preguntas }));
      setStep(2);
    } catch {
      setError("Error obteniendo preguntas");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        sede_id: selection.sede,
        respuestas: Object.entries(respuestas).map(([pid, val]) => ({ pregunta_id: pid, valor_respuesta: val }))
      };
      
      const res = await fetch(`${API_URL}/encuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();
      setStep(3);
    } catch {
      setError("Error al guardar la encuesta.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Helper para buscar nombres
    const getName = (list, id) => list.find(item => item.id == id)?.nombre || 'N/A';
    
    // 1. Construir cabecera y contexto
    let csvContent = "Concepto,Detalle\n";
    csvContent += `Fecha,${new Date().toLocaleString()}\n`;
    csvContent += `Pais,${getName(data.paises, selection.pais)}\n`;
    csvContent += `Empresa,${getName(data.empresas, selection.empresa)}\n`;
    csvContent += `Sede,${getName(data.sedes, selection.sede)}\n`;
    csvContent += ",\n"; // Separador
    
    // 2. Construir respuestas
    csvContent += "Pregunta,Respuesta\n";
    data.preguntas.forEach((p, index) => {
      const val = respuestas[p.id] || 'N/A';
      // Escapar comillas dobles en textos
      const safeText = p.texto_pregunta.replace(/"/g, '""');
      const safeVal = String(val).replace(/"/g, '""');
      
      // Mapear valor numérico a texto si es escala
      let finalVal = safeVal;
      if (p.tipo_respuesta !== 'texto') {
        const labels = {1: 'Muy malo', 2: 'Malo', 3: 'Regular', 4: 'Bueno', 5: 'Excelente'};
        if (labels[val]) finalVal = `${val} - ${labels[val]}`;
      }
      
      csvContent += `"${index + 1}. ${safeText}","${finalVal}"\n`;
    });

    // 3. Descargar archivo
    const bom = "\uFEFF"; // Byte Order Mark para que Excel abra UTF-8 correctamente
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encuesta_resultado_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 3) return (
    <article className="opinia-card fade-in">
      <div className="opinia-success">
        <div className="success-icon">✓</div>
        <h2>¡Gracias por tu opinión!</h2>
        <p>Tu respuesta ha sido registrada exitosamente.</p>
        <div className="actions">
            <button onClick={() => window.location.reload()} className="opinia-btn primary">Nueva Encuesta</button>
            <button onClick={handleExport} className="opinia-btn outline">Exportar Resultado</button>
        </div>
      </div>
    </article>
  );

  return (
    <article className="opinia-card fade-in">
      <header><h2>{loading ? 'Cargando...' : 'Evaluación de Servicio'}</h2></header>
      {loading && <progress />}
      {error && <mark>{error}</mark>}

      {step === 1 && (
        <form>
          <label>1. País
            <select value={selection.pais} onChange={handlePaisChange} disabled={loading}>
              <option value="">Seleccione...</option>
              {data.paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </label>
          <label>2. Empresa
            <select value={selection.empresa} onChange={handleEmpresaChange} disabled={!selection.pais || loading}>
              <option value="">Seleccione...</option>
              {data.empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </label>
          <label>3. Sede
            <select value={selection.sede} onChange={e => setSelection(prev => ({ ...prev, sede: e.target.value }))} disabled={!selection.empresa || loading}>
              <option value="">Seleccione...</option>
              {data.sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </label>
          <button type="button" disabled={!selection.sede || loading} onClick={startEncuesta}>Comenzar</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          {data.preguntas.map((p, i) => (
            <div key={p.id} className="question-item fade-in">
              <label><strong>{i+1}.</strong> {p.texto_pregunta}
                {p.tipo_respuesta === 'texto' ? (
                  <input required onChange={e => setRespuestas({...respuestas, [p.id]: e.target.value})} />
                ) : (
                  <select required onChange={e => setRespuestas({...respuestas, [p.id]: e.target.value})} defaultValue="">
                    <option value="" disabled>Calificación...</option>
                    {[
                      { val: 1, label: '1 - Muy malo' },
                      { val: 2, label: '2 - Malo' },
                      { val: 3, label: '3 - Regular' },
                      { val: 4, label: '4 - Bueno' },
                      { val: 5, label: '5 - Excelente' }
                    ].map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                  </select>
                )}
              </label>
            </div>
          ))}
          <button type="submit" disabled={loading}>Enviar Respuestas</button>
        </form>
      )}
    </article>
  );
}