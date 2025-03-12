'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'
import type { CartItemType, OrderType, OrderItemType } from '../types'

// Get Cart Items
export async function getCartItems(userId: string): Promise<CartItemType[]> {
  const supabase = await createClient()

  try {
    if (!userId) {
      console.error('Error: userId is undefined')
      return []
    }

    const { data, error } = await supabase.rpc('get_cart_items', { user_uuid: userId })

    if (error) throw new Error(error.message)

    return data || []
  } catch (error: any) {
    console.error('getCartItems Error:', error)
    logger('getCartItems', error, 'error')
    return []
  }
}

// Remove Cart Items
export async function removeCartItems(cartItems: CartItemType[]): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.rpc('remove_cart_items', {
      cart_item_ids: cartItems.map(item => item.id)
    })

    if (error) throw new Error(error.message)

    logger('removeCartItems', cartItems, 'info')

    revalidatePath('/master//cart')

    return true
  } catch (error: any) {
    logger('removeCartItems', error, 'error')
    return false
  }
}

// Update quantity
export const updateCartItem = async (itemId: string, newQuantity: number) => {
  const supabase = await createClient()

  const { error } = await supabase.rpc('update_cart_item', {
    item_id: itemId,
    new_quantity: newQuantity
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Checkout Cart
export async function checkoutCart(selectedItems: CartItemType[], userId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    console.log('User ID saat checkout:', userId)

    const { error } = await supabase.rpc('checkout_cart', {
      user_uuid: userId,
      selected_items: selectedItems
    })

    if (error) throw new Error(error.message)

    logger('checkoutCart - Success', selectedItems, 'info')

    revalidatePath('/cart')
    return true
  } catch (error: any) {
    logger('checkoutCart', error, 'error')
    return false
  }
}
