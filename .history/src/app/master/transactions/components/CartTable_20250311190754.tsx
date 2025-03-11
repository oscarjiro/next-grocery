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
        image_src: item.products.image_src || '/images/default-product.jpg' // Placeholder, bisa diganti kalau ada gambar produk
      })) || []
  )

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <Table>
      <TableBody>
        {orders.map(order => (
          <>
            <Card className='mb-6'>
              <CardContent>
                <Table>
                  <TableBody>
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
                        </TableCell>

                        <TableCell align='right'>
                          <Typography>
                            <span className='mr-1'>
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'IDR'
                              }).format(item.purchase_price)}
                            </span>
                            x {item.quantity}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* 🟠 Total Harga */}
                    <TableRow>
                      <TableCell colSpan={3} align='right'>
                        <Typography variant='h6' fontWeight={600}>
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
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ))}
      </TableBody>
    </Table>
  )
}

export default CartTable
