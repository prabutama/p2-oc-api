const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customersController');

// === CUSTOMERS ROUTES ===
router.get('/', customersController.getAllCustomers);
router.get('/total', customersController.getTotalCustomers);
router.get('/fullname', customersController.getCustomersWithFullName);
router.get('/top-country', customersController.getHighestCustomersByCountry);
router.get('/top-city', customersController.getHighestCustomersByCity);
router.get('/top-state', customersController.getHighestCustomersByState);
router.get('/without-state', customersController.getCustomersWithoutState);
router.get('/credit-limit', customersController.getCustomersByCreditLimit);
router.get('/high-credit', customersController.getHighCreditCustomers);
router.get('/highest-credit', customersController.getHighestCreditCustomer);
router.get('/lowest-credit', customersController.getLowestCreditCustomer);
router.get('/without-sales-rep', customersController.getCustomersWithoutSalesRep);
router.get('/credit-status', customersController.getCustomerCreditStatus);
router.get('/contact-names', customersController.getCustomersByContactName);
router.get('/:customerName/details', customersController.getCustomerDetails);

module.exports = router;
