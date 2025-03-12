'use server'

import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'
import type { OrderType } from '../types'

export async function getOrders(userId: string): Promise<OrderType[]> {
  const supabase = await createClient()

  try {
    if (!userId) throw new Error('User ID is required')
    const { data, error } = await supabase.rpc('fetch_orders', { user_uuid: userId })
    if (error) throw new Error(error.message)

    return data || []
  } catch (error) {
    logger('getOrders', error, 'error')
    return []
  }
}
