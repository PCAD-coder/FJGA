"use server"

import { getDeliveries } from "../services/delivery-service"

export async function getDeliveriesAction() {
  return getDeliveries()
}