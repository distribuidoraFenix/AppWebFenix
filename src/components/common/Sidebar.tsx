// Sidebar.tsx
"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const menuLinks = [
    { href: "/cotizacion", label: "COTIZACIÓN", roles: ["admin", "user"] },
    { href: "/requisitos", label: "REQUISITOS", roles: ["admin", "user"] },
    { href: "/faqs", label: "FAQ'S", roles: ["admin"] },
  ];

  const filteredLinks = user?.role
    ? menuLinks.filter((link) => link.roles.includes(user.role!))
    : [];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}></div>}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-violet-200 flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-violet-800">MENÚ</h2>
          <button aria-label="Cerrar menú" onClick={onClose} className="p-1">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Links filtrados */}
        <div className="flex flex-col p-4 space-y-4 bg-gray-200">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-800 hover:text-violet-600 font-bold text-md ml-2"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Logout */}
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
