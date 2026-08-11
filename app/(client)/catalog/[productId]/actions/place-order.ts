"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { createOrderServer } from "@/app/(admin)/dashboard/orders/actions/create-order"


export async function placeProductOrder(
  productId: string,
  quantity: number,
  notes?: string
) {
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

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        product_name,
        width,
        height,
        depth
      `
    )
    .eq("id", productId)
    .single()

  if (error || !product) {
    throw new Error("Product not found")
  }

  const result = await createOrderServer({
  customer_id: profile.id,
  order_type: "standard",
  delivery_fee: 0,
  notes: notes ?? "",

  items: [
    {
      product_id: product.id,
      quantity,

      width: product.width,
      height: product.height,
      depth: product.depth,

      dimension_unit: "cm",
    },
  ],
})

  redirect("/my-orders")
}