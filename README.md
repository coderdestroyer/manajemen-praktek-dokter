# 🏥 Sistem Manajemen Praktek Dokter (Klinik App)

Sebuah aplikasi web berbasis **MERN Stack (MongoDB, Express, React, Node.js)** yang dirancang untuk mendigitalkan operasional harian praktek dokter mandiri atau klinik kecil. Aplikasi ini memfasilitasi manajemen pasien, antrian kunjunga, dan manajemen staf dengan pembagian hak akses (Role-Based Access Control).

## 🚀 Fitur Utama

Aplikasi ini memiliki dua level pengguna: **Dokter (Doctor)** dan **Perawat (Nurse)**.

### 1. 📊 Dashboard Interaktif
* Menampilkan statistik real-time: Total Pasien, Kunjungan Hari Ini, Pasien Menunggu, dan Pasien Selesai.
* Sapaan personal berdasarkan waktu (Pagi/Siang/Malam).
* Informasi status server dan tanggal.
* Akses cepat ke kontak IT Support.

### 2. 👥 Manajemen Pasien (Data Pasien)
* **CRUD Lengkap:** Tambah, Lihat, Edit, dan Hapus data pasien.
* **Pencarian & Filter:** Cari pasien berdasarkan Nama/No. RM dan filter berdasarkan Gender.
* **Pagination:** Tampilan data rapi dengan pembagian halaman.

### 3. 🗓️ Manajemen Kunjungan (Antrian)
* **Pendaftaran:** Perawat mendaftarkan kunjungan pasien (memilih Dokter & Pasien).
* **Alur Status:**
    * `Menunggu` (Default saat didaftarkan).
    * `Diperiksa` (Saat masuk ruang dokter).
    * `Selesai` (Setelah pemeriksaan/pembayaran).
* **Filter Tanggal:** Lihat riwayat kunjungan berdasarkan tanggal tertentu.

### 4. 👨‍⚕️ Manajemen Staff
* **Admin Dokter:** Dokter dapat menambahkan akun staff baru (Role: Nurse).
* **CRUD Akun:** Edit username, nama, reset password, dan hapus akun staff.

### 6. 👤 Manajemen Profil
* Ubah Nama Lengkap.
* Ganti Password (dengan validasi password lama & konfirmasi password baru).

## 🛠️ Teknologi yang Digunakan

### Frontend (Client)
* **React.js (Vite):** Framework UI utama.
* **Tailwind CSS:** Styling modern dan responsif.
* **Axios:** HTTP Client untuk request ke API.
* **React Router Dom:** Manajemen navigasi halaman.
* **Lucide React:** Ikon antarmuka yang bersih.

### Backend (Server)
* **Node.js & Express.js:** Server-side runtime & framework.
* **MongoDB & Mongoose:** Database NoSQL dan ODM.
* **JWT (JSON Web Token):** Autentikasi aman.
* **Bcrypt.js:** Hashing password.
* **Cors & Dotenv:** Keamanan dan konfigurasi environment.
