"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import CarCard from "@/components/common/CarCard";
import { ArrowLeft } from "lucide-react";

// 🔹 Tipo de la tabla en Supabase
interface CarRow {
  id: number;
  nombre: string;
  ano: number;
  precio: number;
  imagen_url: string | null;
  brands?: {
    logo_url: string | null;
  };
}

// 🔹 Tipo adaptado para el componente
interface Car {
  id: number;
  nombre: string;
  ano: number;
  precio: number;
  marcalogo: string;
  imagen: string;
}

export default function ResultadosClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const brandsParam = searchParams.get("brands");
  const typesParam = searchParams.get("types");

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      const brandsIds = brandsParam ? brandsParam.split(",").map(Number) : [];
      const typesIds = typesParam ? typesParam.split(",").map(Number) : [];

      let query = supabase
        .from("data_car")
        .select(`
          id, nombre, ano, precio, imagen_url, 
          brands(logo_url)
        `)
        .order("precio", {ascending:true})
        .eq("active", true);

      if (brandsIds.length > 0) {
        query = query.in("brand_id", brandsIds);
      }

      if (typesIds.length > 0) {
        query = query.in("type_id", typesIds);
      }

      const { data, error } = await query.returns<CarRow[]>();

      if (error) {
        console.error("Error al cargar autos:", error.message);
        setCars([]);
      } else if (data) {
        const adapted: Car[] = data.map((car) => ({
          id: car.id,
          nombre: car.nombre,
          ano: car.ano,
          precio: car.precio,
          marcalogo: car.brands?.logo_url || "/placeholder.webp",
          imagen: car.imagen_url || "/placeholder.webp",
        }));
        setCars(adapted);
      }

      setLoading(false);
    };

    fetchCars();
  }, [brandsParam, typesParam]);

  if (loading) return <p className="p-4">Cargando autos...</p>;
  if (cars.length === 0) return <p className="p-4">No se encontraron resultados</p>;

  return (
    <main className="p-4 relative">
      {/* 🔹 Grid de autos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </section>

      {/* 🔙 Botón flotante */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-red-950 text-gray-200 px-3 py-3 rounded-full shadow-lg hover:bg-red-800 transition"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline"></span>
      </button>
    </main>
  );
}
