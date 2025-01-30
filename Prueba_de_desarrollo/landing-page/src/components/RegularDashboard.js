import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegularDashboard.css';

const RegularDashboard = () => {
  const [message, setMessage] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionStartTime] = useState(Date.now()); // Tiempo de inicio de sesión
  const navigate = useNavigate();
  const appInfo = {
    title: "Mi Aplicación",
    description: "Una aplicación intuitiva diseñada para facilitar la gestión de actividades, mejorar la productividad y optimizar procesos mediante una interfaz amigable y eficiente.",
  };    
  
  // Función para manejar el clic en los botones
  const handleButtonClick = (buttonNumber) => {
    const data = {
      button_number: buttonNumber,
      session_time: sessionTime, // Envía el tiempo de sesión junto con el clic
    };

    fetch('http://localhost:8000/core/update-button-click/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error updating click:', error));
  };

  // Calcula el tiempo de sesión
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStartTime) / 1000)); // Tiempo en segundos
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [sessionStartTime]);

  // Heartbeat: Enviar una señal cada 1 segundo para indicar que el usuario está activo
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        const preciseSessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
  
        const response = await fetch('http://localhost:8000/core/heartbeat/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ session_time: preciseSessionTime }),
        });
  
        if (!response.ok) {
          throw new Error('Error en el heartbeat');
        }
  
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error en el heartbeat:', error);
      }
    };
  
    // ✅ Enviar el primer heartbeat inmediatamente al cargar el componente
    sendHeartbeat();
  
    // ✅ Luego programamos los siguientes cada 1 segundo
    const heartbeatInterval = setInterval(sendHeartbeat, 1000);
  
    return () => clearInterval(heartbeatInterval);
  }, [sessionStartTime]);

  return (
    <div className="dashboard-container">
      <div className="logo-text-container">
        <img src="/images/Logo.png" alt="Logo" className="logo" />
        <div className="text-container">
          <h2 className="title">{appInfo.title}</h2>
          <p className="description">{appInfo.description}</p>
        </div>
      </div>

      <div className="session-info">
        <p>{message}</p>
        <p>Tiempo de sesión: {sessionTime} segundos</p>
      </div>

      <div className="button-container">
        <button onClick={() => handleButtonClick(1)}>Botón 1</button>
        <button onClick={() => handleButtonClick(2)}>Botón 2</button>
      </div>
    </div>
  );
};

export default RegularDashboard;