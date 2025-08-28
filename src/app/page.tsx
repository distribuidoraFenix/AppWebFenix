// app/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // si no hay sesión, lo mandamos a login
    redirect("/login");
  }

  // si hay sesión, lo mandamos directo al dashboard
  redirect("/dashboard");
}
