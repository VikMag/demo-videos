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
  

const createTables = async () => {
  try {
    await pool.query(`
      -- Tabla categorias
      CREATE TABLE categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL
      );

      -- Tabla users
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        rol VARCHAR(20) CHECK (rol IN ('estudiante', 'profesor', 'admin')) DEFAULT 'estudiante',
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Tabla videos
      CREATE TABLE videos (
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

      -- Tabla documentos
      CREATE TABLE documentos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        video_id INTEGER NOT NULL,
        CONSTRAINT fk_video
          FOREIGN KEY (video_id)
          REFERENCES videos(id)
          ON DELETE CASCADE
      );

      -- Tabla user_videos
      CREATE TABLE user_videos (
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
    console.log('✅ Tablas creadas exitosamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error.message);
  } finally {
    pool.end();
  }
};

createTables();