const db = require('../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT v.*, c.nombre AS categoria_nombre 
      FROM videos v
      JOIN categorias c ON v.categoria_id = c.id
    `);
    return rows;
  },
  
  getAllCategories: async () => {
    const [rows] = await db.execute(`
      SELECT * 
      FROM categorias
    `);
    return rows;
  },
  // Crear video
  create: async ({ titulo, url, categoria_id, precio, imagen, descripcion }) => {
    const [result] = await db.execute(
      'INSERT INTO videos (titulo, url, categoria_id, precio, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, url, categoria_id, precio, imagen, descripcion]
    );
    return result.insertId;
  },

  // Actualizar video
  update: async (id, { titulo, url, categoria_id, precio, imagen, descripcion }) => {
    await db.execute(
      'UPDATE videos SET titulo = ?, url = ?, categoria_id = ?, precio = ?, imagen = ?, descripcion = ? WHERE id = ?',
      [titulo, url, categoria_id, precio, imagen, descripcion, id]
    );
  },

  // Eliminar video
  delete: async (id) => {
    await db.execute('DELETE FROM videos WHERE id = ?', [id]);
  }
};