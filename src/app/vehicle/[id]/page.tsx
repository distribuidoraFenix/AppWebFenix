"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { colorMap } from "@/utils/colors";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { use } from "react"; // 👈 importante

type DataCar = {
  id: number;
  brand_id: number;
  type_id: number;
  nombre: string;
  ano: number;
  imagen_url: string;
  precio: number;
  active: boolean;
};

type Color = {
  id: number;
  id_data_car: number;
  name_color: string;
  url_car_color: string;
};

type Detail = {
  id: number; 
  data_car_id: number; 
  pasajeros: number; 
  motor: string; 
  s_transmision: string; 
  cilindrada: string; 
  traccion: string; 
  torque: string; 
  neumatico: string; 
  tipo_combustible: string; 
  hp_rpm: string; 
  s_direccion: string; 
  s_frenos: string; 
  frenos: string; 
  s_suspension: string; 
  s_alimentacion: string;
  tanque:string;
};

type Brand = {
  id: number;
  logo_url: string;
};

export default function VehiclePage({ params }: { params: Promise<{ id: string }> }) {
  // 👇 aquí unwrap del Promise
  const { id } = use(params);

  const [car, setCar] = useState<DataCar | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [details, setDetails] = useState<Detail[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: carData } = await supabase
        .from("data_car")
        .select("*")
        .eq("id", id)
        .single();

      const { data: colorsData } = await supabase
        .from("colors")
        .select("*")
        .eq("id_data_car", id);

      const { data: detailsData } = await supabase
        .from("details")
        .select("*")
        .eq("id_data_car", id);

      const { data: brandData } = await supabase
        .from("brands")
        .select("id, logo_url")
        .eq("id", carData.brand_id)
        .single();

      setCar(carData);
      setColors(colorsData || []);
      setDetails(detailsData || []);
      setBrand(brandData);

      setMainImage(carData?.imagen_url || "");
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Cargando vehículo...</p>;
  }

  if (!car) {
    return (
      <p className="text-center text-red-600 mt-10">
        No se encontró el vehículo con id {id}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center p-4 relative">
      <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-md space-y-8">
        {/* 🔹 Sección 1: Marca + Nombre/Año */}
        <section className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-full md:w-1/3 flex justify-center items-center mb-4 md:mb-0">
            {brand ? (
              <Image
                src={brand.logo_url}
                alt="Logo Marca"
                width={96}
                height={96}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <p className="text-gray-500">Sin logo</p>
            )}
          </div>

          <div className="w-full md:w-2/3 text-left space-y-2">
            <h2 className="text-xl font-bold text-gray-800">{car.nombre}</h2>
            <p className="text-gray-600">Año: {car.ano}</p>
          </div>
        </section>

        {/* 🔹 Sección 2: Imagen principal + Precio */}
        <section className="flex flex-col items-center space-y-4">
          <Image
            key={mainImage}
            src={mainImage}
            alt={car.nombre}
            width={320}
            height={320}
            className="w-80 h-80 object-contain rounded-lg shadow-md transition-all duration-500 ease-in-out"
          />
          <p className="text-2xl font-semibold text-blue-700">${car.precio}</p>
        </section>

        {/* 🔹 Sección 3: Colores disponibles */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-red-800">Colores disponibles</h2>
          {colors.length === 0 ? (
            <p className="text-gray-600">No hay colores registrados.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => {
                const colorClass = colorMap[color.name_color] || "bg-gray-200 border";
                return (
                  <button
                    key={color.id}
                    onClick={() => setMainImage(color.url_car_color)}
                    className={`w-10 h-10 rounded-xl shadow-md ${colorClass} transition-transform duration-300 hover:scale-110`}
                    title={color.name_color}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 🔹 Sección 4: Especificaciones básicas */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-blue-800">Especificaciones básicas</h2>
         {/* 🔹 Sección 4: Especificaciones básicas */}
<section> 

  {/* Contenedor grid responsive */}
  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 ">

    {/* Card 1 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/motor.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
      />
      <p className="text-sm font-semibold text-gray-800 pl-2 sm:pl-6">
        {details[0]?.motor || "Sin información"}
      </p>
    </div>

    {/* Card 2 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/transmision.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"        
      />
      <p className="text-sm font-semibold text-gray-800">
           {details[0]?.s_transmision || "Sin información"}
      </p>
    </div>

    {/* Card 3 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/traccion.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
      />
      <p className="text-sm font-semibold text-gray-800">
       {details[0]?.traccion || "Sin información"}
      </p>
    </div>

    {/* Card 4 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/combustible.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"        
      />
      <p className="text-sm font-semibold text-gray-800">
       {details[0]?.tipo_combustible || "Sin información"}
      </p>
    </div>

    {/* Card 5 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/torque.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
      />
      <p className="text-sm font-semibold text-gray-800">
        {details[0]?.torque || "Sin información"}
      </p>
    </div>

    {/* Card 6 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/hp.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"        
      />
      <p className="text-sm font-semibold text-gray-800">
        {details[0]?.hp_rpm || "Sin información"}
      </p>
    </div>

    {/* Card 7 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/tanque.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"

      />
      <p className="text-sm font-semibold text-gray-800">
        {details[0]?.tanque || "Sin información"}
      </p>
    </div>

    {/* Card 8 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/direccion.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"

      />
      <p className="text-sm font-semibold text-gray-800">
        {details[0]?.neumatico || "Sin información"}
      </p>
    </div>

    {/* Card 9 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/frenos.svg"
        alt="Motor"
        width={64}
        height={64}
               className="w-10 h-10 sm:w-12 sm:h-12 object-contain"

      />
      <p className="text-sm font-semibold text-gray-800">
        {details[0]?.s_frenos || "Sin información"}
      </p>
    </div>

      {/* Card 10 */}
    <div className="w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/icons/frenos.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"

      />
      <p className="text-sm font-semibold text-gray-800 pl-6">
        {details[0]?.frenos || "Sin información"}
      </p>
    </div>

    {/* Card 11 */}
    <div className="p-2 w-full h-40 bg-gray-100 rounded-xl border border-gray-700 flex flex-col items-center justify-center space-y-2">
      <Image
        src="/icons/suspension.svg"
        alt="Motor"
        width={64}
        height={64}
        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
      />
      <p className="text-sm font-semibold text-gray-800 pl-6">
        {details[0]?.s_suspension || "Sin información"}

      </p>
    </div>

  </div>
</section>

          
        </section>
      </div>

      {/* 🔘 Botón flotante volver */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
    </div>
  );
}
