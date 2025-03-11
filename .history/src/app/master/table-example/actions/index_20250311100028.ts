'use server'

import { revalidatePath } from 'next/cache'

import { ProductType, CheckoutItem } from '../types'

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

export async function productCart(items: CheckoutItem[], userId: string) {
  const supabase = await createClient()

  try {
    const { data: dataData, error: dataError } = await supabase
      .from('carts')
      .insert([{ user_id: userId }])
      .select()
      .single()

    if (dataError) throw new Error(dataError.message)

    const dataId = dataData.id

    // Insert data_items
    const dataItems = items.map(item => ({
      data_id: dataId,
      product_id: item.product_id,
      cart_id: 
      quantity: item.quantity
    }))

    const { error: dataItemsError } = await supabase.from('cart_items').insert(dataItems)

    if (dataItemsError) throw new Error(dataItemsError.message)

    logger('checkoutCart', { dataId, dataItems }, 'info')

    revalidatePath('/cart') // Bisa diubah ke path yang sesuai

    return { success: true, dataId }
  } catch (error: any) {
    logger('checkoutCart', error, 'error')

    throw error
  }
}
