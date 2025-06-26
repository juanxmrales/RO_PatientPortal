const bcrypt = require('bcrypt');
const User = require('../models/User');
const { findUserByField } = require('../utils/userUtils');
const { generateVueMotionUrl } = require('../services/vueMotionService');


const loginUser = async (req, res) => {
  try {
    const { dni, password } = req.body;

    // Validación básica. Mejorar a futuro
    // Podríamos usar una librería como Joi o express-validator para validaciones más robustas
    if (!dni || !password) {
      return res.status(400).json({ message: 'DNI y contraseña son requeridos' });
    }

    
    const user = await findUserByField('dni', dni);//Podemos buscar por email o dni. En este caso elegimos dni
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    if (user.role === 'patient') {
        const vueUrl = await generateVueMotionUrl(user.dni);
        return res.status(200).json({ redirectUrl: vueUrl });
    }else if (user.role === 'admin') {
        // Aquí podríamos redirigir a una página de administración o devolver un mensaje específico
        return res.status(200).json({ message: 'Login exitoso como administrador', user });
    }

    /*
    // Si todo OK, devolvemos el usuario (o un mensaje)
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        dni: user.dni,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
    */
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


const createUser = async (req, res) => {
  try {
    const { firstName, lastName, dni, email, password, role } = req.body;

    // Mejorar validacion
    if (!firstName || !lastName || !dni || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await findUserByField('dni', dni);
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe un usuario registrado con el DNI ingresado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      dni,
      email,
      password: hashedPassword,
      role: role || 'patient'
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createUser, getUsers, loginUser };

