import React, { useState, useEffect } from 'react';
import './WaterDashboard.css';
import { getEstadisticas, getHistorial, getTendencias } from './Api'; // Asegúrate de que la ruta sea correcta

const WaterManagementDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleString());
  const [currentSystem] = useState("Red de Distribución Zona Norte");
  const [metrics, setMetrics] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);
  const [rendimientoData, setRendimientoData] = useState({});
  const [alertas, setAlertas] = useState([]); // Estado para almacenar alertas

  // Estados para la paginación
  const [currentPageHistorial, setCurrentPageHistorial] = useState(1);
  const [currentPageTendencias, setCurrentPageTendencias] = useState(1);
  const itemsPerPage = 10; // Número de registros por página

  // Conexión WebSocket para notificaciones en tiempo real
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      console.log('Conectado al servidor WebSocket');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tipo === "alerta") {
        setAlertas((prevAlertas) => [...prevAlertas, data.mensaje]);
      }
    };

    ws.onclose = () => {
      console.log('Desconectado del servidor WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);
  // Función para cerrar una alerta
  const cerrarAlerta = (id) => {
    setAlertas((prevAlertas) =>
      prevAlertas.map((alerta) =>
        alerta.id === id ? { ...alerta, cerrando: true } : alerta
      )
    );

    // Eliminar la alerta después de la animación
    setTimeout(() => {
      setAlertas((prevAlertas) => prevAlertas.filter((alerta) => alerta.id !== id));
    }, 300); // Tiempo de la animación
  };

  // Obtener datos del backend
  useEffect(() => {
    const fetchData = async () => {
      const estadisticas = await getEstadisticas();
      const historial = await getHistorial();
      const tendenciasData = await getTendencias();

      if (estadisticas) {
        setMetrics([
          { id: 1, label: "Flujo Promedio", value: `${estadisticas.flujo_promedio}%`, color: "#4ade80" },
          { id: 2, label: "Flujo Máximo", value: `${estadisticas.flujo_maximo}%`, color: "#4ade80" },
          { id: 3, label: "Flujo Mínimo", value: `${estadisticas.flujo_minimo}%`, color: "#4ade80" },
          { id: 4, label: "Eficiencia", value: `${estadisticas.eficiencia}%`, color: "#4ade80" },
        ]);

        // Simular datos de consumo energético basados en el flujo promedio
        const consumoZonaA = estadisticas.flujo_promedio * 11.2;
        const consumoZonaB = estadisticas.flujo_promedio * 11.5;
        const consumoZonaC = estadisticas.flujo_promedio * 11.0;

        setConsumptionData([
          { id: 1, x: 30, y: 40, area: "Zona A", value: `${consumoZonaA.toFixed(2)} kWh` },
          { id: 2, x: 50, y: 50, area: "Zona B", value: `${consumoZonaB.toFixed(2)} kWh` },
          { id: 3, x: 70, y: 60, area: "Zona C", value: `${consumoZonaC.toFixed(2)} kWh` },
        ]);

        // Actualizar datos de rendimiento del sistema
        setRendimientoData({
          eficiencia: estadisticas.eficiencia,
          flujoPromedio: estadisticas.flujo_promedio,
          flujoMaximo: estadisticas.flujo_maximo,
        });
      }

      if (historial) {
        setTableData(historial.map(reg => ({
          date: reg.timestamp,
          pumpSpeed: reg.flujo,
          pumpMax: estadisticas.flujo_maximo,
          flowRate: estadisticas.flujo_promedio,
          flowMax: estadisticas.flujo_maximo,
          efficiency: `${estadisticas.eficiencia}%`,
        })));
      }

      if (tendenciasData) {
        setTendencias(tendenciasData);
      }
    };

    fetchData();
    const intervalId = setInterval(() => {
      setCurrentDate(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Función para obtener los registros de la página actual (historial)
  const getCurrentHistorial = () => {
    const startIndex = (currentPageHistorial - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tableData.slice(startIndex, endIndex);
  };

  // Función para obtener los registros de la página actual (tendencias)
  const getCurrentTendencias = () => {
    const startIndex = (currentPageTendencias - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tendencias.slice(startIndex, endIndex);
  };

  // Función para cambiar de página (historial)
  const handlePageChangeHistorial = (direction) => {
    if (direction === "next" && currentPageHistorial < Math.ceil(tableData.length / itemsPerPage)) {
      setCurrentPageHistorial(currentPageHistorial + 1);
    } else if (direction === "prev" && currentPageHistorial > 1) {
      setCurrentPageHistorial(currentPageHistorial - 1);
    }
  };

  // Función para cambiar de página (tendencias)
  const handlePageChangeTendencias = (direction) => {
    if (direction === "next" && currentPageTendencias < Math.ceil(tendencias.length / itemsPerPage)) {
      setCurrentPageTendencias(currentPageTendencias + 1);
    } else if (direction === "prev" && currentPageTendencias > 1) {
      setCurrentPageTendencias(currentPageTendencias - 1);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Notificaciones de alerta */}
      <div className="alertas-container">
        {alertas.map((alerta) => (
          <div key={alerta.id} className={`alerta ${alerta.cerrando ? 'cerrando' : ''}`}>
            <span>⚠️ Alerta de fuga</span>
            <button onClick={() => cerrarAlerta(alerta.id)}>×</button>
          </div>
        ))}
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
          {metrics.map((metric) => (
            <div key={metric.id} className="metric-card">
              <h2 className="metric-value" style={{ color: metric.color }}>
                {metric.value}
              </h2>
              <p className="metric-label">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Consumo Energético Sistemas (kWh) */}
          <div className="chart-card">
            <h3 className="chart-title">Consumo Energético Sistemas (kWh)</h3>
            <div className="consumption-map">
              <div className="map-container">
                <svg viewBox="0 0 100 100" className="map-svg">
                  {/* Simple pipes */}
                  <path d="M20,40 L50,30 L70,40 M50,30 L50,70 M50,70 L20,40 M50,70 L70,40"
                    stroke="#4ade80"
                    strokeWidth="1"
                    fill="none" />

                  {/* Consumption points */}
                  {consumptionData.map((point) => (
                    <g key={point.id}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={5}
                        fill="#4ade80"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={10}
                        fill="transparent"
                        stroke="#4ade80"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                      <text
                        x={point.x}
                        y={point.y - 15}
                        textAnchor="middle"
                        fontSize="3"
                        fill="white"
                      >
                        {point.area}
                      </text>
                      <text
                        x={point.x}
                        y={point.y - 10}
                        textAnchor="middle"
                        fontSize="4"
                        fill="white"
                        fontWeight="bold"
                      >
                        {point.value}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Rendimiento del Sistema */}
          <div className="chart-card">
            <h3 className="chart-title">Rendimiento del Sistema</h3>
            <div className="performance-chart">
              <svg viewBox="0 0 100 50" className="chart-svg">
                {/* Chart scale lines */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#333" strokeWidth="0.5" />
                <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#333" strokeWidth="0.5" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#333" strokeWidth="0.5" />
                <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#333" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#333" strokeWidth="0.5" />

                {/* Eficiencia - curva verde */}
                <path
                  d="M0,25 C10,20 20,15 30,10 C40,5 50,15 60,20 C70,25 80,15 90,22 C95,25 100,20"
                  stroke="#4ade80"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Pérdidas de agua - curva amarilla */}
                <path
                  d="M0,35 C10,30 20,35 30,25 C40,30 50,40 60,35 C70,30 80,25 90,35 C95,38 100,30"
                  stroke="#eab308"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Punto destacado */}
                <circle cx="70" cy="15" r="1.5" fill="#4ade80" />
                <circle cx="70" cy="15" r="3" fill="transparent" stroke="#4ade80" />

                {/* Label para el punto */}
                <rect x="65" y="5" width="15" height="8" rx="2" fill="#1e3a8a" />
                <text x="72.5" y="10" fontSize="4" textAnchor="middle" fill="white" fontWeight="bold">
                  {rendimientoData.eficiencia}%
                </text>
                <text x="72.5" y="3" fontSize="2" textAnchor="middle" fill="white">Mar 19</text>

                {/* Escala X - fechas */}
                <text x="5" y="55" fontSize="2" fill="#aaa">Mar 15</text>
                <text x="20" y="55" fontSize="2" fill="#aaa">Mar 16</text>
                <text x="35" y="55" fontSize="2" fill="#aaa">Mar 17</text>
                <text x="50" y="55" fontSize="2" fill="#aaa">Mar 18</text>
                <text x="65" y="55" fontSize="2" fill="#aaa">Mar 19</text>
                <text x="80" y="55" fontSize="2" fill="#aaa">Mar 20</text>
                <text x="95" y="55" fontSize="2" fill="#aaa">Mar 21</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Tabla de Historial de Flujo */}
        <div className="table-container">
          <h3 className="table-title">Historial de Flujo</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Flujo</th>
                <th>Bombeo Máximo</th>
                <th>Flujo Máximo</th>
                <th>Eficiencia</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentHistorial().map((row, index) => (
                <tr key={index}>
                  <td className="date-cell">{row.date}</td>
                  <td>{row.pumpSpeed}</td>
                  <td>{row.pumpMax}</td>
                  <td>{row.flowMax}</td>
                  <td>{row.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Botones de paginación */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChangeHistorial("prev")}
              disabled={currentPageHistorial === 1}
            >
              Anterior
            </button>
            <span>Página {currentPageHistorial}</span>
            <button
              onClick={() => handlePageChangeHistorial("next")}
              disabled={currentPageHistorial === Math.ceil(tableData.length / itemsPerPage)}
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Tabla de Tendencias */}
        <div className="table-container">
          <h3 className="table-title">Tendencias</h3>
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
              {getCurrentTendencias().map((tendencia, index) => (
                <tr key={index}>
                  <td className="date-cell">{tendencia.fecha}</td>
                  <td>{tendencia.periodo}</td>
                  <td>{tendencia.tendencia}</td>
                  <td>{tendencia.recomendacion}</td>
                  <td>{tendencia.probabilidad_fuga}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Botones de paginación */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChangeTendencias("prev")}
              disabled={currentPageTendencias === 1}
            >
              Anterior
            </button>
            <span>Página {currentPageTendencias}</span>
            <button
              onClick={() => handlePageChangeTendencias("next")}
              disabled={currentPageTendencias === Math.ceil(tendencias.length / itemsPerPage)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaterManagementDashboard;