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
    href: '/master/orders',
    icon: 'tabler-receipt'
  },
  {
    label: 'Cart',
    href: '/master/carts',
    icon: 'tabler-device-mobile'
  }
]

export default verticalMenuData
