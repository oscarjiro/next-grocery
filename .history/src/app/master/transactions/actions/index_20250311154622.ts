'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'
import type { OrderType } from '../types'

export async function getOrders(): Promise<OrderType[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `id, created_at, customer_name, total_price, status,
        order_items(quantity, purchase_price, products(name))`
      )
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    logger('getOrders', data, 'info')

    return data || []
  } catch (error) {
    logger('getOrders', error, 'error')

    return []
  }
}
