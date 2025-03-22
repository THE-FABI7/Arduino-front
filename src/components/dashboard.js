import React, { useState } from 'react';
import './WaterDashboard.css'; // Asegúrate de crear este archivo CSS

const WaterManagementDashboard = () => {
  // Estado para almacenar datos de ejemplo
  const [currentDate] = useState("Marzo 22 2025 10:00 - Ahora");
  const [currentSystem] = useState("Red de Distribución Zona Norte");
  
  // Datos de ejemplo para el monitoreo de agua
  const metrics = [
    { id: 1, label: "Eficiencia", value: "72.3%", color: "#4ade80" },
    { id: 2, label: "Calidad", value: "96.5%", color: "#4ade80" },
    { id: 3, label: "Disponibilidad", value: "81.2%", color: "#4ade80" },
    { id: 4, label: "Sostenibilidad", value: "68.7%", color: "#4ade80" },
  ];
  
  // Datos para el mapa de consumo energético
  const consumptionData = [
    { id: 1, area: "Planta Principal", value: 78.59, x: 50, y: 30 },
    { id: 2, area: "Bomba 1", value: 91.64, x: 35, y: 65 },
    { id: 3, area: "Estación Purificadora", value: 16.1, x: 70, y: 40 },
    { id: 4, area: "Distribución", value: 15.76, x: 20, y: 40 },
    { id: 5, area: "Filtros", value: 14.97, x: 50, y: 70 },
  ];

  // Datos de la tabla
  const tableData = [
    { date: "2025-03-22 10:00", pumpSpeed: 282, pumpMax: 325, flowRate: 54, flowMax: 79, efficiency: "102%" },
    { date: "2025-03-22 09:00", pumpSpeed: 181, pumpMax: 329, flowRate: 32, flowMax: 100, efficiency: "99%" },
    { date: "2025-03-22 08:00", pumpSpeed: 89, pumpMax: 322, flowRate: 33, flowMax: 103, efficiency: "95%" },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo"></div>
          <h1>Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="date-selector">
            <span>{currentDate}</span>
            <svg className="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="system-selector">
            <span>{currentSystem}</span>
            <svg className="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
          {/* Consumption Map */}
          <div className="chart-card">
            <h3 className="chart-title">Consumo Energético Sistemas (kWh)</h3>
            <div className="consumption-map">
              {/* Simple representation of water distribution system */}
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

          {/* Uptime Chart */}
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
                <text x="72.5" y="10" fontSize="4" textAnchor="middle" fill="white" fontWeight="bold">99%</text>
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

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="with-icon">
                  Fecha
                  <svg className="sort-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </th>
                <th>
                  Velocidad Bombeo
                </th>
                <th>
                  Bombeo Máximo
                </th>
                <th className="with-icon">
                  Flujo Promedio
                  <svg className="sort-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </th>
                <th className="with-icon">
                  Flujo Máximo
                  <svg className="sort-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </th>
                <th className="with-icon">
                  Eficiencia
                  <svg className="sort-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="date-cell">{row.date}</td>
                  <td>{row.pumpSpeed}</td>
                  <td>{row.pumpMax}</td>
                  <td>{row.flowRate}</td>
                  <td>{row.flowMax}</td>
                  <td>{row.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default WaterManagementDashboard;