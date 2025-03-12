'use client'

import { Pagination as MUIPagination, PaginationItem } from '@mui/material'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = Number(searchParams.get('page')) || 1

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <MUIPagination
      count={totalPages}
      page={currentPage}
      size='large'
      onChange={(_, value) => router.push(createPageURL(value))}
      renderItem={item => <PaginationItem component={Link} href={createPageURL(item.page!)} {...item} />}
    />
  )
}
