// NavbarWrapper.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mientras se verifica sesión, no renderizamos nada
  if (loading) return null;

  // Rutas donde NO queremos mostrar navbar
  const noNavbarRoutes = ["/login", "/404"];
  if (noNavbarRoutes.includes(pathname)) return null;

  // Opcional: ocultar si no hay sesión
  if (!user) return null;

  return (
    <>
      {/* TopNav: pasa la función para abrir el Sidebar */}
      <TopNav
        onMenuClick={() => setSidebarOpen(true)}
        userName={user.usuario}
        userSucursal={user.sucursal}
      />

      {/* Sidebar: solo se muestra cuando sidebarOpen es true */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
