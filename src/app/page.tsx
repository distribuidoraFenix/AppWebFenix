"use client";

import Navbar from "@/components/common/NavBar";
import { useState } from "react";
import FilterBrandCard from "@/components/common/FilterBrandCard";

const brandFilters = [
  { id: 1, name: "BAW", image: "/logos/bawlogo.webp" },
  { id: 2, name: "BAIC", image: "/logos/baiclogo.webp" },
  { id: 3, name: "NISSAN", image: "/logos/nissanlogo.webp" },
  { id: 4, name: "SUZUKI", image: "/logos/suzukilogo.webp" },
];

export default function Home() {
  const [activeFilters, setActiveFilters] = useState<number[]>([]);

  const handleToggle = (id: number) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <main className="p-4">
      
 

      {/* Título */}
      <h1 className="text-lg font-bold my-4">Selecciona la marca</h1>

      {/* Tarjetas de filtros */}
      <div className="grid grid-cols-2 gap-4">
        {brandFilters.map((brand) => (
          <FilterBrandCard
            key={brand.id}
            id={brand.id}
            name={brand.name}
            image={brand.image}
            onToggle={handleToggle}
            isActive={activeFilters.includes(brand.id)}
          />
        ))}
      </div>

      {/* Mostrar filtros activos */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold">Filtros activos:</h2>
        <p className="text-gray-600">{activeFilters.join(", ") || "Ninguno"}</p>
      </div>
    </main>
  );
}
