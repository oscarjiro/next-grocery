// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'asas',
    href: '/about',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Admin Table',
    href: '/master/table-example',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Orders',
    href: '/master/orders',
    icon: 'tabler-receipt'
  },
  {
    label: 'Carts',
    href: '/master/carts',
    icon: 'tabler-device-mobile'
  }
]

export default verticalMenuData
