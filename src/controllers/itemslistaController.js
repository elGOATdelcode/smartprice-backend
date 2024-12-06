const db = require('../models/db');

// Agregar un producto a una lista
const agregarItem = async (req, res) => {
  const { lista_id, producto_id, cantidad } = req.body;
  const usuario_id = req.usuario.id;

  if (!lista_id || !producto_id || !cantidad) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const [listas] = await db.query('SELECT * FROM listas WHERE id = ? AND usuario_id = ?', [lista_id, usuario_id]);
    if (listas.length === 0) {
      return res.status(404).json({ mensaje: 'Lista no encontrada' });
    }

    // Verificar si el producto ya existe en la lista
    const [existingItems] = await db.query(
      'SELECT * FROM items_lista WHERE lista_id = ? AND producto_id = ?',
      [lista_id, producto_id]
    );

    if (existingItems.length > 0) {
      // Actualizar la cantidad existente
      const newCantidad = existingItems[0].cantidad + cantidad;
      await db.query(
        'UPDATE items_lista SET cantidad = ? WHERE id = ?',
        [newCantidad, existingItems[0].id]
      );
      res.json({ mensaje: 'Cantidad actualizada en la lista', itemId: existingItems[0].id });
    } else {
      // Insertar el nuevo item en la lista
      const [resultado] = await db.query(
        'INSERT INTO items_lista (lista_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [lista_id, producto_id, cantidad]
      );
      res.status(201).json({ mensaje: 'Producto agregado a la lista', itemId: resultado.insertId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Obtener todos los items de una lista
const obtenerItems = async (req, res) => {
  const { lista_id } = req.params;
  const usuario_id = req.usuario.id;

  try {
    const [listas] = await db.query('SELECT * FROM listas WHERE id = ? AND usuario_id = ?', [lista_id, usuario_id]);
    if (listas.length === 0) {
      return res.status(404).json({ mensaje: 'Lista no encontrada' });
    }

    // Obtener los items de la lista
    const [items] = await db.query(
      `SELECT items_lista.id, productos.nombre, productos.precio_chedraui, productos.precio_heb, items_lista.cantidad
       FROM items_lista
       JOIN productos ON items_lista.producto_id = productos.id
       WHERE items_lista.lista_id = ?`,
      [lista_id]
    );

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Actualizar la cantidad de un item en la lista
const actualizarItem = async (req, res) => {
  const { id } = req.params; 
  const { cantidad } = req.body;
  const usuario_id = req.usuario.id;

  if (!cantidad) {
    return res.status(400).json({ mensaje: 'La cantidad es obligatoria' });
  }

  try {
    // Verificar que el item pertenece a una lista del usuario
    const [items] = await db.query(
      `SELECT items_lista.*
       FROM items_lista
       JOIN listas ON items_lista.lista_id = listas.id
       WHERE items_lista.id = ? AND listas.usuario_id = ?`,
      [id, usuario_id]
    );
    if (items.length === 0) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }

    // Actualizar la cantidad
    await db.query('UPDATE items_lista SET cantidad = ? WHERE id = ?', [cantidad, id]);
    res.json({ mensaje: 'Cantidad actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Eliminar un item de la lista
const eliminarItem = async (req, res) => {
  const { id } = req.params; 
  const usuario_id = req.usuario.id;

  try {
    // Verificar que el item pertenece a una lista del usuario
    const [items] = await db.query(
      `SELECT items_lista.*
       FROM items_lista
       JOIN listas ON items_lista.lista_id = listas.id
       WHERE items_lista.id = ? AND listas.usuario_id = ?`,
      [id, usuario_id]
    );
    if (items.length === 0) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }

    // Eliminar el item
    await db.query('DELETE FROM items_lista WHERE id = ?', [id]);
    res.json({ mensaje: 'Item eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  agregarItem,
  obtenerItems,
  actualizarItem,
  eliminarItem
};


