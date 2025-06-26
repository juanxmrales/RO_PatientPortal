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

module.exports = { findUserByField };
