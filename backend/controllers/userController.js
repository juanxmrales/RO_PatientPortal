const bcrypt = require('bcrypt');
const User = require('../models/User');
const { findUserByField } = require('../utils/userUtils');
const { generateVueMotionUrl } = require('../services/vueMotionService');
const {sanitizeUser} = require('../utils/userUtils');



const loginUser = async (req, res) => {
  try {
    const { dni, password } = req.body;
    
    //A futuro usar joi o express-validator para validar los campos
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

    await user.update({ lastLogin: new Date() });

     if (user.role === 'patient') {
      const vueUrl = await generateVueMotionUrl(user.dni);
      return res.status(200).json({ redirectUrl: vueUrl });
    }

    // Para admin y admission
    const safeUser = sanitizeUser(user);
    return res.status(200).json({
      message: `Login exitoso como ${user.role}`,
      user: safeUser
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, dni, email, password, role } = req.body;

    if (!firstName || !lastName || !dni || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const existingUser = await findUserByField('dni', dni);
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe un usuario registrado con ese DNI' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      dni,
      email,
      password: hashedPassword,
      role: role || 'patient',
    });

    const safeUser = sanitizeUser(newUser);
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    const safeUsers = users.map(sanitizeUser);
    res.status(200).json(safeUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createUser, getUsers, loginUser };
