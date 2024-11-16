const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  fechaReserva: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', reservationSchema);
