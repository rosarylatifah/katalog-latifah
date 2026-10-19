"use client";

import { useActionState, useState } from "react";
import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPasswordAction } from "../actions";

export default function HalamanGantiPassword() {
  const [state, formAction, isPending] = useActionState(gantiPasswordAction, null);
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Ganti password</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Ganti password bawaan segera setelah pertama kali masuk. Minimal 8 karakter.
        </p>
      </div>

      <form action={formAction} className="flex max-w-sm flex-col gap-4">
        {state?.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            {state.success}
          </div>
        )}

        <Input
          label="Password baru"
          name="password_baru"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={passwordBaru}
          onChange={(e) => setPasswordBaru(e.target.value)}
          required
        />
        <Input
          label="Ulangi password baru"
          name="konfirmasi_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={konfirmasiPassword}
          onChange={(e) => setKonfirmasiPassword(e.target.value)}
          required
        />
        <Tombol type="submit" disabled={isPending} className="self-start">
          {isPending ? "Menyimpan..." : "Simpan password"}
        </Tombol>
      </form>
    </div>
  );
}