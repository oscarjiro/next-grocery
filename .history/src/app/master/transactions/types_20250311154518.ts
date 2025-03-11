export interface OrderType {
  id?: string | null | undefined
  created_at?: string | null | undefined
  customer_name: string
  total_price: number
  status: 'pending' | 'completed' | 'canceled'
  order_items?: {
    quantity: number
    purchase_price: number
    products: {
      name: string
    }
  }[]
}
