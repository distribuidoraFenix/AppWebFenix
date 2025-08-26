"use client";

import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full h-14 flex items-center justify-between px-4 shadow-sm bg-violet-300">
        {/* Sección izquierda: Menú */}
        <div className="w-1/5 flex items-center">
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="p-1"
          >
            <Menu className="w-7 h-7 text-gray-700 cursor-pointer" />
          </button>
        </div>

        {/* Sección central: Logo → redirige a HomePage */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="focus:outline-none"
            aria-label="Ir a inicio"
          >
            <Image
              src="/logos/fenixlogo.webp"
              alt="Distribuidora Fenix"
              width={40}
              height={40}
              priority
            />
          </button>
        </div>

        {/* Sección derecha: Buscar + Usuario y Rol al lado */}
        <div className="w-1/5 flex items-center justify-end gap-5 text-sm font-medium text-gray-700">
          <Search className="w-6 h-6 cursor-pointer" />
          <div className="flex flex-col leading-tight text-left">
            <span className="text-gray-900">Usuario: Admin</span>
            <span className="text-gray-900">Rol: Administrador</span>
          </div>
        </div>
      </nav>

      {/* OVERLAY (fondo oscuro) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header con botón de cerrar */}
        <div className="bg-violet-200 flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-violet-800">MENÚ</h2>
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="p-1"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Opciones del menú */}
        <div className=" flex flex-col p-4 space-y-4 ">
          <Link
            href="/cotizacion"
            className="text-gray-800 hover:text-violet-600 font-medium"
            onClick={() => setOpen(false)}
          >
            Cotización
          </Link>
          <Link
            href="/requisitos"
            className="text-gray-800 hover:text-violet-600  font-medium"
            onClick={() => setOpen(false)}
          >
            Requisitos
          </Link>
        </div>

        {/* Cerrar sesión fijo abajo */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600">
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
