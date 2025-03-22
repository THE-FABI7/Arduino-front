import React, { useState, useEffect } from 'react';
import './WaterDashboard.css';
import { getEstadisticas, getHistorial, getTendencias } from './Api';

const WaterManagementDashboard = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleString());
  const [currentSystem] = useState("Red de Distribución Zona Norte");
  const [metrics, setMetrics] = useState([]);
  const [historialData, setHistorialData] = useState([]);
  const [tendenciasData, setTendenciasData] = useState([]);
  const [loading, setLoading] = useState({
    estadisticas: true,
    historial: true,
    tendencias: true
  });
  const [error, setError] = useState({
    estadisticas: null,
    historial: null,
    tendencias: null
  });
  const [alertas, setAlertas] = useState(null);

  // Dashboard visualization states
  const [flujoPorZona, setFlujoPorZona] = useState([]);
  const [rendimientoHistorico, setRendimientoHistorico] = useState({
    fechas: [],
    flujos: [],
    eficiencias: []
  });

  // Pagination states
  const [currentPageHistorial, setCurrentPageHistorial] = useState(1);
  const [currentPageTendencias, setCurrentPageTendencias] = useState(1);
  const itemsPerPage = 10;

  // WebSocket connection for real-time notifications
  useEffect(() => {
    let ws = null;

    try {
      ws = new WebSocket('ws://localhost:8000/ws');

      ws.onopen = () => {
        console.log('Conectado al servidor WebSocket');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.tipo === "alerta") {
          setAlertas({ id: Date.now(), mensaje: data.mensaje });
        } 

      };

      ws.onclose = () => {
        console.log('Desconectado del servidor WebSocket');
      };

      ws.onerror = (error) => {
        console.error('Error en la conexión WebSocket:', error);
      };
    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Function to close an alert
  const cerrarAlerta = () => {
    setAlertas(null);
  };

  // Process historical data for visualization
  const processHistoricalData = (historial) => {
    if (!historial || historial.length === 0) return;

    // Sort data by timestamp
    const sortedData = [...historial].sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Extract last 7 days of data for the flow performance chart
    const last7Days = sortedData.slice(-7);

    // Prepare data for the historical performance chart
    const fechas = last7Days.map(item => {
      const date = new Date(item.timestamp);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const flujos = last7Days.map(item => item.flujo);

    // For this example, we'll simulate efficiency based on the flow rate
    // In real application, this would come from your actual data
    const eficiencias = last7Days.map(item => {
      // Simulate efficiency (higher flow might indicate lower efficiency due to leaks)
      const baseEfficiency = 100;
      const flowPenalty = item.flujo > 75 ? (item.flujo - 75) * 0.8 : 0;
      return Math.max(baseEfficiency - flowPenalty, 50).toFixed(1);
    });

    setRendimientoHistorico({
      fechas,
      flujos,
      eficiencias
    });

    // Simulate flow by zone (in a real app, you'd get this from your API)
    // This simulates three measurement points in your water distribution system
    setFlujoPorZona([
      {
        id: 1,
        x: 30,
        y: 40,
        area: "Zona Residencial",
        flujo: (sortedData[sortedData.length - 1]?.flujo * 0.4).toFixed(1),
        perdida: (sortedData[sortedData.length - 1]?.flujo * 0.4 * 0.05).toFixed(2)
      },
      {
        id: 2,
        x: 50,
        y: 50,
        area: "Zona Comercial",
        flujo: (sortedData[sortedData.length - 1]?.flujo * 0.35).toFixed(1),
        perdida: (sortedData[sortedData.length - 1]?.flujo * 0.35 * 0.08).toFixed(2)
      },
      {
        id: 3,
        x: 70,
        y: 60,
        area: "Zona Industrial",
        flujo: (sortedData[sortedData.length - 1]?.flujo * 0.25).toFixed(1),
        perdida: (sortedData[sortedData.length - 1]?.flujo * 0.25 * 0.12).toFixed(2)
      }
    ]);
  };

  // Main data fetching function
  const fetchData = async () => {
    try {
      setLoading({
        estadisticas: true,
        historial: true,
        tendencias: true
      });

      // Fetch statistics
      const estadisticas = await getEstadisticas();
      if (estadisticas) {
        // Format metrics for display
        setMetrics([
          { id: 1, label: "Flujo Promedio", value: `${estadisticas.flujo_promedio.toFixed(1)}%`, color: getFlowColor(estadisticas.flujo_promedio) },
          { id: 2, label: "Flujo Máximo", value: `${estadisticas.flujo_maximo.toFixed(1)}%`, color: getFlowColor(estadisticas.flujo_maximo) },
          { id: 3, label: "Flujo Mínimo", value: `${estadisticas.flujo_minimo.toFixed(1)}%`, color: getFlowColor(estadisticas.flujo_minimo) },
          { id: 4, label: "Eficiencia", value: `${estadisticas.eficiencia.toFixed(1)}%`, color: getEfficiencyColor(estadisticas.eficiencia) },
        ]);
      }
      setLoading(prev => ({ ...prev, estadisticas: false }));

      // Fetch history
      const historial = await getHistorial(100, 0);
      if (historial && historial.length > 0) {
        // Format history data
        const formattedHistory = historial.map(reg => ({
          id: reg.id,
          date: new Date(reg.timestamp).toLocaleString(),
          flujo: reg.flujo.toFixed(1),
          analisis: reg.analisis || 'Normal',
          timestamp: reg.timestamp
        }));

        setHistorialData(formattedHistory);

        // Process data for visualizations
        processHistoricalData(historial);
      }
      setLoading(prev => ({ ...prev, historial: false }));

      // Fetch trend analysis
      const tendencias = await getTendencias(20);
      if (tendencias && tendencias.length > 0) {
        const formattedTendencias = tendencias.map(t => ({
          id: t.id,
          fecha: new Date(t.fecha).toLocaleString(),
          periodo: t.periodo || 'Diario',
          tendencia: t.tendencia || 'Estable',
          recomendacion: t.recomendacion || 'Monitoreo continuo',
          probabilidad_fuga: t.probabilidad_fuga ? t.probabilidad_fuga.toFixed(1) : '0.0',
          detalles: t.detalles || ''
        }));

        setTendenciasData(formattedTendencias);
      }
      setLoading(prev => ({ ...prev, tendencias: false }));

    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError({
        estadisticas: err.message,
        historial: err.message,
        tendencias: err.message
      });
      setLoading({
        estadisticas: false,
        historial: false,
        tendencias: false
      });
    }
  };

  // Utility functions for colors
  const getFlowColor = (value) => {
    if (value > 90) return "#ef4444"; // red for high flow (potential leak)
    if (value > 75) return "#f97316"; // orange for medium-high flow
    if (value > 60) return "#eab308"; // yellow for medium flow
    return "#4ade80"; // green for normal flow
  };

  const getEfficiencyColor = (value) => {
    if (value < 60) return "#ef4444"; // red for low efficiency
    if (value < 75) return "#f97316"; // orange for medium-low efficiency
    if (value < 85) return "#eab308"; // yellow for medium efficiency
    return "#4ade80"; // green for high efficiency
  };

  // Initial data load and timer setup
  useEffect(() => {
    fetchData();

    // Set up date refresh interval
    const dateIntervalId = setInterval(() => {
      setCurrentDate(new Date().toLocaleString());
    }, 1000);

    // Set up data refresh interval (every 30 seconds)
    const dataIntervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => {
      clearInterval(dateIntervalId);
      clearInterval(dataIntervalId);
    };
  }, []);

  // Pagination functions
  const getCurrentHistorial = () => {
    const startIndex = (currentPageHistorial - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return historialData.slice(startIndex, endIndex);
  };

  const getCurrentTendencias = () => {
    const startIndex = (currentPageTendencias - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tendenciasData.slice(startIndex, endIndex);
  };

  const handlePageChangeHistorial = (direction) => {
    if (direction === "next" && currentPageHistorial < Math.ceil(historialData.length / itemsPerPage)) {
      setCurrentPageHistorial(currentPageHistorial + 1);
    } else if (direction === "prev" && currentPageHistorial > 1) {
      setCurrentPageHistorial(currentPageHistorial - 1);
    }
  };

  const handlePageChangeTendencias = (direction) => {
    if (direction === "next" && currentPageTendencias < Math.ceil(tendenciasData.length / itemsPerPage)) {
      setCurrentPageTendencias(currentPageTendencias + 1);
    } else if (direction === "prev" && currentPageTendencias > 1) {
      setCurrentPageTendencias(currentPageTendencias - 1);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Alert notifications */}
      <div className="alertas-container">
        {alertas && (
          <div key={alertas.id} className="alerta">
            <span>⚠️ {alertas.mensaje}</span>
            <button onClick={cerrarAlerta}>×</button>
          </div>
        )}
      </div>
      
      
      
      
      
      
      

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo"></div>
          <h1>DeterFuga</h1>
        </div>
        <div className="header-right">
          <div className="date-selector">
            <span>{currentDate}</span>
          </div>
          <div className="system-selector">
            <span>{currentSystem}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Metrics Cards */}
        <div className="metrics-grid">
          {loading.estadisticas ? (
            <div className="loading-indicator">Cargando estadísticas...</div>
          ) : error.estadisticas ? (
            <div className="error-message">Error: {error.estadisticas}</div>
          ) : (
            metrics.map((metric) => (
              <div key={metric.id} className="metric-card">
                <h2 className="metric-value" style={{ color: metric.color }}>
                  {metric.value}
                </h2>
                <p className="metric-label">{metric.label}</p>
              </div>
            ))
          )}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Distribution System Flow Map */}
          <div className="chart-card"></div>

          {/* System Performance Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Rendimiento del Sistema (Últimos 7 días)</h3>
            <div className="performance-chart">
              {loading.historial ? (
                <div className="loading-indicator">Cargando datos de rendimiento...</div>
              ) : rendimientoHistorico.fechas.length === 0 ? (
                <div className="empty-data-message">No hay suficientes datos históricos</div>
              ) : (
                <svg viewBox="0 0 100 50" className="chart-svg">
                  {/* Chart scale lines */}
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#333" strokeWidth="0.5" />
                  <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#333" strokeWidth="0.5" />
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeWidth="0.5" />
                  <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#333" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="0.5" />

                  {/* Flow rate line (blue) */}
                  <path
                    d={`M
                      ${rendimientoHistorico.fechas.map((_, i) => {
                      const x = i * (100 / (rendimientoHistorico.fechas.length - 1));
                      // Normalize flow values to fit the chart height (0-100% to 0-50px)
                      const y = 50 - (rendimientoHistorico.flujos[i] / 100 * 50);
                      return `${i === 0 ? '' : ' L'}${x},${y}`;
                    }).join('')}
                    `}
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  {/* Efficiency line (green) */}
                  <path
                    d={`M
                      ${rendimientoHistorico.fechas.map((_, i) => {
                      const x = i * (100 / (rendimientoHistorico.fechas.length - 1));
                      // Normalize efficiency values (0-100% to 0-50px)
                      const y = 50 - (rendimientoHistorico.eficiencias[i] / 100 * 50);
                      return `${i === 0 ? '' : ' L'}${x},${y}`;
                    }).join('')}
                    `}
                    stroke="#4ade80"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  {/* X-axis date labels */}
                  {rendimientoHistorico.fechas.map((fecha, i) => {
                    const x = i * (100 / (rendimientoHistorico.fechas.length - 1));
                    return (
                      <text
                        key={i}
                        x={x}
                        y="55"
                        fontSize="2"
                        textAnchor="middle"
                        fill="#aaa"
                      >
                        {fecha}
                      </text>
                    );
                  })}

                  {/* Legend */}
                  <rect x="75" y="5" width="3" height="2" fill="#3b82f6" />
                  <text x="80" y="7" fontSize="2" fill="#fff">Flujo</text>
                  <rect x="75" y="10" width="3" height="2" fill="#4ade80" />
                  <text x="80" y="12" fontSize="2" fill="#fff">Eficiencia</text>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Flow History Table */}
        <div className="table-container">
          <h3 className="table-title">Historial de Flujo</h3>
          {loading.historial ? (
            <div className="loading-indicator">Cargando historial...</div>
          ) : error.historial ? (
            <div className="error-message">Error: {error.historial}</div>
          ) : historialData.length === 0 ? (
            <div className="empty-data-message">No hay datos de historial disponibles</div>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Flujo (%)</th>
                    <th>Análisis</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentHistorial().map((row, index) => (
                    <tr key={index} className={row.analisis !== 'Normal' ? 'warning-row' : ''}>
                      <td className="date-cell">{row.date}</td>
                      <td>{row.flujo}</td>
                      <td>{row.analisis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination controls */}
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChangeHistorial("prev")}
                  disabled={currentPageHistorial === 1}
                >
                  Anterior
                </button>
                <span>Página {currentPageHistorial} de {Math.max(1, Math.ceil(historialData.length / itemsPerPage))}</span>
                <button
                  onClick={() => handlePageChangeHistorial("next")}
                  disabled={currentPageHistorial >= Math.ceil(historialData.length / itemsPerPage)}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>

        {/* Trends Table */}
        <div className="table-container">
          <h3 className="table-title">Tendencias y Análisis de Fugas</h3>
          {loading.tendencias ? (
            <div className="loading-indicator">Cargando tendencias...</div>
          ) : error.tendencias ? (
            <div className="error-message">Error: {error.tendencias}</div>
          ) : tendenciasData.length === 0 ? (
            <div className="empty-data-message">No hay datos de tendencias disponibles</div>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Período</th>
                    <th>Tendencia</th>
                    <th>Recomendación</th>
                    <th>Probabilidad de Fuga</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentTendencias().map((tendencia, index) => {
                    // Set row class based on leak probability
                    const rowClass =
                      parseFloat(tendencia.probabilidad_fuga) > 75 ? 'high-alert' :
                        parseFloat(tendencia.probabilidad_fuga) > 50 ? 'medium-alert' :
                          parseFloat(tendencia.probabilidad_fuga) > 25 ? 'low-alert' : '';

                    return (
                      <tr key={index} className={rowClass}>
                        <td className="date-cell">{tendencia.fecha}</td>
                        <td>{tendencia.periodo}</td>
                        <td>{tendencia.tendencia}</td>
                        <td>{tendencia.recomendacion}</td>
                        <td>{tendencia.probabilidad_fuga}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Pagination controls */}
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChangeTendencias("prev")}
                  disabled={currentPageTendencias === 1}
                >
                  Anterior
                </button>
                <span>Página {currentPageTendencias} de {Math.max(1, Math.ceil(tendenciasData.length / itemsPerPage))}</span>
                <button
                  onClick={() => handlePageChangeTendencias("next")}
                  disabled={currentPageTendencias >= Math.ceil(tendenciasData.length / itemsPerPage)}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default WaterManagementDashboard;