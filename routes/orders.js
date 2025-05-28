const express = require('express');
const router = express.Router();
const { getQuery } = require('../db');

// === ORDERS ===
router.get('/', async (req, res) => {
  try {
    const data = await getQuery('SELECT * FROM orders');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const data = await getQuery('SELECT count(distinct orderNumber) as Total_Orders FROM orders');
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/by-year-month', async (req, res) => {
  try {
    const data = await getQuery('SELECT  year(orderDate) as Year, MONTH(orderDate) AS Month, monthname(orderDate) as Month_Name, count(orderNumber) as Total_orders, sum( count(orderNumber) ) over ( partition by Year(orderDate) order by MONTH(orderDate) asc) as Sum_Of_Orders from orders group by Year,Month,Month_Name order by Year,Month asc');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/shipped', async (req, res) => {
  try {
    const data = await getQuery("select status, count(orderNumber) as Total_Orders from orders where status = 'Shipped'");
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/shipped-by-year', async (req, res) => {
  try {
    const data = await getQuery('select year(shippeddate) Year,count(shippeddate) Total_shipped from orders where shippeddate is not null group by year(shippeddate)');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;