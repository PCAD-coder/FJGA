"use server"

import { getDeliveryDetails } from "../services/delivery-service"

import type {
  DeliveryQueryResult,
  ReturnDeliveryQueryResult,
} from "../services/delivery-mapper"

export async function getDeliveryDetailsAction(
  deliveryId: string,
  deliveryType: "order" | "return"
): Promise<DeliveryQueryResult | ReturnDeliveryQueryResult> {
  return getDeliveryDetails(deliveryId, deliveryType)
}