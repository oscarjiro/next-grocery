import { createColumnHelper } from '@tanstack/react-table'

import type { ProductType } from './types'
import { caseInsensitiveSort } from '@/utils/sorting'
import Img from './components/Image'

const columnHelper = createColumnHelper<ProductType>()

const columns = [
  // columnHelper.accessor('image_src', {
  //   cell: info => {
  //     const src = info.getValue()
  //     return src ? <Img src={src} alt="Product Image" width={50} height={50} /> : '-'
  //   },
  //   header: 'Image',
  //   enableSorting: false,  
  // }),
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: 'Name',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('description', {
    cell: info => info.getValue(),
    header: 'Description',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('price', {
    cell: info => info.getValue(),
    header: 'Price',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
  columnHelper.accessor('stock', {
    cell: info => info.getValue(),
    header: 'Stock',
    enableSorting: true,
    sortingFn: caseInsensitiveSort
  }),
]

export default columns
