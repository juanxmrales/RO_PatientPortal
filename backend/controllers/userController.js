const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { findUserByField, sanitizeUser, getUserById } = require('../utils/userUtils');
const { generateVueMotionUrl } = require('../services/vueMotionService');
const { generateSimplePassword } = require('../utils/passwordGenerator');
const { sendPatientCreatedEmail } = require("../services/emailService");
const { enqueueEmail } = require('../services/emailQueue');

const loginUser = async (req, res) => {
  try {
    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({ message: 'DNI y contraseña son requeridos' });
    }

    const user = await findUserByField('dni', dni);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    await pool.execute('UPDATE users SET lastLogin = NOW(), updatedAt = NOW() WHERE id = ?', [user.id]);

    if (user.role === 'patient') {
      const vueUrl = await generateVueMotionUrl(user.dni);
      return res.status(200).json({ redirectUrl: vueUrl });
    }

    const safeUser = sanitizeUser({ ...user, lastLogin: new Date() });
    return res.status(200).json({
      message: `Login exitoso como ${user.role}`,
      user: safeUser
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 *
 * Crea un nuevo usuario.
 * Solo pacientes pueden crearse sin contraseña.
 * Si no se envía una contraseña, se genera una simple.
 * Los usuarios administrativos deben tener contraseña.
 * No envia el correo inmediatamente, lo encola y luego es enviado.
 */

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, dni, email, password, role } = req.body;

    if (!firstName || !lastName || !dni || !email) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const existingUser = await findUserByField('dni', dni);
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe un usuario registrado con ese DNI' });
    }

    if (role !== 'patient' && !password) {
      return res.status(400).json({ message: 'Los usuarios administrativos deben tener contraseña' });
    }

    const rawPassword = password || generateSimplePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (firstName, lastName, dni, email, password, role, lastLogin, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NULL, NOW(), NOW())`,
      [firstName, lastName, dni, email, hashedPassword, role || 'patient']
    );

    const newUser = await getUserById(result.insertId);

    enqueueEmail(newUser, async (user) => {
      await sendPatientCreatedEmail(user); // sigue usando tu servicio existente
    });

    const safeUser = sanitizeUser(newUser);
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dni, email, role } = req.body;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (email && email !== user.email) {
      const [emailRows] = await pool.execute('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [email, id]);
      if (emailRows.length > 0) {
        return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
      }
    }

    if (dni && dni !== user.dni) {
      const [dniRows] = await pool.execute('SELECT id FROM users WHERE dni = ? AND id <> ? LIMIT 1', [dni, id]);
      if (dniRows.length > 0) {
        return res.status(400).json({ message: 'Ya existe un usuario con ese DNI' });
      }
    }

    const updatedFirstName = firstName || user.firstName;
    const updatedLastName = lastName || user.lastName;
    const updatedDni = dni || user.dni;
    const updatedEmail = email || user.email;
    const updatedRole = role || user.role;

    await pool.execute(
      `UPDATE users SET firstName = ?, lastName = ?, dni = ?, email = ?, role = ?, updatedAt = NOW()
       WHERE id = ?`,
      [updatedFirstName, updatedLastName, updatedDni, updatedEmail, updatedRole, id]
    );

    const updatedUser = await getUserById(id);

    const safeUser = sanitizeUser(updatedUser);
    res.status(200).json(safeUser);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT * FROM users');
    const safeUsers = users.map(sanitizeUser);
    res.status(200).json(safeUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createUser, updateUser, deleteUser, getUsers, loginUser };
