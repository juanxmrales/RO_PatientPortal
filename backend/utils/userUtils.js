const { pool } = require('../config/database');

/**Busca un usuario por un campo que puede ser dni o email.
 *
 * @param {string} field - Campo de busqueda.
 * @param {string} value - El valor del campo.
 * @returns {Promise<Object|null>} - Devuelve el usuario encontrado o null.
 */
const findUserByField = async (field, value) => {
  const allowedFields = ['dni', 'email'];
  if (!allowedFields.includes(field)) {
    throw new Error('Campo de búsqueda no permitido');
  }

  const [rows] = await pool.execute(`SELECT * FROM users WHERE \`${field}\` = ? LIMIT 1`, [value]);
  return rows[0] || null;
};

const getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

// Utilidad para limpiar el usuario antes de devolverlo. Eliminamos campos sensibles como password.
const sanitizeUser = (user) => {
  if (!user) return null;

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

module.exports = { findUserByField, sanitizeUser, getUserById };
