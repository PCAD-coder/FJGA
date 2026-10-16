export interface DeliveryAddressInput {
  houseBuildingNumber: string
  street: string
  buildingSubdivision: string
  unitFloor: string

  regionPsgcCode: string
  regionName: string

  provincePsgcCode: string | null
  provinceName: string | null

  cityPsgcCode: string
  cityName: string

  barangayPsgcCode: string
  barangayName: string

  postalCode: string
  landmark: string
}