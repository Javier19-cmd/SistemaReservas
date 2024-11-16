import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error al obtener los eventos', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <div>
        <Link to="/login">Iniciar Sesión</Link> | <Link to="/register">Registrarse</Link>
      </div>
    </div>
  );
};

export default HomePage;