import React from 'react';
import { Link } from 'react-router-dom';

type Event = {
  _id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
};

type EventListProps = {
  events: Event[] | null; // Permitir que `events` sea null inicialmente
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (!events || !Array.isArray(events)) {
    return <div>No hay eventos disponibles</div>;
  }

  return (
    <ul>
      {events.map((event) => (
        <li key={event._id}>
          <h2>{event.titulo}</h2>
          <p>{event.descripcion}</p>
          <Link to={`/event/${event._id}`}>Ver detalles</Link>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
