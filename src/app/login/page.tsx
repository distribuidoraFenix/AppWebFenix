"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  // Extraemos también 'user' para sacarte del login si ya estás autenticado
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚨 CORRECTOR DE BUCLE ASÍNCRONO PARA PRODUCCIÓN
  // Si el AuthContext en segundo plano encuentra que el usuario ya inició sesión,
  // rompe la vista estática y fuerza el viaje al Dashboard inmediatamente.
  useEffect(() => {
    if (!loading && user) {
      console.log("LOGIN DETECTÓ USER EN PRODUCCIÓN → Forzando Dashboard");
      window.location.href = "/dashboard";
    }
  }, [user, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      console.log("INICIANDO LOGIN");

      await login(email, password);

      console.log("LOGIN OK → Forzando redirección limpia");
      
      // SOLUCIÓN CRÍTICA: window.location.href rompe la caché estática de Vercel
      // e inyecta las cookies de Supabase de manera instantánea en el servidor.
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-gray-400 font-medium">Verificando sesión...</p>
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
          <Image src="/logos/fenixlogo.webp" alt="Fenix Logo" width={120} height={120} priority />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-800">Iniciar Sesión</h1>

        {error && <p className="text-red-600 mb-2 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg text-gray-900"
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg text-gray-900"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-950 disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
