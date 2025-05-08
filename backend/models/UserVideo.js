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
  getByUser: async (user_id) => {
    try {
      const { rows } = await pool.query(
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
         WHERE uv.user_id = $1`,
        [user_id]
      );
      return rows;
    } catch (error) {
      console.error('Error in getByUser:', error);
      throw new Error('Error fetching videos');
    }
  },

  addUserVideo: async (user_id, video_id, precio_pagado) => {
    const { rows } = await pool.query(
      `INSERT INTO user_videos (user_id, video_id, precio_pagado) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [user_id, video_id, precio_pagado]
    );
    return rows[0].id;
  }
};