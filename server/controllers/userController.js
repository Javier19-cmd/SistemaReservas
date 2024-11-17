const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
    }

    // Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(password, salt);

    // Crea una nueva instancia del usuario con la contraseña encriptada
    const nuevoUsuario = new User({ name, email, password: contraseñaEncriptada });

    // Guarda el nuevo usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Por favor, proporciona email y contraseña.' });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const esContraseñaValida = await bcrypt.compare(password, usuario.password);
    if (!esContraseñaValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.name, email: usuario.email, tipo: usuario.tipo }, // Incluye el rol
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      tipo: usuario.tipo, // También lo envías como respuesta directa
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
};