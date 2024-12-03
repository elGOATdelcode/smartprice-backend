
const db = require('../models/db');

const obtenerProductos = async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos');
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Buscar productos por nombre
const buscarProductos = async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) {
    return res.status(400).json({ mensaje: 'Parámetro de búsqueda "nombre" es requerido' });
  }

  try {
    const [productos] = await db.query(
      'SELECT * FROM productos WHERE LOWER(nombre) LIKE ? LIMIT 10',
      [`%${nombre.toLowerCase()}%`]
    );
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerProductos,
  buscarProductos
};
