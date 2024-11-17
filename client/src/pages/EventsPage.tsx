import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventsPage.css';

interface Event {
  _id: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  capacidad: number;
  reservasCount: number;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch events on component load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        const eventsData = Array.isArray(response.data) ? response.data : [];
        const normalizedEvents = eventsData.map((event) => ({
          ...event,
          capacidad: event.capacidad || 0,
          reservasCount: event.reservas ? event.reservas.length : 0,
        }));
        setEvents(normalizedEvents);
      } catch (err) {
        console.error('Error al obtener los eventos:', err);
        setError('Error al obtener los eventos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API_URL]);

  const handleReserve = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Por favor, inicia sesión para realizar una reserva.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        `${API_URL}/api/reservations`,
        { eventoId: eventId },
        config
      );

      setSuccessMessage(response.data.mensaje);
      setError('');

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // Update local state to reflect the reservation
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, reservasCount: event.reservasCount + 1 }
            : event
        )
      );
    } catch (err: any) {
      console.error('Error al reservar:', err);
      setError(
        err.response?.data?.mensaje || 'Error al realizar la reserva. Inténtalo de nuevo.'
      );
      setSuccessMessage('');
    }
  };

  return (
    <div className="events-page">
      <header className="page-header">
        <h1>Eventos Destacados</h1>
        <p>Descubre los eventos más recientes y emocionantes.</p>
      </header>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="events-container">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="card-content">
                <h2>{event.titulo || 'Evento sin título'}</h2>
                <p className="event-date">
                  <strong>Fecha:</strong>{' '}
                  {event.fecha ? new Date(event.fecha).toLocaleDateString('es-ES') : 'Fecha no disponible'}
                </p>
                <p className="event-description">
                  <strong>Descripción:</strong> {event.descripcion || 'Descripción no disponible'}
                </p>
                <p className="event-capacity">
                  <strong>Capacidad total:</strong> {event.capacidad}
                </p>
                <p className="event-reservations">
                  <strong>Reservas actuales:</strong> {event.reservasCount}
                </p>
                <p className="event-available-capacity">
                  <strong>Cupos disponibles:</strong>{' '}
                  {Math.max(event.capacidad - event.reservasCount, 0)}
                </p>
              </div>
              <button
                className="details-button"
                onClick={() => handleReserve(event._id)}
                disabled={event.reservasCount >= event.capacidad}
              >
                {event.reservasCount >= event.capacidad ? 'Cupos llenos' : 'Reservar'}
              </button>
            </div>
          ))
        ) : (
          <p className="no-events">No hay eventos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
