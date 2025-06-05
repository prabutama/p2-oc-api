const express = require('express');
const router = express.Router();
const officesController = require('../controllers/officesController');

// === OFFICES ROUTES ===
router.get('/', officesController.getAllOffices);
router.get('/total', officesController.getTotalOffices);
router.get('/by-country', officesController.getOfficesByCountry);
router.get('/with-employee-count', officesController.getOfficesWithEmployeeCount);
router.get('/city/:city', officesController.getOfficesByCity);
router.get('/:officeCode', officesController.getOfficeByCode);

module.exports = router;