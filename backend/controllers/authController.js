const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await User.getAll(); // Método que consulta todos los usuarios
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios.' });
    }
  },
  register: async (req, res) => {
    try {
      const { email, username, password, role } = req.body;
      const password_hash = await bcrypt.hash(password, 10);
      const userId = await User.create({ username, email, passwordHash: password_hash, rol: role });
      res.status(201).json({ id: userId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  login: async (req, res) => {
    const { email, password } = req.body;
    
    // Obtener el usuario por su email
    const user = await User.getByEmail(email); // Aquí se usa el método correcto, getByEmail
    
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generamos el token
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Enviamos el token y los datos del usuario
    res.json({ token, rol: user.rol, username: user.username, id: user.id });
  }
};
