import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/loginForm.css';

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
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de Usuario:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
