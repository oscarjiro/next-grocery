import { ITEMS_PER_PAGE } from '@/libs/styles/constants'
import { Card, CardContent, Skeleton } from '@mui/material'

export function ProductCardSkeleton() {
  return (
    <Card className='flex flex-col h-full shadow-lg border rounded-lg'>
      {/* Image skeleton */}
      <Skeleton variant='rectangular' width='100%' height={250} className='rounded-t-lg' />

      {/* Content skeleton */}
      <CardContent className='flex flex-col flex-1 p-4'>
        <Skeleton variant='text' width='80%' height={28} />
        <Skeleton variant='text' width='100%' height={20} />
        <Skeleton variant='text' width='100%' height={20} className='mb-2' />

        {/* Price & stock section */}
        <div className='mt-auto flex items-center justify-between'>
          <Skeleton variant='text' width={80} height={28} />
          <Skeleton variant='text' width={100} height={20} />
        </div>

        {/* Button skeleton */}
        <Skeleton variant='rectangular' width='100%' height={40} className='mt-4 rounded-lg' />
      </CardContent>
    </Card>
  )
}

export function ProductGridSkeleton() {
  return (
    <section className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 w-full gap-4'>
      {Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </section>
  )
}
