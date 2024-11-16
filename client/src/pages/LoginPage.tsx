import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;