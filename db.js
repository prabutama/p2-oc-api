const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '165.22.97.18',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'kelompok1',
  password: process.env.DB_PASSWORD || 'kelompok1',
  database: process.env.DB_NAME || 'classicmodels',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getQuery(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function testConnection() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { getQuery, testConnection };
