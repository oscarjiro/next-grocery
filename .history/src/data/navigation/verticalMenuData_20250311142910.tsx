// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'About',
    href: '/about',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Admin Table',
    href: '/master/table-example',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Transactions',
    href: '/master/transactions',
    icon: 'tabler-receipt'
  },
  {
    label: 'Cart',
    href: '/master/cart',
    icon: 'tabler-device-mobile'
  }
]

export default verticalMenuData
