import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getProducts } from '@/app/(master)/admin-dashboard/actions'
import Products from './components/HomeProduct'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const products = await getProducts()

  return <Products initialData={products || []} />
}
