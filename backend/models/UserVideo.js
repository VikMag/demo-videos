const db = require('../config/db');

module.exports = {
    getByUser: async (user_id) => {
        try {
          const [rows] = await db.execute(
            `SELECT 
              v.id,
              v.titulo,
              v.url,
              v.imagen,
              v.descripcion,
              c.nombre as categoria_nombre,
              uv.precio_pagado
             FROM videos v
             INNER JOIN user_videos uv ON v.id = uv.video_id
             INNER JOIN categorias c ON v.categoria_id = c.id
             WHERE uv.user_id = ?`,
            [user_id]
          );
          return rows;
        } catch (error) {
          console.error('Error en getByUser:', error);
          throw new Error('Error al obtener videos');
        }
      },

  addUserVideo: async (user_id, video_id, precio_pagado) => {
    const [result] = await db.execute(
      'INSERT INTO user_videos (user_id, video_id, precio_pagado) VALUES (?, ?, ?)',
      [user_id, video_id, precio_pagado]
    );
    return result.insertId;
  }
};