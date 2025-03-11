export interface ProductType {
  id?: string | null | undefined
  name: string
  description: string
  price: number
  stock: number
  image_src: string
  created_at?: string | null | undefined
}

export interface CheckoutItem {
  product_id:  string | null | undefined
  quantity: number
}
