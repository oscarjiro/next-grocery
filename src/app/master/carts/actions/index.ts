'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'
import type { CartItemType } from '../types'

// 🔹 Get Cart Items via RPC
export async function getCartItems(userId: string): Promise<CartItemType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc('get_cart_items', { user_id: userId })

    if (error) throw new Error(error.message)

    logger('getCartItems', data, 'info')
    return data
  } catch (error: any) {
    logger('getCartItems', error, 'error')
    return []
  }
}

// 🔹 Remove Cart Items via RPC
export async function removeCartItems(userId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.rpc('remove_cart_items', { user_id: userId })

    if (error) throw new Error(error.message)

    logger('removeCartItems', { userId }, 'info')

    revalidatePath('/carts')
    return true
  } catch (error: any) {
    logger('removeCartItems', error, 'error')
    return false
  }
}

// 🔹 Update Cart Item Quantity
export async function updateCartItem(itemId: string, newQuantity: number): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.rpc('update_cart_item', { item_id: itemId, quantity: newQuantity })

    if (error) throw new Error(error.message)

    logger('updateCartItem', { itemId, newQuantity }, 'info')
    return true
  } catch (error: any) {
    logger('updateCartItem', error, 'error')
    return false
  }
}

// 🔹 Checkout Cart via RPC
export async function checkoutCart(userId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.rpc('checkout_cart', { user_id: userId })

    if (error) throw new Error(error.message)

    logger('checkoutCart', { userId }, 'info')

    revalidatePath('/carts')
    return true
  } catch (error: any) {
    logger('checkoutCart', error, 'error')
    return false
  }
}
