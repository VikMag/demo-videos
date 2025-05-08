const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },
  // Obtener todos los usuarios
  getUserById: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.getById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  },

  // Crear nuevo usuario
  createUser: async (req, res) => {
    const { username, email, password, rol } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
      // Verificar si el email ya existe
      const existingUser = await User.getAll();
      if (existingUser.find(user => user.email === email)) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Hashear la contraseña
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Crear el usuario en la base de datos
      const userId = await User.create({ username, email, passwordHash, rol });

      res.status(201).json({ id: userId, message: 'Usuario creado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  // Eliminar usuario
  deleteUser: async (req, res) => {
    const userId = req.params.id;

    try {
      // Verificar si el usuario existe
      const users = await User.getAll();
      const user = users.find(u => u.id === parseInt(userId));

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Evitar eliminar el último administrador
      const admins = users.filter(u => u.rol === 'admin');
      if (admins.length <= 1 && user.rol === 'admin') {
        return res.status(400).json({ error: 'No se puede eliminar el último administrador' });
      }

      // Eliminar usuario
      await User.delete(userId);
      res.json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
};
