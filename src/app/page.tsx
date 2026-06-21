import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabaseServer";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  redirect("/dashboard");
}