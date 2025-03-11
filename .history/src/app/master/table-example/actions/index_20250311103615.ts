'use server'

import { revalidatePath } from 'next/cache'

import { ProductType, CheckoutItem } from '../types'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

export default async function getUserInfo() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user?.id
}

export async function getProducts(): Promise<ProductType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').select('*')

    if (error) throw new Error(error.message)

    logger('getProducts', data, 'info')

    return data || []
  } catch (error: any) {
    logger('getProducts', error, 'error')

    return []
  }
}

export async function addProduct(product: ProductType): Promise<ProductType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').insert([product]).select().single()

    if (error) throw new Error(error.message)

    logger('addProducts', data, 'info')

    revalidatePath('/master/products')

    return data
  } catch (error: any) {
    logger('addProduct', error, 'error')

    throw error
  }
}

export async function updateProduct(product: ProductType): Promise<ProductType | null> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single()

    if (error) {
      throw new Error(error.message)
    }

    logger('updateProduct', data, 'info')

    revalidatePath('/master/products')

    return data
  } catch (error: any) {
    logger('updateProduct', error, 'error')

    throw error
  }
}

export async function deleteProducts(products: ProductType[]): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .in(
        'id',
        products.map(product => product.id)
      )

    if (error) throw new Error(error.message)

    logger('deleteProduct', data, 'info')

    revalidatePath('/master/products')

    return true
  } catch (error: any) {
    logger('deleteProducts', error, 'error')

    throw error
  }
}

export async function addToCart(items: CheckoutItem[], userId: string) {
  const supabase = await createClient()

  try {
    if (!userId) throw new Error('User ID is required')

    // Cek apakah user sudah punya cart
    const { data: existingCart, error: cartCheckError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (cartCheckError && cartCheckError.code !== 'PGRST116') {
      throw new Error(cartCheckError.message)
    }

    let cartId = existingCart?.id

    // Kalau user belum punya cart, buat cart baru
    if (!cartId) {
      const { data: newCart, error: cartError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select()
        .single()

      if (cartError) throw new Error(cartError.message)
      cartId = newCart.id
    }

    // Insert ke tabel cart_items
    const cartItems = items.map(item => ({
      cart_id: cartId,
      product_id: item.product_id,
      quantity: item.quantity
    }))

    const { error: insertError } = await supabase.from('cart_items').insert(cartItems)

    if (insertError) throw new Error(insertError.message)

    logger('addToCart', { cartId, cartItems }, 'info')

    revalidatePath('/cart')

    return { success: true, cartId }
  } catch (error: any) {
    logger('addToCart', error, 'error')
    throw error
  }
}
