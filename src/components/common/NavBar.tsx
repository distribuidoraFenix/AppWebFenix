"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

type AppUser = {
  id: string;
  nombre: string;
  usuario: string;
  sucursal: string;
  active: boolean;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const router = useRouter();

  // Obtener usuario al montar el navbar
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const authUser = data.user ?? null;

      if (authUser) {
        const { data: appUserData, error } = await supabase
          .from("app_users")
          .select("id, nombre, usuario, sucursal, active")
          .eq("id", authUser.id)
          .single();

        if (!error && appUserData) {
          setAppUser(appUserData);
        }
      }
    };

    getUser();

    // Suscribirse a cambios de sesión
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setAppUser(null);
        } else {
          // Se puede recargar info del appUser si se requiere
          supabase
            .from("app_users")
            .select("id, nombre, usuario, sucursal, active")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) setAppUser(data);
            });
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // 🔹 Función cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-4 shadow-sm bg-violet-300 z-50">
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

        {/* Sección central: Logo → en móviles va a la derecha, en sm vuelve al centro */}
        <div className="flex-1 flex justify-end sm:justify-center">
          <button
            onClick={() => router.push("/dashboard")}
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

        {/* Sección derecha: Usuario y Sucursal → solo desde sm */}
        <div className="hidden sm:flex w-1/5 items-center justify-end gap-5 text-sm font-medium text-gray-700">
          <div className="flex flex-col leading-tight text-left">
            <span className="text-gray-900 font-bold italic">
              {appUser?.usuario ?? "Invitado"}
            </span>
            <span className="text-gray-700 font-bold italic">
              {appUser?.sucursal ?? "Sin sesión"}
            </span>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
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
        <div className="flex flex-col p-4 space-y-4 bg-gray-200">
          <Link
            href="/cotizacion"
            className="text-gray-800 hover:text-violet-600 font-bold text-md ml-2"
            onClick={() => setOpen(false)}
          >
            COTIZACIÓN
          </Link>
          <hr className="border-1 border-gray-500" />
          <Link
            href="/requisitos"
            className="text-gray-800 hover:text-violet-600 font-bold text-md ml-2"
            onClick={() => setOpen(false)}
          >
            REQUISITOS
          </Link>
        </div>

        {/* Cerrar sesión */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
