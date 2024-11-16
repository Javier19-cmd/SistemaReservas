const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  fecha: Date,
  capacidad: Number,
  reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
});

module.exports = mongoose.model('Event', eventSchema);
