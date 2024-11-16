import React, { useState } from 'react';
import axios from 'axios';

type ReservationFormProps = {
  eventId: string;
};

const ReservationForm: React.FC<ReservationFormProps> = ({ eventId }) => {
  const [userId, setUserId] = useState('');

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reservations`, { eventId, userId });
      alert('Reserva realizada con éxito');
    } catch (error) {
      console.error('Error al realizar la reserva', error);
    }
  };

  return (
    <form onSubmit={handleReservation}>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="ID de Usuario"
      />
      <button type="submit">Reservar</button>
    </form>
  );
};

export default ReservationForm;
