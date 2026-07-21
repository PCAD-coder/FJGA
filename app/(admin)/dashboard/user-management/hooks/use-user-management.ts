"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useDataTable } from "@/hooks/use-data-table"

import { getColumns } from "../components/table"

import { UserManagementService } from "../services/user-management.service"

import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserManagementStats,
} from "../types/user-management"

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [changeRoleOpen, setChangeRoleOpen] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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
      active: users.filter((u) => u.status === "Active").length,
      inactive: users.filter((u) => u.status === "Inactive").length,
      administrators: users.filter((u) => u.role === "admin").length,
      clients: users.filter((u) => u.role === "client").length,
    }),
    [users]
  )

  const openAdd = () => {
  setAddOpen(true)
}

const openEdit = (user: User) => {
  setSelectedUser(user)
  setEditOpen(true)
}

const openDelete = (user: User) => {
  setSelectedUser(user)
  setDeleteOpen(true)
}

const openChangeRole = (user: User) => {
  setSelectedUser(user)
  setChangeRoleOpen(true)
}
  const table = useDataTable({
    data: users,
    columns: getColumns({
  onEdit: openEdit,
  onDelete: openDelete,
  onChangeRole: openChangeRole,
}),

    globalFilterFn: (row, _, value) => {
      const user = row.original

      return `${user.first_name} ${user.last_name} ${user.email}`
        .toLowerCase()
        .includes(String(value).toLowerCase())
    },
  })

  const actions = {

    openAdd,
    openEdit,
    openDelete,
    openChangeRole,
    refresh,

    create: async (data: CreateUserDto) => {
      try{
        setLoading(true)
        await UserManagementService.createUser(data)
        await refresh()
        setAddOpen(false)
        } finally {
          setLoading(false)
        }
      
    },

    update: async (id: string, data: UpdateUserDto) => {
        try{
            setLoading(true)
            await UserManagementService.updateUser(id, data)
            await refresh()
            setEditOpen(false)
            setSelectedUser(null)
        }finally {
          setLoading(false)
        }
      
    },

    deleteUser: async (id: string) => {
        try{
            setLoading(true)
            await UserManagementService.deleteUser(id)
            await refresh()
            setDeleteOpen(false)
            setSelectedUser(null)
        }finally {
          setLoading(false)
        }
      
    },

    changeRole: async (id: string, role: User["role"]) => {
        try{
            setLoading(true)
            await UserManagementService.changeRole(id, role)
            await refresh()
            setChangeRoleOpen(false)
            setSelectedUser(null)
        }finally {
          setLoading(false)
        }
      
    },

    toggleStatus: async (id: string) => {
      await UserManagementService.toggleUserStatus(id)
      await refresh()
    },
  }
  const dialogs = {
    add: {
      open: addOpen,
      setOpen: setAddOpen,
    },

    edit: {
      open: editOpen,
      setOpen: setEditOpen,
    },

    delete: {
      open: deleteOpen,
      setOpen: setDeleteOpen,
    },

    changeRole: {
      open: changeRoleOpen,
      setOpen: setChangeRoleOpen,
    },

    selectedUser,
  }

  return {
    state: {
      users,
      loading,
      error,
    },

    table,

    stats,

    actions,
    dialogs,
  }
}
