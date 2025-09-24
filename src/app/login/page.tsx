"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const { user, loading, login } = useAuth(); // usamos sesión global
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 Redirigir automáticamente si ya hay sesión
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password); // autenticación centralizada
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocurrió un error inesperado");
    }
  };

  // 🔹 Mientras se verifica sesión, no renderizamos el formulario
  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    );
  }

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
