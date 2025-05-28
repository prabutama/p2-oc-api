const express = require('express');
const router = express.Router();
const { getQuery } = require('../db');

// === OFFICES ===
router.get('/', async (req, res) => {
  try {
    const data = await getQuery('SELECT * FROM offices');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const data = await getQuery('SELECT count(distinct officeCode) as Total_Offices FROM offices');
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/by-country', async (req, res) => {
  try {
    const data = await getQuery('SELECT country , count(officeCode) as Total_Offices FROM offices group by country order by Total_Offices desc');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;