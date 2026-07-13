export interface BackupRecord {
  id: number

  backupName: string

  backupType:
    | "Full Backup"
    | "Database Backup"
    | "Content Backup"
    | "Documents Backup"

  size: string

  createdAt: string

  status:
    | "Completed"
    | "In Progress"
    | "Failed"
}