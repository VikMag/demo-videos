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
  // Obtener todos los documentos
  getAll: async () => {
    const { rows } = await pool.query('SELECT id, nombre, url, video_id FROM documentos');
    return rows;
  },

  // Obtener un documento por video_id
  getByVideoId: async (video_id) => {
    const { rows } = await pool.query(
      'SELECT id, nombre, url, video_id FROM documentos WHERE video_id = $1', 
      [video_id]
    );
    return rows;
  },

  // Crear nuevo documento
  create: async ({ nombre, url, video_id }) => {
    const { rows } = await pool.query(
      `INSERT INTO documentos (nombre, url, video_id) 
       VALUES ($1, $2, $3) 
       RETURNING id`, // PostgreSQL retorna el id insertado con RETURNING
      [nombre, url, video_id]
    );
    return rows[0].id; // Accedemos al id desde el primer elemento de rows
  },

  // Eliminar documento
  delete: async (id) => {
    await pool.query('DELETE FROM documentos WHERE id = $1', [id]);
  }
};