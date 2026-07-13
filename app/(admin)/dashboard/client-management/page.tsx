import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export default function ClientManagementPage() {
  return (
    <div className="space-y-6">

      {/* 🔹 Header */}
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage employee access and permissions
        </p>
      </div>

      {/* 🔹 Warning Banner */}
      <div className="border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 rounded-lg p-4 text-sm">
        Restricted Area - Administrator Access Only  
        <br />
        <span className="text-xs">
          All actions are logged for security and audit purposes.
        </span>
      </div>

      {/* 🔹 Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        
        <Input placeholder="Search by name or email..." />

        <div className="flex gap-2">
          <Button variant="outline">All Roles</Button>
          <Button>Add New User</Button>
        </div>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">6</p>
        </div>

        <div className="p-4 rounded-lg border bg-green-500/10">
          <p className="text-sm text-green-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600">5</p>
        </div>

        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Administrators</p>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="rounded-xl border bg-card p-2">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Last Active</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-2">John Doe</td>
              <td className="p-2">john@email.com</td>
              <td className="p-2">
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
                  Admin
                </span>
              </td>
              <td className="p-2">2 hours ago</td>
              <td className="p-2 text-green-500">Active</td>
              <td className="p-2">
                <Button size="sm" variant="outline">
                    <Pencil className="w-2 h-2" />
                    Edit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  )
}