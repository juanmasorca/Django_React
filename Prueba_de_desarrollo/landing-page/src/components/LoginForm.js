import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirección

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const requestBody = JSON.stringify({ username, password });
    console.log("Enviando datos:", requestBody); // Verificar los datos antes de enviarlos

    try {
      const response = await fetch("http://localhost:8000/core/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      if (response.ok) {
        localStorage.setItem("token", data.token)
        if (data.is_admin) {
          navigate("/admin-dashboard"); // Redirige a la consola del admin
        } else {
          navigate("/regular-dashboard"); // Redirige a la página regular
        }
      } else { 
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de red: Intenta nuevamente");
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginForm;
