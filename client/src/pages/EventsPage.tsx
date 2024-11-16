import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventsPage.css';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        const eventsData = Array.isArray(response.data) ? response.data : response.data.events;

        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
        } else {
          setError('Formato de datos incorrecto.');
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
        setError('Error al obtener los eventos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API_URL]);

  return (
    <div className="events-page">
      <header className="page-header">
        <h1>Eventos Destacados</h1>
        <p>Descubre los eventos más recientes y emocionantes.</p>
      </header>

      <div className="events-container">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="event-card">
              <div className="card-content">
                <h2>{event.title}</h2>
                <p className="event-date"><strong>Fecha:</strong> {event.date}</p>
                <p className="event-description">{event.description}</p>
              </div>
              <button className="details-button">Ver detalles</button>
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
