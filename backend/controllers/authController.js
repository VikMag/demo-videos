const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      const publicUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        rol: user.rol,
        created_at: user.created_at
      }));
      res.status(200).json(publicUsers);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  register: async (req, res) => {
    try {
      const { email, username, password, role } = req.body;
      
      const existingUser = await User.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const userId = await User.create({ 
        username, 
        email, 
        passwordHash: password_hash, 
        rol: role 
      });
      
      res.status(201).json({ id: userId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  login: async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.getByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, rol: user.rol, username: user.username, id: user.id });
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.getById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const publicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        rol: user.rol
      };
      
      res.status(200).json(publicUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  }
};