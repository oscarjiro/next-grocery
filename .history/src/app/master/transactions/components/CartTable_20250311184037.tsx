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
                {/* 🟢 Baris Order (judul) */}
                <TableRow key={order.id} sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell colSpan={3}>
                    <Typography fontWeight={600}>
                      Transaction date:{' '}
                      {order.created_at ? format(parseISO(order.created_at), 'dd/MM/yyyy HH:mm') : '-'}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* 🔵 List Produk di dalam Order */}
                {order.order_items?.map((item, index) => (
                  <TableRow key={`${order.id}-${index}`}>
                    {/* Gambar Produk */}
                    <TableCell width={100}>
                      <Image
                        src='/images/default-product.jpg'
                        alt={item.products.name}
                        width={80}
                        height={80}
                        style={{ borderRadius: 8 }}
                      />
                    </TableCell>

                    {/* Nama Produk & Variasi */}
                    <TableCell>
                      <Typography fontWeight={600}>{item.products.name}</Typography>
                      <Typography fontSize={14}>
                        x{item.quantity} @
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'IDR'
                        }).format(order.total_price)}
                      </Typography>
                    </TableCell>

                    {/* Harga */}
                    <TableCell align='right'>
                      <Typography color='error' fontWeight={600}>
                        Rp{order.total_price.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align='right'>
                    <Typography textAlign={right} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      Total:
                      <span className='ml-1'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'IDR'
                        }).format(order.total_price)}
                      </span>
                    </Typography>
                  </TableCell>
                </TableRow>
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
