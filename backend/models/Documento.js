const db = require('../config/db');

module.exports = {
  // Obtener todos los documentos
  getAll: async () => {
    const [rows] = await db.execute('SELECT id, nombre, url, video_is FROM documentos');
    return rows;
  },

  // Obtener un documento por id
  getByVideoId: async (video_id) => {
    const [rows] = await db.execute('SELECT id, nombre, url, video_id FROM documentos where video_id = ?', [video_id]);
    return rows; 
  },

  // Crear nuevo usuario
  create: async ({ nombre, url, video_id}) => {
    const [result] = await db.execute(
      `INSERT INTO documentos (nombre, url, video_id) 
       VALUES (?, ?, ?)`,
      [nombre, url, video_id]
    );
    return result.insertId;
  },

  // Eliminar usuario
  delete: async (id) => {
    await db.execute('DELETE FROM documentos WHERE id = ?', [id]);
  }
};
