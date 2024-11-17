import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

type Event = {
  _id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  capacidad: number;
};

const AdminPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [capacidad, setCapacidad] = useState<number>(0); // Nuevo estado para la capacidad
  const [message, setMessage] = useState<string>('');
  const API_URL = process.env.REACT_APP_API_URL;

  // Obtener todos los eventos
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        const data = Array.isArray(response.data) ? response.data : []; // Asegura que sea un arreglo
        setEvents(data);
      } catch (error) {
        console.error('Error al obtener los eventos', error);
        setMessage('Error al obtener los eventos.');
      }
    };
    fetchEvents();
  }, [API_URL]);

  // Crear un nuevo evento
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Asumiendo que el token está en localStorage
      if (!token) {
        setMessage('Por favor, inicia sesión para crear un evento.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const newEvent = { titulo, descripcion, fecha, capacidad }; // Incluye la capacidad
      const response = await axios.post(`${API_URL}/api/events`, newEvent, config);

      setEvents((prevEvents) =>
        Array.isArray(prevEvents) ? [...prevEvents, response.data] : [response.data]
      );
      setTitulo('');
      setDescripcion('');
      setFecha('');
      setCapacidad(0); // Restablece la capacidad
      setMessage('Evento creado exitosamente.');
    } catch (error: any) {
      console.error('Error al crear el evento:', error);
      setMessage(
        error.response?.data?.mensaje || 'Error al crear el evento. Inténtalo de nuevo.'
      );
    }
  };

  // Editar un evento
  const handleEditEvent = async (id: string) => {
    const newTitulo = prompt('Ingresa el nuevo título:');
    const newDescripcion = prompt('Ingresa la nueva descripción:');
    const newFecha = prompt('Ingresa la nueva fecha (YYYY-MM-DD):');
    const newCapacidad = prompt('Ingresa la nueva capacidad:');

    if (!newTitulo || !newDescripcion || !newFecha || !newCapacidad) {
      setMessage('Todos los campos son obligatorios para editar el evento.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Por favor, inicia sesión para editar un evento.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const updatedEvent = {
        titulo: newTitulo,
        descripcion: newDescripcion,
        fecha: newFecha,
        capacidad: parseInt(newCapacidad),
      };
      const response = await axios.put(`${API_URL}/api/events/${id}`, updatedEvent, config);

      setEvents((prevEvents) =>
        Array.isArray(prevEvents)
          ? prevEvents.map((event) =>
              event._id === id ? { ...event, ...response.data } : event
            )
          : []
      );
      setMessage('Evento actualizado exitosamente.');
    } catch (error: any) {
      console.error('Error al editar el evento:', error);
      setMessage('Error al editar el evento. Inténtalo de nuevo.');
    }
  };

  // Eliminar un evento
  const handleDeleteEvent = async (id: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este evento?');

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Por favor, inicia sesión para eliminar un evento.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`${API_URL}/api/events/${id}`, config);

      setEvents((prevEvents) =>
        Array.isArray(prevEvents) ? prevEvents.filter((event) => event._id !== id) : []
      );
      setMessage('Evento eliminado exitosamente.');
    } catch (error: any) {
      console.error('Error al eliminar el evento:', error);
      setMessage('Error al eliminar el evento. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="admin-page">
      <h1>Panel de Administración</h1>

      {/* Mensaje de éxito/error */}
      {message && <p className="message">{message}</p>}

      {/* Formulario para crear eventos */}
      <form onSubmit={handleCreateEvent} className="event-form">
        <h2>Crear Nuevo Evento</h2>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="capacidad">Capacidad:</label>
          <input
            type="number"
            id="capacidad"
            value={capacidad}
            onChange={(e) => setCapacidad(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Crear Evento</button>
      </form>

      {/* Lista de eventos */}
      <ul className="event-list">
        {Array.isArray(events) &&
          events.map((event) => (
            <li key={event._id} className="event-item">
              <h2>{event.titulo}</h2>
              <p>
                <strong>Descripción:</strong> {event.descripcion}
              </p>
              <p>
                <strong>Fecha:</strong> {event.fecha}
              </p>
              <p>
                <strong>Capacidad:</strong> {event.capacidad}
              </p>
              <div className="event-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEditEvent(event._id)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AdminPage;
