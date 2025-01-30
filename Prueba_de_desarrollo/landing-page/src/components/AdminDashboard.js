import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/adminDashboard.css';
import { Line, Bar, Pie } from 'react-chartjs-2'; // Importa los gráficos
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js'; // Importa componentes de Chart.js

// Registro de los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [graphDataButton1, setGraphDataButton1] = useState({});
  const [graphDataButton2, setGraphDataButton2] = useState({});

  useEffect(() => {
    console.log("Token:", localStorage.getItem('token'));
    axios
      .get('http://localhost:8000/core/admin-dashboard/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        console.log('Respuesta de la API:', response.data);
        setUsers(response.data);
        processData(response.data); // Llama a processData con la respuesta
      })
      .catch((error) => {
        console.error('Error al cargar los usuarios:', error);
      });
  }, []);

  // Función para formatear el tiempo en segundos a un formato legible (HH:MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Procesar datos para los gráficos
  const processData = (users) => {
    const userNames = users.map(user => user.nombre);
    const sessionTimes = users.map(user => user.tiempo_total_sesiones);
    const buttonClicks1 = users.map(user => user.clic_botón_1 ?? 0);
    const buttonClicks2 = users.map(user => user.clic_botón_2 ?? 0);

    // Gráfico de Tiempo Total de Sesiones (línea)
    setGraphData({
      labels: userNames,
      datasets: [
        {
          label: 'Tiempo Total de Sesiones (segundos)',
          data: sessionTimes,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          type: 'line',
        },
      ],
    });

    // Gráfico de Clics Botón 1 (barras)
    setGraphDataButton1({
      labels: userNames,
      datasets: [
        {
          label: 'Clics Botón 1',
          data: buttonClicks1,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          type: 'bar',
        },
      ],
    });

    // Gráfico de Clics Botón 2 (pastel)
    setGraphDataButton2({
      labels: userNames,
      datasets: [
        {
          label: 'Clics Botón 2',
          data: buttonClicks2,
          backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
          fill: true,
          type: 'pie',
        },
      ],
    });
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Usuarios Registrados</h1>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha de Registro</th>
              <th>Fecha de Inicio de Sesión</th>
              <th>Tiempo de Última Sesión</th>
              <th>Tiempo Total de Sesiones</th>
              <th>Clic Botón 1</th>
              <th>Clic Botón 2</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.slice(0, 10).map((user, index) => (
                <tr key={index}>
                  <td>{user.nombre}</td>
                  <td>{user.fecha_registro}</td>
                  <td>{user.fecha_inicio_sesion || 'No disponible'}</td>
                  <td>{formatTime(user.tiempo_ultima_sesion) || 'No disponible'}</td>
                  <td>{formatTime(user.tiempo_total_sesiones) || 'No disponible'}</td>
                  <td>{user.clic_botón_1 ?? 0}</td>
                  <td>{user.clic_botón_2 ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contenedor de los gráficos */}
      <div className="graphs-container">
        <div className="graph">
          <h3>Tiempo Total de Sesiones</h3>
          {graphData.labels && graphData.datasets ? <Line data={graphData} /> : <p>Cargando...</p>}
        </div>
        <div className="graph">
          <h3>Clics Botón 1</h3>
          {graphDataButton1.labels && graphDataButton1.datasets ? <Bar data={graphDataButton1} /> : <p>Cargando...</p>}
        </div>
        <div className="graph">
          <h3>Clics Botón 2</h3>
          {graphDataButton2.labels && graphDataButton2.datasets ? <Pie data={graphDataButton2} /> : <p>Cargando...</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
