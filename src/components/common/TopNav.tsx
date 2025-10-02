// TopNav.tsx
"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TopNavProps {
  onMenuClick: () => void;
  userName?: string;
  userSucursal?: string;
}

export default function TopNav({ onMenuClick, userName, userSucursal }: TopNavProps) {
  return (
    <nav
      role="navigation"
      className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-4 shadow-sm bg-violet-300 z-50"
    >
      {/* Botón menú */}
      <div className="w-1/5 flex items-center">
        <button aria-label="Abrir menú" onClick={onMenuClick} className="p-1">
          <Menu className="w-7 h-7 text-gray-700 cursor-pointer" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex-1 flex justify-end sm:justify-center">
        <Link href="/dashboard" aria-label="Ir al inicio" className="p-1">
          <Image
            src="/logos/fenixlogo.webp"
            alt="Distribuidora Fenix"
            width={40}
            height={40}
            priority
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Usuario */}
      <div className="hidden sm:flex w-1/5 items-center justify-end gap-5 text-sm font-medium text-gray-700">
        <div className="flex flex-col leading-tight text-left">
          <span className="text-gray-900 font-bold italic">{userName ?? "Invitado"}</span>
          <span className="text-gray-700 font-bold italic">{userSucursal ?? "Sin sesión"}</span>
        </div>
      </div>
    </nav>
  );
}
