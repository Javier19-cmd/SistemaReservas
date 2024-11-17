const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  capacidad: { type: Number, required: true, default: 0 },
  reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
});

module.exports = mongoose.model('Event', eventSchema);
