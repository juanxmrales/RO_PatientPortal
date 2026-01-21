const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.33.117:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API del portal de pacientes funcionando');
});

const PORT = process.env.PORT || 3001;

app.use('/api/users', userRoutes);

async function startServer() {
  try {
    await testConnection();
    console.log('Conexión a la base de datos establecida');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor backend corriendo en http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Error al conectar la base de datos:', err);
    process.exit(1);
  }
}

startServer();
