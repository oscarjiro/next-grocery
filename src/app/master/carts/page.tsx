import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getCartItems } from './actions'
import Cart from './components/Cart'

export default async function CartPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const cartItems = await getCartItems(data.user.id)

  return <Cart initialData={cartItems || []} userId={data.user.id} />
}
