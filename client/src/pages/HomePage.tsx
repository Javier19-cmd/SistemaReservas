import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header className="header">
        <h1>Bienvenido al sistema de eventos</h1>
      </header>

      <main className="main-content">
        <div className="auth-links">
          <Link to="/login" className="auth-link">Iniciar Sesión</Link>
          <Link to="/register" className="auth-link">Registrarse</Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
