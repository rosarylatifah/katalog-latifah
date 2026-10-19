import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { createServerClient } from "@/lib/supabase/server";
import FormEditProduk from "./FormEditProduk";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
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
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Ubah Produk</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Perbarui informasi produk di katalog.
        </p>
      </div>
      <FormEditProduk produk={produk} />
    </div>
  );
}
