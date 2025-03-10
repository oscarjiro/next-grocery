import { useEffect, useTransition } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'
import { DialogActions } from '@mui/material'

// Custom Components
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import CustomTextField from '@core/components/mui/TextField'
import Form from '@components/Form'

import { createClient } from '@/utils/supabase/client'

import type { ProductType } from '../types'

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be greater than 0').moreThan(0, 'Price must be greater than 0'),
  stock: yup.number().required('Stock is required').positive('Stock must be greater than 0').moreThan(0, 'Stock must be greater than 0'),
  image_src: yup.string().required('Image is required'),
})

type ProductDialogType = {
  open: boolean
  mode: 'add' | 'edit'
  initialProduct: ProductType | null
  setOpen: (open: boolean) => void
  onAddProduct: (product: ProductType) => void
  onUpdateProduct: (product: ProductType) => void
}

const UpsertProduct = ({ open, mode, initialProduct, setOpen, onAddProduct, onUpdateProduct }: ProductDialogType) => {
  const handleClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick' | string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return
    }

    setOpen(false)
  }

  const [isPending, startTransition] = useTransition()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductType>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', price: 0, stock: 0, image_src: '' },
  })

  useEffect(() => {
    if (initialProduct && mode === 'edit') {
      reset(initialProduct)
    } else if (mode === 'add') {
      reset({ name: '', description: '', price: 0, stock: 0, image_src: '' })
    }
  }, [initialProduct, mode, reset])

  const onSubmit = (data: ProductType) => {
    startTransition(async () => {
      try {
        if (mode === 'add') {
          onAddProduct(data)
        } else if (initialProduct && initialProduct.id) {
          onUpdateProduct({ ...initialProduct, ...data })
        }

        reset()
        setOpen(false)
      } catch (error) {
        console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} product:`, error)
        alert(`Failed to ${mode === 'add' ? 'add' : 'update'} product`)
      }
    })
  }

  const handleCancel = () => {
    reset()
    setOpen(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('No file selected.');
      return;
    }
  
    try {
      const supabase = createClient();
      const fileName = `${Date.now()}-${file.name}`;
  
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
  
      if (error) throw new Error(`Error uploading file: ${error.message}`);
  
      const publicURL = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName).data.publicUrl;
  
      if (!publicURL) throw new Error('Failed to retrieve public URL.');

      setValue('image_src', publicURL);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      closeAfterTransition={false}
      onClose={handleClose}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Name'
                    placeholder='Product Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Description'
                    placeholder='Product Description'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='price'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Price'
                    placeholder='Product Price'
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='stock'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Stock'
                    placeholder='Product Stock'
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name='image_src'
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileUpload}
                    />
                    {errors.image_src && <span>{errors.image_src?.message}</span>}

                    {mode === 'edit' && initialProduct?.image_src && (
                      <div>
                        <img
                          src={initialProduct.image_src}
                          alt='Current Product'
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
                        />
                      </div>
                    )}
                  </>
                )}
              />
            </Grid>
          </Grid>
          <DialogActions className='mt-4 p-0'>
            <Button variant='outlined' color='error' onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' type='submit' disabled={isPending} color={mode === 'add' ? 'primary' : 'info'}>
              {isPending ? (mode === 'add' ? 'Adding...' : 'Updating...') : mode === 'add' ? 'Add' : 'Update'}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertProduct
