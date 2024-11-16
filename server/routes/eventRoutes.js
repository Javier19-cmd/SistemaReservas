const express = require('express');
const router = express.Router();
const {
  obtenerEventos,
  crearEvento,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/eventController');

// Definición de las rutas
router.get('/', obtenerEventos);
router.post('/', crearEvento);
router.get('/:id', obtenerEventoPorId);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);

module.exports = router;
