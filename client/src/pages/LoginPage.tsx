import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, { email, password });

      // Guardar el token en el localStorage
      localStorage.setItem('token', response.data.token);

      // Redirigir según el rol del usuario
      if (response.data.tipo === 'admin') {
        navigate('/admin'); // Redirige al panel de administración
      } else {
        navigate('/events'); // Redirige a la página de eventos
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión', error);
      setError(error.response?.data?.mensaje || 'Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h1>Iniciar Sesión</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
