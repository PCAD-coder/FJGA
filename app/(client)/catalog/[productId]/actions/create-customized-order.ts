"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { createOrderServer } from "@/app/(admin)/dashboard/orders/actions/create-order"

export async function createCustomizedOrder(input: {
  productId: string
  width: number
  height: number
  depth: number
  quantity: number
  notes?: string

  aluminumVariantId?: string | null
  glassVariantId?: string | null
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError || !profile) {
    throw new Error("Profile not found")
  }

  const result = await createOrderServer({
    customer_id: profile.id,
    order_type: "standard",
    delivery_fee: 0,
    notes: input.notes ?? "",
    items: [
      {
        product_id: input.productId,
        quantity: input.quantity,
        width: input.width,
        height: input.height,
        depth: input.depth,
        dimension_unit: "cm",
        aluminum_variant_id: input.aluminumVariantId ?? null,
        glass_variant_id: input.glassVariantId ?? null,
      },
    ],
  })

  if (result.error) {
    throw new Error(result.error)
  }

  redirect("/my-orders")
}