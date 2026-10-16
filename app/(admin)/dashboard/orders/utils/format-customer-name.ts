interface CustomerProfile {
  first_name: string | null
  last_name: string | null
  full_name: string | null
}

export function formatCustomerName(
  profile: CustomerProfile | null | undefined
): string {
  if (!profile) {
    return "Unknown Client"
  }

  const firstName =
    profile.first_name?.trim() ?? ""

  const lastName =
    profile.last_name?.trim() ?? ""

  const structuredName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ")

  if (structuredName) {
    return structuredName
  }

  const fullName =
    profile.full_name?.trim() ?? ""

  return fullName || "Unknown Client"
}