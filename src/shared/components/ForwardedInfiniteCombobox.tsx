import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { cn } from '@/shared/lib/utils'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Generic type cho item data
interface ComboboxItem {
  id: string | number
  name: string
  [key: string]: any
}

// Hook data interface - để component có thể hoạt động với bất kỳ tanstack query nào
interface UseInfiniteQueryResult<T> {
  data?: {
    pages: Array<{
      data: T[]
      [key: string]: any
    }>
  }
  isLoading: boolean
  hasNextPage?: boolean
  fetchNextPage: () => Promise<any>
  isFetchingNextPage: boolean
  error: any
  refetch: () => void
}

interface InfiniteComboboxProps<T extends ComboboxItem> {
  // Data & Query
  queryResult: UseInfiniteQueryResult<T>

  // Single select props
  value?: string
  onValueChange?: (value: string) => void

  // Multi select props
  values?: string[]
  onValuesChange?: (values: string[]) => void

  // UI Configuration
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  loadingText?: string
  errorText?: string
  retryText?: string
  clearAllText?: string
  selectionCountText?: (count: number, max?: number) => string
  displayMultipleText?: (first: string, count: number) => string

  // Behavior
  disabled?: boolean
  multiple?: boolean
  maxSelection?: number
  showSelectionCount?: boolean

  // Styling
  className?: string
  width?: string

  // Advanced
  itemRenderer?: (item: T, isSelected: boolean, isMaxReached: boolean) => React.ReactNode
  selectedBadgeRenderer?: (item: T) => React.ReactNode
  onItemSelect?: (item: T) => void
  filterFn?: (item: T, search: string) => boolean
  onSearchValueChange?: (value: string) => void
  textDisplay?: (item: T) => string

  // Error handling
  error?: string

  // Accessibility
  'aria-label'?: string
}

function InfiniteCombobox<T extends ComboboxItem>(
  {
    queryResult,
    value,
    onValueChange,
    values = [],
    onValuesChange,
    placeholder = 'Chọn mục...',
    searchPlaceholder = 'Tìm kiếm...',
    emptyText = 'Không có dữ liệu',
    loadingText = 'Đang tải dữ liệu...',
    errorText = 'Có lỗi xảy ra khi tải dữ liệu',
    retryText = 'Thử lại',
    clearAllText = 'Xóa tất cả',
    selectionCountText = (count: number, max?: number) => `Đã chọn: ${count}${max ? ` / ${max}` : ''}`,
    displayMultipleText = (first: string, count: number) => `${first} và ${count - 1} khác`,
    disabled = false,
    multiple = false,
    maxSelection,
    showSelectionCount = false,
    className,
    width = '100%',
    itemRenderer,
    selectedBadgeRenderer,
    onItemSelect,
    filterFn,
    onSearchValueChange,
    error,
    'aria-label': ariaLabel,
    textDisplay
  }: InfiniteComboboxProps<T>,
  ref: React.Ref<HTMLButtonElement>
) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, error: queryError, refetch } = queryResult

  // Lưu trữ tất cả dữ liệu đã tải từ API
  const [allItems, setAllItems] = useState<T[]>([])

  // Tổng hợp dữ liệu từ tất cả các trang
  const searchResults = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) || []
  }, [data])

  // Cập nhật danh sách items khi có dữ liệu mới
  useEffect(() => {
    if (searchResults.length > 0) {
      setAllItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id.toString()))
        const newItems = searchResults.filter((item) => !existingIds.has(item.id.toString()))
        return [...prev, ...newItems]
      })
    }
  }, [searchResults])

  // Lấy các item đã được chọn
  const selectedItems = useMemo(() => {
    if (multiple) {
      return allItems.filter((item) => values.includes(item.id.toString()))
    }
    return allItems.filter((item) => item.id.toString() === value)
  }, [allItems, multiple, values, value])

  // Xử lý scroll để load thêm dữ liệu
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

  // Xử lý thay đổi giá trị tìm kiếm
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value)
      onSearchValueChange?.(value) // Callback để parent component có thể biết search value thay đổi
    },
    [onSearchValueChange]
  )

  // Xử lý chọn item
  const handleSelect = useCallback(
    (itemId: string) => {
      const selectedItem = allItems.find((item) => item.id.toString() === itemId)

      if (multiple) {
        const currentValues = values || []
        const isSelected = currentValues.includes(itemId)

        if (isSelected) {
          // Bỏ chọn
          const newValues = currentValues.filter((id) => id !== itemId)
          onValuesChange?.(newValues)
        } else {
          // Chọn mới (kiểm tra giới hạn)
          if (!maxSelection || currentValues.length < maxSelection) {
            const newValues = [...currentValues, itemId]
            onValuesChange?.(newValues)
          }
        }
      } else {
        // Single select
        const newValue = value === itemId ? '' : itemId
        onValueChange?.(newValue)
        setOpen(false)
        setSearchValue('')
      }

      // Callback khi select item
      if (selectedItem && onItemSelect) {
        onItemSelect(selectedItem)
      }
    },
    [multiple, values, onValuesChange, maxSelection, onValueChange, value, allItems, onItemSelect]
  )

  // Xử lý xóa tất cả lựa chọn
  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (multiple) {
        onValuesChange?.([])
      } else {
        onValueChange?.('')
      }
    },
    [multiple, onValuesChange, onValueChange]
  )

  // Kiểm tra item có được chọn không
  const isSelected = useCallback(
    (itemId: string) => {
      if (multiple) {
        return values.includes(itemId)
      }
      return value === itemId
    },
    [multiple, values, value]
  )

  // Text hiển thị trên button
  const displayText = useMemo(() => {
    if (multiple) {
      if (selectedItems.length === 0) {
        return placeholder
      }
      if (selectedItems.length === 1) {
        return textDisplay ? textDisplay(selectedItems[0]) : selectedItems[0].name
      }
      if (showSelectionCount) {
        return selectionCountText(selectedItems.length, maxSelection)
      }
      return displayMultipleText(
        textDisplay ? textDisplay(selectedItems[0]) : selectedItems[0].name,
        selectedItems.length
      )
    }

    const selectedItem = selectedItems[0]
    return selectedItem ? (textDisplay ? textDisplay(selectedItem) : selectedItem.name) : placeholder
  }, [
    multiple,
    selectedItems,
    showSelectionCount,
    placeholder,
    selectionCountText,
    displayMultipleText,
    maxSelection,
    textDisplay
  ])

  // Kiểm tra có selection không
  const hasSelection = multiple ? values.length > 0 : !!value

  // Reset search khi đóng popover
  useEffect(() => {
    if (!open) {
      setSearchValue('')
    }
  }, [open])

  // Xử lý phím tắt
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  // Focus vào input khi mở popover
  useEffect(() => {
    if (open) {
      const input = document.querySelector('[cmdk-input]') as HTMLInputElement
      if (input) {
        setTimeout(() => {
          input.focus()
        }, 100)
      }
    }
  }, [open])

  // Xử lý retry khi có lỗi
  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  // Filter results nếu có custom filter function
  const filteredResults = useMemo(() => {
    if (!filterFn || !searchValue) {
      return searchResults
    }
    return searchResults.filter((item) => filterFn(item, searchValue))
  }, [searchResults, filterFn, searchValue])

  // Default item renderer
  const defaultItemRenderer = useCallback(
    (item: T, selected: boolean, isMaxReached: boolean) => (
      <>
        <Check className={cn('mr-2 h-4 w-4 flex-shrink-0', selected ? 'opacity-100' : 'opacity-0')} />
        <span className='flex-1 truncate' title={item.name}>
          {item.name}
        </span>
        {isMaxReached && <span className='text-xs text-muted-foreground ml-2 flex-shrink-0'>Đã đạt giới hạn</span>}
      </>
    ),
    []
  )

  // Default badge renderer
  const defaultBadgeRenderer = useCallback(
    (item: T) => (
      <Badge key={item.id} variant='outline' className='truncate text-xs max-w-[120px] h-6' title={item.name}>
        <span className='truncate'>{item.name}</span>
      </Badge>
    ),
    []
  )

  // Render nội dung danh sách
  const renderContent = () => {
    // Loading state
    if (isLoading && filteredResults.length === 0) {
      return (
        <div className='py-8 text-center'>
          <Loader2 className='mx-auto h-5 w-5 animate-spin text-muted-foreground' />
          <p className='mt-2 text-sm text-muted-foreground'>{loadingText}</p>
        </div>
      )
    }

    // Error state
    if (queryError) {
      return (
        <div className='py-8 text-center'>
          <p className='text-sm text-destructive'>{errorText}</p>
          <Button variant='ghost' size='sm' className='mt-2 h-8 text-xs' onClick={handleRetry}>
            {retryText}
          </Button>
        </div>
      )
    }

    // Empty state
    if (filteredResults.length === 0) {
      return (
        <div className='py-8 text-center text-sm text-muted-foreground'>
          {searchValue ? `Không tìm thấy "${searchValue}"` : emptyText}
        </div>
      )
    }

    // Render danh sách
    return (
      <CommandGroup>
        {filteredResults.map((item: T) => {
          const selected = isSelected(item.id.toString())
          const isMaxReached = multiple && maxSelection && values.length >= maxSelection && !selected
          const renderer = itemRenderer || defaultItemRenderer

          return (
            <CommandItem
              key={item.id}
              value={item.id.toString()}
              onSelect={() => {
                if (!isMaxReached) {
                  handleSelect(item.id.toString())
                }
              }}
              className={cn('cursor-pointer', isMaxReached && 'opacity-50 cursor-not-allowed', selected && 'bg-accent')}
              disabled={!!isMaxReached}
            >
              {renderer(item, selected, !!isMaxReached)}
            </CommandItem>
          )
        })}
      </CommandGroup>
    )
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          if (!disabled) setOpen(isOpen)
        }}
        modal={false}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            aria-haspopup='listbox'
            aria-label={ariaLabel || (multiple ? 'Chọn nhiều mục' : 'Chọn mục')}
            className={cn(
              'w-full justify-between',
              !hasSelection && 'text-muted-foreground',
              error && 'border-destructive',
              disabled && 'cursor-not-allowed opacity-50',
              multiple && selectedItems.length > 0 && 'justify-start'
            )}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            style={{ width: width !== '100%' ? width : undefined }}
          >
            {multiple && selectedItems.length > 0 ? (
              <>
                {selectedItems
                  .slice(0, 3)
                  .reverse()
                  .map((item) => (selectedBadgeRenderer ? selectedBadgeRenderer(item) : defaultBadgeRenderer(item)))}
                {selectedItems.length > 3 && (
                  <Badge variant='secondary' className='text-xs h-6'>
                    +{selectedItems.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <span className='pr-11 overflow-hidden truncate'>{displayText}</span>
            )}
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50 absolute right-2' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='p-0 w-[var(--radix-popover-trigger-width)] overscroll-y-contain'
          align='start'
          sideOffset={4}
        >
          <Command shouldFilter={false} className='w-full'>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={handleSearchChange}
              className='h-9'
            />

            {multiple && (
              <div className='px-3 py-2 text-xs text-muted-foreground bg-muted/50 border-b flex items-center justify-between'>
                <span>{selectionCountText(values.length, maxSelection)}</span>
                {values.length > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive'
                    onClick={(e) => {
                      e.stopPropagation()
                      onValuesChange?.([])
                    }}
                  >
                    {clearAllText}
                  </Button>
                )}
              </div>
            )}

            <CommandList
              className='max-h-[200px] overflow-y-auto overscroll-y-contain'
              ref={listRef}
              onScroll={handleScroll}
            >
              {renderContent()}

              {isFetchingNextPage && (
                <div className='py-3 text-center border-t'>
                  <Loader2 className='mx-auto h-4 w-4 animate-spin text-muted-foreground' />
                  <p className='mt-1 text-xs text-muted-foreground'>Đang tải thêm...</p>
                </div>
              )}

              {!hasNextPage && filteredResults.length > 0 && (
                <div className='py-2 text-center text-xs text-muted-foreground border-t'>
                  {filteredResults.length === 1
                    ? 'Đã hiển thị 1 mục'
                    : `Đã hiển thị tất cả ${filteredResults.length} mục`}
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Clear button */}
      {hasSelection && !disabled && (
        <button
          type='button'
          className='absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 cursor-pointer hover:bg-muted z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          onClick={handleClearAll}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={multiple ? 'Xóa tất cả lựa chọn' : 'Xóa lựa chọn'}
          tabIndex={-1}
        >
          <X className='h-3 w-3' />
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className='mt-1 text-xs text-destructive' role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}

const ForwardedInfiniteCombobox = forwardRef(InfiniteCombobox) as <T extends ComboboxItem>(
  props: InfiniteComboboxProps<T> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement

export default ForwardedInfiniteCombobox
export type { ComboboxItem, InfiniteComboboxProps, UseInfiniteQueryResult }
