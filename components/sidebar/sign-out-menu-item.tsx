"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutMenuItem() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;

      window.location.replace("/");
    } catch {
      toast.error("Unable to sign out. Please try again.");
      setIsSigningOut(false);
    }
  }

  return (
    <DropdownMenuItem
      variant="destructive"
      className="flex items-center gap-2"
      disabled={isSigningOut}
      onSelect={(event) => {
        event.preventDefault();
        void handleSignOut();
      }}
    >
      <LogOut className="h-4 w-4" />
      {isSigningOut ? "Signing out…" : "Sign Out"}
    </DropdownMenuItem>
  );
}
