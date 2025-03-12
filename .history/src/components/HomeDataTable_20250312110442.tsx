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
      columnFilters: selectedPriceRange ? [{ id: 'price', value: selectedPriceRange }] : []
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalContainsFilter,
    filterFns: {
      price: priceRangeFilter
    }
  })

  useEffect(() => {
    table.setPageIndex(0)
  }, [searchTerm, selectedPriceRange])

  const handlePriceRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newRange = e.target.value
      setSelectedPriceRange(newRange)
      table.setColumnFilters([{ id: 'price', value: newRange }])
    },
    [table]
  )

  return (
    <CustomTextField
      select
      value={selectedPriceRange}
      onChange={handlePriceRangeChange}
      className='max-sm:is-full sm:is-[150px]'
      placeholder='Filter price'
    >
      {localPriceRanges.map(range => (
        <MenuItem key={range.value} value={range.value}>
          {range.label}
        </MenuItem>
      ))}
    </CustomTextField>
  )
}
