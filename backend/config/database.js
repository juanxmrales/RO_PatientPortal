const { Sequelize } = require('sequelize');
require ('dotenv').config(); // Carga las variables de entorno desde .env
// Configuración de la conexión a la base de datos MySQL usando Sequelize


const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false
});


module.exports = sequelize;
