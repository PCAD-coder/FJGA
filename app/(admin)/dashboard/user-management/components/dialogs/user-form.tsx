"use client"

import { useEffect, useState } from "react"

import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserRole,
  UserFormValues,
} from "../../types/user-management"

import {
  Button,
} from "@/components/ui/button"

import {
  Input,
} from "@/components/ui/input"

import {
  Label,
} from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserFormProps {
  defaultValues?: Partial<User>

  loading?: boolean

  submitLabel: string

  onSubmit: (
  data: UserFormValues
) => Promise<void>

  onCancel: () => void
}

export default function UserForm({
  defaultValues,
  loading = false,
  submitLabel,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] =
    useState<UserRole>("client")

  useEffect(() => {

    setFirstName(defaultValues?.first_name ?? "")
    setLastName(defaultValues?.last_name ?? "")
    setEmail(defaultValues?.email ?? "")
    setRole(defaultValues?.role ?? "client")
  }, [defaultValues])

  async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault()

  console.log("✅ UserForm submitted")

  await onSubmit({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim(),
    role,
  })

  console.log("✅ onSubmit finished")
}

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="first_name">
          First Name
        </Label>

        <Input
          id="first_name"
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="last_name">
          Last Name
        </Label>

        <Input
          id="last_name"
          value={lastName}
          onChange={(e) =>
            setLastName(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label>
          Role
        </Label>

        <Select
          value={role}
          onValueChange={(value) =>
            setRole(value as UserRole)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="admin">
              Administrator
            </SelectItem>

            <SelectItem value="client">
              Client
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}