"use client";

import { Menu, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full h-12 flex items-center justify-between px-4 py-2 shadow-sm bg-violet-300">
      
      {/* Sección izquierda*/}
      <div className="w-1/5 flex items-center">
        <Menu className="w-8 h-8 text-gray-700 cursor-pointer md:ml-4" />
      </div>

      {/* Sección central (logo) */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/logos/fenixlogo.webp"
          alt="Distribuidora Fenix"
          width={36}
          height={36}
          priority
        />
      </div>

      {/* Sección derecha */}
      <div className="w-1/5 flex justify-end">
        <Search className="w-8 h-8 text-gray-700 cursor-pointer md:mr-4" />
      </div>
    </nav>
  );
}
