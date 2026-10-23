export interface DeliveryZoneCity {
  id: string
  cityPsgcCode: string
  cityName: string
  localityType: string
  provinceName: string | null
  regionName: string
}

export interface DeliveryZone {
  id: string
  zoneName: string
  description: string | null
  deliveryFee: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  cities: DeliveryZoneCity[]
}

export interface CreateDeliveryZoneInput {
  zoneName: string
  description: string | null
  deliveryFee: number
  cityPsgcCodes: string[]
}

export interface UpdateDeliveryZoneInput {
  zoneName: string
  description: string | null
  deliveryFee: number
  cityPsgcCodes: string[]
}

export interface DeliveryZoneCityOption {
  psgcCode: string
  cityName: string
  localityType: string
  provinceName: string | null
  regionName: string
  assignedZoneId: string | null
  assignedZoneName: string | null
}