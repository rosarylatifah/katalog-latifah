# Jurnal Prompt - Katalog Latifah

Berikut adalah riwayat prompt dan instruksi yang digunakan dalam pengembangan aplikasi web ini dari US-01 hingga US-06.

## US-02: Ambil Data Produk dari Supabase (Sisi Server)
- **Prompt/Instruksi:** Mengubah `app/produk/[id]/page.jsx` supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL di sisi server, memakai koneksi Supabase di `lib/supabase`. Jika produk tidak ditemukan, panggil `notFound()`. Hapus `CatatanBelumAktif` dan pertahankan tombol WhatsApp serta tampilan asli.

## US-03: Tombol WhatsApp Dinamis
- **Prompt/Instruksi:** Mengubah `components/TombolWhatsApp.jsx` menjadi tautan `https://wa.me/` menggunakan nomor dari `lib/toko.js`, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah yang di-encode dengan `encodeURIComponent` serta dibuka di tab baru.

## US-04: Login Admin dengan Supabase Auth
- **Prompt/Instruksi:** Membuat login admin memakai Supabase Auth (email & password) diproses dengan Server Action di `app/admin/actions.js` dan disambungkan ke form di `app/admin/login/page.jsx`. Menampilkan pesan error jika gagal serta membuat tombol "Keluar" di `components/NavAdmin.jsx` berfungsi mengakhiri sesi.

## US-05: Ganti Password Admin
- **Prompt/Instruksi:** Membuat Server Action ganti password di `app/admin/actions.js` untuk admin yang sedang login dengan validasi server (minimal 8 karakter dan konfirmasi harus sama). Disambungkan ke form di `app/admin/password/page.jsx`.

## US-06: Proteksi Rute Admin dengan Proxy
- **Prompt/Instruksi:** Membuat file `proxy.js` di root proyek untuk memproteksi semua rute `/admin` (kecuali `/admin/login`) agar wajib login dengan Supabase Auth dan mengalihkan ke halaman login jika belum terautentikasi. Menghapus `CatatanBelumAktif` dari halaman `/admin`.

## Debugging & Integrasi Penuh Fitur (US-07 hingga US-14)
- **Prompt/Instruksi:** Memperbaiki kendala stuck di halaman login admin (/admin/login), menyinkronkan file proxy.js di root proyek dengan mekanisme autentikasi admin Supabase SSR, memperbaiki seluruh Server Actions di app/admin/actions.js (login, logout, ganti password, tambah produk, ubah produk, hapus produk), memastikan validasi server dan proteksi rute, merestorasi halaman admin (/admin) dengan tabel produk database, memindahkan fitur pencarian & filter (US-11) ke halaman katalog utama (/), mengintegrasikan pemilihan jumlah pesanan (US-12) di detail produk, serta generator deskripsi AI (US-14).

## Debugging & Integrasi Penuh Fitur (US-07 hingga US-14)
- **Prompt/Instruksi:** Memperbaiki kendala stuck di halaman login admin (/admin/login), menyinkronkan file proxy.js di root proyek dengan mekanisme autentikasi admin Supabase SSR, memperbaiki seluruh Server Actions di app/admin/actions.js (login, logout, ganti password, tambah produk, ubah produk, hapus produk), memastikan validasi server dan proteksi rute, merestorasi halaman admin (/admin) dengan tabel produk database, memindahkan fitur pencarian & filter (US-11) ke halaman katalog utama (/), mengintegrasikan pemilihan jumlah pesanan (US-12) di detail produk, serta generator deskripsi AI (US-14).
- **Prompt/Instruksi:** Membuat file `proxy.js` di root proyek untuk memproteksi semua rute `/admin` (kecuali `/admin/login`) agar wajib login dengan Supabase Auth dan mengalihkan ke halaman login jika belum terautentikasi. Menghapus `CatatanBelumAktif` dari halaman `/admin`.