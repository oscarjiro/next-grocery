import { Card, CardContent, Table, TableBody, TableCell, TableRow, Typography, Box } from '@mui/material'
import Image from 'next/image'
import { OrderType } from '../types'

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
        pp: order.order_items.
        image: '/images/default-product.jpg' // Placeholder, bisa diganti kalau ada gambar produk
      })) || []
  )

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <Card>
      <CardContent>
        <Table>
          <TableBody>
            {cartItems.map((item, index) => (
              <TableRow key={index}>
                {/* Gambar Produk */}
                <TableCell width={100}>
                  <Image src={item.image} alt={item.name} width={80} height={80} style={{ borderRadius: 8 }} />
                </TableCell>

                {/* Nama Produk & Variasi */}
                <TableCell>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography fontSize={14}>x{item.quantity}</Typography>
                </TableCell>

                {/* Harga */}
                <TableCell align='right'>
                  <Typography color='error' fontWeight={600}>
                    Rp{item.price.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
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
