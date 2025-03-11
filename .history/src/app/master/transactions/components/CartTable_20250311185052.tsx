import { Card, CardContent, Table, TableBody, TableCell, TableRow, Typography, Box } from '@mui/material'
import Image from 'next/image'
import { OrderType } from '../types'
import { parseISO, format } from 'date-fns'

type CartTableProps = {
  orders: OrderType[]
}

const CartTable = ({ orders }: CartTableProps) => {
  // Ubah data orders agar sesuai dengan CartTable
  const cartItems = orders.flatMap(
    order =>
      order.order_items?.map(item => ({
        id: order.id,
        name: item.products.name,
        quantity: item.quantity,
        price: item.purchase_price,
        total_price: order.total_price,
        created_at: order.created_at,
        status: order.status,
        image: '/images/default-product.jpg' // Placeholder, bisa diganti kalau ada gambar produk
      })) || []
  )

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <Card>
      <CardContent>
        <Table>
          <TableBody>
            {orders.map(order => (
              <>
                <Card>
                  <CardContent>
                    <tab
                  </CardContent>
                </Card>
              </>
            ))}
          </TableBody>
        </Table>

        {/* Total Harga */}
        <Box display='flex' justifyContent='flex-end' mt={2}>
          <Typography variant='h6' fontWeight={600}>
            Total Pesanan: <span style={{ color: 'red' }}>Rp{totalPrice.toLocaleString()}</span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CartTable
