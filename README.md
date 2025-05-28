# p2-oc-api

## **Deskripsi**
Proyek ini adalah API berbasis Node.js menggunakan framework Express.js yang menyediakan akses ke database **ClassicModels**. API ini dirancang untuk mengelola data seperti pelanggan, karyawan, pesanan, pembayaran, produk, dan lainnya.

---

## **Fitur Utama**
- **Endpoint CRUD** untuk berbagai resource seperti pelanggan, karyawan, pesanan, dll.
- **Statistik**: Menyediakan data analitik seperti total pelanggan, pesanan per bulan, dll.
- **Koneksi ke MySQL**: Menggunakan database eksternal untuk menyimpan data.
- **Modular Routing**: Struktur routing yang terpisah untuk setiap resource.
- **Dockerized**: Dapat dijalankan menggunakan Docker untuk mempermudah deployment.

---

## **Struktur Proyek**
```
p2-oc-api/
├── routes/                 # Folder untuk routing modular
│   ├── customers.js        # Routing untuk resource customers
│   ├── employees.js        # Routing untuk resource employees
│   ├── offices.js          # Routing untuk resource offices
│   ├── orders.js           # Routing untuk resource orders
│   ├── payments.js         # Routing untuk resource payments
│   ├── productlines.js     # Routing untuk resource productlines
│   ├── products.js         # Routing untuk resource products
│   ├── procedures.js       # Routing untuk stored procedures
├── .gitignore              # File untuk mengabaikan file/direktori tertentu
├── docker-compose.yml      # Konfigurasi Docker Compose
├── Dockerfile              # File Docker untuk membangun container
├── package.json            # File konfigurasi npm
├── package-lock.json       # File lock dependencies
├── server.js               # File utama aplikasi Express
└── README.md               # Dokumentasi proyek
```

---

## **Persyaratan**
- **Node.js**: v16 atau lebih baru
- **MySQL**: Database eksternal dengan konfigurasi:
  - Host: `165.22.97.18`
  - Port: `3306`
  - Database: `classicmodels`
  - User: `kelompok1`
  - Password: `kelompok1`
- **Docker**: Untuk menjalankan aplikasi dalam container (opsional)

---

## **Instalasi**
### **1. Clone Repository**
Clone proyek ini ke komputer atau server Anda:
```bash
git clone https://github.com/your-repo-url.git
cd p2-oc-api
```

### **2. Install Dependencies**
Jalankan perintah berikut untuk menginstal dependencies:
```bash
npm install
```

### **3. Konfigurasi Environment**
Pastikan variabel lingkungan untuk koneksi database sudah diatur. Anda dapat mengedit file [`docker-compose.yml`](docker-compose.yml ) atau membuat file `.env` (opsional).

---

## **Menjalankan Aplikasi**
### **1. Jalankan Secara Lokal**
Jalankan aplikasi secara lokal dengan perintah:
```bash
npm start
```
Aplikasi akan berjalan di `http://localhost:3000`.

### **2. Jalankan dengan Docker**
Jika menggunakan Docker, jalankan perintah berikut:
```bash
docker compose up --build -d
```
Aplikasi akan berjalan di `http://<server-ip>:3000`.

---

## **Endpoint API**
Berikut adalah daftar endpoint utama:

### **1. Customers**
- `GET /api/customers`: Mendapatkan semua pelanggan.
- `GET /api/customers/total`: Mendapatkan total pelanggan.
- `GET /api/customers/by-country`: Mendapatkan pelanggan berdasarkan negara.

### **2. Employees**
- `GET /api/employees`: Mendapatkan semua karyawan.

### **3. Offices**
- `GET /api/offices`: Mendapatkan semua kantor.

### **4. Orders**
- `GET /api/orders`: Mendapatkan semua pesanan.

### **5. Payments**
- `GET /api/payments`: Mendapatkan semua pembayaran.

### **6. Productlines**
- `GET /api/productlines`: Mendapatkan semua lini produk.

### **7. Products**
- `GET /api/products`: Mendapatkan semua produk.

### **8. Procedures**
- `GET /api/procedures/customer-details/:customerName`: Mendapatkan detail pelanggan berdasarkan nama.
- `GET /api/procedures/product-details/:productCode`: Mendapatkan detail produk berdasarkan kode.

---

## **Deployment**
### **1. Salin Proyek ke Server**
Gunakan `scp` atau Git untuk memindahkan proyek ke server.

### **2. Jalankan dengan Docker**
Jalankan perintah berikut di server:
```bash
docker compose up --build -d
```

### **3. Akses Aplikasi**
Akses aplikasi melalui browser atau tool seperti Postman:
```
http://<server-ip>:3000
```

---

## **Pengujian**
Gunakan Postman atau cURL untuk menguji endpoint API. Contoh:
```bash
curl http://localhost:3000/api/customers/total
```

---

## **Catatan**
- Pastikan port 3000 terbuka di firewall server.
- Gunakan reverse proxy (seperti Nginx) jika ingin mengakses aplikasi tanpa port.

---

Jika ada pertanyaan atau kendala, silakan hubungi pengembang proyek. 😊
