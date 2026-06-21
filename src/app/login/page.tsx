"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // Extraemos únicamente loading y login para evitar conflictos de estado reactivo
  const { loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🟢 SE ELIMINÓ EL USEEFFECT DETECTOR DE USER (EVITA EL PARPADEO Y REBOTE)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      console.log("INICIANDO LOGIN LINEAL");

      // 1. Esperamos a que Supabase procese las credenciales y actualice cookies
      await login(email, password);

      console.log("LOGIN OK → Ejecutando redirección única y directa");
      
      // 2. Redirección lineal: reemplaza la ruta actual sin dejar historial para evitar bucles
      router.replace("/dashboard");
      router.refresh();

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
      // Solo liberamos el submit si hubo un error para permitir reintentar
      setIsSubmitting(false);
    }
  };

  // Evitamos mostrar la pantalla de carga si el usuario está enviando el formulario activamente
  if (loading && !isSubmitting) {
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
          disabled={isSubmitting}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg text-gray-900"
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-950 disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
