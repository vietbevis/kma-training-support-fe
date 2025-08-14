import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { MoreHorizontalIcon } from 'lucide-react'
import { Fragment, useCallback, useMemo } from 'react'
import { cn } from '../lib/utils'
import type { MetaPagination } from '../validations/CommonSchema'
import { Button } from './ui/button'

interface PaginationProps {
  meta: MetaPagination
  className?: string
  showPageSizeSelector?: boolean
  setFilter: (filters: Record<string, string>) => void
}

export const PaginationComponent = ({ meta, className, showPageSizeSelector = true, setFilter }: PaginationProps) => {
  const { total, totalPages, page, limit } = meta

  const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100]

  const startRecord = useMemo(() => (page - 1) * limit + 1, [page, limit])
  const endRecord = useMemo(() => Math.min(page * limit, total), [page, limit, total])

  const generatePageNumbers = useCallback(() => {
    const delta = 2
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (page <= delta + 3) {
        for (let i = 2; i <= Math.min(totalPages - 1, delta + 3); i++) {
          pages.push(i)
        }
        if (totalPages > delta + 3) {
          pages.push('ellipsis')
        }
      } else if (page >= totalPages - delta - 2) {
        if (totalPages > delta + 3) {
          pages.push('ellipsis')
        }
        for (let i = Math.max(2, totalPages - delta - 2); i <= totalPages - 1; i++) {
          pages.push(i)
        }
      } else {
        pages.push('ellipsis')
        for (let i = page - delta; i <= page + delta; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [page, totalPages])

  if (totalPages <= 1) {
    return showPageSizeSelector ? (
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          Hiển thị {Math.min(limit, total)} trên tổng số {total} bản ghi
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-muted-foreground'>Số bản ghi mỗi trang:</span>
          <Select value={limit.toString()} onValueChange={(value) => setFilter({ limit: value, page: '1' })}>
            <SelectTrigger className='w-24'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='w-(--radix-select-trigger-width) min-w-none'>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ) : null
  }

  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className='text-sm text-muted-foreground'>
        Hiển thị {startRecord} - {endRecord} trên tổng số {total} bản ghi
      </div>

      <div className='flex items-center gap-4'>
        {showPageSizeSelector && (
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-muted-foreground whitespace-nowrap'>Số bản ghi:</span>
            <Select value={limit.toString()} onValueChange={(value) => setFilter({ limit: value, page: '1' })}>
              <SelectTrigger className='w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='w-(--radix-select-trigger-width) min-w-none'>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className='flex items-center gap-2'>
          <Fragment>
            {page > 1 ? (
              <Button
                onClick={() => setFilter({ page: (page - 1).toString() })}
                aria-disabled={page <= 1}
                className={cn(page <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
                disabled={page <= 1}
                variant={'outline'}
              >
                <span className='hidden sm:block'>Trước</span>
              </Button>
            ) : (
              <Button variant='outline' disabled className='cursor-not-allowed opacity-50' aria-disabled>
                <span className='hidden sm:block'>Trước</span>
              </Button>
            )}
          </Fragment>

          {generatePageNumbers().map((pageNum, index) => (
            <Fragment key={index}>
              {pageNum === 'ellipsis' ? (
                <MoreHorizontalIcon className='size-4' />
              ) : (
                <Button
                  onClick={() => setFilter({ page: pageNum.toString() })}
                  aria-disabled={pageNum === page}
                  className={cn(
                    pageNum === page
                      ? 'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'
                      : ''
                  )}
                  variant={'outline'}
                  size={'icon'}
                >
                  {pageNum}
                </Button>
              )}
            </Fragment>
          ))}

          <Fragment>
            {page < totalPages ? (
              <Button
                onClick={() => setFilter({ page: (page + 1).toString() })}
                aria-disabled={page >= totalPages}
                className={cn(page >= totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}
                disabled={page >= totalPages}
                variant={'outline'}
              >
                <span className='hidden sm:block'>Sau</span>
              </Button>
            ) : (
              <Button variant='outline' disabled className='cursor-not-allowed opacity-50' aria-disabled>
                <span className='hidden sm:block'>Sau</span>
              </Button>
            )}
          </Fragment>
        </div>
      </div>
    </div>
  )
}
