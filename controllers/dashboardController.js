const db = require('../db');

class DashboardController {
    // Get dashboard overview statistics
    async getDashboardOverview(req, res) {
        try {
            // Get multiple statistics in parallel
            const [
                customersCount,
                ordersCount,
                totalRevenue,
                productsCount,
                officesCount,
                employeesCount
            ] = await Promise.all([
                db.execute('SELECT COUNT(DISTINCT customerNumber) AS Total_Customers FROM customers'),
                db.execute('SELECT COUNT(DISTINCT orderNumber) AS Total_Orders FROM orders'),
                db.execute('SELECT SUM(amount) AS Total_Amount FROM payments'),
                db.execute('SELECT COUNT(DISTINCT productCode) AS Total_Products FROM products'),
                db.execute('SELECT COUNT(DISTINCT officeCode) AS Total_Offices FROM offices'),
                db.execute('SELECT COUNT(DISTINCT employeeNumber) AS Total_Employees FROM employees')
            ]);

            const overview = {
                customers: customersCount[0][0]?.Total_Customers || 0,
                orders: ordersCount[0][0]?.Total_Orders || 0,
                revenue: totalRevenue[0][0]?.Total_Amount || 0,
                products: productsCount[0][0]?.Total_Products || 0,
                offices: officesCount[0][0]?.Total_Offices || 0,
                employees: employeesCount[0][0]?.Total_Employees || 0
            };

            res.json({ 
                success: true, 
                data: overview,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get sales performance by month for current year
    async getSalesPerformance(req, res) {
        try {
            const currentYear = new Date().getFullYear();
            const [rows] = await db.execute(`
                SELECT 
                    MONTH(o.orderDate) AS month,
                    MONTHNAME(o.orderDate) AS month_name,
                    COUNT(DISTINCT o.orderNumber) AS total_orders,
                    COALESCE(SUM(od.quantityOrdered * od.priceEach), 0) AS total_sales
                FROM orders o
                LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber
                WHERE YEAR(o.orderDate) = ?
                GROUP BY MONTH(o.orderDate), MONTHNAME(o.orderDate)
                ORDER BY MONTH(o.orderDate)
            `, [currentYear]);

            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                year: currentYear
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get top performing products
    async getTopProducts(req, res) {
        try {
            const { limit = 10 } = req.query;
            const limitValue = parseInt(limit);
            const [rows] = await db.execute(
                `SELECT 
                    p.productCode,
                    p.productName,
                    p.productLine,
                    SUM(od.quantityOrdered) AS total_quantity_sold,
                    SUM(od.quantityOrdered * od.priceEach) AS total_revenue
                FROM products p
                JOIN orderdetails od ON p.productCode = od.productCode
                GROUP BY p.productCode, p.productName, p.productLine
                ORDER BY total_revenue DESC
                LIMIT ` + limitValue
            );

            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                limit: limitValue
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get customer growth trend
    async getCustomerGrowth(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    YEAR(o.orderDate) AS order_year,
                    MONTH(o.orderDate) AS order_month,
                    COUNT(DISTINCT o.customerNumber) AS customers_with_orders
                FROM orders o
                GROUP BY YEAR(o.orderDate), MONTH(o.orderDate)
                ORDER BY order_year, order_month
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

    // Get regional performance
    async getRegionalPerformance(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    c.country,
                    COUNT(DISTINCT c.customerNumber) AS total_customers,
                    COUNT(DISTINCT o.orderNumber) AS total_orders,
                    COALESCE(SUM(p.amount), 0) AS total_payments
                FROM customers c
                LEFT JOIN orders o ON c.customerNumber = o.customerNumber
                LEFT JOIN payments p ON c.customerNumber = p.customerNumber
                GROUP BY c.country
                ORDER BY total_payments DESC
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

    // Get order status distribution
    async getOrderStatusDistribution(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    status,
                    COUNT(*) AS count,
                    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders)) AS percentage
                FROM orders
                GROUP BY status
                ORDER BY count DESC
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
}

module.exports = new DashboardController();
