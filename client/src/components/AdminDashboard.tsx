import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Event = {
  _id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
};

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error al obtener los eventos', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Panel de Administración</h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h2>{event.titulo}</h2>
            <button>Editar</button>
            <button>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;