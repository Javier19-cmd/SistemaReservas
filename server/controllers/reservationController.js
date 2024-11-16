const Reservation = require('../models/Reservation');
const Event = require('../models/Event');

// Crear una reserva
exports.crearReserva = async (req, res) => {
  const { eventoId } = req.body;
  const usuarioId = req.usuario.id;

  try {
    const evento = await Event.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    // Verificar disponibilidad
    const reservasCount = await Reservation.countDocuments({ evento: eventoId });
    if (reservasCount >= evento.capacidad) {
      return res.status(400).json({ mensaje: 'No hay cupos disponibles' });
    }

    // Crear la reserva
    const nuevaReserva = new Reservation({
      usuario: usuarioId,
      evento: eventoId,
    });
    await nuevaReserva.save();

    // Actualizar el evento con la nueva reserva
    evento.reservas.push(nuevaReserva._id);
    await evento.save();

    res.status(201).json({ mensaje: 'Reserva creada exitosamente', reserva: nuevaReserva });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la reserva' });
  }
};

// Obtener reservas del usuario autenticado
exports.obtenerReservasUsuario = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const reservas = await Reservation.find({ usuario: usuarioId }).populate('evento');
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reservas' });
  }
};

// Obtener reservas de un evento específico
exports.obtenerReservasEvento = async (req, res) => {
  const { eventoId } = req.params;

  try {
    const reservas = await Reservation.find({ evento: eventoId }).populate('usuario');
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reservas del evento' });
  }
};

// Cancelar una reserva
exports.cancelarReserva = async (req, res) => {
  const reservaId = req.params.id;
  const usuarioId = req.usuario.id;

  try {
    const reserva = await Reservation.findById(reservaId);

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Verificar que la reserva pertenece al usuario o que es un administrador
    if (reserva.usuario.toString() !== usuarioId && req.usuario.rol !== 'administrador') {
      return res.status(403).json({ mensaje: 'No autorizado para cancelar esta reserva' });
    }

    await reserva.remove();

    // Remover la reserva del evento
    await Event.findByIdAndUpdate(reserva.evento, { $pull: { reservas: reservaId } });

    res.status(200).json({ mensaje: 'Reserva cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cancelar la reserva' });
  }
};
