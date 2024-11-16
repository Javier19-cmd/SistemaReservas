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
  const { email, password } = req.body; // Cambiado 'contraseña' por 'password'
  try {
    // Verificar que el email y la contraseña están presentes
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Por favor, proporciona email y contraseña.' });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Verificar que la contraseña ingresada coincida con la almacenada
    const esContraseñaValida = await bcrypt.compare(password, usuario.password); // Cambiado 'usuario.contraseña' por 'usuario.password'
    if (!esContraseñaValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Generar el JWT después de verificar la contraseña
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.name, email: usuario.email }, // Cambiado 'usuario.nombre' por 'usuario.name'
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver el token al cliente
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error); // Registrar el error para depuración
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
};