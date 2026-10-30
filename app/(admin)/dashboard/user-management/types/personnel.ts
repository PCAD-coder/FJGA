export interface Employee {
  id: string
  name: string
  position: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateEmployeeInput {
  name: string
  position: string | null
}

export interface UpdateEmployeeInput {
  name: string
  position: string | null
}

export interface CreateTeamInput {
  name: string
}

export interface UpdateTeamInput {
  name: string
}