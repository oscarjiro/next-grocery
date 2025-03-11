'use client'

import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error && data?.user) {
        setUser(data.user)
      }
    }

    fetchUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  return user
}
