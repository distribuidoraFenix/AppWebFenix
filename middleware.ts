import { NextResponse } from "next/server";
// 1. IMPORTANTE: Aquí se importa 'NextRequest' para solucionar el error ts(2304)
import type { NextRequest } from "next/server"; 
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // Creamos la respuesta base
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Instanciamos el cliente con la sintaxis moderna getAll / setAll (Sin líneas tachadas)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sincronizamos las cookies tanto en la petición como en la respuesta
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Validamos de forma segura el usuario en los servidores de Supabase (Obligatorio en Vercel)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // Lógica de redirecciones basada en la sesión real
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (user && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    /*
     * Excluye archivos estáticos de la verificación para no degradar el rendimiento
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
