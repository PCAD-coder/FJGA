import type {
  Delivery,
  DeliveryDetails,
  DeliveryStatus,
  ReturnResolutionType,
} from "../types/delivery"

interface DeliveryOrder {
  id: string
  order_number: string
  customer_id: string
  delivery_fee: number
  total_amount: number
  status: string

  order_payments:
    | {
        amount: number
      }[]
    | null

  profiles:
    | {
        id: string
        first_name: string | null
        last_name: string | null
      }[]
    | {
        id: string
        first_name: string | null
        last_name: string | null
      }
    | null

  order_addresses:
    | {
        house_building_number: string
        street: string
        building_subdivision: string | null
        unit_floor: string | null
        region_name: string
        province_name: string | null
        city_name: string
        barangay_name: string
        postal_code: string | null
        landmark: string | null
      }[]
    | {
        house_building_number: string
        street: string
        building_subdivision: string | null
        unit_floor: string | null
        region_name: string
        province_name: string | null
        city_name: string
        barangay_name: string
        postal_code: string | null
        landmark: string | null
      }
    | null

  order_items:
    | {
        id: string
        product_name_snapshot: string
        quantity: number
      }[]
    | null
}

export interface DeliveryQueryResult {
  id: string
  order_id: string
  delivery_status: string
  scheduled_date: string | null
  scheduled_time: string | null
  assigned_driver: string | null
  assigned_truck: string | null
  delivered_at: string | null
  delivery_notes: string | null
  created_at: string
  updated_at: string

  orders: DeliveryOrder | DeliveryOrder[] | null
}

export interface ReturnDeliveryQueryResult {
  id: string
  return_request_id: string
  production_job_id: string
  delivery_status: string
  scheduled_date: string | null
  scheduled_time: string | null
  assigned_driver: string | null
  assigned_truck: string | null
  delivered_at: string | null
  delivery_notes: string | null
  created_at: string
  updated_at: string

  return_requests:
    | {
        id: string
        return_number: string
        order_id: string
        status: string

        orders: DeliveryOrder | DeliveryOrder[] | null
      }
    | {
        id: string
        return_number: string
        order_id: string
        status: string

        orders: DeliveryOrder | DeliveryOrder[] | null
      }[]
    | null

  return_production_jobs:
    | {
        id: string
        resolution_id: string
        return_resolutions:
          | {
              resolution_type: string
            }
          | {
              resolution_type: string
            }[]
          | null
      }
    | {
        id: string
        resolution_id: string
        return_resolutions:
          | {
              resolution_type: string
            }
          | {
              resolution_type: string
            }[]
          | null
      }[]
    | null
}

function getFirstRelation<T>(relation: T | T[] | null | undefined): T | null {
  if (!relation) {
    return null
  }

  return Array.isArray(relation) ? (relation[0] ?? null) : relation
}

function getOrder(row: DeliveryQueryResult): DeliveryOrder {
  const order = getFirstRelation(row.orders)

  if (!order) {
    throw new Error(`Delivery ${row.id} is missing its related order`)
  }

  return order
}

function getReturnRequest(row: ReturnDeliveryQueryResult) {
  const returnRequest = getFirstRelation(row.return_requests)

  if (!returnRequest) {
    throw new Error(`Return delivery ${row.id} is missing its return request`)
  }

  return returnRequest
}

function getReturnProductionJob(row: ReturnDeliveryQueryResult) {
  const job = getFirstRelation(row.return_production_jobs)

  if (!job) {
    throw new Error(`Return delivery ${row.id} is missing its production job`)
  }

  return job
}

function getProfile(order: DeliveryOrder) {
  return getFirstRelation(order.profiles)
}

function getAddress(order: DeliveryOrder) {
  return getFirstRelation(order.order_addresses)
}

function getItems(order: DeliveryOrder) {
  return order.order_items ?? []
}

function getOrderPaymentTotal(order: DeliveryOrder) {
  return (order.order_payments ?? []).reduce(
    (total, payment) => total + Number(payment.amount ?? 0),
    0
  )
}

function buildClientName(order: DeliveryOrder) {
  const profile = getProfile(order)

  return profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
        "Unknown Customer"
    : "Unknown Customer"
}

function buildAddress(order: DeliveryOrder) {
  const address = getAddress(order)

  const addressParts = [
    address?.house_building_number,
    address?.street,
    address?.building_subdivision,
    address?.unit_floor,
    address?.barangay_name,
    address?.city_name,
    address?.province_name,
    address?.region_name,
    address?.postal_code,
  ].filter(Boolean)

  return addressParts.length > 0
    ? addressParts.join(", ")
    : "Address not available"
}

function getResolutionType(
  row: ReturnDeliveryQueryResult
): ReturnResolutionType | null {
  const job = getReturnProductionJob(row)

  const resolution = getFirstRelation(job.return_resolutions)

  if (
    resolution?.resolution_type === "repair" ||
    resolution?.resolution_type === "replacement"
  ) {
    return resolution.resolution_type
  }

  return null
}

export function mapOrderToDelivery(row: DeliveryQueryResult): Delivery {
  const order = getOrder(row)
  const items = getItems(order)

  const totalAmount = Number(order.total_amount ?? 0)

  const amountPaid = getOrderPaymentTotal(order)

  const remainingBalance = Math.max(totalAmount - amountPaid, 0)

  const firstItem = items[0] ?? null

  return {
    id: row.id,
    deliveryType: "order",

    orderId: row.order_id,
    orderNumber: order.order_number,

    returnRequestId: null,
    returnNumber: null,
    resolutionType: null,

    projectName:
      firstItem?.product_name_snapshot ?? `Order ${order.order_number}`,

    clientName: buildClientName(order),

    address: buildAddress(order),

    deliveryDate: row.scheduled_date,
    deliveryTime: row.scheduled_time,

    assignedTruck: row.assigned_truck,
    assignedDriver: row.assigned_driver,

    productName: firstItem?.product_name_snapshot ?? "Multiple Products",

    deliveryFee: Number(order.delivery_fee ?? 0),

    totalAmount,
    amountPaid,
    remainingBalance,

    status: row.delivery_status as DeliveryStatus,

    deliveredAt: row.delivered_at,
    deliveryNotes: row.delivery_notes,
  }
}

export function mapReturnToDelivery(row: ReturnDeliveryQueryResult): Delivery {
  const returnRequest = getReturnRequest(row)

  const order = getFirstRelation(returnRequest.orders)

  if (!order) {
    throw new Error(`Return delivery ${row.id} is missing its related order`)
  }

  const items = getItems(order)

  const totalAmount = Number(order.total_amount ?? 0)

  const amountPaid = getOrderPaymentTotal(order)

  const remainingBalance = Math.max(totalAmount - amountPaid, 0)

  const firstItem = items[0] ?? null

  const resolutionType = getResolutionType(row)

  const resolutionLabel =
    resolutionType === "replacement"
      ? "Replacement"
      : resolutionType === "repair"
        ? "Repair"
        : "Return"

  return {
    id: row.id,
    deliveryType: "return",

    orderId: order.id,
    orderNumber: order.order_number,

    returnRequestId: returnRequest.id,
    returnNumber: returnRequest.return_number,
    resolutionType,

    projectName: `${resolutionLabel} - ${
      firstItem?.product_name_snapshot ?? `Order ${order.order_number}`
    }`,

    clientName: buildClientName(order),

    address: buildAddress(order),

    deliveryDate: row.scheduled_date,
    deliveryTime: row.scheduled_time,

    assignedTruck: row.assigned_truck,
    assignedDriver: row.assigned_driver,

    productName: firstItem?.product_name_snapshot ?? "Multiple Products",

    deliveryFee: 0,

    totalAmount,
    amountPaid,
    remainingBalance: 0,

    status: row.delivery_status as DeliveryStatus,

    deliveredAt: row.delivered_at,
    deliveryNotes: row.delivery_notes,
  }
}

export function mapOrderToDeliveryDetails(
  row: DeliveryQueryResult
): DeliveryDetails {
  const order = getOrder(row)
  const profile = getProfile(order)
  const address = getAddress(order)
  const items = getItems(order)

  return {
    id: row.id,
    deliveryType: "order",

    orderId: row.order_id,
    orderNumber: order.order_number,

    returnRequestId: null,
    returnNumber: null,
    resolutionType: null,

    status: row.delivery_status as DeliveryStatus,

    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,

    assignedDriver: row.assigned_driver,
    assignedTruck: row.assigned_truck,

    deliveredAt: row.delivered_at,
    deliveryNotes: row.delivery_notes,

    deliveryFee: Number(order.delivery_fee ?? 0),

    customer: profile
      ? {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
        }
      : null,

    address: address
      ? {
          houseBuildingNumber: address.house_building_number,
          street: address.street,
          buildingSubdivision: address.building_subdivision,
          unitFloor: address.unit_floor,
          regionName: address.region_name,
          provinceName: address.province_name,
          cityName: address.city_name,
          barangayName: address.barangay_name,
          postalCode: address.postal_code,
          landmark: address.landmark,
        }
      : null,

    items: items.map((item) => ({
      id: item.id,
      productName: item.product_name_snapshot,
      quantity: item.quantity,
    })),
  }
}

export function mapReturnToDeliveryDetails(
  row: ReturnDeliveryQueryResult
): DeliveryDetails {
  const returnRequest = getReturnRequest(row)

  const order = getFirstRelation(returnRequest.orders)

  if (!order) {
    throw new Error(`Return delivery ${row.id} is missing its related order`)
  }

  const profile = getProfile(order)
  const address = getAddress(order)
  const items = getItems(order)

  return {
    id: row.id,
    deliveryType: "return",

    orderId: order.id,
    orderNumber: order.order_number,

    returnRequestId: returnRequest.id,
    returnNumber: returnRequest.return_number,
    resolutionType: getResolutionType(row),

    status: row.delivery_status as DeliveryStatus,

    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,

    assignedDriver: row.assigned_driver,
    assignedTruck: row.assigned_truck,

    deliveredAt: row.delivered_at,
    deliveryNotes: row.delivery_notes,

    deliveryFee: 0,

    customer: profile
      ? {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
        }
      : null,

    address: address
      ? {
          houseBuildingNumber: address.house_building_number,
          street: address.street,
          buildingSubdivision: address.building_subdivision,
          unitFloor: address.unit_floor,
          regionName: address.region_name,
          provinceName: address.province_name,
          cityName: address.city_name,
          barangayName: address.barangay_name,
          postalCode: address.postal_code,
          landmark: address.landmark,
        }
      : null,

    items: items.map((item) => ({
      id: item.id,
      productName: item.product_name_snapshot,
      quantity: item.quantity,
    })),
  }
}
