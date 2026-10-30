import { createClient } from "@/lib/supabase/client"

import type {
  CreateEmployeeInput,
  CreateTeamInput,
  Employee,
  Team,
  UpdateEmployeeInput,
  UpdateTeamInput,
} from "../types/personnel"

const supabase = createClient()

export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("name")

  if (error) throw error

  return data as Employee[]
}

export async function getActiveEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("is_active", true)
    .order("name")

  if (error) throw error

  return data as Employee[]
}

export async function createEmployee(
  input: CreateEmployeeInput
): Promise<void> {
  const { error } = await supabase.from("employees").insert({
    name: input.name.trim(),
    position: input.position?.trim() || null,
  })

  if (error) throw error
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput
): Promise<void> {
  const { error } = await supabase
    .from("employees")
    .update({
      name: input.name.trim(),
      position: input.position?.trim() || null,
    })
    .eq("id", id)

  if (error) throw error
}

export async function setEmployeeActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from("employees")
    .update({
      is_active: isActive,
    })
    .eq("id", id)

  if (error) throw error
}

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("name")

  if (error) throw error

  return data as Team[]
}

export async function getActiveTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("is_active", true)
    .order("name")

  if (error) throw error

  return data as Team[]
}

export async function createTeam(
  input: CreateTeamInput
): Promise<void> {
  const { error } = await supabase.from("teams").insert({
    name: input.name.trim(),
  })

  if (error) throw error
}

export async function updateTeam(
  id: string,
  input: UpdateTeamInput
): Promise<void> {
  const { error } = await supabase
    .from("teams")
    .update({
      name: input.name.trim(),
    })
    .eq("id", id)

  if (error) throw error
}

export async function setTeamActive(
  id: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from("teams")
    .update({
      is_active: isActive,
    })
    .eq("id", id)

  if (error) throw error
}