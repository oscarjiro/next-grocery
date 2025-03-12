'use client'

import { useMemo, useState, useEffect } from 'react'
import type { TextFieldProps } from '@mui/material'
import { Card, CardHeader, MenuItem, Typography } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import ProductDetailModal from '@/app/(master)/admin-dashboard/components/ProductDetail'
import { ProductType } from '@/app/(master)/admin-dashboard/types'
import { usePathname } from 'next/navigation'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, Cell, SortingState } from '@tanstack/react-table'
import TablePaginationComponent from '@components/TablePaginationComponent'
import styles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'

interface DebouncedInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

function globalContainsFilter<T extends Record<string, any>>(
  row: { original: T },
  columnId: string,
  filterValue: string
): boolean {
  if (!filterValue) return true

  const searchableValue = Object.values(row.original)
    .filter(val => val != null)
    .join(' ')
    .toLowerCase()

  return searchableValue.includes(filterValue.toLowerCase())
}

interface HomeDataTableProps<T> {
  data: T[]
  tableName: string
  dynamicColumns: ColumnDef<T, any>[]
  setOpen: (open: boolean) => void
}

export default function HomeDataTable<T extends { id?: string | undefined | null; price: number }>({
  data,
  tableName,
  dynamicColumns,
  setOpen
}: HomeDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [productDetailOpen, setProductDetailOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [priceFilter, setPriceFilter] = useState<string>('')

  const priceRanges = [
    { label: 'All Price', value: 'All Price' },
    { label: 'Rp0.00 - Rp49,999.00', value: '0-49999' },
    { label: 'Rp50,000.00 - Rp99,999.00', value: '50000-99999' },
    { label: 'Rp100,000 - Rp149,999', value: '100000-149999' },
    { label: '> Rp150,000', value: '>150000' }
  ]

  const filteredData = useMemo(() => {
    if (!priceFilter) return data

    return data.filter(item => {
      const price = item.price as number
      if (priceFilter === '0-49999') return price >= 0 && price <= 49999
      if (priceFilter === '50000-99999') return price >= 50000 && price <= 99999
      if (priceFilter === '100000-149999') return price >= 100000 && price <= 149999
      if (priceFilter === '>150000') return price > 150000
      return true
    })
  }, [data, priceFilter])

  const sortableDynamicColumns = useMemo(
    () =>
      dynamicColumns.map(column => ({
        ...column,
        enableSorting: true
      })),
    [dynamicColumns]
  )

  const imageColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: 'image_src',
      accessorKey: 'image_src',
      header: '',
      enableSorting: false,
      cell: ({ row }) => {
        const src = row.getValue('image_src') as string
        return (
          <div className='flex items-center'>
            {src ? <img src={src} alt='Product Image' width={50} height={50} /> : <Typography>-</Typography>}
          </div>
        )
      }
    }),
    []
  )

  const modifiedColumns = useMemo<ColumnDef<T>[]>(
    () => [imageColumn, ...sortableDynamicColumns],
    [imageColumn, sortableDynamicColumns]
  )

  const table = useReactTable({
    data: filteredData,
    columns: modifiedColumns,
    getRowId: row => String(row.id),
    state: {
      sorting,
      globalFilter: searchTerm
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalContainsFilter
  })

  const currentPageRows = table.getRowModel().rows
  const filteredCount = table.getFilteredRowModel().rows.length

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
    const product = row.original
    setSelectedProduct(product)
    setProductDetailOpen(true)
  }

  const pathname = usePathname()

  return (
    <Card>
      <CardHeader title={tableName} />
      <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
        <CustomTextField
          select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
            table.setPageIndex(0)
          }}
          className='max-sm:is-full sm:is-[70px]'
        >
          {[5, 10, 15].map(pageSize => (
            <MenuItem key={pageSize} value={pageSize}>
              {pageSize}
            </MenuItem>
          ))}
        </CustomTextField>
        <DebouncedInput
          value={searchTerm}
          className='max-sm:is-full min-is-[250px]'
          onChange={value => setSearchTerm(String(value))}
          placeholder='Type to search data...'
        />
        <CustomTextField
          select
          value={priceFilter}
          onChange={e => setPriceFilter(e.target.value)}
          className='max-sm:is-full sm:is-[150px]'
          placeholder='Filter by price'
        >
          {priceRanges.map(range => (
            <MenuItem key={range.value} value={range.value}>
              {range.label}
            </MenuItem>
          ))}
        </CustomTextField>
      </div>
      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                  >
                    <div className='flex items-center gap-2'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <i className='tabler-chevron-up text-xl' />,
                        desc: <i className='tabler-chevron-down text-xl' />
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {currentPageRows.length === 0 ? (
              <tr>
                <td colSpan={modifiedColumns.length} className='text-center'>
                  No data found
                </td>
              </tr>
            ) : (
              currentPageRows.map(row => (
                <tr key={row.id} onClick={event => handleRowClick(event, row)} style={{ cursor: 'pointer' }}>
                  {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent<T> table={table} />}
        count={filteredCount}
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        onPageChange={(_, newPage) => table.setPageIndex(newPage)}
        onRowsPerPageChange={e => {
          table.setPageSize(Number(e.target.value))
          table.setPageIndex(0)
        }}
      />
      <ProductDetailModal open={productDetailOpen} product={selectedProduct} setOpen={setProductDetailOpen} />
    </Card>
  )
}
