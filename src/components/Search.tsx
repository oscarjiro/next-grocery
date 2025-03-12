'use client'

import { useDebouncedCallback } from 'use-debounce'
import { SearchOutlined } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }

    replace(`${pathname}?${params.toString()}`)

    console.log(params.toString())
  }, 300)

  return (
    <div className='flex items-center w-full'>
      <TextField
        fullWidth
        variant='outlined'
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
        onChange={e => handleSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SearchOutlined />
              </InputAdornment>
            )
          }
        }}
      />
    </div>
  )
}
