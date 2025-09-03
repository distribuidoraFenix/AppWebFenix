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

    // 1️⃣ Autenticación con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      // Validación personalizada de errores
      if (authError?.message.includes("missing email or phone")) {
        setError("Por favor ingresa tu correo.");
      } else if (authError?.message.includes("Invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error, intenta de nuevo.");
      }
      return;
    }

    // 2️⃣ Verificar si el usuario está activo en app_users
    const { data: appUser, error: userError } = await supabase
      .from("app_users")
      .select("active")
      .eq("id", authData.user.id)
      .single();

    if (userError || !appUser) {
      setError("No se pudo verificar el estado del usuario.");
      return;
    }

    if (!appUser.active) {
      setError("El usuario no está activo. Contacta al administrador.");
      // Opcional: cerrar sesión inmediatamente
      await supabase.auth.signOut();
      return;
    }

    // 3️⃣ Usuario activo → redirigir
    router.push("/dashboard");
    router.refresh();
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

        <h1 className="text-2xl font-bold mb-4 text-gray-800">Iniciar Sesión</h1>

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
