export type UserRole =
  | "admin"
  | "client"

export type UserStatus =
  | "Active"
  | "Inactive"

export interface UserRecord {
  id: string
  auth_user_id: string

  first_name: string | null
  last_name: string | null
  full_name: string | null

  email: string
  contact_number: string | null

  profile_image: string | null

  role: UserRole
  status: UserStatus

  created_at: string
  updated_at: string
}

export type User = UserRecord
/**
 * Data sent when creating a user.
 */



/**
 * Data sent when updating a user.
 */


/**
 * Statistics displayed in the cards.
 */
export interface UserManagementStats {
  total: number
  active: number
  inactive: number
  administrators: number
  clients: number
}

/**
 * Service contract.
 */
