const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,        
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,    
    port: 5432,   
    ssl: {
      rejectUnauthorized: false
    }
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    // Iniciamos una transacción para asegurar la integridad
    await client.query('BEGIN');

    // 1. Primero creamos la tabla categorias (no tiene dependencias)
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL
      );
    `);

    // 2. Luego la tabla users (no tiene dependencias)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(20) CHECK (rol IN ('estudiante', 'profesor', 'admin')) DEFAULT 'estudiante',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Ahora videos (depende de categorias)
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        categoria_id INTEGER NOT NULL,
        precio DECIMAL(10,2) DEFAULT 0.00,
        imagen VARCHAR(255),
        descripcion TEXT,
        CONSTRAINT fk_categoria 
          FOREIGN KEY (categoria_id) 
          REFERENCES categorias(id)
      );
    `);

    // 4. Luego documentos (depende de videos)
    await client.query(`
      CREATE TABLE IF NOT EXISTS documentos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        video_id INTEGER NOT NULL,
        CONSTRAINT fk_video
          FOREIGN KEY (video_id)
          REFERENCES videos(id)
          ON DELETE CASCADE
      );
    `);

    // 5. Finalmente user_videos (depende de users y videos)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_videos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        video_id INTEGER NOT NULL,
        precio_pagado DECIMAL(10,2) NOT NULL,
        CONSTRAINT unique_user_video 
          UNIQUE (user_id, video_id),
        CONSTRAINT fk_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_video
          FOREIGN KEY (video_id)
          REFERENCES videos(id)
          ON DELETE CASCADE
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Todas las tablas creadas exitosamente en el orden correcto');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear tablas:', error.message);
    throw error; // Relanzamos el error para manejo externo
  } finally {
    client.release();
    pool.end();
  }
};

// Ejecutamos con manejo de errores adecuado
createTables()
  .catch(e => {
    console.error('Error en la ejecución:', e);
    process.exit(1);
  });