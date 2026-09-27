"use server"

import { getDeliveries } from "../services/delivery-service"

import type {
  DeliveryQueryResult,
  ReturnDeliveryQueryResult,
} from "../services/delivery-mapper"

export interface GetDeliveriesResult {
  orderDeliveries: DeliveryQueryResult[]
  returnDeliveries: ReturnDeliveryQueryResult[]
}

export async function getDeliveriesAction(): Promise<GetDeliveriesResult> {
  return getDeliveries()
}