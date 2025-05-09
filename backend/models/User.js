const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,    
  port:  5432,   
  ssl: {
    rejectUnauthorized: false       // Obligatorio en Render
  }
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
  create: async ({ username, email, passwordHash, rol  }) => {
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