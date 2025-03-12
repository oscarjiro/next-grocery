'use client'

import { useState, useTransition } from 'react'
import { Box, Skeleton } from '@mui/material'
import type { OrderType } from '../types'
import OrderHistory from './TransactionTable'

type OrdersProps = {
  initialData: OrderType[]
}

export default function Orders({ initialData }: OrdersProps) {
  const [orders, setOrders] = useState<OrderType[]>(initialData)
  const [isPending, startTransition] = useTransition()

  return (
    <div>
      {isPending || !orders ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <OrderHistory orders={orders} />
      )}
    </div>
  )
}
