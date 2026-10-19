"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function AreaPemesanan({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  // Pastikan jumlah berada dalam batas aman (1 s.d. 999)
  const jumlahAman = Math.max(1, Math.min(999, parseInt(jumlah, 10) || 1));
  const totalHarga = (produk.harga || 0) * jumlahAman;

  // Sanitasi nomor WhatsApp toko (hanya angka)
  const noWhatsApp = (toko.nomorWhatsApp || "").replace(/\D/g, "");

  // Format pesan WhatsApp dengan jumlah dan total harga yang di-encode aman
  const teksPesan = `Halo, saya ingin memesan ${produk.nama} sejumlah ${jumlahAman} pcs dengan total harga ${formatRupiah(totalHarga)}.`;
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