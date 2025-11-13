import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/common/NavbarWrapper";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Distribuidora Fenix",
  description: "App web de Distribuidora Fenix",
  icons: {
    icon: "/logos/fenixlogo.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-800 text-gray-200 flex flex-col min-h-screen">
        <AuthProvider>
          <NavbarWrapper />
          <main className="flex-grow pt-14">{children}</main>
         <footer className="bg-gray-900 text-gray-400 text-left py-4 px-6 text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3">
  <div>
    <p>
      Develop by <span className="text-gray-200 font-semibold">AR-SystemsBolivia  </span> 
      for Distribuidora Fenix © {new Date().getFullYear()}
      <span className="text-gray-200 font-semibold font-mono">  Version 1.0 </span> 
    </p>   
  </div>
</footer>
        </AuthProvider>
      </body>
    </html>
  );
}
