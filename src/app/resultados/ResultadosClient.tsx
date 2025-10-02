"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import CarCard from "@/components/common/CarCard";
import AdvancedFilter from "@/components/filters/AdvancedFilter";

interface CarRow {
  id: number;
  nombre: string;
  ano: number;
  precio: number;
  imagen_url: string | null;
  brand_id: number;
  type_id: number;
  brands?: { logo_url: string | null };
}

interface Car {
  id: number;
  nombre: string;
  ano: number;
  precio: number;
  marcalogo: string;
  imagen: string;
}

interface Brand {
  id: number;
  name: string;
}

interface TypeVehicle {
  id: number;
  tipo_vehiculo: string;
}

export default function ResultadosClient() {
  const searchParams = useSearchParams();
  const brandsParam = searchParams.get("brands");
  const typesParam = searchParams.get("types");

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [typesList, setTypesList] = useState<TypeVehicle[]>([]);

  const [filtersSelected, setFiltersSelected] = useState({
    selectedBrands: brandsParam ? brandsParam.split(",").map(Number) : [],
    selectedTypes: typesParam ? typesParam.split(",").map(Number) : [],
    priceRange: [0, 200000] as [number, number],
  });

  const [appliedFilters, setAppliedFilters] = useState(filtersSelected);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // 🔹 Fetch marcas y tipos
  useEffect(() => {
    const fetchBrandsAndTypes = async () => {
      const { data: brandsData } = await supabase
        .from("brands")
        .select("id, name")
        .eq("active", true)
        .order("name");

      const { data: typesData } = await supabase
        .from("typeCar")
        .select("id, tipo_vehiculo")
        .eq("active", true)
        .order("tipo_vehiculo");

      setBrandsList(brandsData || []);
      setTypesList(typesData || []);
    };

    fetchBrandsAndTypes();
  }, []);

  // 🔹 Fetch autos según filtros aplicados
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      let query = supabase
        .from("data_car")
        .select(
          `id, nombre, ano, precio, imagen_url, brand_id, type_id, brands(logo_url)`
        )
        .order("precio", { ascending: true })
        .eq("active", true);

      if (appliedFilters.selectedBrands.length > 0)
        query = query.in("brand_id", appliedFilters.selectedBrands);

      if (appliedFilters.selectedTypes.length > 0)
        query = query.in("type_id", appliedFilters.selectedTypes);

      if (appliedFilters.priceRange) {
        query = query
          .gte("precio", appliedFilters.priceRange[0])
          .lte("precio", appliedFilters.priceRange[1]);
      }

      const { data, error } = await query.returns<CarRow[]>();

      if (error) {
        console.error("Error al cargar autos:", error.message);
        setCars([]);
      } else if (data) {
        const adapted: Car[] = data.map((car) => ({
          id: Number(car.id),
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
  }, [appliedFilters]);

  const handleClearFilters = () => {
    const cleared = {
      selectedBrands: [],
      selectedTypes: [],
      priceRange: [0, 200000] as [number, number],
    };
    setFiltersSelected(cleared);
    setAppliedFilters(cleared);
  };

  const handleApplyFilters = (filters: typeof filtersSelected) => {
    // 🔹 Aplicar filtros incluyendo el rango de precio actualizado
    setFiltersSelected(filters);
    setAppliedFilters({
      ...filters,
      priceRange: filters.priceRange || [0, 200000],
    });
    setShowFilterModal(false);
  };

  return (
    <main className="p-4 relative mb-16">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        {/* Sidebar para lg */}
        <aside className="hidden lg:block md:col-span-0 lg:col-span-3 xl:col-span-2">
          <AdvancedFilter
            brands={brandsList}
            types={typesList}
            selectedBrands={filtersSelected.selectedBrands}
            selectedTypes={filtersSelected.selectedTypes}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Resultados */}
        <section
          className="md:col-span-10 lg:col-span-7 xl:col-span-8 
                     grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start"
        >
          {loading ? (
            <p className="p-4 col-span-full text-center text-gray-500 font-semibold">
              Cargando autos...
            </p>
          ) : cars.length === 0 ? (
            <p className="p-4 col-span-full text-center text-gray-400 font-semibold">
              No se encontraron resultados
            </p>
          ) : (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          )}
        </section>
      </div>

      {/* Botón flotante PERSONALIZA TU BÚSQUEDA para md y abajo */}
      <button
        onClick={() => setShowFilterModal(true)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full sm:w-[85%] max-w-lg
                  bg-violet-500 text-white py-3 text-center font-semibold rounded-xl shadow-xl lg:hidden"
      >
        PERSONALIZA TU BÚSQUEDA
      </button>

      {/* Modal para filtros en móviles */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative w-[90vw] h-[90vh] bg-gray-300 rounded-lg p-4 pt-12 flex flex-col">
            <button
              onClick={() => setShowFilterModal(false)}
              className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center 
                         bg-red-900 text-white rounded-full font-bold text-2xl 
                         shadow z-50"
            >
              ×
            </button>

            <AdvancedFilter
              brands={brandsList}
              types={typesList}
              selectedBrands={filtersSelected.selectedBrands}
              selectedTypes={filtersSelected.selectedTypes}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      )}
    </main>
  );
}
