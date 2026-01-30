import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api';

export default function Exportar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llama al endpoint nuevo que te dije que agregaras
    fetch(`${API_URL}/encuestas/reporte`)
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  }, []);

  const downloadCSV = () => {
    if (!data.length) return;
    // Aplanar JSON a CSV a la fuerza
    const rows = data.map(row => ({
      Fecha: new Date(row.fecha_creacion).toLocaleString(),
      Pais: row.encuesta?.sede?.filial?.pais?.nombre || 'N/A',
      Empresa: row.encuesta?.sede?.filial?.empresa?.nombre || 'N/A',
      Sede: row.encuesta?.sede?.nombre || 'N/A',
      Pregunta: row.pregunta?.texto_pregunta || 'Borrada',
      Respuesta: row.valor_respuesta
    }));

    const headers = Object.keys(rows[0]).join(',');
    const values = rows.map(r => Object.values(r).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + values], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_encuestas.csv';
    a.click();
  };

  return (
    <article className="opinia-card fade-in">
      <div className="opinia-table-header">
        <hgroup>
          <h2>📊 Reporte de Resultados</h2>
          <p>{data.length > 0 ? `${data.length} respuestas registradas` : 'No hay datos disponibles'}</p>
        </hgroup>
        <button 
          onClick={downloadCSV} 
          disabled={!data.length}
        >
          💾 Descargar CSV
        </button>
      </div>

      {loading ? (
        <div className="opinia-loading">
          <progress />
          <p>Cargando datos...</p>
        </div>
      ) : data.length === 0 ? (
        <div style={{textAlign: 'center', padding: '3rem'}}>
          <p style={{fontSize: '3rem', margin: '0'}}>📭</p>
          <p><em>No hay encuestas registradas aún</em></p>
        </div>
      ) : (
        <figure>
          <table role="grid">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Pregunta</th>
                <th>Respuesta</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 50).map((row, i) => (
                <tr key={i}>
                  <td>{row.encuesta?.sede?.filial?.empresa?.nombre || 'N/A'}</td>
                  <td><small>{row.pregunta?.texto_pregunta || 'Pregunta eliminada'}</small></td>
                  <td><strong>{row.valor_respuesta}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 50 && (
            <figcaption>
              Mostrando 50 de {data.length} resultados
            </figcaption>
          )}
        </figure>
      )}
    </article>
  );
}