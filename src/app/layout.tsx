import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/NavBar"; // 

export const metadata: Metadata = {
  title: "Distribuidora Fenix",
  description: "App web de Distribuidora Fenix",
  icons: {
    icon: "/logos/fenixlogo.webp", // favicon 
  },
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
      

        {/* Aquí renderizan las páginas */}
        <main className="p-2">{children}</main>
      </body>
    </html>
  );
}
