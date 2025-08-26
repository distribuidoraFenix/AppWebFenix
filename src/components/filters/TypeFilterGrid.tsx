"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import FilterTypeCard from "@/components/common/FilterTypeCard";

export interface TypeCar {
  id: number;
  tipo_vehiculo: string;
  icono_url: string;
}

interface TypeFilterGridProps {
  defaultSelected?: number[];                  // opcional: ids preseleccionados
  onSelectionChange?: (ids: number[]) => void; // opcional: notifica cambios al padre
}

export default function TypeFilterGrid({
  defaultSelected = [],
  onSelectionChange,
}: TypeFilterGridProps) {
  const [types, setTypes] = useState<TypeCar[]>([]);
  const [selected, setSelected] = useState<number[]>(defaultSelected);

  useEffect(() => {
    console.log("🚀 useEffect de tipos montado");
    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from("typeCar")
        .select("id, tipo_vehiculo, icono_url");

      if (error) {
        console.error("❌ Error al cargar tipos:", error.message);
      } else {
        console.log("✅ Tipos recibidos de Supabase:", data);
        setTypes(data || []);
      }
    };

    fetchTypes();
  }, []);

  const handleToggleType = (id: number) => {
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      onSelectionChange?.(next);
      return next;
    });
  };

  return (
    <section className="grid grid-cols-4 p-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-12 gap-4">
      {types.length === 0 && <p>Error 301!</p>}
      {types.map((t) => (
        <FilterTypeCard
          key={t.id}
          id={t.id}
          name={t.tipo_vehiculo}
          icon={t.icono_url}
          isActive={selected.includes(t.id)}  
          onToggle={handleToggleType}
        />
      ))}
    </section>
  );
}
