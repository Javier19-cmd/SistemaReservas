import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './EventDetail.css';

type Event = {
  _id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  capacidad: number;
  reservasCount: number;
};

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error al obtener el evento', error);
        setErrorMessage('Error al obtener el evento. Por favor, inténtalo de nuevo más tarde.');
      }
    };
    fetchEvent();
  }, [id]);

  const handleReserve = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Por favor, inicia sesión para realizar una reserva.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reservations`,
        { eventoId: id },
        config
      );

      setSuccessMessage(response.data.mensaje);
      setErrorMessage('');

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // Actualizar el estado para reflejar la nueva reserva
      if (event) {
        setEvent({
          ...event,
          reservasCount: event.reservasCount + 1,
        });
      }
    } catch (error: any) {
      console.error('Error al reservar:', error);
      setErrorMessage(
        error.response?.data?.mensaje || 'Error al realizar la reserva. Inténtalo de nuevo.'
      );
      setSuccessMessage('');
    }
  };

  if (!event) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="event-detail-container">
      <div className="event-detail-card">
        <h1>{event.titulo}</h1>
        <p className="event-description"><strong>Descripción:</strong> {event.descripcion}</p>
        <p className="event-date"><strong>Fecha:</strong> {new Date(event.fecha).toLocaleDateString('es-ES')}</p>
        <p className="event-capacity"><strong>Capacidad total:</strong> {event.capacidad}</p>
        <p className="event-reservations"><strong>Reservas actuales:</strong> {event.reservasCount}</p>
        <button
          className="reserve-button"
          onClick={handleReserve}
          disabled={event.reservasCount >= event.capacidad}
        >
          {event.reservasCount >= event.capacidad ? 'Cupos llenos' : 'Reservar'}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default EventDetail;
