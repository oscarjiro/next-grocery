import { Box, Typography } from '@mui/material'
import { getFilteredProducts, getProductsPages } from './actions'
import Search from '@/components/Search'
import Pagination from '@/components/Pagination'
import ProductCard from './ProductCard'

export default async function Page(props: { searchParams?: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams?.query ?? ''
  const page = Number(searchParams?.page) || 1

  let { totalPages, error: totalPagesError } = await getProductsPages(query)
  totalPages = totalPages ? Math.ceil(totalPages) : 1
  if (totalPagesError) {
    console.error('Error fetching total products pages:', totalPagesError)
  }

  const { products, error: productsError } = await getFilteredProducts(page, query)
  if (productsError) {
    console.error('Error fetching products:', productsError)
  }

  return (
    <Box className='flex flex-col items-center w-full space-y-4' component='section'>
      {/* Title */}
      <Typography variant='h2' className='w-full'>
        Stock up on freshness!
      </Typography>

      {/* Search bar */}
      <Search placeholder="What's on your grocery list?" />

      {/* Grid */}
      <Box className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-4'>
        {products?.length ? (
          products.map(product => <ProductCard key={product.id} product={product} />)
        ) : (
          <p>No products yet :(</p>
        )}
      </Box>

      {/* Pagination */}
      <Pagination totalPages={totalPages} />
    </Box>
  )
}
