const express = require('express');
const router = express.Router();
const {
  crearReserva,
  obtenerReservasUsuario,
  obtenerReservasEvento,
  cancelarReserva,
} = require('../controllers/reservationController');
const { verificarToken } = require('../middleware/authMiddleware');

// Crear una reserva (usuarios autenticados)
router.post('/', verificarToken, crearReserva);

// Obtener reservas del usuario autenticado
router.get('/mis-reservas', verificarToken, obtenerReservasUsuario);

// Obtener reservas de un evento específico (opcionalmente solo para administradores)
router.get('/evento/:eventoId', verificarToken, obtenerReservasEvento);

// Cancelar una reserva
router.delete('/:id', verificarToken, cancelarReserva);

module.exports = router;
