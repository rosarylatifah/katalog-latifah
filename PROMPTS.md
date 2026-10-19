# Jurnal Prompt - Katalog Latifah

Berikut adalah riwayat prompt dan instruksi yang digunakan dalam pengembangan aplikasi katalog produk dari US-01 hingga seluruh fitur bonus (US-14).

## US-01: Katalog dari Database
- **Prompt:** Ubah `app/page.jsx` supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder `lib/supabase`. Tampilkan produk dengan komponen `KartuProduk` yang sudah ada. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus `CatatanBelumAktif` dari halaman ini.
- **Hasil:** Halaman `/` berhasil mengambil dan menampilkan produk langsung dari Supabase secara dinamis di sisi server dengan penanganan kondisi error dan tabel kosong.
- **Perbaikan:** Menghapus mock data dan `CatatanBelumAktif` serta memastikan format mata uang rupiah terpelihara rapi.

## US-02: Detail Produk
- **Prompt:** Ubah `app/produk/[id]/page.jsx` supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL di sisi server, memakai koneksi Supabase di `lib/supabase`. Jika produk tidak ditemukan, panggil `notFound()`. Hapus `CatatanBelumAktif` dan pertahankan tampilan detail.
- **Hasil:** Halaman detail produk menampilkan data dinamis dari database dan mengembalikan halaman 404 jika ID produk tidak ditemukan.
- **Perbaikan:** Menambahkan validasi parameter ID berupa integer positif untuk mencegah kueri tidak valid.

## US-03: Pesan via WhatsApp Dinamis
- **Prompt:** Buat tombol pemesanan WhatsApp yang terhubung ke nomor toko di `lib/toko.js`. Format pesan terisi otomatis berisi nama dan harga produk dalam format rupiah yang di-encode dengan `encodeURIComponent`, serta berfungsi di HP dan laptop.
- **Hasil:** Tombol pemesanan WhatsApp membuka link `https://wa.me/` dengan pesan pesanan terisi otomatis.
- **Perbaikan:** Nomor WhatsApp disanitasi dari karakter non-numerik agar tautan valid di semua perangkat.

## US-04: Login Admin dengan Supabase Auth
- **Prompt:** Buat login admin memakai Supabase Auth (email dan password) diproses dengan Server Action di `app/admin/actions.js` dan disambungkan ke form di `app/admin/login/page.jsx`. Menampilkan pesan error jika gagal dan redirect ke `/admin` jika berhasil. Tombol "Keluar" mengakhiri sesi.
- **Hasil:** Admin dapat masuk secara aman via Supabase Auth dan sesi dikelola di sisi server.
- **Perbaikan:** Menyelaraskan penyimpanan sesi menggunakan `@supabase/ssr` cookies agar tidak terjebak di halaman login.

## US-05: Ganti Password Admin
- **Prompt:** Buat form di `/admin/password` dan Server Action di `app/admin/actions.js` untuk mengganti password admin yang sedang login. Validasi password baru minimal 8 karakter dan sama dengan konfirmasinya. Tampilkan pesan berhasil atau pesan error yang jelas.
- **Hasil:** Password admin yang sedang login berhasil diperbarui secara aman melalui `supabase.auth.updateUser()`.
- **Perbaikan:** Memastikan verifikasi sesi admin aktif di server sebelum pembaruan password dijalankan.

## US-06: Proteksi Halaman Admin dengan Proxy
- **Prompt:** Buat file `proxy.js` di root proyek untuk memproteksi semua rute `/admin` (kecuali `/admin/login`) agar wajib login dan mengalihkan ke halaman login jika belum memiliki sesi aktif. Setiap aksi yang mengubah data memeriksa login di server.
- **Hasil:** Rute `/admin` terlindungi penuh. Pengunjung tanpa sesi aktif otomatis dialihkan ke `/admin/login`.
- **Perbaikan:** Menggunakan `supabase.auth.getUser()` untuk validasi kriptografis token sesi admin secara ketat.

## US-07: List Produk di Halaman Admin
- **Prompt:** Tampilkan seluruh daftar produk dari tabel database Supabase di halaman `/admin` menggunakan komponen `TabelProduk`, lengkap dengan foto, nama, kategori, harga, serta tombol aksi Ubah dan Hapus.
- **Hasil:** Halaman dashboard admin menampilkan tabel produk terkini langsung dari database Supabase secara real-time.
- **Perbaikan:** Menambahkan penanganan state kosong dan error database yang informatif.

## US-08: Tambah Produk Baru
- **Prompt:** Buat form di `/admin/produk/baru` untuk menambahkan produk baru ke database Supabase melalui Server Action di `app/admin/actions.js`. Form tervalidasi dan setelah berhasil langsung kembali ke `/admin`.
- **Hasil:** Admin dapat menambahkan produk baru lengkap dengan nama, kategori, harga, foto, dan deskripsi.
- **Perbaikan:** Sanitasi input string, validasi rentang harga, dan pembersihan tag HTML berbahaya.

## US-09: Ubah Produk
- **Prompt:** Buat halaman `/admin/produk/[id]/ubah` yang terisi data lama produk dan menyimpan perubahan data ke database Supabase melalui Server Action `ubahProdukAction`.
- **Hasil:** Admin dapat memperbarui informasi produk yang sudah ada di katalog.
- **Perbaikan:** Menghilangkan circular import pada komponen form edit dan menambahkan validasi ID produk.

## US-10: Hapus Produk dengan Konfirmasi
- **Prompt:** Tambahkan fitur hapus produk pada `TabelProduk` dengan konfirmasi interaktif sebelum menghapus dari database Supabase melalui Server Action `hapusProdukAction`.
- **Hasil:** Produk dapat dihapus dengan aman setelah admin mengonfirmasi dialog konfirmasi.
- **Perbaikan:** Revalidasi cache halaman utama dan admin secara otomatis setelah penghapusan berhasil.

## US-11: Filter Kategori & Pencarian Produk
- **Prompt:** Tambahkan fitur pencarian nama produk dan penyaringan berdasarkan kategori di halaman katalog utama `/`.
- **Hasil:** Pengunjung dapat mencari produk dengan kata kunci dan menyaring daftar produk berdasarkan kategori secara instan.
- **Perbaikan:** Sanitasi parameter query URL dan penyediaan tombol reset pencarian jika tidak ada hasil.

## US-12: Pilih Jumlah & Varian Pesanan
- **Prompt:** Di halaman detail produk, tambahkan pengatur jumlah produk (+ / -) dengan kalkulasi total harga dinamis serta kolom pemilihan varian/catatan pesanan yang otomatis masuk ke draf pesan WhatsApp.
- **Hasil:** Pengunjung dapat memilih jumlah pesanan dan varian/catatan khusus, dengan pesan WhatsApp yang otomatis mencantumkan rincian tersebut dan total harga.
- **Perbaikan:** Pembatasan jumlah pesanan yang rasional (1 hingga 999 pcs) dan sanitasi teks varian.

## US-13: Progressive Web App (PWA)
- **Prompt:** Konfigurasikan aplikasi agar dapat diinstal di layar beranda HP seperti aplikasi native dengan ikon di `public/icons`, manifest web lengkap, dan Service Worker.
- **Hasil:** Katalog memiliki `manifest.json` yang valid, ikon 192x192 & 512x512, tema warna konsisten, serta `sw.js` untuk caching offline dan prompt instalasi HP.
- **Perbaikan:** Menambahkan metadata viewport, theme-color, dan apple-touch-icon di `RootLayout`.

## US-14: Generator Deskripsi Produk dengan AI
- **Prompt:** Tambahkan fitur bantuan AI (Google Gemini API) untuk membuat deskripsi produk otomatis berdasarkan nama dan kategori produk pada form tambah dan ubah produk admin.
- **Hasil:** Tombol "✨ Buat Deskripsi dengan AI" secara otomatis menyusun kalimat deskripsi produk yang menarik dan mengisi kolom textarea.
- **Perbaikan:** Menambahkan generator fallback berkualitas tinggi jika API key Gemini belum diisi atau kuota API habis.