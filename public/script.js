// API Base URL
const API_BASE_URL = window.location.origin;

// Global state
let currentSection = 'customers';

// DOM Elements
const dbStatus = document.getElementById('dbStatus');
const navButtons = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize the application
async function initializeApp() {
    await checkDatabaseStatus();
    await loadInitialData();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
}

// Check database connection status
async function checkDatabaseStatus() {
    try {
        dbStatus.className = 'status-indicator checking';
        dbStatus.innerHTML = '<i class="fas fa-circle"></i> <span>Checking connection...</span>';
        
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'healthy' && data.database === 'connected') {
            dbStatus.className = 'status-indicator connected';
            dbStatus.innerHTML = '<i class="fas fa-circle"></i> <span>Database Connected</span>';
        } else {
            dbStatus.className = 'status-indicator disconnected';
            dbStatus.innerHTML = '<i class="fas fa-circle"></i> <span>Database Disconnected</span>';
        }
    } catch (error) {
        dbStatus.className = 'status-indicator disconnected';
        dbStatus.innerHTML = '<i class="fas fa-circle"></i> <span>Connection Failed</span>';
        console.error('Health check failed:', error);
    }
}

// Switch between sections
function switchSection(sectionName) {
    // Update navigation
    navButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update content
    contentSections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionName).classList.add('active');
    
    currentSection = sectionName;
    
    // Load section data
    loadSectionData(sectionName);
}

// Load initial data
async function loadInitialData() {
    await loadCustomersData();
}

// Load data for specific section
async function loadSectionData(section) {
    switch(section) {
        case 'customers':
            await loadCustomersData();
            break;
        case 'employees':
            await loadEmployeesData();
            break;
        case 'offices':
            await loadOfficesData();
            break;
        case 'orders':
            await loadOrdersData();
            break;
        case 'payments':
            await loadPaymentsData();
            break;
        case 'products':
            await loadProductsData();
            break;
        case 'productlines':
            await loadProductLinesData();
            break;
    }
}

// API helper function
async function apiCall(endpoint, elementId = null) {
    try {
        if (elementId) {
            document.getElementById(elementId).textContent = 'Loading...';
        }
        
        const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'API call failed');
        }
        
        return data;
    } catch (error) {
        console.error(`API call failed for ${endpoint}:`, error);
        if (elementId) {
            document.getElementById(elementId).textContent = 'Error loading data';
        }
        throw error;
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format number
function formatNumber(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

// Create table rows
function createTableRows(data, columns) {
    return data.map(row => {
        const cells = columns.map(col => {
            let value = row[col.key];
            if (col.format === 'currency') {
                value = formatCurrency(value);
            } else if (col.format === 'number') {
                value = formatNumber(value);
            }
            return `<td>${value || '-'}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
}

// Show error in table
function showTableError(tableBodyId, columnCount, message = 'Error loading data') {
    document.getElementById(tableBodyId).innerHTML = 
        `<tr><td colspan="${columnCount}" class="error">${message}</td></tr>`;
}

// === CUSTOMERS FUNCTIONS ===
async function loadCustomersData() {
    await Promise.all([
        loadTotalCustomers(),
        loadTopCountry(),
        loadTopCity(),
        loadCustomersFullName(),
        loadHighestCredit(),
        loadLowestCredit()
    ]);
}

async function loadTotalCustomers() {
    try {
        const data = await apiCall('/customers/total');
        document.getElementById('totalCustomers').textContent = 
            formatNumber(data.data.total_customers);
    } catch (error) {
        document.getElementById('totalCustomers').textContent = 'Error';
    }
}

async function loadTopCountry() {
    try {
        const data = await apiCall('/customers/top-country');
        document.getElementById('topCountry').textContent = 
            `${data.data.Country} (${data.data.Total_Customers})`;
    } catch (error) {
        document.getElementById('topCountry').textContent = 'Error';
    }
}

async function loadTopCity() {
    try {
        const data = await apiCall('/customers/top-city');
        const topCities = Array.isArray(data.data) ? data.data : [data.data];
        document.getElementById('topCity').textContent = 
            topCities.map(city => `${city.City} (${city.Total_Customers})`).join(', ');
    } catch (error) {
        document.getElementById('topCity').textContent = 'Error';
    }
}

async function loadCustomersFullName() {
    try {
        const data = await apiCall('/customers/fullname');
        const columns = [
            { key: 'customerNumber' },
            { key: 'customerName' },
            { key: 'fullName' },
            { key: 'phone' },
            { key: 'city' },
            { key: 'country' }
        ];
        
        const tableBody = document.getElementById('customersFullNameData');
        if (data.data && data.data.length > 0) {
            tableBody.innerHTML = createTableRows(data.data.slice(0, 20), columns);
        } else {
            tableBody.innerHTML = '<tr><td colspan="6">No data found</td></tr>';
        }
    } catch (error) {
        showTableError('customersFullNameData', 6);
    }
}

async function loadHighestCredit() {
    try {
        const data = await apiCall('/customers/highest-credit');
        document.getElementById('highestCredit').innerHTML = 
            `<strong>${data.data.customerName}</strong><br>
             Credit: ${formatCurrency(data.data.creditLimit)}`;
    } catch (error) {
        document.getElementById('highestCredit').textContent = 'Error loading data';
    }
}

async function loadLowestCredit() {
    try {
        const data = await apiCall('/customers/lowest-credit');
        document.getElementById('lowestCredit').innerHTML = 
            `<strong>${data.data.customerName}</strong><br>
             Credit: ${formatCurrency(data.data.creditLimit)}`;
    } catch (error) {
        document.getElementById('lowestCredit').textContent = 'Error loading data';
    }
}

// === EMPLOYEES FUNCTIONS ===
async function loadEmployeesData() {
    await Promise.all([
        loadTotalEmployees(),
        loadEmployees()
    ]);
}

async function loadTotalEmployees() {
    try {
        const data = await apiCall('/employees/total');
        document.getElementById('totalEmployees').textContent = 
            formatNumber(data.data.Total_Employees);
    } catch (error) {
        document.getElementById('totalEmployees').textContent = 'Error';
    }
}

async function loadEmployees() {
    try {
        const data = await apiCall('/employees/');
        const columns = [
            { key: 'employeeNumber' },
            { key: 'firstName' },
            { key: 'lastName' },
            { key: 'jobTitle' },
            { key: 'officeCode' },
            { key: 'email' }
        ];
        
        const tableBody = document.getElementById('employeesData');
        if (data.data && data.data.length > 0) {
            tableBody.innerHTML = createTableRows(data.data, columns);
        } else {
            tableBody.innerHTML = '<tr><td colspan="6">No data found</td></tr>';
        }
    } catch (error) {
        showTableError('employeesData', 6);
    }
}

// === OFFICES FUNCTIONS ===
async function loadOfficesData() {
    await loadOfficesByCountry();
}

async function loadOfficesByCountry() {
    try {
        const data = await apiCall('/offices/by-country');
        const columns = [
            { key: 'country' },
            { key: 'Total_Offices', format: 'number' }
        ];
        
        const tableBody = document.getElementById('officesByCountryData');
        if (data.data && data.data.length > 0) {
            tableBody.innerHTML = createTableRows(data.data, columns);
        } else {
            tableBody.innerHTML = '<tr><td colspan="2">No data found</td></tr>';
        }
    } catch (error) {
        showTableError('officesByCountryData', 2);
    }
}

// === ORDERS FUNCTIONS ===
async function loadOrdersData() {
    await Promise.all([
        loadTotalOrders(),
        loadShippedOrders(),
        loadOrdersByYearMonth()
    ]);
}

async function loadTotalOrders() {
    try {
        const data = await apiCall('/orders/total');
        document.getElementById('totalOrders').textContent = 
            formatNumber(data.data.Total_Orders);
    } catch (error) {
        document.getElementById('totalOrders').textContent = 'Error';
    }
}

async function loadShippedOrders() {
    try {
        const data = await apiCall('/orders/shipped');
        document.getElementById('shippedOrders').textContent = 
            formatNumber(data.data.Total_Orders);
    } catch (error) {
        document.getElementById('shippedOrders').textContent = 'Error';
    }
}

async function loadOrdersByYearMonth() {
    try {
        const data = await apiCall('/orders/by-year-month');
        const columns = [
            { key: 'Year' },
            { key: 'Month' },
            { key: 'Month_Name' },
            { key: 'Total_orders', format: 'number' },
            { key: 'Sum_Of_Orders', format: 'number' }
        ];
        
        const tableBody = document.getElementById('ordersByYearMonthData');
        if (data.data && data.data.length > 0) {
            tableBody.innerHTML = createTableRows(data.data, columns);
        } else {
            tableBody.innerHTML = '<tr><td colspan="5">No data found</td></tr>';
        }
    } catch (error) {
        showTableError('ordersByYearMonthData', 5);
    }
}

// === PAYMENTS FUNCTIONS ===
async function loadPaymentsData() {
    await Promise.all([
        loadTotalAmount(),
        loadPaymentsByYear()
    ]);
}

async function loadTotalAmount() {
    try {
        const data = await apiCall('/payments/total-amount');
        document.getElementById('totalAmount').textContent = 
            formatCurrency(data.data.Total_Amount);
    } catch (error) {
        document.getElementById('totalAmount').textContent = 'Error';
    }
}

async function loadPaymentsByYear() {
    try {
        const data = await apiCall('/payments/by-year');
        const columns = [
            { key: 'Year' },
            { key: 'Total_Amount', format: 'currency' },
            { key: 'Sum_Of_Amount', format: 'currency' }
        ];
        
        const tableBody = document.getElementById('paymentsByYearData');
        if (data.data && data.data.length > 0) {
            tableBody.innerHTML = createTableRows(data.data, columns);
        } else {
            tableBody.innerHTML = '<tr><td colspan="3">No data found</td></tr>';
        }
    } catch (error) {
        showTableError('paymentsByYearData', 3);
    }
}

// === PRODUCTS FUNCTIONS ===
async function loadProductsData() {
    await Promise.all([
        loadTotalProducts(),
        loadTotalVendors(),
        loadProductsByLine()
    ]);
}

async function loadTotalProducts() {
    try {
        const data = await apiCall('/products/total');
        document.getElementById('totalProducts').textContent = 
            formatNumber(data.data.Total_Products);
    } catch (error) {
        document.getElementById('totalProducts').textContent = 'Error';
    }
}

async function loadTotalVendors() {
    try {
        const data = await apiCall('/products/vendors/total');
        document.getElementById('totalVendors').textContent = 
            formatNumber(data.data.Total_Vendors);
    } catch (error) {
        document.getElementById('totalVendors').textContent = 'Error';
    }
}

async function loadProductsByLine() {
    try {
        const data = await apiCall('/products/by-line');
        const columns = [
            { key: 'productLine' },
            { key: 'Total_Products', format: 'number' }
        ];
        
        const tableBody = document.getElementById('productsByLineData');
        if (data.data && data.data.length > 0) {
            tableBody.innerHTML = createTableRows(data.data, columns);
        } else {
            tableBody.innerHTML = '<tr><td colspan="2">No data found</td></tr>';
        }
    } catch (error) {
        showTableError('productsByLineData', 2);
    }
}

// === PRODUCT LINES FUNCTIONS ===
async function loadProductLinesData() {
    await Promise.all([
        loadTotalProductLines(),
        loadProductLines()
    ]);
}

async function loadTotalProductLines() {
    try {
        const data = await apiCall('/productlines/total');
        document.getElementById('totalProductLines').textContent = 
            formatNumber(data.data.total_productLine);
    } catch (error) {
        document.getElementById('totalProductLines').textContent = 'Error';
    }
}

async function loadProductLines() {
    try {
        const data = await apiCall('/productlines/');
        const columns = [
            { key: 'productLine' },
            { key: 'textDescription' }
        ];
        
        const tableBody = document.getElementById('productLinesData');
        if (data.data && data.data.length > 0) {
            tableBody.innerHTML = createTableRows(data.data, columns);
        } else {
            tableBody.innerHTML = '<tr><td colspan="2">No data found</td></tr>';
        }
    } catch (error) {
        showTableError('productLinesData', 2);
    }
}

// Auto refresh every 5 minutes
setInterval(checkDatabaseStatus, 300000);

// Expose functions to global scope for onclick handlers
window.loadCustomersFullName = loadCustomersFullName;
window.loadEmployees = loadEmployees;
window.loadOfficesByCountry = loadOfficesByCountry;
window.loadOrdersByYearMonth = loadOrdersByYearMonth;
window.loadPaymentsByYear = loadPaymentsByYear;
window.loadProductsByLine = loadProductsByLine;
window.loadProductLines = loadProductLines;