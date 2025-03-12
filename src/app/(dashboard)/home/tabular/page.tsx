import { getProducts } from '@/app/(master)/admin-dashboard/actions'
import Products from '../components/HomeProduct'
import { Box, Button, Typography } from '@mui/material'
import Link from '@/components/Link'
import { Window } from '@mui/icons-material'

export default async function Page() {
  const products = await getProducts()

  return (
    <Box className='flex flex-col space-y-4 items-center'>
      {/* Title */}
      <div className='flex flex-col'>
        <Typography variant='h2' className='w-full'>
          Stock up on freshness!
        </Typography>
        <Button className='uppercase tracking-widest' startIcon={<Window />} component={Link} href='/home' size='large'>
          View as grid
        </Button>
      </div>

      {/* Table */}
      <Products initialData={products || []} />
    </Box>
  )
}
