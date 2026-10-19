"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { loginAction } from "../actions";

export default function HalamanLogin() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-extrabold">Masuk admin</h1>
        <p className="mt-1 text-sm text-teks-lembut">Khusus pemilik toko untuk mengelola produk.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state?.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {state.error}
          </div>
        )}
        <Input 
          label="Email" 
          name="email" 
          type="email" 
          autoComplete="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Memproses..." : "Masuk"}
        </Tombol>
      </form>
    </div>
  );
}