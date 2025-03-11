'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'
import type { CartItemType, OrderType, OrderItemType } from '../types'

// 🔹 Get Cart Items
export async function getCartItems(): Promise<CartItemType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('cart').select('*')

    if (error) throw new Error(error.message)

    logger('getCartItems', data, 'info')

    return data || []
  } catch (error: any) {
    logger('getCartItems', error, 'error')
    return []
  }
}

// 🔹 Remove Cart Items
export async function removeCartItems(cartItems: CartItemType[]): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .in('id', cartItems.map(item => item.id))

    if (error) throw new Error(error.message)

    logger('removeCartItems', cartItems, 'info')

    revalidatePath('/cart')

    return true
  } catch (error: any) {
    logger('removeCartItems', error, 'error')
    return false
  }
}

// 🔹 Checkout Cart
export async function checkoutCart(selectedItems: CartItemType[], userId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const orderData: OrderType = {
      user_id: userId,
      status: 'pending',
      total_price: selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    // Insert order ke Supabase
    const { data: order, error: orderError } = await supabase
      .from('order')
      .insert([orderData])
      .select()
      .single()

    if (orderError) throw new Error(orderError.message)

    logger('checkoutCart - Order Created', order, 'info')

    // Insert order items
    const orderItems: OrderItemType[] = selectedItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems)

    if (orderItemsError) throw new Error(orderItemsError.message)

    logger('checkoutCart - Order Items Created', orderItems, 'info')

    // Remove items from cart
    await removeCartItems(selectedItems)

    revalidatePath('/cart')
    return true
  } catch (error: any) {
    logger('checkoutCart', error, 'error')
    return false
  }
}
