"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import FilterBrandCard from "@/components/common/FilterBrandCard";

interface Brand {
  id: number;
  name: string;
  logo_url: string;
  active: boolean;
  importadora: string;
}

export default function HomePage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selected, setSelected] = useState<number[]>([]); // IDs seleccionados


useEffect(() => {
  const fetchBrands = async () => {
    const { data, error } = await supabase.from("brands").select("*");
    if (error) {
      console.error("Error al cargar marcas:", error.message);
    } else {
      console.log("✅ Data de Supabase:", data);  // 👈 para verificar
      setBrands(data || []);
    }
  };
  fetchBrands();
}, []);


  const handleToggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <main className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-12 gap-4 p-4">
      {brands.map((brand) => (
        <FilterBrandCard
          key={brand.id}
          id={brand.id}
          name={brand.name}
          logo={brand.logo_url}
          isActive={selected.includes(brand.id)}
          onToggle={handleToggle}
        />
      ))}
    </main>
  );
}
