'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@mui/material'
import { LoginOutlined } from '@mui/icons-material'
import Link from '@/components/Link'

const NavbarContent = () => {
  const user = useAuth()

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />
      </div>
      <div className='flex items-center'>
        {user ? (
          <UserDropdown />
        ) : (
          <Button component={Link} href='/login' className='uppercase tracking-widest' startIcon={<LoginOutlined />}>
            Login
          </Button>
        )}
      </div>
    </div>
  )
}

export default NavbarContent
