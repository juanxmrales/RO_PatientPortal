const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

// Inicializa la aplicación Express
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.33.117:3000'],
  credentials: true
}));
app.use(express.json());

// Ruta de prueba: http://localhost:3001
app.get('/', (req, res) => {
  res.send('API del portal de pacientes funcionando');
});

// Usa el puerto definido en .env o por defecto 3001
const PORT = process.env.PORT || 3001;

app.use('/api/users', userRoutes);

sequelize.sync()
  .then(() => {
    console.log('Base de datos conectada y modelo sincronizado');
      app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor backend corriendo en http://0.0.0.0:${PORT}`);
       });
  })
  .catch(err => {
    console.error('Error al conectar la base de datos:', err);
  });


