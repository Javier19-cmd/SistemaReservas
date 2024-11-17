import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types/types';

type EventListProps = {
  events: Event[] | null;
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (!events || !Array.isArray(events)) {
    return <div>No hay eventos disponibles</div>;
  }

  return (
    <ul className="event-list">
      {events.map((event) => (
        <li key={event._id} className="event-card">
          <h2>{event.titulo || 'Evento sin título'}</h2>
          <p><strong>Descripción:</strong> {event.descripcion || 'Descripción no disponible'}</p>
          <p><strong>Fecha:</strong> {event.fecha ? new Date(event.fecha).toLocaleDateString('es-ES') : 'Fecha no disponible'}</p>
          <p><strong>Capacidad:</strong> {event.capacidad}</p>
          <p><strong>Reservas:</strong> {event.reservasCount}</p>
          <Link to={`/event/${event._id}`} className="details-button">Ver detalles</Link>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
