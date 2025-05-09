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

const insertCategorias = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Asegurarse de que 'nombre' sea único para poder usar ON CONFLICT
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'unique_nombre'
        ) THEN
          ALTER TABLE categorias ADD CONSTRAINT unique_nombre UNIQUE (nombre);
        END IF;
      END
      $$;
    `);

    const categorias = [
      'Recursos Humanos',
      'Ingeniería Industrial',
      'Tecnologías de la Información',
      'Marketing',
      'Contabilidad',
      'Administración',
      'Diseño Gráfico',
      'Educación',
      'Salud',
      'Logística'
    ];

    for (const nombre of categorias) {
      await client.query(
        `INSERT INTO categorias (nombre) VALUES ($1)
         ON CONFLICT (nombre) DO NOTHING;`,
        [nombre]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Categorías insertadas correctamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al insertar categorías:', error.message);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
};

insertCategorias()
  .catch(e => {
    console.error('Error en la ejecución:', e);
    process.exit(1);
  });
