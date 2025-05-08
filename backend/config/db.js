// db.js (Nueva versión para PostgreSQL)
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432, // Puerto por defecto de PostgreSQL
  ssl: { rejectUnauthorized: false } // Necesario en Render
});

module.exports = pool;