"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestSupabase() {
  useEffect(() => {
    async function testConnection() {
      const supabase = createClient();

      const { data, error } = await supabase.auth.getSession();

      console.log("Session:", data);
      console.log("Error:", error);
    }

    testConnection();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Testing Supabase Connection...
      </h1>

      <p>Open your browser console (F12).</p>
    </div>
  );
}