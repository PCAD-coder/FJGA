export interface HomepageContent {
  id: number

  heroTitle: string

  companyDescription: string

  heroImage: string
}

export interface GalleryItem {
  id: number

  title: string

  category: string

  image: string

  uploadedAt: string
}

export interface DocumentTemplate {
  id: number

  name: string

  type:
    | "Quotation"
    | "Invoice"
    | "Receipt"
    | "Contract"

  uploadedAt: string

  fileName: string
}