export interface CartItemType {
  id: string
  product_id: string
  name: string
  image_src: string
  quantity: number
  price: number
  created_at?: string
}

export interface OrderType {
  id?: string
  user_id: string
  status: string
  total_price: number
  created_at?: string
}

export interface OrderItemType {
  id?: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  purchase_price: number
}
