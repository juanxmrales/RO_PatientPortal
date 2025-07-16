const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EmailLog = require('./EmailLog');

//Usuarios tanto pacientes como administradores
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('patient', 'admin', 'admission'),  //Usamos ENUM para poder agregar mas roles a futuro
    allowNull: false,
    defaultValue: 'patient',
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;


User.hasMany(EmailLog, { foreignKey: 'userId', as: 'emailLogs' });
EmailLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

console.log('Modelo User definido');

