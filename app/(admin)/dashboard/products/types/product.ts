export interface Product {
  id: number
  name: string
  category: "Windows" | "Doors" | "Railings" | "Partitions"
  dimensions: string
  price: number
  image: string
  description: string
  status: "active" | "archived"
}