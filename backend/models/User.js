const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usa la variable de Render
  ssl: { rejectUnauthorized: false } // Obligatorio para Render
});

module.exports = {
  // Obtener todos los usuarios (excepto admin)
  getAll: async () => {
    const { rows } = await pool.query('SELECT id, username, email, rol, created_at FROM users WHERE rol != $1', ['admin']);
    return rows;
  },

  // Obtener un usuario por email
  getByEmail: async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Obtener un usuario por id
  getById: async (id) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Crear nuevo usuario
  create: async ({ username, email, passwordHash, rol = 'estudiante' }) => {
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash, rol) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`, // PostgreSQL devuelve el id con RETURNING
      [username, email, passwordHash, rol]
    );
    return rows[0].id; // Accedemos al id insertado
  },

  // Eliminar usuario
  delete: async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
};