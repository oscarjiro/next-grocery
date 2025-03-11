'use server'

import { revalidatePath } from 'next/cache'
import { ProductType, CheckoutItem } from '../types'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'


export async function getUserInfo() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    return data.user?.id || null
  } catch (error: any) {
    logger('getUserInfo', error, 'error')
    return null
  }
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
  const supabase = await createClient();

  try {
    const productJSON = JSON.stringify(product);

    const { error } = await supabase.rpc('add_product', { product: JSON.parse(productJSON) });

    if (error) throw new Error(error.message);

    logger('addProduct', product, 'info');

    revalidatePath('/master/products');
    return product;
  } catch (error: any) {
    logger('addProduct', error, 'error');
    return null;
  }
}

export async function updateProduct(product: ProductType): Promise<ProductType | null> {
  const supabase = await createClient()

  try {
    const productJSON = JSON.stringify(product);

    const { error } = await supabase.rpc('update_product', { product: JSON.parse(productJSON) })
    if (error) throw new Error(error.message)

    logger('updateProduct', product, 'info')

    revalidatePath('/master/products')
    return product
  } catch (error: any) {
    logger('updateProduct', error, 'error')
    return null
  }
}

export async function deleteProducts(products: ProductType[]): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.rpc('delete_products', {
      product_ids: products.map(product => product.id)
    })
    if (error) throw new Error(error.message)

    logger('deleteProducts', products, 'info')

    revalidatePath('/master/products')
    return true
  } catch (error: any) {
    logger('deleteProducts', error, 'error')
    return false
  }
}

export async function addToCart(items: CheckoutItem[], userId: string) {
  const supabase = await createClient()

  try {
    if (!userId) throw new Error('User ID is required')

    const { error } = await supabase.rpc('add_to_cart', {
      user_id: userId,
      items: JSON.stringify(items)
    })

    if (error) throw new Error(error.message)

    logger('addToCart', { userId, items }, 'info')

    revalidatePath('/master/carts')

    return { success: true }
  } catch (error: any) {
    logger('addToCart', error, 'error')
    return { success: false, message: error.message }
  }
}
