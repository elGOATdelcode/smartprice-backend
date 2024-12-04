
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rutas = require('./rutas');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewaree
app.use(cors);
app.use(express.json());


app.use(rutas);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API de SmartPrice está funcionando');
});

// Manejar rutas no definidas (404)
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
