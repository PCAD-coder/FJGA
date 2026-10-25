"use client"

import UserManagementSkeleton from "./components/user-management-skeleton"

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
    return <UserManagementSkeleton />
  }

  if (state.error) {
    return (
      <div className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
        <UserManagementHeader />
        <p
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {state.error}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <UserManagementHeader />

      <UserManagementStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
        admins={stats.administrators}
        clients={stats.clients}
      />

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

      <section
        aria-label="User directory"
        className="min-w-0 overflow-hidden rounded-xl border border-border/80 bg-card"
      >
        <div className="border-b border-border/60 px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold">User directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search accounts and manage roles, access, and account details.
          </p>
        </div>
        <div className="space-y-4 p-4 sm:p-5 [&_table]:min-w-[640px] [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:text-sm [&_thead]:bg-muted/50">
          <DataTable
            table={table}
            toolbar={<Toolbar table={table} onAddUser={actions.openAdd} />}
            pagination={<DataTablePagination table={table} />}
          />
        </div>
      </section>
    </div>
  )
}
