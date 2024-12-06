// src/rutas.js
const express = require('express');
const router = express.Router();
const usuariosController = require('./controllers/usuariosController');
const productosController = require('./controllers/productosController');
const listasController = require('./controllers/listasController');
const itemslistaController = require('./controllers/itemslistaController');
const autenticarToken = require('./middlewares/auth');

// Rutas de Usuarios
router.post('/api/usuarios/registro', usuariosController.registrarUsuario);
router.post('/api/usuarios/login', usuariosController.iniciarSesion);

// Rutas de Productos
router.get('/api/productos', productosController.obtenerProductos);
router.get('/api/productos/buscar', productosController.buscarProductos);

// Rutas de Listas (Protegidas)
router.post('/api/listas', autenticarToken, listasController.crearLista);
router.get('/api/listas', autenticarToken, listasController.obtenerListas);
router.put('/api/listas/:id', autenticarToken, listasController.actualizarLista);
router.delete('/api/listas/:id', autenticarToken, listasController.eliminarLista);

// Rutas de Items de Lista (Protegidas)
router.post('/api/items', autenticarToken, itemslistaController.agregarItem);
router.get('/api/items/:lista_id', autenticarToken, itemslistaController.obtenerItems);
router.put('/api/items/:id', autenticarToken, itemslistaController.actualizarItem);
router.delete('/api/items/:id', autenticarToken, itemslistaController.eliminarItem);

module.exports = router;

