import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log(localStorage.getItem('token'));
    axios
      .get('/core/admin_dashboard/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        
      })
      .then((response) => {
        console.log('Respuesta de la API:', response.data);  // Agrega este log
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error al cargar los usuarios:', error);
      });
  }, []);

  return (
    <div>
      <h1>Usuarios Registrados</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td> {/* Usar 'username' en lugar de 'nombre' */}
                <td>{user.email}</td>
                <td>{user.fecha_registro}</td> {/* 'fecha_registro' es correcto si estás pasando ese campo desde el backend */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
