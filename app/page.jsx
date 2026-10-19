import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const qRaw = params?.q || "";
  const kategoriRaw = params?.kategori || "";

  // Sanitasi query pencarian dan kategori untuk mencegah script injection
  const q = typeof qRaw === "string" ? qRaw.trim().replace(/[<>]/g, "").slice(0, 100) : "";
  const kategoriDipilih =
    typeof kategoriRaw === "string" ? kategoriRaw.trim().replace(/[<>]/g, "").slice(0, 50) : "";

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Ambil daftar kategori unik untuk filter
    const { data: kumpulKategori } = await supabase.from("produk").select("kategori");
    daftarKategori = Array.from(
      new Set(kumpulKategori?.map((item) => item.kategori).filter(Boolean))
    );

    // Ambil produk dengan filter pencarian dan kategori jika ada
    let query = supabase.from("produk").select("*").order("id", { ascending: true });

    if (q) {
      // PostgREST memproses nilai filter secara aman dengan parameter binding
      query = query.ilike("nama", `%${q}%`);
    }

    if (kategoriDipilih) {
      query = query.eq("kategori", kategoriDipilih);
    }

    const { data, error } = await query;

    if (error) {
      pesanError = "Gagal memuat produk dari database.";
    } else {
      daftarProduk = data || [];
    }
  } catch {
    pesanError = "Terjadi gangguan koneksi saat memuat produk.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      {/* Fitur Pencarian & Filter Kategori (US-11) */}
      <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-garis bg-permukaan p-4">
        <form method="GET" className="flex gap-2">
          {kategoriDipilih && <input type="hidden" name="kategori" value={kategoriDipilih} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder="Cari nama produk..."
            className="w-full rounded-lg border border-garis bg-latar px-4 py-2 text-sm text-teks outline-none focus:border-utama"
          />
          <button
            type="submit"
            className="rounded-lg bg-utama px-5 py-2 text-sm font-semibold text-white transition hover:bg-utama-gelap"
          >
            Cari
          </button>
        </form>

        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-teks-lembut">Kategori:</span>
            <Link
              href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                !kategoriDipilih
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              Semua
            </Link>
            {daftarKategori.map((kat) => (
              <Link
                key={kat}
                href={`/?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  kategori: kat,
                }).toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  kategoriDipilih === kat
                    ? "bg-utama text-white"
                    : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                }`}
              >
                {kat}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        {pesanError ? (
          <div className="rounded-lg border border-garis bg-permukaan p-4">
            <p className="font-semibold text-bahaya">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="rounded-2xl border border-garis p-8 text-center text-teks-lembut">
            <p className="font-semibold">
              {q || kategoriDipilih
                ? "Tidak ada produk yang cocok dengan pencarian."
                : "Belum ada produk"}
            </p>
            {(q || kategoriDipilih) && (
              <Link href="/" className="mt-3 inline-block text-xs font-semibold text-utama underline">
                Reset pencarian
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
