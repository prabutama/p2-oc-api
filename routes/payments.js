const express = require('express');
const router = express.Router();
const { getQuery } = require('../db');

// === PAYMENTS ===
router.get('/', async (req, res) => {
  try {
    const data = await getQuery('SELECT * FROM payments');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/total-amount', async (req, res) => {
  try {
    const data = await getQuery('select sum(amount) Total_Amount from payments');
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/by-customer', async (req, res) => {
  try {
    const data = await getQuery('select customerNumber, sum(amount) as Total_Payment from payments group by customerNumber');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/by-year', async (req, res) => {
  try {
    const data = await getQuery('select year(paymentDate) as Year, sum(amount) as Total_Amount, sum(sum(amount)) over( order by Year(paymentDate)) as Sum_Of_Amount from payments group by Year order by Year');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/by-year-month', async (req, res) => {
  try {
    const data = await getQuery('select year(paymentDate) as Year, monthname(paymentDate) as Month_Name, sum(amount) as Total_Amount from payments group by Year,month(paymentDate),Month_Name order by Year,month(paymentDate),Month_Name');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;