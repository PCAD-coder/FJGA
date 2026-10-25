export interface DeliveryZoneCity {
  id: string
  cityPsgcCode: string
  cityName: string
  localityType: string
  provincePsgcCode: string | null
  provinceName: string | null
  regionPsgcCode: string
  regionName: string
}

export interface DeliveryZone {
  id: string
  zoneName: string
  description: string | null
  deliveryFee: number
  isActive: boolean
  regionPsgcCode: string
  regionName: string
  provincePsgcCode: string | null
  provinceName: string | null
  createdAt: string
  updatedAt: string
  cities: DeliveryZoneCity[]
}

export interface CreateDeliveryZoneInput {
  regionPsgcCode: string
  provincePsgcCode: string | null
  description: string | null
  deliveryFee: number
  cityPsgcCode: string
}

export interface UpdateDeliveryZoneInput {
  description: string | null
  deliveryFee: number
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

export interface DeliveryZoneBarangay {
  psgcCode: string
  barangayName: string
  isAvailable: boolean
}