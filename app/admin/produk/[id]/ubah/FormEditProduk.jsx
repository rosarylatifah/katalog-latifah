"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { ubahProdukAction, buatDeskripsiAIAction } from "@/app/admin/actions";

export default function FormEditProduk({ produk }) {
  const [state, formAction, isPending] = useActionState(ubahProdukAction, null);

  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleBuatDeskripsiAI = async () => {
    if (!nama) {
      alert("Isi nama produk terlebih dahulu!");
      return;
    }
    setLoadingAI(true);
    const res = await buatDeskripsiAIAction(nama, kategori);
    setLoadingAI(false);

    if (res.error) {
      alert(res.error);
    } else {
      setDeskripsi(res.deskripsi);
    }
  };

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state?.error && (
        <div className="rounded-lg border border-bahaya/30 bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      <input type="hidden" name="id" value={produk.id} />

      <Input
        label="Nama Produk"
        name="nama"
        type="text"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />

      <Input
        label="Kategori"
        name="kategori"
        type="text"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        required
      />

      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        defaultValue={produk.harga}
        min="0"
        required
      />

      <Input
        label="Link Foto"
        name="foto_url"
        type="text"
        defaultValue={produk.foto_url || ""}
        placeholder="https://... atau /produk/nama-file.svg"
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Deskripsi</label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={loadingAI}
            className="flex items-center gap-1 text-xs font-semibold text-utama hover:underline"
          >
            {loadingAI ? "✨ Membuat deskripsi..." : "✨ Buat Deskripsi dengan AI"}
          </button>
        </div>
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar p-3 text-sm outline-none focus:border-utama"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}