import { createClient } from "@/lib/supabase/client"

import { User } from "../types/user-management"

export const UserManagementService = {
  async getUsers(): Promise<User[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
          id,
          auth_user_id,
          first_name,
          last_name,
          full_name,
          email,
          contact_number,
          profile_image,
          role,
          status,
          created_at,
          updated_at
        `
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      throw error
    }

    return data as User[]
  },
}