const express = require('express');
const router = express.Router();
const { getQuery } = require('../db');

// === CUSTOMERS ===
router.get('/', async (req, res) => {
  try {
    const data = await getQuery('SELECT * FROM customers');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/total', async (req, res) => {
  try {
    const data = await getQuery('SELECT count(distinct customerNumber) as total_customers FROM customers');
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// ...lanjutkan endpoint lain sesuai blok CUSTOMERS di server.js...

module.exports = router;
