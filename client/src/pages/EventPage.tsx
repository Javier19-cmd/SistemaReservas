import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error al obtener el evento', error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>{event.titulo}</h1>
      <p>{event.descripcion}</p>
      <button>Reservar</button>
    </div>
  );
};

export default EventPage;