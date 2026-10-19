import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  // Format teks pesan otomatis sesuai instruksi
  const teksPesan = `Halo, saya ingin memesan ${produk.nama} seharga ${formatRupiah(produk.harga)}.`;
  
  // Encode pesan untuk URL
  const pesanEncoded = encodeURIComponent(teksPesan);
  
  // Buat tautan wa.me dengan nomor dari lib/toko.js
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${pesanEncoded}`;

  return (
    <a
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}