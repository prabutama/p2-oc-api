const express = require('express');
const router = express.Router();
const { getQuery } = require('../db');

// === EMPLOYEES ===
router.get('/', async (req, res) => {
  try {
    const data = await getQuery('SELECT * FROM employees');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/total', async (req, res) => {
  try {
    const data = await getQuery('SELECT count(distinct employeeNumber) as Total_Employees FROM employees');
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/null', async (req, res) => {
  try {
    const data = await getQuery('SELECT employeeNumber FROM employees WHERE employeeNumber IS NULL');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/executives', async (req, res) => {
  try {
    const data = await getQuery('SELECT employeenumber,concat(firstname," ",lastname) EmployeeName,jobtitle FROM employees WHERE jobtitle like "%VP%" or jobtitle like "%Manager%"');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/reporting-structure', async (req, res) => {
  try {
    const data = await getQuery('SELECT Reportsto,count(*) Employees FROM employees WHERE reportsto is not null GROUP BY reportsto ORDER BY Employees desc');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;