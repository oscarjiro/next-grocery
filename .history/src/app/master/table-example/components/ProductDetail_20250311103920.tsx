import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CustomTextField from '@core/components/mui/TextField'
import type { ProductType } from '../types'
import { useState } from 'react'
import { addToCart } from '../actions'
import { useSession } from '@supabase/auth-helpers-react'
import { getUserInfo } from '../actions'
import { userAgent } from 'next/server'

type ProductDetailDialogType = {
  open: boolean
  product: ProductType | null
  setOpen: (open: boolean) => void
}

const ProductDetailModal = ({ open, product, setOpen }: ProductDetailDialogType) => {
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddToCart = async () => {
    if (!product?.id) {
      alert('Invalid product!')
      return
    }

    if (!getUserInfo) {
      alert('User not logged in!')
      return
    }

    setLoading(true)

    try {
      await addToCart([{ product_id: product.id, quantity: 1 }], getUserInfo)
      alert('Product added to cart!')
      handleClose()
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby='product-detail-dialog-title' fullWidth>
      {/* Dialog Title and Close Button */}
      <DialogTitle
        id='product-detail-dialog-title'
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        Product Details
        <IconButton edge='end' color='inherit' onClick={handleClose} aria-label='close'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Name'
              value={product?.name || ''}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Description'
              value={product?.description || ''}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Price'
              value={`${product?.price.toFixed(2) || '0.00'}`}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Stock'
              value={product?.stock || 0}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
          </Grid>

          <Grid item xs={12}>
            {product?.image_src && (
              <img
                src={product.image_src}
                alt='Product Image'
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      {/* Add to Cart Button */}
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button variant='contained' color='primary' onClick={handleAddToCart} disabled={loading}>
          {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductDetailModal
