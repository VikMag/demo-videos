const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email, password, rol } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const existingUser = await User.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email ya registrado' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = await User.create({ username, email, passwordHash, rol });
      
      res.status(201).json({ id: userId });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.getById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const allUsers = await User.getAll();
      const admins = allUsers.filter(u => u.rol === 'admin');
      
      if (admins.length <= 1 && user.rol === 'admin') {
        return res.status(400).json({ error: 'No se puede eliminar el último admin' });
      }

      await User.delete(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
};