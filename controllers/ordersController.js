const db = require('../db');

class OrdersController {
    // Get all orders
    async getAllOrders(req, res) {
        try {
            const [rows] = await db.execute('SELECT * FROM orders');
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

    // Get total number of orders
    async getTotalOrders(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT orderNumber) AS Total_Orders 
                FROM orders
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

    // Get orders by year and month
    async getOrdersByYearMonth(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT YEAR(orderDate) AS Year,
                       MONTH(orderDate) AS Month,
                       MONTHNAME(orderDate) AS Month_Name,
                       COUNT(orderNumber) AS Total_orders,
                       SUM(COUNT(orderNumber)) OVER (
                           PARTITION BY YEAR(orderDate) 
                           ORDER BY MONTH(orderDate) ASC
                       ) AS Sum_Of_Orders
                FROM orders
                GROUP BY Year, Month, Month_Name
                ORDER BY Year, Month ASC
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

    // Get shipped orders count
    async getShippedOrders(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT status, COUNT(orderNumber) AS Total_Orders 
                FROM orders 
                WHERE status = 'Shipped'
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

    // Get orders shipped by year
    async getShippedOrdersByYear(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT YEAR(shippedDate) AS Year, 
                       COUNT(shippedDate) AS Total_shipped
                FROM orders
                WHERE shippedDate IS NOT NULL
                GROUP BY YEAR(shippedDate)
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

    // Get number of orders by customer
    async getOrdersCountByCustomer(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT customerNumber, COUNT(*) AS Total_Orders
                FROM orders
                GROUP BY customerNumber
                ORDER BY COUNT(*) DESC
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

    // Get customer delivery time analysis
    async getCustomerDeliveryTime(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT c.customerName, 
                       DATEDIFF(o.shippedDate, o.orderDate) AS Total_Days
                FROM customers c 
                JOIN orders o ON c.customerNumber = o.customerNumber
                WHERE o.shippedDate IS NOT NULL
                ORDER BY Total_Days DESC
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

    // Get orders by status
    async getOrdersByStatus(req, res) {
        try {
            const { status } = req.params;
            const [rows] = await db.execute(`
                SELECT * FROM orders WHERE status = ?
                ORDER BY orderDate DESC
            `, [status]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                status: status
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get on hold orders with details
    async getOnHoldOrders(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT o.status, o.customerNumber, c.customerName, 
                       od.orderNumber, COUNT(od.productCode) AS Total_products,
                       SUM(od.quantityOrdered * od.priceEach) AS Total_Price 
                FROM orders o 
                JOIN customers c ON o.customerNumber = c.customerNumber
                JOIN orderdetails od ON o.orderNumber = od.orderNumber
                WHERE o.status = 'On Hold'
                GROUP BY o.status, o.customerNumber, c.customerName, od.orderNumber
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

    // Get order by number
    async getOrderByNumber(req, res) {
        try {
            const { orderNumber } = req.params;
            const [rows] = await db.execute(`
                SELECT o.*, c.customerName, c.contactFirstName, c.contactLastName
                FROM orders o
                JOIN customers c ON o.customerNumber = c.customerNumber
                WHERE o.orderNumber = ?
            `, [orderNumber]);
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
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

    // Get order details with products
    async getOrderDetails(req, res) {
        try {
            const { orderNumber } = req.params;
            const [rows] = await db.execute(`
                SELECT od.*, p.productName, p.productLine
                FROM orderdetails od
                JOIN products p ON od.productCode = p.productCode
                WHERE od.orderNumber = ?
            `, [orderNumber]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                orderNumber: orderNumber
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = new OrdersController();
