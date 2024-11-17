const Event = require('../models/Event'); // Importar el modelo Event

// Obtener todos los eventos
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Event.find(); // Obtiene todos los eventos de la base de datos
    res.status(200).json(eventos); // Devuelve los eventos en formato JSON
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ mensaje: 'Error al obtener los eventos' });
  }
};

// Crear un nuevo evento
exports.crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, capacidad } = req.body; // Incluye capacidad en los datos enviados
    const nuevoEvento = new Event({ titulo, descripcion, fecha, capacidad }); // Crea un nuevo evento con capacidad
    const eventoGuardado = await nuevoEvento.save(); // Guarda el evento en la base de datos
    res.status(201).json(eventoGuardado); // Devuelve el evento creado
  } catch (error) {
    console.error('Error al crear el evento:', error);
    res.status(500).json({ mensaje: 'Error al crear el evento' });
  }
};

// Obtener un evento por su ID
exports.obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL
    const evento = await Event.findById(id); // Busca el evento por su ID
    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }
    res.status(200).json(evento); // Devuelve el evento encontrado
  } catch (error) {
    console.error('Error al obtener el evento:', error);
    res.status(500).json({ mensaje: 'Error al obtener el evento' });
  }
};

// Actualizar un evento
exports.actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL
    const { titulo, descripcion, fecha, capacidad } = req.body; // Incluye capacidad en los datos enviados
    const eventoActualizado = await Event.findByIdAndUpdate(
      id,
      { titulo, descripcion, fecha, capacidad }, // Actualiza todos los campos
      { new: true } // Devuelve el documento actualizado
    );
    if (!eventoActualizado) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }
    res.status(200).json(eventoActualizado); // Devuelve el evento actualizado
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el evento' });
  }
};

// Eliminar un evento
exports.eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL
    const eventoEliminado = await Event.findByIdAndDelete(id); // Elimina el evento por su ID
    if (!eventoEliminado) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }
    res.status(200).json({ mensaje: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el evento' });
  }
};
