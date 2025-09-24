"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 🔹 Mientras cargamos la sesión, mostramos cargando
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    );
  }

  // 🔹 Si no hay sesión, redirigir a login
  if (!user) {
    router.replace("/login");
    return null; // no renderiza nada mientras redirige
  }

  // 🔹 Si hay sesión, renderizamos los hijos protegidos
  return <>{children}</>;
}
