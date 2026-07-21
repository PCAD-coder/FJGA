export type UserRole =
  | "admin"
  | "client"

export type UserStatus =
  | "Active"
  | "Inactive"

export interface UserRecord {
  id: string
  auth_user_id: string

  first_name: string
  last_name: string
  full_name: string

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
export interface CreateUserDto {
  first_name: string
  last_name: string
  email: string
  role: UserRole
}

export interface UserFormValues {
  first_name: string
  last_name: string
  email: string
  role: UserRole
}

/**
 * Data sent when updating a user.
 */
export interface UpdateUserDto {
  first_name?: string
  last_name?: string
  role?: UserRole
  status?: UserStatus
}

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
export interface IUserManagementService {
  getUsers(): Promise<User[]>

  createUser(
    data: CreateUserDto
  ): Promise<void>

  updateUser(
    id: string,
    data: UpdateUserDto
  ): Promise<void>

  deleteUser(
    id: string
  ): Promise<void>

  changeRole(
    id: string,
    role: UserRole
  ): Promise<void>

  toggleUserStatus(
    id: string
  ): Promise<void>
}