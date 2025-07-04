const User = require('../models/User');

/**Busca un usuario por un campo que puede ser dni o email.
 
 * @param {string} field - Campo de busqueda.
 * @param {string} value - El valor del campo.
 * @returns {Promise<User|null>} - Devuelve el usuario encontrado o null.
 */
const findUserByField = async (field, value) => {
  const allowedFields = ['dni', 'email'];
  if (!allowedFields.includes(field)) {
    throw new Error('Campo de búsqueda no permitido');
  }

  const whereClause = {};
  whereClause[field] = value;

  const user = await User.findOne({ where: whereClause });
  return user;
};


// Utilidad para limpiar el usuario antes de devolverlo. Eliminamos campos sensibles como password.
const sanitizeUser = (user) => {
  return {
    id: user.id,
    dni: user.dni,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = { findUserByField, sanitizeUser, };
