const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1', 
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

const db = {
  execute: async (sql, params = []) => {
    return await pool.execute(sql, params);
  },
  query: async (sql, params = []) => {
    return await pool.query(sql, params);
  }
};

module.exports = { getQuery, testConnection, ...db };
