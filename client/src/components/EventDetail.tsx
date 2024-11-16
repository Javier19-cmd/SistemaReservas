import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReservationForm from './ReservationForm';

type Event = {
  _id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
};

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
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
      <p>Fecha: {event.fecha}</p>
      <ReservationForm eventId={event._id} />
    </div>
  );
};

export default EventDetail;