import Link from "next/link";
import { notFound } from "next/navigation";
import AreaPemesanan from "@/components/AreaPemesanan";
import { createServerClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  // Validasi ID: harus angka bulat positif
  if (isNaN(idNum) || idNum <= 0) {
    notFound();
  }

  const supabase = createServerClient();

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", idNum)
    .single();

  if (error || !produk) {
    notFound();
  }

  return (
    <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <img
        src={produk.foto_url || "/produk/kopi.svg"}
        alt={produk.nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <p className="text-sm text-teks-lembut">{produk.kategori || "Umum"}</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
        <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
        <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
        
        {/* Fitur US-03 dan US-12: Area Pemesanan WhatsApp dengan Pemilihan Jumlah */}
        <AreaPemesanan produk={produk} />
      </div>
    </article>
  );
}