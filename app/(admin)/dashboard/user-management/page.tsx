"use client"

import { useUserManagement } from "./hooks/use-user-management"
import {
  AddUserDialog,
  EditUserDialog,
  DeleteUserDialog,
  ChangeRoleDialog,
} from "./components/dialogs"

import UserManagementHeader from "./components/user-management-header"
import UserManagementStats from "./components/cards/user-management-stats"

import { Toolbar } from "./components/table"

import { DataTable } from "@/components/ui/data-table"
import { DataTablePagination } from "@/components/ui/data-table-pagination"

export default function UserManagementPage() {
  const { state, stats, table, actions, dialogs } = useUserManagement()

  if (state.loading) {
    return (
      <div className="space-y-6">
        <UserManagementHeader />
        <p>Loading users...</p>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="space-y-6">
        <UserManagementHeader />
        <p className="text-destructive">{state.error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <UserManagementHeader />

      <UserManagementStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
        admins={stats.administrators}
        clients={stats.clients}
      />

      <Toolbar table={table} onAddUser={actions.openAdd} />
      <AddUserDialog
        open={dialogs.add.open}
        loading={state.loading}
        onOpenChange={dialogs.add.setOpen}
        onSubmit={actions.create}
      />

      <EditUserDialog
        open={dialogs.edit.open}
        user={dialogs.selectedUser}
        loading={state.loading}
        onOpenChange={dialogs.edit.setOpen}
        onSubmit={(data) =>
          dialogs.selectedUser
            ? actions.update(dialogs.selectedUser.id, data)
            : Promise.resolve()
        }
      />

      <DeleteUserDialog
        open={dialogs.delete.open}
        user={dialogs.selectedUser}
        loading={state.loading}
        onOpenChange={dialogs.delete.setOpen}
        onConfirm={() =>
          dialogs.selectedUser
            ? actions.deleteUser(dialogs.selectedUser.id)
            : Promise.resolve()
        }
      />

      <ChangeRoleDialog
        open={dialogs.changeRole.open}
        user={dialogs.selectedUser}
        loading={state.loading}
        onOpenChange={dialogs.changeRole.setOpen}
        onSubmit={(role) =>
          dialogs.selectedUser
            ? actions.changeRole(dialogs.selectedUser.id, role)
            : Promise.resolve()
        }
      />

      <DataTable table={table} />

      <DataTablePagination table={table} />
    </div>
  )
}
