"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar";
import { useAuth } from "@/context/AuthContext";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // 🔹 Mientras se verifica sesión, no renderizamos nada
  if (loading) return null;

  // 🔹 Rutas donde NO queremos mostrar navbar
  const noNavbarRoutes = ["/login", "/404", "/otra-ruta-error"];
  if (noNavbarRoutes.includes(pathname)) return null;

  // 🔹 Opcional: si no hay sesión, también ocultar
  if (!user) return null;

  return <Navbar />;
}
