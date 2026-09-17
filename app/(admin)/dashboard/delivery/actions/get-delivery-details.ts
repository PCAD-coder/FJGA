"use server"

import { getDeliveryDetails } from "../services/delivery-service"

export async function getDeliveryDetailsAction(
  deliveryId: string
) {
  return getDeliveryDetails(deliveryId)
}