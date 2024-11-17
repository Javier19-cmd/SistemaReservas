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
