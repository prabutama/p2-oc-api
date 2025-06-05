const db = require('../db');

class ProductsController {
    // Get all products
    async getAllProducts(req, res) {
        try {
            const [rows] = await db.execute('SELECT * FROM products');
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

    // Get total products count
    async getTotalProducts(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT productCode) AS Total_Products 
                FROM products
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

    // Get products by product line
    async getProductsByLine(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT productLine, COUNT(productCode) AS Total_Products
                FROM products
                GROUP BY productLine
                ORDER BY Total_Products DESC
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

    // Get quantity in stock by product line
    async getStockByProductLine(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT productLine, SUM(quantityInStock) AS Quantity_In_Stock 
                FROM products 
                GROUP BY productLine
                ORDER BY Quantity_In_Stock DESC
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

    // Get total vendors
    async getTotalVendors(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT productVendor) AS Total_Vendors 
                FROM products
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

    // Get products ordered by vendor
    async getProductsByVendor(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT p.productVendor,
                       COUNT(DISTINCT p.productCode) AS Total_Products,
                       SUM(od.quantityOrdered) AS Total_quantity,
                       SUM(od.quantityOrdered * od.priceEach) AS Total_price 
                FROM products p 
                INNER JOIN orderdetails od ON p.productCode = od.productCode
                GROUP BY p.productVendor
                ORDER BY Total_Products DESC
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

    // Get total orders by product
    async getOrdersByProduct(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT p.productCode, p.productName, 
                       SUM(od.quantityOrdered) AS Total_quantity 
                FROM products p 
                INNER JOIN orderdetails od ON p.productCode = od.productCode
                GROUP BY p.productCode, p.productName
                ORDER BY Total_quantity DESC
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

    // Get products purchased by specific customer
    async getProductsByCustomer(req, res) {
        try {
            const { customerName } = req.params;
            const [rows] = await db.execute(`
                SELECT p.productName, 
                       CONCAT(c.contactFirstName, ' ', c.contactLastName) AS c_name 
                FROM customers c 
                INNER JOIN orders o ON c.customerNumber = o.customerNumber
                INNER JOIN orderdetails od ON o.orderNumber = od.orderNumber
                INNER JOIN products p ON od.productCode = p.productCode
                WHERE c.customerName LIKE ?
            `, [`%${customerName}%`]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                customer: customerName
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get product with highest number of customers
    async getProductWithMostCustomers(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT p.productCode, p.productName, COUNT(*) AS Total_customers 
                FROM customers c 
                INNER JOIN orders o ON c.customerNumber = o.customerNumber
                INNER JOIN orderdetails od ON o.orderNumber = od.orderNumber
                INNER JOIN products p ON p.productCode = od.productCode
                GROUP BY p.productCode, p.productName
                ORDER BY Total_customers DESC
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

    // Get product by code
    async getProductByCode(req, res) {
        try {
            const { productCode } = req.params;
            const [rows] = await db.execute(`
                SELECT * FROM products WHERE productCode = ?
            `, [productCode]);
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
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

    // Get product details using stored procedure
    async getProductDetails(req, res) {
        try {
            const { productCode } = req.params;
            const [rows] = await db.execute('CALL Product_Details(?)', [productCode]);
            res.json({ 
                success: true, 
                data: rows[0],
                productCode: productCode
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get products by price range
    async getProductsByPriceRange(req, res) {
        try {
            const { minPrice = 0, maxPrice = 1000 } = req.query;
            const [rows] = await db.execute(`
                SELECT * FROM products 
                WHERE buyPrice BETWEEN ? AND ?
                ORDER BY buyPrice ASC
            `, [minPrice, maxPrice]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                priceRange: { minPrice, maxPrice }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get low stock products
    async getLowStockProducts(req, res) {
        try {
            const { threshold = 100 } = req.query;
            const [rows] = await db.execute(`
                SELECT productCode, productName, quantityInStock, productLine
                FROM products 
                WHERE quantityInStock < ?
                ORDER BY quantityInStock ASC
            `, [threshold]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                threshold: threshold
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = new ProductsController();
