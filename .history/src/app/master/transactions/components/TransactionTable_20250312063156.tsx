import { Card, CardContent, Table, TableBody, TableCell, TableRow, Typography, Box } from '@mui/material'
import { OrderType } from '../types'
import { parseISO, format } from 'date-fns'
import { Chip } from '@mui/material'

type OrderHistoryProps = {
  orders: OrderType[]
}

const OrderHistory = ({ orders }: OrderHistoryProps) => {
  const cartItems = orders.flatMap(
    order =>
      order.order_items?.map(item => ({
        id: order.id,
        name: 
        quantity: item.quantity,
        price: item.purchase_price,
        total_price: order.total_price,
        created_at: order.created_at,
        status: order.status
      })) || []
  )

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography variant='h5' color='textSecondary' fontWeight={600}>
              Transactions History
            </Typography>
          </TableCell>
        </TableRow>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} align='center'>
              <Typography variant='h6' className='text-gray-500'>
                No Data Found
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          orders.map(order => (
            <TableRow key={order.id}>
              <TableCell colSpan={3}>
                <Card key={order.id} className='mb-6'>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {/* 🟢 Baris Order (judul) */}
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell colSpan={3}>
                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                              <Typography fontWeight={600}>
                                Transaction date:{' '}
                                {order.created_at ? format(parseISO(order.created_at), 'dd/MM/yyyy HH:mm') : '-'}
                              </Typography>
                              <Chip label={order.status} color='success' variant='tonal' />
                            </Box>
                          </TableCell>
                        </TableRow>

                        {/* 🔵 List Produk di dalam Order */}
                        {order.order_items?.map((item, index) => (
                          <TableRow key={`${order.id}-${index}`}>
                            <TableCell>
                              <Typography fontWeight={600}>Product name: {item.products.name}</Typography>
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
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell>
                            <Typography variant='h6' fontWeight={600}>
                              Total:
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={3} align='right'>
                            <Typography variant='h6' fontWeight={600}>
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default OrderHistory
