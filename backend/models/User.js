const db = require('../config/db');

module.exports = {
  // Obtener todos los usuarios
  getAll: async () => {
    const [rows] = await db.execute('SELECT id, username, email, rol, created_at FROM users where rol != "admin"');
    return rows;
  },

  // Obtener un usuario por email
  getByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null; // Devuelve el primer usuario o null si no se encuentra
  },

  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null; // Devuelve el primer usuario o null si no se encuentra
  },
  // Crear nuevo usuario
  create: async ({ username, email, passwordHash, rol }) => {
    const [result] = await db.execute(
      `INSERT INTO users (username, email, password_hash, rol) 
       VALUES (?, ?, ?, ?)`,
      [username, email, passwordHash, rol || 'estudiante']
    );
    return result.insertId;
  },

  // Eliminar usuario
  delete: async (id) => {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
  }
};
