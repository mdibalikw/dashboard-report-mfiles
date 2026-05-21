# M-Files Analytics & Dashboard Report Gateway

Sebuah mesin dashboard pelaporan berbasis konfigurasi real-time yang terhubung langsung ke REST API M-Files Web Service (MFWS). Proyek ini melakukan agregasi, penelusuran (traversal), dan visualisasi data M-Files vault menggunakan grafik interaktif yang modern.

---

## 🚀 Fitur Utama

* **Pelaporan Berbasis Konfigurasi**: Menambahkan atau mengubah laporan cukup dengan memperbarui file konfigurasi JSON (`config/reports.json`).
* **Penelusuran View Hierarkis (Rekursif)**: Secara otomatis menelusuri view bersarang (nested views), sub-view, folder virtual, dan tingkat pengelompokan (grouping levels) M-Files (misalnya memproses path seperti `/views/v124/v117/items` atau `/views/v2/L8/items`).
* **Visualisasi Data Interaktif**: Menyajikan grafik responsif yang modern (Doughnut, Bar, Pie) yang ditenagai oleh ApexCharts.
* **Manajer Koneksi Dinamis**: Uji dan perbarui endpoint vault, kredensial pengguna, serta view pelaporan aktif langsung dari dropdown pilihan di UI (tanpa perlu mengetik ID secara manual).
* **Penerjemah Metadata (Translator)**: Mengambil struktur `/structure/classes` dan `/structure/objecttypes` secara otomatis dari vault untuk memetakan ID numerik mentah ke nama ramah yang mudah dibaca (misalnya mengubah Class ID `31` menjadi `"Employee"`).
* **Mode Demo Sandbox**: Coba dashboard secara instan menggunakan data simulasi lokal (mock data) cukup dengan mengaktifkan tombol sakelar, tanpa memerlukan koneksi aktif ke server M-Files.

---

## 🛠️ Arsitektur & Teknologi

### Backend (Node.js & Express)
* Terletak di direktori root.
* Mengambil data secara rekursif dari REST endpoint M-Files menggunakan penelusuran paralel berbasis Promise.
* Melakukan pengelompokan data in-memory, penghapusan duplikasi, dan caching struktur metadata vault.
* Mengelola token autentikasi secara dinamis untuk mencegah terjadinya kunci "token storm" akibat query konkuren yang banyak.

### Frontend (Vue 3, Vite & Tailwind CSS)
* Terletak di dalam folder `/frontend`.
* Memiliki antarmuka tema gelap (dark mode) dengan desain glassmorphism yang modern dan premium.
* Menggunakan Axios untuk berkomunikasi dengan server REST API gateway lokal.

---

## ⚙️ Pengaturan Konfigurasi

Buat berkas `.env` di direktori root untuk mengatur nilai default koneksi Anda:

```env
MFWS_URL=http://localhost/REST
MFWS_USERNAME=Admin
MFWS_PASSWORD=password_anda
MFWS_VAULT_GUID={CF1079B6-08D7-466D-868B-A2894F6F98FF}
PORT=3000
```

---

## 🏃 Cara Menjalankan Aplikasi

### 1. Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 16+ disarankan).

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori root untuk menginstal dependensi backend dan frontend:
```bash
# Instal dependensi backend
npm install

# Instal dependensi frontend
npm run install:frontend
```

### 3. Menjalankan Server Development
Jalankan kedua server (backend di port `3000` dan frontend dev server di port `5173`) secara bersamaan:
```bash
npm run dev
```

Buka browser Anda dan akses ke [http://localhost:5173](http://localhost:5173).

### 4. Membuat Build Produksi
Untuk melakukan kompilasi aset frontend siap dideploy:
```bash
npm run build
```

---

## 📊 Menambahkan Laporan Baru

Laporan dikonfigurasi di dalam berkas [config/reports.json](config/reports.json). Untuk menambahkan laporan baru, cukup tambahkan objek konfigurasi ke dalam array JSON:

```json
{
  "id": "docs-by-views",
  "title": "Dokumen berdasarkan View",
  "type": "bar",
  "sourceViewId": "124",
  "groupBy": "views"
}
```

### Deskripsi Field Konfigurasi:
* `id`: Identifikasi unik untuk endpoint laporan.
* `title`: Judul yang ditampilkan pada bagian atas kartu grafik.
* `type`: Gaya grafik visual (`bar`, `pie`, `doughnut`).
* `sourceViewId`: ID View M-Files yang berisi folder/file yang ingin diagregasi. Jika dikosongkan untuk `docs-by-views`, maka pelaporan akan merujuk ke semua view tingkat root.
* `groupBy`: Kunci dasar pengelompokan data (`class`, `state`, `type`, atau `views`).
* Hanya untuk Vault Mfiles