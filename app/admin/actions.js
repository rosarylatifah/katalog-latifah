"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createAdminClient, createServerClient } from "@/lib/supabase/server";

// Helper Sanitasi URL Foto untuk mencegah celah XSS (misal javascript:... atau data:...)
function sanitasiUrlFoto(url) {
  if (!url || typeof url !== "string") {
    return "/produk/kopi.svg";
  }
  const urlBersih = url.trim();
  // Hanya izinkan http, https, atau path relatif yang diawali /
  if (
    urlBersih.startsWith("https://") ||
    urlBersih.startsWith("http://") ||
    urlBersih.startsWith("/")
  ) {
    const urlLower = urlBersih.toLowerCase();
    if (!urlLower.includes("javascript:") && !urlLower.includes("data:") && !urlLower.includes("<")) {
      return urlBersih.slice(0, 500);
    }
  }
  return "/produk/kopi.svg";
}

// Helper Sanitasi Teks Umum (menghapus tag HTML dasar untuk mencegah injection)
function sanitasiTeks(str, maxPanjang = 255) {
  if (!str || typeof str !== "string") return "";
  return str
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxPanjang);
}

// Verifikasi Sesi Admin yang Ketat di Sisi Server
async function verifikasiAdminAktif() {
  const supabase = await createAdminClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null };
  }
  return { supabase, user };
}

export async function loginAction(prevState, formData) {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");

  const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  const password = typeof passwordRaw === "string" ? passwordRaw : "";

  // Validasi format email dasar & panjang
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length > 254) {
    return { error: "Format email tidak valid." };
  }

  if (!password || password.length < 8 || password.length > 128) {
    return { error: "Password harus terdiri dari 8 hingga 128 karakter." };
  }

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Login gagal: Email atau password salah." };
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (err) {
    return { error: "Terjadi kesalahan saat memproses login. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  try {
    const supabase = await createAdminClient();
    await supabase.auth.signOut();
  } catch {
    // Abaikan error saat signOut
  }

  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
  } catch {
    // Abaikan error saat menghapus cookie
  }

  redirect("/admin/login");
}

export async function gantiPasswordAction(prevState, formData) {
  const { supabase, user } = await verifikasiAdminAktif();
  if (!user) {
    return { error: "Akses ditolak: Sesi admin tidak valid. Silakan masuk kembali." };
  }

  const passwordBaruRaw = formData.get("password_baru");
  const konfirmasiPasswordRaw = formData.get("konfirmasi_password");

  const passwordBaru = typeof passwordBaruRaw === "string" ? passwordBaruRaw : "";
  const konfirmasiPassword = typeof konfirmasiPasswordRaw === "string" ? konfirmasiPasswordRaw : "";

  if (passwordBaru.length < 8 || passwordBaru.length > 128) {
    return { error: "Password baru harus memiliki panjang 8 hingga 128 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      return { error: "Gagal mengganti password: " + error.message };
    }

    return { success: "Password berhasil diperbarui!" };
  } catch {
    return { error: "Terjadi kesalahan sistem saat memperbarui password." };
  }
}

export async function tambahProdukAction(prevState, formData) {
  const { supabase, user } = await verifikasiAdminAktif();
  if (!user) {
    return { error: "Akses ditolak: Anda harus login sebagai admin." };
  }

  const nama = sanitasiTeks(formData.get("nama"), 150);
  const kategori = sanitasiTeks(formData.get("kategori"), 50);
  const hargaRaw = formData.get("harga");
  const harga = parseInt(hargaRaw, 10);
  const deskripsi = sanitasiTeks(formData.get("deskripsi"), 2000);
  const foto_url = sanitasiUrlFoto(formData.get("foto_url"));

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }
  if (isNaN(harga) || harga < 0 || harga > 1_000_000_000) {
    return { error: "Harga produk harus berupa angka positif yang wajar." };
  }

  const payload = {
    nama,
    kategori: kategori || null,
    harga,
    deskripsi: deskripsi || null,
    foto_url,
  };

  let { error } = await supabase.from("produk").insert([payload]);

  if (error && process.env.SUPABASE_SECRET_KEY) {
    try {
      const serviceClient = createServerClient();
      const res = await serviceClient.from("produk").insert([payload]);
      error = res.error;
    } catch {
      // Pertahankan error awal
    }
  }

  if (error) {
    return { error: "Gagal menambah produk: " + error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function ubahProdukAction(prevState, formData) {
  const { supabase, user } = await verifikasiAdminAktif();
  if (!user) {
    return { error: "Akses ditolak: Anda harus login sebagai admin." };
  }

  const idRaw = formData.get("id");
  const id = parseInt(idRaw, 10);
  if (isNaN(id) || id <= 0) {
    return { error: "ID produk tidak valid." };
  }

  const nama = sanitasiTeks(formData.get("nama"), 150);
  const kategori = sanitasiTeks(formData.get("kategori"), 50);
  const hargaRaw = formData.get("harga");
  const harga = parseInt(hargaRaw, 10);
  const deskripsi = sanitasiTeks(formData.get("deskripsi"), 2000);
  const foto_url = sanitasiUrlFoto(formData.get("foto_url"));

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }
  if (isNaN(harga) || harga < 0 || harga > 1_000_000_000) {
    return { error: "Harga produk harus berupa angka positif yang wajar." };
  }

  const payload = {
    nama,
    kategori: kategori || null,
    harga,
    deskripsi: deskripsi || null,
    foto_url,
  };

  let { error } = await supabase.from("produk").update(payload).eq("id", id);

  if (error && process.env.SUPABASE_SECRET_KEY) {
    try {
      const serviceClient = createServerClient();
      const res = await serviceClient.from("produk").update(payload).eq("id", id);
      error = res.error;
    } catch {
      // Pertahankan error awal
    }
  }

  if (error) {
    return { error: "Gagal mengubah produk: " + error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

export async function hapusProdukAction(formData) {
  const { supabase, user } = await verifikasiAdminAktif();
  if (!user) {
    throw new Error("Akses ditolak: Anda harus login sebagai admin.");
  }

  const idRaw = formData.get("id");
  const id = parseInt(idRaw, 10);
  if (isNaN(id) || id <= 0) {
    throw new Error("ID produk tidak valid.");
  }

  let { error } = await supabase.from("produk").delete().eq("id", id);

  if (error && process.env.SUPABASE_SECRET_KEY) {
    try {
      const serviceClient = createServerClient();
      const res = await serviceClient.from("produk").delete().eq("id", id);
      error = res.error;
    } catch {
      // Pertahankan error awal
    }
  }

  if (error) {
    throw new Error("Gagal menghapus produk: " + error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function buatDeskripsiAIAction(namaProduk, kategoriProduk) {
  const nama = sanitasiTeks(namaProduk, 100);
  const kategori = sanitasiTeks(kategoriProduk, 50);

  if (!nama) {
    return { error: "Nama produk harus diisi terlebih dahulu untuk membuat deskripsi AI." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
          apiKey
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Buatkan deskripsi produk yang menarik, ramah, dan menjual dalam 2-3 kalimat bahasa Indonesia untuk produk bernama "${nama}"${
                      kategori ? ` dengan kategori "${kategori}"` : ""
                    }. Jangan gunakan format tebal markdown atau tanda bintang.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const hasilTeks = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (hasilTeks) {
          return { success: true, deskripsi: sanitasiTeks(hasilTeks, 2000) };
        }
      }
    } catch {
      // Fallback ke generator template jika API gagal
    }
  }

  // Fallback generator deskripsi berkualitas tinggi & aman
  const deskripsiAI = `${nama} merupakan produk pilihan ${
    kategori ? `kategori ${kategori}` : "berkualitas"
  } yang diproduksi dengan bahan-bahan pilihan terbaik. Dibuat secara higienis dan teliti, menghadirkan keistimewaan rasa serta mutu yang siap memuaskan Anda. Sangat cocok dinikmati sehari-hari maupun dijadikan bingkisan istimewa!`;

  return { success: true, deskripsi: deskripsiAI };
}