const jwt = require('jsonwebtoken');

exports.verificarToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido' });
  }
};
