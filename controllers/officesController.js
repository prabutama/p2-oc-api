const db = require('../db');

class OfficesController {
    // Get all offices
    async getAllOffices(req, res) {
        try {
            const [rows] = await db.execute('SELECT * FROM offices');
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

    // Get total unique offices
    async getTotalOffices(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT officeCode) AS Total_Offices 
                FROM offices
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

    // Get offices by country
    async getOfficesByCountry(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT country, COUNT(officeCode) AS Total_Offices 
                FROM offices 
                GROUP BY country
                ORDER BY Total_Offices DESC
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

    // Get office by code
    async getOfficeByCode(req, res) {
        try {
            const { officeCode } = req.params;
            const [rows] = await db.execute(`
                SELECT * FROM offices WHERE officeCode = ?
            `, [officeCode]);
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Office not found'
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

    // Get offices by city
    async getOfficesByCity(req, res) {
        try {
            const { city } = req.params;
            const [rows] = await db.execute(`
                SELECT * FROM offices WHERE city LIKE ?
            `, [`%${city}%`]);
            res.json({ 
                success: true, 
                data: rows,
                count: rows.length,
                filter: city
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    // Get offices with employees count
    async getOfficesWithEmployeeCount(req, res) {
        try {
            const [rows] = await db.execute(`
                SELECT o.*, COUNT(e.employeeNumber) AS employee_count
                FROM offices o
                LEFT JOIN employees e ON o.officeCode = e.officeCode
                GROUP BY o.officeCode
                ORDER BY employee_count DESC
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

module.exports = new OfficesController();
