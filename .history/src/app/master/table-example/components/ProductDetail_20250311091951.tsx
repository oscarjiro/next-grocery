import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, IconButton } from '@mui/material'
import iconclos
import CustomTextField from '@core/components/mui/TextField'
import type { ProductType } from '../types'

type ProductDetailDialogType = {
  open: boolean
  product: ProductType | null
  setOpen: (open: boolean) => void
}

const ProductDetailModal = ({ open, product, setOpen }: ProductDetailDialogType) => {
  const handleClose = () => {
    setOpen(false)
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
              value={${product?.price.toFixed(2) || '0.00'}}
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
        <Button variant='contained' color='primary'>
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductDetailModal
