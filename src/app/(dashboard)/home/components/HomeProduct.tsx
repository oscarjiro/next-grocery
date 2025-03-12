'use client'

import { useState, useTransition } from 'react'

import { Box, Skeleton } from '@mui/material'

import type { ProductType } from '@/app/(master)/admin-dashboard/types'

import columns from '@/app/(master)/admin-dashboard/columns'
import HomeDataTable from '@/components/HomeDataTable'

type ProductsProps = {
  initialData: ProductType[]
}

export default function Products({ initialData }: ProductsProps) {
  const [products, setProducts] = useState<ProductType[]>(initialData)
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  return (
    <div className='w-full'>
      {isPending || !products ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
          <Skeleton variant='rectangular' width='100%' height={50} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <HomeDataTable data={products} dynamicColumns={columns} tableName='Products List' setOpen={setOpen} />
      )}
    </div>
  )
}
