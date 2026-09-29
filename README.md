# KASKU: Your Financial Companion

Buat aplikasi web bernama **KASKU** — aplikasi pencatatan keuangan pribadi/keluarga yang modern, ringan, responsive, dan mobile-first.

## ⚠️ ATURAN PALING PENTING

Aplikasi ini **HANYA FRONTEND**.

Gunakan:

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Lucide React untuk icon

JANGAN gunakan:

* Supabase
* Firebase
* Clerk
* Appwrite
* PocketBase
* Backend-as-a-Service apa pun
* Database apa pun
* API eksternal
* Server action
* Edge function
* Authentication service
* Backend authentication
* ORM
* Prisma
* SQL
* PHP
* Laravel
* Node.js backend

Jangan membuat backend sama sekali.

Semua data untuk sementara menggunakan:

* mock data
* local state
* Context API jika diperlukan
* localStorage hanya jika diperlukan untuk simulasi

Tujuan project ini adalah agar saya bisa **download source code React dari Lovable**, kemudian melanjutkan backend sendiri menggunakan **Antigravity + PHP/Laravel + MySQL**.

Karena backend akan dibuat kemudian, struktur frontend harus dibuat modular dan siap dihubungkan ke REST API.

---

# 1. KONSEP APLIKASI

KASKU adalah aplikasi pencatatan keuangan yang membantu pengguna:

* mencatat pemasukan
* mencatat pengeluaran
* melihat saldo
* melihat laporan keuangan
* mengatur kategori transaksi
* mengatur rekening/dompet
* membuat anggaran
* mencatat utang/piutang
* melihat transaksi berdasarkan periode
* mencari dan memfilter transaksi
* melihat statistik keuangan
* mengatur profil dan preferensi aplikasi

Aplikasi harus terasa seperti produk SaaS/mobile finance app modern.

Target utama:

* pengguna umum
* mahasiswa
* pekerja
* keluarga
* UMKM kecil

---

# 2. GAYA UI

Gunakan desain:

* modern
* clean
* minimalis
* profesional
* friendly
* mobile-first
* rounded card
* soft shadow
* whitespace yang cukup
* typography yang jelas
* tidak terlalu ramai

Gunakan icon dari **Lucide React**.

Hindari emoji sebagai icon UI.

Gunakan desain yang terasa seperti aplikasi finansial modern.

Warna utama:

* Primary: emerald/green
* Income: green
* Expense: red
* Neutral: slate/gray
* Warning: amber
* Info: blue

Gunakan CSS variables/theme sehingga warna mudah diubah nanti.

---

# 3. RESPONSIVE

Aplikasi harus benar-benar responsive.

Prioritaskan:

### Mobile

320px – 767px

### Tablet

768px – 1023px

### Desktop

1024px+

Pada mobile gunakan bottom navigation.

Pada desktop gunakan sidebar.

Layout harus berubah secara natural tanpa membuat UI berantakan.

---

# 4. STRUKTUR NAVIGASI

Buat halaman:

1. Dashboard
2. Transaksi
3. Tambah Transaksi
4. Laporan
5. Anggaran
6. Utang & Piutang
7. Kategori
8. Rekening / Dompet
9. Profil
10. Pengaturan

Untuk mobile:

Bottom navigation:

* Beranda
* Transaksi
* Tambah
* Laporan
* Profil

Tombol tambah transaksi harus terlihat jelas.

---

# 5. DASHBOARD

Buat dashboard utama yang menarik.

Header:

"Selamat datang 👋"

Nama user:

"Ananda"

Tampilkan periode:

"September 2026"

Card saldo:

"Total Saldo"

Contoh:

Rp 12.450.000

Di bawahnya:

Pemasukan bulan ini
Rp 8.500.000

Pengeluaran bulan ini
Rp 4.250.000

Tabungan
Rp 2.000.000

---

## Quick Actions

Buat shortcut:

* Pemasukan

* Pengeluaran

Transfer

Utang

---

## Grafik

Buat grafik:

### Cash Flow

Menampilkan:

Pemasukan
vs
Pengeluaran

Per minggu/bulan.

Gunakan library chart frontend yang ringan jika diperlukan.

Jangan menggunakan API.

Data chart berasal dari mock data.

---

## Pengeluaran berdasarkan kategori

Donut/pie chart:

Makanan
Transportasi
Belanja
Tagihan
Hiburan
Lainnya

---

## Transaksi terbaru

Tampilkan 5–10 transaksi terbaru.

Contoh:

🍔 Makan siang
Rp 35.000
29 Sep 2026

🚗 Bensin
Rp 100.000
28 Sep 2026

💰 Gaji

* Rp 7.500.000
  28 Sep 2026

Gunakan icon Lucide sesuai kategori.

---

# 6. HALAMAN TRANSAKSI

Buat halaman daftar transaksi lengkap.

Fitur UI:

* search
* filter tanggal
* filter tipe
* filter kategori
* filter rekening
* sorting
* pagination
* grouping berdasarkan tanggal

Contoh:

29 September 2026

Makan siang

* Rp35.000

Bensin

* Rp100.000

Freelance

* Rp500.000

---

Buat transaksi sebagai reusable component:

TransactionItem

TransactionCard

TransactionTable

TransactionFilter

---

# 7. TAMBAH TRANSAKSI

Buat halaman/modal tambah transaksi.

Jenis:

Pemasukan
Pengeluaran
Transfer

Field:

* tipe transaksi
* nominal
* kategori
* rekening
* tanggal
* waktu
* catatan
* lampiran/struk
* tag

Tombol:

"Simpan Transaksi"

Untuk sekarang tombol hanya menyimpan ke mock state/localStorage.

Jangan membuat API.

---

# 8. FORM INPUT UANG

Nominal harus memiliki formatting Rupiah.

Contoh:

1000

menjadi:

Rp1.000

1000000

menjadi:

Rp1.000.000

Tetap simpan raw number di state.

Contoh internal:

amount: 1000000

Bukan:

amount: "Rp1.000.000"

Hal ini penting supaya nanti mudah dikirim ke backend.

---

# 9. KATEGORI

Buat halaman kategori.

Kategori pemasukan:

* Gaji
* Bonus
* Freelance
* Bisnis
* Investasi
* Lainnya

Kategori pengeluaran:

* Makanan
* Transportasi
* Belanja
* Tagihan
* Pendidikan
* Kesehatan
* Hiburan
* Rumah
* Internet
* Lainnya

Fitur UI:

* tambah kategori
* edit
* hapus
* icon
* warna
* tipe income/expense

Gunakan mock data.

---

# 10. REKENING / DOMPET

Buat halaman:

"Rekening & Dompet"

Contoh:

Bank BCA
Rp 5.500.000

Bank Mandiri
Rp 3.200.000

Cash
Rp 750.000

E-Wallet
Rp 1.250.000

Fitur:

* tambah rekening
* edit rekening
* hapus rekening
* lihat saldo
* pilih icon
* pilih warna

---

# 11. ANGGARAN

Buat halaman Budget.

Contoh:

Makanan

Budget:
Rp1.500.000

Terpakai:
Rp950.000

Progress bar:

63%

Transportasi

Budget:
Rp750.000

Terpakai:
Rp420.000

---

Tampilkan warning jika hampir mencapai limit.

Contoh:

"Anggaran makanan sudah mencapai 85%."

---

# 12. LAPORAN

Buat halaman laporan keuangan.

Filter:

* hari ini
* minggu ini
* bulan ini
* tahun ini
* custom range

Tampilkan:

Total pemasukan

Total pengeluaran

Cash flow

Net income

Grafik:

* income vs expense
* expense by category
* cash flow
* trend pengeluaran

Tambahkan tombol:

"Export"

Untuk sementara tombol hanya UI/mock action.

Jangan membuat backend.

---

# 13. UTANG & PIUTANG

Buat halaman:

"Utang & Piutang"

Tab:

Utang

Piutang

Contoh:

Utang:

Budi
Rp500.000
Jatuh tempo 5 Oktober 2026

Piutang:

Andi
Rp250.000
Jatuh tempo 2 Oktober 2026

Status:

* Belum Lunas
* Jatuh Tempo
* Lunas

Buat progress/status badge yang jelas.

---

# 14. DETAIL TRANSAKSI

Ketika transaksi diklik, buka halaman/detail modal.

Tampilkan:

* nama transaksi
* nominal
* tipe
* kategori
* rekening
* tanggal
* waktu
* catatan
* tag
* lampiran
* created date

Action:

Edit

Hapus

---

# 15. PROFIL

Buat halaman profil:

Foto/avatar

Nama:

Ananda

Email:

ananda@example.com

Menu:

* Profil
* Preferensi
* Mata uang
* Format tanggal
* Tema
* Notifikasi
* Keamanan

Karena belum ada backend/authentication, gunakan dummy user.

---

# 16. PENGATURAN

Buat halaman Settings.

Section:

### Tampilan

* Light
* Dark
* System

### Mata Uang

* IDR
* USD

### Notifikasi

* Pengingat transaksi
* Pengingat budget
* Pengingat utang
* Ringkasan keuangan

### Data

* Export data
* Import data
* Reset data

Semua masih frontend/mock.

---

# 17. DARK MODE

Implementasikan dark mode dengan benar.

Gunakan Tailwind dark mode.

Pastikan:

* background
* card
* text
* border
* input
* modal
* chart
* navigation

semuanya tetap terbaca.

---

# 18. EMPTY STATE

Setiap halaman yang datanya kosong harus memiliki empty state.

Contoh:

"Belum ada transaksi"

"Mulai catat transaksi pertamamu."

Button:

"+ Tambah Transaksi"

---

# 19. LOADING STATE

Buat reusable:

Skeleton

Loading spinner

Button loading

Walaupun sekarang menggunakan mock data.

Ini disiapkan untuk nanti ketika backend API sudah digunakan.

---

# 20. ERROR STATE

Buat reusable error state:

"Terjadi kesalahan"

"Coba lagi"

Nanti komponen ini akan digunakan ketika API backend sudah terhubung.

---

# 21. TOAST / NOTIFICATION

Gunakan toast notification untuk:

* transaksi berhasil ditambahkan
* transaksi berhasil diedit
* transaksi berhasil dihapus
* kategori berhasil ditambahkan
* budget berhasil dibuat

Untuk sekarang hanya frontend.

---

# 22. KOMPONEN REUSABLE

Buat component architecture yang rapi.

Contoh:

src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── transaction/
│   ├── budget/
│   ├── reports/
│   ├── debts/
│   └── shared/
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── AddTransaction.tsx
│   ├── Reports.tsx
│   ├── Budgets.tsx
│   ├── Debts.tsx
│   ├── Categories.tsx
│   ├── Accounts.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
│
├── data/
│   └── mockData.ts
│
├── types/
│   └── index.ts
│
├── hooks/
│   └── ...
│
├── utils/
│   ├── currency.ts
│   ├── date.ts
│   └── format.ts
│
└── App.tsx

---

# 23. TYPES

Buat TypeScript interface yang jelas.

Minimal:

User

Transaction

Category

Account

Budget

Debt

Receivable

Tag

TransactionType

PaymentMethod

TransactionStatus

Contoh:

interface Transaction {
id: string;
type: "income" | "expense" | "transfer";
amount: number;
categoryId: string;
accountId: string;
date: string;
note?: string;
tags?: string[];
}

Pastikan struktur data mudah dipetakan ke database backend nanti.

---

# 24. BACKEND-READY ARCHITECTURE

Walaupun belum ada backend, buat abstraction layer untuk API.

Contoh:

src/services/

api.ts

transactionService.ts

categoryService.ts

accountService.ts

budgetService.ts

debtService.ts

authService.ts

Untuk sekarang service menggunakan mock data.

Tetapi struktur harus dibuat agar nanti saya bisa mengganti implementasinya menjadi REST API.

Contoh konsep:

transactionService.getAll()

transactionService.getById(id)

transactionService.create(data)

transactionService.update(id, data)

transactionService.delete(id)

Jangan langsung menaruh seluruh logic data di component.

---

# 25. API BASE URL

Buat konfigurasi:

VITE_API_URL

Contoh:

VITE_API_URL=http://localhost:8000/api

Tetapi jangan benar-benar membuat backend.

Gunakan environment variable agar nanti mudah diganti.

---

# 26. AUTHENTICATION

JANGAN membuat authentication backend.

Buat hanya UI:

Login

Register

Forgot Password

Dashboard

Untuk sekarang login menggunakan mock authentication.

Contoh:

demo@example.com

password

Boleh login menggunakan dummy state/localStorage.

Tetapi jangan menggunakan:

Firebase Auth

Supabase Auth

Clerk

Auth0

atau authentication service lain.

Nanti authentication akan saya buat sendiri di backend.

---

# 27. MOCK DATA

Buat mock data yang realistis.

Gunakan transaksi minimal 30–50 data.

Gunakan tanggal sekitar:

September 2026

Data harus cukup banyak agar:

* dashboard terlihat hidup
* grafik terlihat realistis
* filter transaksi bisa dites
* search bisa dites
* kategori bisa dites
* laporan bisa dites

---

# 28. FORMAT RUPIAH

Gunakan:

Intl.NumberFormat("id-ID", {
style: "currency",
currency: "IDR",
maximumFractionDigits: 0
})

Semua nominal tampil sebagai Rupiah.

---

# 29. ACCESSIBILITY

Perhatikan:

* semantic HTML
* aria-label
* keyboard navigation
* focus state
* contrast
* button states
* form label

---

# 30. UX

Perhatikan UX berikut:

* Jangan membuat user terlalu banyak klik.
* Tambah transaksi harus sangat mudah.
* Dashboard harus langsung menunjukkan kondisi keuangan.
* CTA utama harus jelas.
* Form tidak terlalu panjang.
* Gunakan modal/drawer jika lebih nyaman di mobile.
* Gunakan confirmation dialog sebelum delete.
* Gunakan toast setelah action berhasil.

---

# 31. PERFORMANCE

Aplikasi harus ringan.

Hindari dependency yang tidak diperlukan.

Gunakan:

React lazy loading jika memang diperlukan.

Jangan menambahkan library besar hanya untuk fitur sederhana.

---

# 32. OUTPUT YANG SAYA INGINKAN

Saya ingin mendapatkan **source code React lengkap** yang dapat saya download dan jalankan secara lokal.

Harus memiliki:

package.json

vite.config.ts

tsconfig.json

tailwind configuration

src/

public/

README.md

.env.example

---

# 33. README

Buat README yang menjelaskan:

1. Cara install

npm install

2. Cara menjalankan

npm run dev

3. Cara build

npm run build

4. Struktur folder

5. Cara mengganti API URL

Contoh:

VITE_API_URL=http://localhost:8000/api

6. Penjelasan bahwa backend belum dibuat.

---

# 34. PENTING UNTUK INTEGRASI BACKEND NANTI

Saya akan membuat backend secara terpisah menggunakan **Antigravity**.

Backend kemungkinan akan menggunakan:

PHP/Laravel

atau

PHP native

dengan:

MySQL

Oleh karena itu frontend jangan bergantung pada teknologi backend tertentu.

Frontend harus berkomunikasi melalui REST API.

Contoh endpoint yang nantinya mungkin digunakan:

GET /api/transactions

POST /api/transactions

GET /api/transactions/{id}

PUT /api/transactions/{id}

DELETE /api/transactions/{id}

GET /api/categories

GET /api/accounts

GET /api/budgets

GET /api/reports

GET /api/dashboard

Tetapi endpoint tersebut **JANGAN dibuat sekarang**.

---

# 35. HAL YANG DILARANG

Jangan:

❌ membuat database

❌ membuat Supabase project

❌ membuat Firebase project

❌ membuat Clerk authentication

❌ membuat backend

❌ membuat server

❌ membuat SQL

❌ membuat API server

❌ membuat Edge Function

❌ membuat serverless function

❌ menggunakan data cloud

❌ membuat deployment backend

❌ meminta saya menghubungkan Supabase

❌ membuat migration

❌ membuat model database

❌ membuat backend authentication

Fokus hanya pada:

**React Frontend UI + UX + Mock Data + Frontend Architecture.**

---

# 36. HASIL AKHIR

Hasil akhirnya harus terasa seperti aplikasi keuangan yang benar-benar siap digunakan dari sisi frontend.

Bukan sekadar prototype sederhana.

Semua halaman harus memiliki:

* responsive UI
* navigation
* reusable components
* realistic mock data
* loading state
* empty state
* error state
* modal
* toast
* form validation
* dark mode
* responsive mobile layout

Tetapi seluruh aplikasi tetap **frontend-only**.

Prioritaskan kualitas UI/UX dan struktur kode yang mudah saya lanjutkan di Antigravity.

Mulai dengan membuat seluruh aplikasi KASKU sesuai spesifikasi di atas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ea50784a-af68-4745-8d8e-a737f5c7dd59).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
