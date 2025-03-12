// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Admin Dashboard',
    href: '/admin-dashboard',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Transactions',
    href: '/transaction-history',
    icon: 'tabler-receipt'
  },
  {
    label: 'Cart',
    href: '/cart',
    icon: 'tabler-device-mobile'
  }
]

export default horizontalMenuData
