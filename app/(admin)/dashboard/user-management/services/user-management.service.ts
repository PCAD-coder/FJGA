import { createClient } from "@/lib/supabase/client"

import {
  CreateUserDto,
  IUserManagementService,
  UpdateUserDto,
  User,
  UserRole,
} from "../types/user-management"

export const UserManagementService: IUserManagementService = {
  async getUsers() {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      throw error
    }

    return data as User[]
  },

  async createUser(data: CreateUserDto) {
    console.log("Create User", data)
  },

  async updateUser(
    id: string,
    data: UpdateUserDto
  ) {
    console.log("Update User", id, data)
  },

  async deleteUser(id: string) {
    console.log("Delete User", id)
  },

  async changeRole(
    id: string,
    role: UserRole
  ) {
    console.log("Change Role", id, role)
  },

  async toggleUserStatus(id: string) {
    console.log("Toggle User Status", id)
  },
}