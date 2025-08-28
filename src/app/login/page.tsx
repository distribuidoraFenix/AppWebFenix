"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

   if (error) {
  // 🔹 Validación personalizada
  if (error.message.includes("missing email or phone")) {
    setError("Por favor ingresa tu correo.");
  } else if (error.message.includes("Invalid login credentials")) {
    setError("Correo o contraseña incorrectos.");
  } else {
    setError("Ocurrió un error, intenta de nuevo.");
  }
  return;
}

    console.log("✅ Sesión iniciada:", data);

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("No se pudo iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-6 sm:p-1 min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm flex flex-col items-center"
      >
        <div className="mb-4 flex justify-center">
          <Image
            src="/logos/fenixlogo.webp"
            alt="Fenix Logo"
            width={120}
            height={120}
            className="rounded"
            priority
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-800">Iniciar Session</h1>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg text-gray-900"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg text-gray-900"
        />

        <button
          type="submit"
          className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-950"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
