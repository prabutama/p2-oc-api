const db = require('../db');

class ProductLinesController {
    // Get all product lines
    async getAllProductLines(req, res) {
        try {
            const [rows] = await db.execute('SELECT * FROM productlines');
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

    // Get total product lines count
    async getTotalProductLines(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT productLine) AS total_productLine 
                FROM productlines
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

    // Get product line by name
    async getProductLineByName(req, res) {
        try {
            const { productLine } = req.params;
            const [rows] = await db.execute(`
                SELECT * FROM productlines WHERE productLine = ?
            `, [productLine]);
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product line not found'
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

    // Get product lines with product count
    async getProductLinesWithCount(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT pl.*, COUNT(p.productCode) AS product_count
                FROM productlines pl
                LEFT JOIN products p ON pl.productLine = p.productLine
                GROUP BY pl.productLine
                ORDER BY product_count DESC
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

module.exports = new ProductLinesController();
