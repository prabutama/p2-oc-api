const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');

// === EMPLOYEES ROUTES ===
router.get('/', employeesController.getAllEmployees);
router.get('/total', employeesController.getTotalEmployees);
router.get('/customers-per-rep', employeesController.getCustomersPerSalesRep);
router.get('/customer-assignments', employeesController.getEmployeeForCustomers);
router.get('/hierarchy', employeesController.getEmployeeHierarchy);
router.get('/executives', employeesController.getExecutives);
router.get('/title/:title', employeesController.getEmployeesByTitle);
router.get('/office/:officeCode', employeesController.getEmployeesByOffice);
router.get('/:employeeNumber', employeesController.getEmployeeById);

module.exports = router;