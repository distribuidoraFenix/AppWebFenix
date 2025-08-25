import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/NavBar"; // 

export const metadata: Metadata = {
  title: "Distribuidora Fenix",
  description: "App web de Distribuidora Fenix",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-800 text-gray-200">
        {/* Navbar siempre arriba */}
        <Navbar />
        <h2 className="text-2xl pt-4 pl-6">Selecciona la marca y el tipo de vehículo que buscas</h2>

        {/* Aquí renderizan las páginas */}
        <main className="p-2">{children}</main>
      </body>
    </html>
  );
}
