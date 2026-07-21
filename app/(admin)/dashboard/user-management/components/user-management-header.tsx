export default function Header() {
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Management
        </h1>

        <p className="text-muted-foreground">
          Manage client accounts, system access, and user roles.
        </p>
      </div>

      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
        <p className="font-medium text-yellow-700 dark:text-yellow-400">
          Administrator Only
        </p>

        <p className="text-sm text-yellow-600 dark:text-yellow-300">
          All user management activities are logged for auditing and security.
        </p>
      </div>
    </div>
  )
}