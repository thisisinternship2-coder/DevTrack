require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 60) + '...' : 'MISSING');

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
    console.error('❌ DB Error Details:');
    console.error('  name:', err.name);
    console.error('  message:', err.message);
    console.error('  code:', err.code);
    console.error('  stack:', err.stack);
    console.error('  full:', JSON.stringify(err, null, 2));
  });

module.exports = pool;