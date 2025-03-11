'use server'

import { revalidatePath } from 'next/cache'

import prod

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'

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

export async function checkoutCart(items: CheckoutItem[], userId: string) {
  const supabase = await createClient()

  try {
    // Buat order baru
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: userId, status: 'pending' }])
      .select()
      .single()

    if (orderError) throw new Error(orderError.message)

    const orderId = orderData.id

    // Insert order_items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity
    }))

    const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems)

    if (orderItemsError) throw new Error(orderItemsError.message)

    logger('checkoutCart', { orderId, orderItems }, 'info')

    revalidatePath('/cart') // Bisa diubah ke path yang sesuai

    return { success: true, orderId }
  } catch (error: any) {
    logger('checkoutCart', error, 'error')

    throw error
  }
}
