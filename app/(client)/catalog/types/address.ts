import type {
  DeliveryAddressInput,
} from "@/types/delivery-address"

export interface OrderAddress {
  id: string
  order_id: string

  house_building_number: string
  street: string
  building_subdivision: string | null
  unit_floor: string | null

  region_psgc_code: string
  region_name: string

  province_psgc_code: string | null
  province_name: string | null

  city_psgc_code: string
  city_name: string

  barangay_psgc_code: string
  barangay_name: string

  postal_code: string | null
  landmark: string | null

  created_at: string
  updated_at: string
}

export interface CreateOrderAddressInput {
  order_id: string

  house_building_number: string
  street: string
  building_subdivision?: string | null
  unit_floor?: string | null

  region_psgc_code: string
  region_name: string

  province_psgc_code?: string | null
  province_name?: string | null

  city_psgc_code: string
  city_name: string

  barangay_psgc_code: string
  barangay_name: string

  postal_code?: string | null
  landmark?: string | null
}
export type OrderAddressFormInput =
  DeliveryAddressInput