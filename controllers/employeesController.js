const db = require('../db');

class EmployeesController {
    // Get all employees
    async getAllEmployees(req, res) {
        try {
            const [rows] = await db.execute('SELECT * FROM employees');
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get total unique employees
    async getTotalEmployees(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT employeeNumber) AS Total_Employees 
                FROM employees
            `);
            res.json({ 
                success: true, 
                data: rows[0]
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get number of customers for each sales representative
    async getCustomersPerSalesRep(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT e.employeeNumber,
                       CONCAT(e.firstName, " ", e.lastName) AS FullName,
                       COUNT(*) AS Total_customers
                FROM customers c 
                JOIN employees e ON c.salesRepEmployeeNumber = e.employeeNumber
                WHERE salesRepEmployeeNumber IS NOT NULL
                GROUP BY e.employeeNumber, FullName
                ORDER BY Total_customers DESC
            `);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get employee for each customer
    async getEmployeeForCustomers(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT c.customerNumber, c.customerName,
                       CONCAT(e.firstName, " ", e.lastName) AS Employee_Name
                FROM customers c 
                JOIN employees e ON c.salesRepEmployeeNumber = e.employeeNumber
                WHERE salesRepEmployeeNumber IS NOT NULL
            `);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get employees who are reported to and count of their subordinates
    async getEmployeeHierarchy(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT reportsTo, COUNT(*) AS Employees
                FROM employees
                WHERE reportsTo IS NOT NULL
                GROUP BY reportsTo
                ORDER BY Employees DESC
            `);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get executives with VP or Manager titles
    async getExecutives(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT employeeNumber,
                       CONCAT(firstName, " ", lastName) AS EmployeeName,
                       jobTitle 
                FROM employees
                WHERE jobTitle LIKE '%VP%' OR jobTitle LIKE '%Manager%'
            `);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get employees by job title
    async getEmployeesByTitle(req, res) {
        try {
            const { title } = req.params;
            const [rows] = await db.execute(`
                SELECT employeeNumber,
                       CONCAT(firstName, " ", lastName) AS EmployeeName,
                       jobTitle, email, officeCode
                FROM employees
                WHERE jobTitle LIKE ?
            `, [`%${title}%`]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                filter: title
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get employee by ID
    async getEmployeeById(req, res) {
        try {
            const { employeeNumber } = req.params;
            const [rows] = await db.execute(`
                SELECT * FROM employees WHERE employeeNumber = ?
            `, [employeeNumber]);
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found'
                });
            }

            res.json({ 
                success: true, 
                data: rows[0]
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get employees by office
    async getEmployeesByOffice(req, res) {
        try {
            const { officeCode } = req.params;
            const [rows] = await db.execute(`
                SELECT e.*, o.city, o.country
                FROM employees e
                JOIN offices o ON e.officeCode = o.officeCode
                WHERE e.officeCode = ?
            `, [officeCode]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                office: officeCode
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = new EmployeesController();
