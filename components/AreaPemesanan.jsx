"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function AreaPemesanan({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  // Pastikan jumlah berada dalam batas aman (1 s.d. 999)
  const jumlahAman = Math.max(1, Math.min(999, parseInt(jumlah, 10) || 1));
  const totalHarga = (produk.harga || 0) * jumlahAman;

  // Sanitasi nomor WhatsApp toko (hanya angka)
  const noWhatsApp = (toko.nomorWhatsApp || "").replace(/\D/g, "");

  // Format pesan WhatsApp dengan jumlah, varian pilihan, dan total harga (US-03 & US-12)
  const keteranganVarian = varian.trim() ? ` (Varian/Catatan: ${varian.trim()})` : "";
  const teksPesan = `Halo, saya ingin memesan ${produk.nama}${keteranganVarian} sejumlah ${jumlahAman} pcs dengan total harga ${formatRupiah(totalHarga)}.`;
  const urlWhatsApp = `https://wa.me/${noWhatsApp}?text=${encodeURIComponent(teksPesan)}`;

  const tambahJumlah = () => setJumlah((prev) => Math.min(999, prev + 1));
  const kurangJumlah = () => setJumlah((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Pengatur Jumlah (US-12) */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold">Jumlah:</span>
        <div className="flex items-center rounded-lg border border-garis bg-permukaan">
          <button
            type="button"
            onClick={kurangJumlah}
            className="px-3 py-1 text-lg font-bold text-teks transition-colors hover:bg-garis/50 rounded-l-lg"
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span className="w-10 text-center font-bold text-sm text-teks">{jumlahAman}</span>
          <button
            type="button"
            onClick={tambahJumlah}
            className="px-3 py-1 text-lg font-bold text-teks transition-colors hover:bg-garis/50 rounded-r-lg"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </div>

      {/* Pemilihan Varian / Catatan Tambahan (US-12) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold">Pilih Varian / Catatan (opsional):</label>
        <input
          type="text"
          value={varian}
          onChange={(e) => setVarian(e.target.value.replace(/[<>]/g, "").slice(0, 100))}
          placeholder="Contoh: Pedas, Manis, Ukuran L, Kemasan Toples"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut outline-none focus:border-utama"
        />
      </div>

      {/* Rincian Total Harga */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-teks-lembut">Total:</span>
        <span className="text-xl font-bold text-harga">{formatRupiah(totalHarga)}</span>
      </div>

      {/* Tombol WhatsApp (US-03) */}
      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap sm:w-auto text-center"
      >
        Pesan via WhatsApp ({jumlahAman} pcs)
      </a>
    </div>
  );
}