const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  try {
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está en uso' });
    }
    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);
    const nuevoUsuario = new User({
      nombre,
      email,
      contraseña: contraseñaHasheada,
    });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

exports.iniciarSesion = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar que la contraseña ingresada coincida con la almacenada
    const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esContraseñaValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Aquí generamos el JWT después de verificar la contraseña
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
      process.env.JWT_SECRET, // Usar el JWT_SECRET del archivo .env
      { expiresIn: '1h' } // Expira en 1 hora
    );

    // Devolver el token al cliente
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token, // El token generado
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
