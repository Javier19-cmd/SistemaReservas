// Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario',
    required: true,
  },
});

module.exports = mongoose.model('Usuario', usuarioSchema);