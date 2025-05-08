const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,    
  port: process.env.PORT || 5432,   
  ssl: {
    rejectUnauthorized: false       // Obligatorio en Render
  }
});

module.exports = {
  getAll: async () => {
    const { rows } = await pool.query(`
      SELECT v.*, c.nombre AS categoria_nombre 
      FROM videos v
      JOIN categorias c ON v.categoria_id = c.id
    `);
    return rows;
  },
  
  getAllCategories: async () => {
    const { rows } = await pool.query(`
      SELECT * 
      FROM categorias
    `);
    return rows;
  },

  // Create video
  create: async ({ titulo, url, categoria_id, precio, imagen, descripcion }) => {
    const { rows } = await pool.query(
      `INSERT INTO videos 
        (titulo, url, categoria_id, precio, imagen, descripcion) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [titulo, url, categoria_id, precio, imagen, descripcion]
    );
    return rows[0].id;
  },

  // Update video
  update: async (id, { titulo, url, categoria_id, precio, imagen, descripcion }) => {
    await pool.query(
      `UPDATE videos 
       SET titulo = $1, 
           url = $2, 
           categoria_id = $3, 
           precio = $4, 
           imagen = $5, 
           descripcion = $6 
       WHERE id = $7`,
      [titulo, url, categoria_id, precio, imagen, descripcion, id]
    );
  },

  // Delete video
  delete: async (id) => {
    await pool.query('DELETE FROM videos WHERE id = $1', [id]);
  }
};