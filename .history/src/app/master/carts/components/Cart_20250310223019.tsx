'use client'

import { useState, useTransition } from 'react'
import { Box, Skeleton, Button } from '@mui/material'

import type { CartItemType } from '../types'
import { getCartItems, removeCartItems, checkoutCart, updateCartItem } from '../actions'
import DataTableRowSelection from '@/components/DataTableRowSelection'
import { showPromiseToast } from '@/utils/toastUtility'

type CartProps = {
  initialData: CartItemType[]
  userId: string
}

export default function Cart({ initialData, userId }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialData)
  const [selectedRows, setSelectedRows] = useState<CartItemType[]>([])
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleRemoveItems = async (itemsToRemove: CartItemType[]) => {
    startTransition(async () => {
      const deletePromise = await showPromiseToast(() => removeCartItems(itemsToRemove), {
        pending: 'Removing items...',
        success: 'Items removed successfully!',
        error: 'Failed to remove items'
      })

      if (deletePromise) {
        setCartItems(prev => prev.filter(item => !itemsToRemove.includes(item)))
      }
    })
  }

  const handleCheckout = async () => {
    startTransition(async () => {
      const checkoutPromise = await showPromiseToast(() => checkoutCart(selectedRows, userId), {
        pending: 'Processing checkout...',
        success: 'Checkout successful!',
        error: 'Failed to checkout'
      })

      if (checkoutPromise) {
        setCartItems(prev => prev.filter(item => !selectedRows.includes(item)))
        setSelectedRows([])
      }
    })
  }

  const handleIncreaseQuantity = async (itemId: string) => {
    setCartItems(prev => prev.map(item => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)))

    try {
      await updateCartItem(itemId, cartItems.find(item => item.id === itemId)!.quantity + 1)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleDecreaseQuantity = async (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId)
    if (!item || item.quantity <= 1) return

    setCartItems(prev => prev.map(item => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)))

    try {
      await updateCartItem(itemId, item.quantity - 1)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  return (
    <div>
      {isPending || !cartItems ? (
        <Box>
          <Skeleton variant='rectangular' width='100%' height={50} />
        </Box>
      ) : (
        <DataTableRowSelection
          data={cartItems}
          dynamicColumns={[
            { accessorKey: 'name', header: 'Product Name' },
            {
              accessorKey: 'quantity',
              header: 'Quantity',
              cell: ({ row }) => {
                const item = row.original
                return (
                  <div className='flex items-center gap-2'>
                    <Button variant="outlined" size="small" sx={{ minWidth: 'auto', padding: '2px 6px' }} onClick={() => handleDecreaseQuantity(item.id)}>
  -
</Button>
<Button variant="outlined" size="small" sx={{ minWidth: 'auto', padding: '2px 6px' }} onClick={() => handleIncreaseQuantity(item.id)}>
  +
</Button>

                  </div>
                )
              }
            },
            { accessorKey: 'price', header: 'Price' }
          ]}
          tableName='Cart Items'
          onSelectedRowsChange={setSelectedRows}
          onDeleteProduct={handleRemoveItems}
          setOpen={setOpen}
          showAddButton={false}
          showExportButton={false}
        />
      )}
      <Box textAlign='center' mt={3}>
        <Button
          className='text-white'
          variant='contained'
          color='primary'
          disabled={selectedRows.length === 0}
          onClick={handleCheckout}
        >
          CHECKOUT
        </Button>
      </Box>
    </div>
  )
}
