const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  contraseña: String,
  rol: { type: String, enum: ['usuario', 'administrador'], default: 'usuario' },
});

module.exports = mongoose.model('User', userSchema);
