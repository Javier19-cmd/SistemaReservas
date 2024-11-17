import React, { useState } from 'react';
import axios from 'axios';

type ReservationFormProps = {
  eventId: string;
};

const ReservationForm: React.FC<ReservationFormProps> = ({ eventId }) => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleReserve = async () => {
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
        `${process.env.REACT_APP_API_URL}/api/reservations`,
        { eventoId: eventId },
        config
      );

      setSuccessMessage(response.data.mensaje);
      setError('');

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Error al reservar:', err);
      setError(
        err.response?.data?.mensaje || 'Error al realizar la reserva. Inténtalo de nuevo.'
      );
      setSuccessMessage('');
    }
  };

  return (
    <div className="reservation-form">
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleReserve} className="details-button">Reservar</button>
    </div>
  );
};

export default ReservationForm;
