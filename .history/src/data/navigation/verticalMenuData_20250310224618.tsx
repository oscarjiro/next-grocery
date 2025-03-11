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
    label: 'Carts',
    href: '/master/orders',
    icon: 'tabler-receipt'
  },
  {
    label: 'Phones',
    href: '/master/phones',
    icon: 'tabler-device-mobile' // Selected icon for mobile devices
  }
]

export default verticalMenuData
