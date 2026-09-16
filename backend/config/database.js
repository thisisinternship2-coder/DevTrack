const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then((client) => {
    console.log('✅ Postgres Connected');
    client.release();
  })
  .catch((err) => {
    console.error('❌ DB Error:', err.message);
  });

module.exports = pool;