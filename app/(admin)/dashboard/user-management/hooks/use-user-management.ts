"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useDataTable } from "@/hooks/use-data-table"

import { getColumns } from "../components/table"
import { UserManagementService } from "../services/user-management.service"

import {
  User,
  UserManagementStats,
} from "../types/user-management"

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)

      const data = await UserManagementService.getUsers()

      setUsers(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Unable to load users.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const stats = useMemo<UserManagementStats>(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === "Active").length,
      inactive: users.filter((user) => user.status === "Inactive").length,
      administrators: users.filter((user) => user.role === "admin").length,
      clients: users.filter((user) => user.role === "client").length,
    }),
    [users]
  )

  const table = useDataTable({
    data: users,
    columns: getColumns(),

    globalFilterFn: (row, _, value) => {
      const user = row.original

      const firstName = user.first_name?.trim() ?? ""
      const lastName = user.last_name?.trim() ?? ""
      const fullName = user.full_name?.trim() ?? ""
      const email = user.email?.trim() ?? ""

      const searchableText = [
        firstName,
        lastName,
        fullName,
        email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchableText.includes(
        String(value).trim().toLowerCase()
      )
    },
  })

  return {
    state: {
      users,
      loading,
      error,
    },

    table,
    stats,
  }
}