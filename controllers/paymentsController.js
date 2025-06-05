const db = require('../db');

class PaymentsController {
    // Get all payments
    async getAllPayments(req, res) {
        try {
            const [rows] = await db.execute('SELECT * FROM payments');
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

    // Get total amount received
    async getTotalAmount(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT SUM(amount) AS Total_Amount 
                FROM payments
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

    // Get total amount paid by customers
    async getPaymentsByCustomer(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, SUM(amount) AS Total_Payment
                FROM payments 
                GROUP BY customerNumber
                ORDER BY Total_Payment DESC
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

    // Get payments by year
    async getPaymentsByYear(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT YEAR(paymentDate) AS Year,
                       SUM(amount) AS Total_Amount,
                       SUM(SUM(amount)) OVER(ORDER BY YEAR(paymentDate)) AS Sum_Of_Amount
                FROM payments
                GROUP BY Year
                ORDER BY Year
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

    // Get payments by year and month
    async getPaymentsByYearMonth(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT YEAR(paymentDate) AS Year,
                       MONTHNAME(paymentDate) AS Month_Name,
                       SUM(amount) AS Total_Amount
                FROM payments
                GROUP BY Year, MONTH(paymentDate), Month_Name 
                ORDER BY Year, MONTH(paymentDate), Month_Name
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

    // Get payment by customer number
    async getPaymentByCustomer(req, res) {
        try {
            const { customerNumber } = req.params;
            const [rows] = await db.execute(`
                SELECT p.*, c.customerName, c.contactFirstName, c.contactLastName
                FROM payments p
                JOIN customers c ON p.customerNumber = c.customerNumber
                WHERE p.customerNumber = ?
                ORDER BY p.paymentDate DESC
            `, [customerNumber]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                customerNumber: customerNumber
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get customers with payments above average
    async getCustomersAboveAveragePayment(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT c.customerNumber, c.customerName, p.amount  
                FROM customers c 
                JOIN payments p ON c.customerNumber = p.customerNumber
                WHERE p.amount > (SELECT AVG(amount) FROM payments)
                ORDER BY p.amount DESC
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

    // Get payment statistics
    async getPaymentStatistics(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    COUNT(*) AS total_payments,
                    SUM(amount) AS total_amount,
                    AVG(amount) AS average_amount,
                    MIN(amount) AS min_amount,
                    MAX(amount) AS max_amount,
                    MIN(paymentDate) AS earliest_payment,
                    MAX(paymentDate) AS latest_payment
                FROM payments
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

    // Get payments by date range
    async getPaymentsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'startDate and endDate parameters are required'
                });
            }

            const [rows] = await db.execute(`
                SELECT p.*, c.customerName
                FROM payments p
                JOIN customers c ON p.customerNumber = c.customerNumber
                WHERE p.paymentDate BETWEEN ? AND ?
                ORDER BY p.paymentDate DESC
            `, [startDate, endDate]);
            
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                dateRange: { startDate, endDate }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get top paying customers
    async getTopPayingCustomers(req, res) {
        try {
            const { limit = 10 } = req.query;
            const [rows] = await db.execute(`
                SELECT c.customerNumber, c.customerName, 
                       SUM(p.amount) AS Total_Payment,
                       COUNT(p.checkNumber) AS Payment_Count
                FROM customers c
                JOIN payments p ON c.customerNumber = p.customerNumber
                GROUP BY c.customerNumber, c.customerName
                ORDER BY Total_Payment DESC
                LIMIT ?
            `, [parseInt(limit)]);
            
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                limit: parseInt(limit)
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = new PaymentsController();
