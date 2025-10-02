"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
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

  // 👇 función para redirigir a cotización con precio y nombre
  const handleCotizar = () => {
    router.push(`/cotizacion?precio=${car.precio}&nombre=${encodeURIComponent(car.nombre)}`);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center p-4 relative">
      <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-md space-y-8">
        {/* 🔹 Sección 1: Marca + Nombre/Año */}      
        <section className="flex flex-row items-center justify-start gap-4">
          {/* Imagen → 20% */}
          <div className="w-1/5 flex justify-center items-center">
            {brand ? (
              <Image
                src={brand.logo_url}
                alt="Logo Marca"
                width={96}
                height={96}
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            ) : (
              <p className="text-gray-500 text-sm">Sin logo</p>
            )}
          </div>

          {/* Texto → 80% */}
          <div className="w-4/5 flex flex-col justify-center text-left space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{car.nombre}</h2>
            <p className="text-gray-600 text-sm md:text-base">Año: {car.ano}</p>
          </div>
        </section>

        {/* 🔹 Sección 2: Imagen principal + Datos */}
        <section className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Imagen → 50% */}
          <div className="w-full sm:w-1/2 flex justify-center">
            <Image
              key={mainImage}
              src={mainImage}
              alt={car.nombre}
              width={320}
              height={320}
              className="w-72 h-40 sm:w-80 sm:h-60 object-contain rounded-lg shadow-md transition-all duration-500 ease-in-out"
            />
          </div>

          {/* Datos → 50% */}
          <div className="w-full sm:w-1/2 flex flex-col justify-center items-start space-y-3 text-left">
            <p className="text-2xl font-semibold text-green-900">
              $ <span className="text-gray-900"> {car.precio}</span>
            </p>
            <p className="text-gray-900 font-bold text-lg">
              Pasajeros: <span className="font-medium">{details[0]?.pasajeros || "Sin información"}</span>
            </p>
            <p className="text-gray-900 font-bold text-lg">
              Cilindrada: <span className="font-medium">{details[0]?.cilindrada || "Sin información"} cc</span>
            </p>
             <p className="text-gray-900 font-bold text-lg">
              Neumáticos: <span className="font-medium">{details[0]?.neumatico || "Sin información"} </span>
            </p>
            <button
              onClick={handleCotizar}
              className="mt-2 px-5 py-2 bg-green-600 border border-l-green-950 text-white font-semibold rounded-lg  hover:bg-green-700 transition"
            >
              Cotizar
            </button>
          </div>
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
                    className={`w-10 h-10 rounded-xl shadow-md border border-gray-700 ${colorClass} transition-transform duration-300 hover:scale-110`}
                    title={color.name_color}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 🔹 Sección 4: Especificaciones básicas */}
        <section> 
          {/* Contenedor grid responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">

          {/* Card 1 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/motor.svg"
                alt="Motor"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Motor</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.motor || "Sin información"}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-4/5 md:5/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/transmision.svg"
                alt="Transmision"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Transmisión</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.s_transmision || "Sin información"}
              </p>
            </div>
          </div>      

          {/* Card 3 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/traccion.svg"
                alt="Traccion"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Tracción</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.traccion || "Sin información"}
              </p>
            </div>
          </div>  

          {/* Card 4 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/combustible.svg"
                alt="Combustible"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Combustible</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.tipo_combustible || "Sin información"}
              </p>
            </div>
          </div> 

          {/* Card 5 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/torque.svg"
                alt="Torque"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Torque</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.torque || "Sin información"}
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/hp.svg"
                alt="Hp"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">HP / RPM</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.hp_rpm || "Sin información"}
              </p>
            </div>
          </div>

          {/* Card 7 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/tanque.svg"
                alt="Tanque"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Tanque</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.tanque || "Sin información"}
              </p>
            </div>
          </div>

          {/* Card 8 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/direccion.svg"
                alt="Direccion"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">S.Dirección</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.s_direccion || "Sin información"}
              </p>
            </div>
          </div>

          {/* Card 9 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/frenos.svg"
                alt="Frenos"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">S. Frenos</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.s_frenos || "Sin información"}
              </p>
            </div>
          </div>

          {/* Card 10 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/frenos.svg"
                alt="Frenos"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Frenos D/T</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.frenos || "Sin información"}
              </p>
            </div>
          </div>

          {/* Card 11 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/suspension.svg"
                alt="Suspension"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Suspensión</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.s_suspension || "Sin información"}
              </p>
            </div>
          </div> 
        
        {/* Card 12 */}
          <div className="w-full h-18 sm:h-24 sm:p-4 bg-violet-100 rounded-lg border border-violet-700 flex ">
            {/* Columna izquierda 20% */}
            <div className="w-2/5 sm:w-3/5 md:4/5 flex flex-col items-center justify-center space-y-2 border-r border-gray-300">
              <Image
                src="/icons/inyeccion.svg"
                alt="Alimentacion"
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h12 object-contain"
              />
              <h5 className="text-xs sm:text-sm font-bold text-gray-700">Alimentacion</h5>
            </div>
            {/* Columna derecha 80% */}
            <div className="w-4/5 flex items-center justify-start p-4">
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                {details[0]?.s_alimentacion || "Sin información"}
              </p>
            </div>
          </div> 


        </div>
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
