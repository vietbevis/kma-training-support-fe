import { Button } from '@/shared/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import type { AcademicCredential } from '@/shared/validations/AcademicCredentialSchema'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAcademicCredentialsInfiniteQuery } from '../api/AcademicCredentialService'

interface ComboboxAcademicCredentialProps {
  value?: string
  onValueChange?: (value: string) => void
  onSelect?: (value: AcademicCredential | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
}

const ComboboxAcademicCredential = forwardRef<HTMLButtonElement, ComboboxAcademicCredentialProps>(
  (
    {
      value,
      onValueChange,
      onSelect,
      placeholder = 'Chọn học hàm/học vị...',
      disabled,
      className,
      width = '300px',
      error
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearchValue = useDebounce(searchValue, 300)
    const listRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)

    const {
      data,
      isLoading,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      error: queryError
    } = useAcademicCredentialsInfiniteQuery({
      search: debouncedSearchValue || undefined
    })

    const academicCredentials = useMemo(() => {
      return data?.pages?.flatMap((page) => page.data) || []
    }, [data])

    const selectedAcademicCredential = useMemo(() => {
      return academicCredentials.find((b) => b.id.toString() === value)
    }, [academicCredentials, value])

    const handleScroll = useCallback(async () => {
      if (!listRef.current || !hasNextPage || isFetchingNextPage || isLoading || isScrolling) return

      const { scrollTop, scrollHeight, clientHeight } = listRef.current
      const scrollThreshold = 100

      if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
        setIsScrolling(true)
        try {
          await fetchNextPage()
        } finally {
          setTimeout(() => setIsScrolling(false), 500)
        }
      }
    }, [hasNextPage, isFetchingNextPage, isLoading, isScrolling, fetchNextPage])

    const handleSearchChange = useCallback((val: string) => {
      setSearchValue(val)
    }, [])

    const handleSelect = useCallback(
      (academicCredentialId: string) => {
        onValueChange?.(academicCredentialId)
        setOpen(false)
        setSearchValue('')
        onSelect?.(academicCredentials.find((b) => b.id.toString() === academicCredentialId) || null)
      },
      [onValueChange, onSelect, academicCredentials]
    )

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        onValueChange?.('')
      },
      [onValueChange]
    )

    const displayText = useMemo(() => {
      if (selectedAcademicCredential) return selectedAcademicCredential.name
      return placeholder
    }, [selectedAcademicCredential, placeholder])

    const hasSelection = !!value

    useEffect(() => {
      if (!open) setSearchValue('')
    }, [open])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }, [])

    const renderContent = () => {
      if (isLoading && academicCredentials.length === 0) {
        return (
          <CommandItem disabled>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Đang tải dữ liệu...
          </CommandItem>
        )
      }
      if (queryError) {
        return (
          <CommandItem disabled className='text-destructive'>
            Có lỗi xảy ra khi tải dữ liệu
          </CommandItem>
        )
      }
      if (academicCredentials.length === 0 && !isLoading) {
        return (
          <CommandItem disabled>
            {debouncedSearchValue ? 'Không tìm thấy học hàm/học vị nào' : 'Không có dữ liệu học hàm/học vị'}
          </CommandItem>
        )
      }

      return (
        <>
          {academicCredentials.map((b) => (
            <CommandItem
              key={b.id}
              value={b.id.toString()}
              onSelect={() => handleSelect(b.id.toString())}
              className='flex cursor-pointer items-center justify-between'
            >
              <span className='font-medium'>{b.name}</span>
              <Check className={cn('ml-2 h-4 w-4', value === b.id.toString() ? 'opacity-100' : 'opacity-0')} />
            </CommandItem>
          ))}
          {(isFetchingNextPage || (hasNextPage && isScrolling)) && (
            <CommandItem disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang tải thêm...
            </CommandItem>
          )}
        </>
      )
    }

    return (
      <div className={cn('relative', className)} style={{ width }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant='outline'
              role='combobox'
              aria-expanded={open}
              aria-haspopup='listbox'
              className={cn(
                'w-full justify-between',
                !hasSelection && 'text-muted-foreground',
                error && 'border-destructive',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              disabled={disabled}
              onKeyDown={handleKeyDown}
              style={{ width: width !== '100%' ? width : undefined }}
            >
              <span className='truncate'>{displayText}</span>
              <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
            <Command shouldFilter={false}>
              <CommandInput
                placeholder='Tìm kiếm học hàm/học vị...'
                value={searchValue}
                onValueChange={handleSearchChange}
              />
              <CommandList ref={listRef} onScroll={handleScroll} className='max-h-[200px] overflow-auto'>
                <CommandGroup>{renderContent()}</CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {hasSelection && !disabled && (
          <button
            type='button'
            className='absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 cursor-pointer hover:bg-muted z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={'Xóa lựa chọn'}
            tabIndex={-1}
          >
            <X className='h-3 w-3' />
          </button>
        )}

        {error && (
          <p className='mt-1 text-xs text-destructive' role='alert'>
            {error}
          </p>
        )}
      </div>
    )
  }
)

ComboboxAcademicCredential.displayName = 'ComboboxAcademicCredential'

export default ComboboxAcademicCredential
