
const db = require('../models/db');

// Crear una nueva lista
const crearLista = async (req, res) => {
  const { nombre } = req.body;
  const usuario_id = req.usuario.id;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre de la lista es obligatorio' });
  }

  try {
    const [resultado] = await db.query(
      'INSERT INTO listas (usuario_id, nombre) VALUES (?, ?)',
      [usuario_id, nombre]
    );

    res.status(201).json({ mensaje: 'Lista creada exitosamente', listaId: resultado.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener todas las listas del usuario
const obtenerListas = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const [listas] = await db.query('SELECT * FROM listas WHERE usuario_id = ?', [usuario_id]);
    res.json(listas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar el nombre de una lista
const actualizarLista = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  const usuario_id = req.usuario.id;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre de la lista es obligatorio' });
  }

  try {
    const [listas] = await db.query('SELECT * FROM listas WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
    if (listas.length === 0) {
      return res.status(404).json({ mensaje: 'Lista no encontrada' });
    }

    // Actualizar el nombre de la lista
    await db.query('UPDATE listas SET nombre = ? WHERE id = ?', [nombre, id]);
    res.json({ mensaje: 'Lista actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar una lista
const eliminarLista = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;

  try {
    const [listas] = await db.query('SELECT * FROM listas WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
    if (listas.length === 0) {
      return res.status(404).json({ mensaje: 'Lista no encontrada' });
    }

    // Eliminar los items asociados a la lista primero (para mantener la integridad referencial)
    await db.query('DELETE FROM items_lista WHERE lista_id = ?', [id]);

    // Eliminar la lista
    await db.query('DELETE FROM listas WHERE id = ?', [id]);
    res.json({ mensaje: 'Lista eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  crearLista,
  obtenerListas,
  actualizarLista,
  eliminarLista
};
