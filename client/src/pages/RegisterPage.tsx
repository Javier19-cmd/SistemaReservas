import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/users/register`, { name, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Error al registrarse', error);
    }
  };

  return (
    <div>
      <h1>Registrarse</h1>
      <form onSubmit={handleRegister}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;