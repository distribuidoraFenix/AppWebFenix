"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase env vars are missing. Check Vercel settings.");
}

export const supabase = createClient(
  supabaseUrl ?? "http://localhost", // fallback para evitar error en build
  supabaseAnonKey ?? "fake-key"
);
