import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getEvents = async () => {
  return await axios.get(`${API_URL}/events`);
};

export const createReservation = async (eventId: string, userId: string) => {
  return await axios.post(`${API_URL}/reservations`, { eventId, userId });
};