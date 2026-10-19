import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Produk</h1>
          <p className="text-sm text-teks-lembut">Kelola semua produk yang ada di katalog toko.</p>
        </div>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError && (
        <div className="rounded-lg border border-garis bg-permukaan p-4">
          <p className="font-semibold text-bahaya">Gagal memuat daftar produk</p>
          <p className="mt-1 text-sm text-teks-lembut">{pesanError}</p>
        </div>
      )}

      {daftarProduk.length === 0 && !pesanError ? (
        <div className="rounded-2xl border border-garis p-8 text-center text-teks-lembut">
          <p>Belum ada produk.</p>
          <p className="mt-2 text-sm">
            Klik tombol &quot;Tambah produk&quot; untuk menambahkan produk pertama Anda.
          </p>
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}