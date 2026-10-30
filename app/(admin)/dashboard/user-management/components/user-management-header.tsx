"use client"

import { useState } from "react"
import { UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ManagePersonnelDialog } from "./dialogs/manage-personnel-dialog"

export default function Header() {
  const [managePersonnelOpen, setManagePersonnelOpen] = useState(false)

  return (
    <>
      <header className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Users
            </h1>

            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              View registered client accounts and manage operational personnel.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setManagePersonnelOpen(true)}
          >
            <UsersRound className="mr-2 size-4" />
            Manage Employees & Teams
          </Button>
        </div>
      </header>

      <ManagePersonnelDialog
        open={managePersonnelOpen}
        onOpenChange={setManagePersonnelOpen}
      />
    </>
  )
}