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
      <body className="bg-gray-50 text-gray-900">
        {/* Navbar siempre arriba */}
        <Navbar />

        {/* Aquí renderizan las páginas */}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
