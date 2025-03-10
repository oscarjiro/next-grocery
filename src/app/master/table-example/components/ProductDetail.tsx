import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material'
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
      <DialogTitle id='product-detail-dialog-title'>Product Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Name'
              value={product?.name || ''}
              slotProps={{
                htmlInput: {
                  readOnly: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Description'
              value={product?.description || ''}
              slotProps={{
                htmlInput: {
                  readOnly: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Price'
              value={`${product?.price.toFixed(2) || '0.00'}`}
              slotProps={{
                htmlInput: {
                  readOnly: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Stock'
              value={product?.stock || 0}
              slotProps={{
                htmlInput: {
                  readOnly: true
                }
              }}
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
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductDetailModal
