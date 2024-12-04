const db = require('../models/db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); 

dotenv.config();

const registrarUsuario = async (req, res) => {
  const { nombre_usuario, email, contrasena } = req.body;

  if (!nombre_usuario || !email || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
   
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length > 0) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

   
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

   
    const [resultado] = await db.query(
      'INSERT INTO usuarios (nombre_usuario, email, contrasena) VALUES (?, ?, ?)',
      [nombre_usuario, email, hashedPassword]
    );

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const iniciarSesion = async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario existe
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];

   
    const esContraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esContraseñaValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en iniciarSesion:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion
};
