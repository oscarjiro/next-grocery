'use server'

import { ITEMS_PER_PAGE } from '@/libs/styles/constants'
import { Product } from '@/types/databaseTypes'
import { createClient } from '@/utils/supabase/server'

export type ProductDataState = {
  error?: string
  products?: Product[]
  totalPages?: number
}

export async function getProductsPages(term: string | undefined): Promise<ProductDataState> {
  const supabase = await createClient()

  // Initialize query
  let queryBuilder = supabase.from('products').select('*', { count: 'exact', head: true })

  // Apply filter only if term exists
  let cleanedTerm = term?.trim()
  if (cleanedTerm) {
    queryBuilder = queryBuilder.or(`name.ilike.%${cleanedTerm}%,description.ilike.%${cleanedTerm}%`)
  }

  // Get total products count
  const { count, error } = await queryBuilder
  if (error) {
    return { error: error.message }
  }

  return { totalPages: (count ?? 0) / ITEMS_PER_PAGE }
}

export async function getFilteredProducts(page: number, term: string | undefined): Promise<ProductDataState> {
  const supabase = await createClient()

  // Filter by search term if applicable
  let queryBuilder = supabase.from('products').select('*')
  let cleanedTerm = term?.trim()
  if (cleanedTerm) {
    queryBuilder = queryBuilder.or(`name.ilike.%${cleanedTerm}%,description.ilike.%${cleanedTerm}%`)
  }

  // Paginate products
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE - 1
  const { data: products, error } = await queryBuilder.range(start, end)

  if (error) {
    return { error: error.message }
  }
  return { products: products }
}
