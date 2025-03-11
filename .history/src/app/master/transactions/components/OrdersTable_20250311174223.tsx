import { Card, CardContent, Table, TableBody, TableCell, TableRow, Typography, Box } from '@mui/material';
import Image from 'next/image';

const CartTable = ({ cartItems }) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card>
      <CardContent>
        <Table>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                {/* Kolom Gambar Produk */}
                <TableCell width={100}>
                  <Image src={item.image} alt={item.name} width={80} height={80} style={{ borderRadius: 8 }} />
                </TableCell>

                {/* Kolom Nama Produk & Variasi */}
                <TableCell>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    Variasi: {item.variation}
                  </Typography>
                  <Typography fontSize={14}>x{item.quantity}</Typography>
                </TableCell>

                {/* Kolom Harga */}
                <TableCell align="right">
                  <Typography color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    Rp{item.originalPrice.toLocaleString()}
                  </Typography>
                  <Typography color="error" fontWeight={600}>
                    Rp{item.price.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Harga */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Typography variant="h6" fontWeight={600}>
            Total Pesanan: <span style={{ color: 'red' }}>Rp{totalPrice.toLocaleString()}</span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Dummy Data untuk Testing
const sampleCartItems = [
  {
    id: '1',
    name: 'MEIDOO Rak Handuk Kamar Mandi Rak Penyimpanan Dinding Aluminium Tahan Air Tanpa Pengeboran',
    variation: 'Tempat tisu mewah',
    quantity: 1,
    originalPrice: 236000,
    price: 109000,
    image: '/images/product1.jpg', // Ganti dengan URL yang sesuai
  },
  {
    id: '2',
    name: 'MEIDOO Rak Handuk Kamar Mandi Rak Penyimpanan Dinding Aluminium Tahan Air Tanpa Pengeboran',
    variation: '4 orang dengan cangk',
    quantity: 1,
    originalPrice: 324000,
    price: 162000,
    image: '/images/product2.jpg',
  },
  {
    id: '3',
    name: 'MEIDOO Rak Handuk Kamar Mandi Rak Penyimpanan Dinding Aluminium Tahan Air Tanpa Pengeboran',
    variation: 'Menebal-50cm',
    quantity: 1,
    originalPrice: 392000,
    price: 196000,
    image: '/images/product3.jpg',
  },
];

export default function CartPage() {
  return <CartTable cartItems={sampleCartItems} />;
}





























// 'use client'

// import { useMemo, useState, useEffect } from 'react'

// import type { TextFieldProps } from '@mui/material'
// import { Button, Card, CardHeader, Checkbox, MenuItem, Typography } from '@mui/material'
// import TablePagination from '@mui/material/TablePagination'
// import ProductDetailModal from '@/app/master/table-example/components/ProductDetail'
// import { ProductType } from '@/app/master/table-example/types'
// import { usePathname } from 'next/navigation'

// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   getSortedRowModel
// } from '@tanstack/react-table'
// import type { ColumnDef, Cell, SortingState } from '@tanstack/react-table'

// import TablePaginationComponent from '@components/TablePaginationComponent'
// import ConfirmationDialog from '@/components/ConfirmationDialog'

// import styles from '@core/styles/table.module.css'
// import CustomTextField from '@/@core/components/mui/TextField'

// interface DebouncedInputProps extends Omit<TextFieldProps, 'onChange'> {
//   value: string | number
//   onChange: (value: string | number) => void
//   debounce?: number
// }

// const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) => {
//   const [value, setValue] = useState(initialValue)

//   useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//   }, [value, debounce, onChange])

//   return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
// }

// function globalContainsFilter<T extends Record<string, any>>(
//   row: { original: T },
//   columnId: string,
//   filterValue: string
// ): boolean {
//   if (!filterValue) return true

//   const searchableValue = Object.values(row.original)
//     .filter(val => val != null)
//     .join(' ')
//     .toLowerCase()

//   return searchableValue.includes(filterValue.toLowerCase())
// }

// interface OrdersTableProps<T> {
//   data: T[]
//   tableName: string
//   dynamicColumns: ColumnDef<T, any>[]
//   onSelectedRowsChange?: (rows: T[]) => void
//   setOpen: (open: boolean) => void
//   onDeleteProduct?: (rows: T[]) => Promise<void>
//   onEditProduct?: (row: T) => void
//   onExportToCSV?: (rows: T[], filename: string) => void
//   showAddButton?: boolean
//   showExportButton?: boolean
//   showEditButton?: boolean
//   disableProductDetail?: boolean
// }

// export default function OrdersTable<T extends { id?: string | undefined | null }>({
//   data,
//   tableName,
//   dynamicColumns,
//   onSelectedRowsChange,
//   onDeleteProduct,
//   setOpen,
//   onEditProduct,
//   onExportToCSV,
//   showAddButton = true,
//   showExportButton = true,
//   showEditButton = true
// }: OrdersTableProps<T>) {
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
//   const [searchTerm, setSearchTerm] = useState('')
//   const [sorting, setSorting] = useState<SortingState>([])
// //   const [productDetailOpen, setProductDetailOpen] = useState(false)
// //   const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)

//   const selectedCount = Object.keys(rowSelection).length

//   const sortableDynamicColumns = useMemo(
//     () =>
//       dynamicColumns.map(column => ({
//         ...column,
//         enableSorting: true
//       })),
//     [dynamicColumns]
//   )

//   const rowSelectColumn = useMemo<ColumnDef<T>>(
//     () => ({
//       id: 'select',
//       enableSorting: false,
//       header: ({ table }) => (
//         <div className='flex items-center'>
//           <Checkbox
//             checked={table.getIsAllRowsSelected()}
//             indeterminate={table.getIsSomeRowsSelected()}
//             onChange={table.getToggleAllRowsSelectedHandler()}
//           />
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className='flex items-center'>
//           <Checkbox
//             checked={row.getIsSelected()}
//             disabled={!row.getCanSelect()}
//             indeterminate={row.getIsSomeSelected()}
//             onChange={row.getToggleSelectedHandler()}
//           />
//         </div>
//       )
//     }),
//     []
//   )

//   const imageColumn = useMemo<ColumnDef<T>>(
//     () => ({
//       id: 'image_src',
//       accessorKey: 'image_src',
//       header: '',
//       enableSorting: false,
//       cell: ({ row }) => {
//         const src = row.getValue('image_src') as string
//         return (
//           <div className='flex items-center'>
//             {src ? <img src={src} alt='Product Image' width={50} height={50} /> : <Typography>-</Typography>}
//           </div>
//         )
//       }
//     }),
//     []
//   )

//   const modifiedColumns = useMemo<ColumnDef<T>[]>(
//     () => [rowSelectColumn, imageColumn, ...sortableDynamicColumns],
//     [rowSelectColumn, imageColumn, sortableDynamicColumns]
//   )

//   const table = useReactTable({
//     data,
//     columns: modifiedColumns,
//     getRowId: row => String(row.id),
//     state: {
//       rowSelection,
//       sorting,
//       globalFilter: searchTerm
//     },
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     globalFilterFn: globalContainsFilter
//   })

//   useEffect(() => {
//     const selectedData = table.getSelectedRowModel().flatRows.map(row => row.original)

//     onSelectedRowsChange?.(selectedData)
//   }, [rowSelection, table, onSelectedRowsChange])

//   const currentPageRows = table.getRowModel().rows
//   const filteredCount = table.getFilteredRowModel().rows.length

//   const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
//     // if ((event.target as HTMLElement).closest('input[type="checkbox"]')) return

//     // const product = row.original
//     // setSelectedProduct(product)
//     // setProductDetailOpen(true)
//   }

//   return (
//     <Card>
//       <CardHeader title={tableName} />
//       {/* Controls Section */}
//       <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
//         <CustomTextField
//           select
//           value={table.getState().pagination.pageSize}
//           onChange={e => {
//             table.setPageSize(Number(e.target.value))
//             table.setPageIndex(0)
//           }}
//           className='max-sm:is-full sm:is-[70px]'
//         >
//           {[5, 10, 15].map(pageSize => (
//             <MenuItem key={pageSize} value={pageSize}>
//               {pageSize}
//             </MenuItem>
//           ))}
//         </CustomTextField>
//         <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
//           {/* Show if 0 selected */}
//           {selectedCount === 0 && (
//             <DebouncedInput
//               value={searchTerm}
//               className='max-sm:is-full min-is-[250px]'
//               onChange={value => setSearchTerm(String(value))}
//               placeholder='Type to search data...'
//             />
//           )}
//         </div>
//       </div>
//       {/* Table */}
//       <div className='overflow-x-auto'>
//         <table className={styles.table}>
//           <thead>
//             {table.getHeaderGroups().map(headerGroup => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <th
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler()}
//                     className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
//                   >
//                     <div className='flex items-center gap-2'>
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                       {{
//                         asc: <i className='tabler-chevron-up text-xl' />,
//                         desc: <i className='tabler-chevron-down text-xl' />
//                       }[header.column.getIsSorted() as string] ?? null}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {currentPageRows.length === 0 ? (
//               <tr>
//                 <td colSpan={modifiedColumns.length} className='text-center'>
//                   No data found
//                 </td>
//               </tr>
//             ) : (
//               currentPageRows.map(row => (
//                 <tr
//                   key={row.id}
//                   className={row.getIsSelected() ? 'selected' : ''}
//                   onClick={event => handleRowClick(event, row)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
//                     <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <TablePagination
//         component={() => <TablePaginationComponent<T> table={table} />}
//         count={filteredCount}
//         page={table.getState().pagination.pageIndex}
//         rowsPerPage={table.getState().pagination.pageSize}
//         onPageChange={(_, newPage) => table.setPageIndex(newPage)}
//         onRowsPerPageChange={e => {
//           table.setPageSize(Number(e.target.value))
//           table.setPageIndex(0)
//         }}
//       />
//     </Card>
//   )
// }
