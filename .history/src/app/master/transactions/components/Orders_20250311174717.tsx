'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { OrderType } from '../types'

import columns from '../columns'
import OrdersTable from './OrdersTable'
import { showPromiseToast } from '@/utils/toastUtility'
import handleExportToCSV from '@/utils/exportToCSV'

type OrdersProps = {
  initialData: OrderType[]
}

export default function Orders({ initialData }: OrdersProps) {
  const [orders, setOrders] = useState<OrderType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<OrderType[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [isPending, startTransition] = useTransition()



  const handleOpenAddModal = () => {
    setMode('add')
    setOpen(true)
  }

  const handleOpenEditModal = () => {
    setMode('edit')
    setOpen(true)
  }

  return (
    <div>
      {isPending || !orders ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <OrdersTable
          // data={orders}
          // dynamicColumns={columns}
          // tableName='Transaction History'
          // setOpen={handleOpenAddModal}
          // onSelectedRowsChange={setSelectedRows}
          // onEditProduct={handleOpenEditModal}
          // onExportToCSV={() => handleExportToCSV(orders, 'Orders')}
        />
      )}
    </div>
  )
}
