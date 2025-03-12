import { Product } from '@/types/databaseTypes'
import { Card, CardContent, Typography, Button } from '@mui/material'
import Image from 'next/image'

export default function ProductCard({ product }: { product: Product }) {
  const { name, description, price, stock, image_src } = product

  return (
    <Card className='flex flex-col h-full shadow-lg border rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105'>
      {/* Image */}
      <div className='relative w-full h-[250px]'>
        <Image src={image_src} alt={name} fill className='object-cover' />
      </div>

      {/* Name and description */}
      <CardContent className='flex flex-col flex-grow p-4'>
        <Typography variant='h6' className='font-semibold'>
          {name}
        </Typography>
        <Typography variant='body2' color='text.secondary' className='line-clamp-2'>
          {description}
        </Typography>

        {/* Price and stock*/}
        <div>
          <div className='flex items-center justify-between mt-2'>
            <Typography variant='h6' className='text-primary font-bold'>
              ${price.toFixed(2)}
            </Typography>
            <Typography
              variant='caption'
              color={stock > 0 ? 'success.main' : 'error.main'}
              className='uppercase tracking-widest'
            >
              {stock > 0 ? `In stock: ${stock}` : 'Out of Stock'}
            </Typography>
          </div>

          {/* Add to cart button */}
          <Button
            variant='contained'
            color={stock > 0 ? 'primary' : 'secondary'}
            fullWidth
            className='mt-4 uppercase tracking-widest'
            disabled={stock === 0}
          >
            {stock > 0 ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
