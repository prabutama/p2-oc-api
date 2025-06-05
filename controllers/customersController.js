const db = require('../db');

class CustomersController {
    // Get all customers
    async getAllCustomers(req, res) {
        try {
            const [rows] = await db.execute('SELECT * FROM customers');
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

    // Get customers with full name
    async getCustomersWithFullName(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, customerName,
                       CONCAT(contactFirstName, " ", contactLastName) AS fullName,
                       phone, city, country
                FROM customers
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

    // Get total unique customers
    async getTotalCustomers(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT customerNumber) AS total_customers 
                FROM customers
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

    // Get highest customers by country
    async getHighestCustomersByCountry(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT Country, COUNT(*) AS Total_Customers
                FROM customers
                GROUP BY country
                ORDER BY Total_Customers DESC
                LIMIT 1
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

    // Get highest customers by city
    async getHighestCustomersByCity(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT City, COUNT(*) AS Total_Customers
                FROM customers 
                GROUP BY city
                ORDER BY Total_Customers DESC
                LIMIT 2
            `);
            res.json({ 
                success: true, 
                data: rows
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get highest customers by state
    async getHighestCustomersByState(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT State, COUNT(*) AS Total_Customers
                FROM customers
                WHERE state IS NOT NULL
                GROUP BY State
                ORDER BY Total_Customers DESC
                LIMIT 1
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

    // Get customers without state
    async getCustomersWithoutState(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, customerName, city, country
                FROM customers
                WHERE state IS NULL
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

    // Get customers by credit limit range
    async getCustomersByCreditLimit(req, res) {
        try {
            const { min = 50000, max = 200000 } = req.query;
            const [rows] = await db.execute(`
                SELECT customerNumber, customerName, creditLimit
                FROM customers
                WHERE creditLimit BETWEEN ? AND ?
            `, [min, max]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                filters: { min_credit: min, max_credit: max }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get customers with high credit limit (above 100,000)
    async getHighCreditCustomers(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, customerName, creditLimit
                FROM customers 
                WHERE creditLimit > 100000
                ORDER BY creditLimit DESC
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

    // Get customer with highest credit limit
    async getHighestCreditCustomer(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, customerName, creditLimit
                FROM customers
                WHERE creditLimit = (SELECT MAX(creditLimit) FROM customers)
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

    // Get customer with lowest credit limit
    async getLowestCreditCustomer(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, customerName, creditLimit
                FROM customers
                WHERE creditLimit = (SELECT MIN(creditLimit) FROM customers)
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

    // Get customers without sales representative
    async getCustomersWithoutSalesRep(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, customerName, country, city
                FROM customers
                WHERE salesRepEmployeeNumber IS NULL
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

    // Get customer credit status categories
    async getCustomerCreditStatus(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber,
                       CONCAT(contactFirstName, contactLastName) AS Full_Name, 
                       creditLimit,
                       CASE 
                           WHEN creditLimit < 10000 THEN 'Low Credit Limit'
                           WHEN creditLimit BETWEEN 10000 AND 75000 THEN 'Medium Credit Limit'
                           WHEN creditLimit > 75000 THEN 'High Credit Limit'
                       END AS Customer_Credit_Status
                FROM customers
                ORDER BY creditLimit DESC
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

    // Get customers by contact name (Arnold or Sarah)
    async getCustomersByContactName(req, res) {
        try {
            const { names = ['arnold', 'sarah'] } = req.query;
            const placeholders = names.map(() => '?').join(',');
            const [rows] = await db.execute(`
                SELECT customerName, CONCAT(contactFirstName, " ", contactLastName) AS ContactName 
                FROM customers 
                WHERE contactFirstName IN (${placeholders})
            `, names);
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

    // Get customer details using stored procedure
    async getCustomerDetails(req, res) {
        try {
            const { customerName } = req.params;
            const [rows] = await db.execute('CALL Customer_Details(?)', [customerName]);
            res.json({ 
                success: true, 
                data: rows[0],
                customer: customerName
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = new CustomersController();
