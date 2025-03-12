'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import type { TextFieldProps } from '@mui/material'
import { Card, CardHeader, MenuItem, Typography } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import ProductDetailModal from '@/app/(master)/admin-dashboard/components/ProductDetail'
import { ProductType } from '@/app/(master)/admin-dashboard/types'
import { usePathname } from 'next/navigation'
import { priceRanges, PriceRange } from '@/types/priceRanges'

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

/**
 * Global text search filter.
 */
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

/**
 * Filter function for the "price" column.
 */
function priceRangeFilter<T extends Record<string, any>>(
  row: { original: T },
  columnId: string,
  filterValue: string
): boolean {
  if (!filterValue) return true
  const price = Number(row.original[columnId])
  switch (filterValue) {
    case '1-10':
      return price >= 1 && price <= 10
    case '11-20':
      return price >= 11 && price <= 20
    case '21-30':
      return price >= 21 && price <= 30
    case '>30':
      return price > 30
    default:
      return true
  }
}

interface HomeDataTableProps<T> {
  data: T[]
  tableName: string
  dynamicColumns: ColumnDef<T, any>[]
  setOpen: (open: boolean) => void
}

export default function HomeDataTable<T extends { id?: string | undefined | null }>({
  data,
  tableName,
  dynamicColumns,
  setOpen
}: HomeDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [productDetailOpen, setProductDetailOpen] = useState(false)
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('')

  const localPriceRanges = [
    { label: 'All Price', value: '' },
    { label: '1-10', value: '1-10' },
    { label: '11-20', value: '11-20' },
    { label: '21-30', value: '21-30' },
    { label: '>30', value: '>30' }
  ]

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
    data,
    columns: modifiedColumns,
    getRowId: row => String(row.id),
    state: {
      sorting,
      globalFilter: searchTerm,
      // Set up column filters only if a price range is selected.
      columnFilters: selectedPriceRange ? [{ id: 'price', value: selectedPriceRange }] : []
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalContainsFilter,
    filterFns: {
      // Assign the custom price range filter function to the "price" key.
      price: priceRangeFilter
    }
  })

  // Reset the page index when the search term or price range changes.
  useEffect(() => {
    table.setPageIndex(0)
  }, [searchTerm, selectedPriceRange])

  const currentPageRows = table.getRowModel().rows
  const filteredCount = table.getFilteredRowModel().rows.length

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
    const product = row.original
    setSelectedProduct(product)
    setProductDetailOpen(true)
  }

  const handlePriceRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newRange = e.target.value
      setSelectedPriceRange(newRange)
      table.setColumnFilters([{ id: 'price', value: newRange }])
    },
    [table]
  )

  const pathname = usePathname()

  return (
    <Card>
      <CardHeader title={tableName} />
      <div className='flex flex-col md:flex-row md:items-center p-6 border-bs gap-4'>
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
        <CustomTextField
          select
          value={selectedPriceRange}
          onChange={handlePriceRangeChange}
          className='max-sm:is-full sm:is-[150px]'
        >
          {localPriceRanges.map(range => (
            <MenuItem key={range.value} value={range.value}>
              {range.label}
            </MenuItem>
          ))}
        </CustomTextField>
        <DebouncedInput
          value={searchTerm}
          className='max-sm:is-full min-is-[250px]'
          onChange={value => setSearchTerm(String(value))}
          placeholder='Type to search data...'
        />
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
      {pathname !== '/master/carts' && (
        <ProductDetailModal open={productDetailOpen} product={selectedProduct} setOpen={setProductDetailOpen} />
      )}
    </Card>
  )
}
