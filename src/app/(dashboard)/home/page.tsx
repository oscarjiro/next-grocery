import { Box, Button, IconButton, Typography } from '@mui/material'
import { getProductsPages } from './actions'
import Search from '@/components/Search'
import Pagination from '@/components/Pagination'
import { Suspense } from 'react'
import { ProductGridSkeleton } from './skeleton'
import ProductGrid from './ProductGrid'
import Link from '@/components/Link'
import { TableChart } from '@mui/icons-material'

export default async function Page(props: { searchParams?: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams?.query ?? ''
  const page = Number(searchParams?.page) || 1

  let { totalPages, error: totalPagesError } = await getProductsPages(query)
  totalPages = totalPages ? Math.ceil(totalPages) : 1
  if (totalPagesError) {
    console.error('Error fetching total products pages:', totalPagesError)
  }

  return (
    <Box className='flex flex-col items-center w-full space-y-4' component='section'>
      {/* Title */}
      <div className='flex flex-col'>
        <Typography variant='h2' className='w-full'>
          Stock up on freshness!
        </Typography>
        <Button
          className='uppercase tracking-widest'
          startIcon={<TableChart />}
          component={Link}
          href='/home/tabular'
          size='large'
        >
          View as table
        </Button>
      </div>

      {/* Search bar */}
      <Search placeholder="What's on your grocery list?" />

      {/* Grid */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid query={query} page={page} />
      </Suspense>

      {/* Pagination */}
      <Pagination totalPages={totalPages} />
    </Box>
  )
}
