import { PaginationComponent } from '@/shared/components/Pagination'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { cn } from '@/shared/lib/utils'
import { RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'
import { useGetAuditLogs } from '../api/AuditLogService'
import { AuditLogFilters, AuditLogTable } from '../components'

export const AuditLogsPage = () => {
  const [interval, setInterval] = useState(10000)
  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '',
    limit: '10',
    userId: '',
    action: '',
    entityName: '',
    fromDate: '',
    toDate: ''
  })

  const { data, isLoading, isFetching, refetch } = useGetAuditLogs(filters as any, interval)

  const auditLogs = data?.data.data || []
  const meta = data?.data.meta

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Lịch sử hoạt động</h1>
          <p className='text-muted-foreground'>Theo dõi các hoạt động thay đổi dữ liệu trong hệ thống</p>
        </div>
        <div className='flex items-center gap-2'>
          <Select value={interval.toString()} onValueChange={(value) => setInterval(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder='Chọn thời gian làm mới' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10000'>Làm mới sau 10 giây</SelectItem>
              <SelectItem value='30000'>Làm mới sau 30 giây</SelectItem>
              <SelectItem value='60000'>Làm mới sau 1 phút</SelectItem>
              <SelectItem value='120000'>Làm mới sau 2 phút</SelectItem>
              <SelectItem value='300000'>Làm mới sau 5 phút</SelectItem>
              <SelectItem value='600000'>Làm mới sau 10 phút</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            size='icon'
            onClick={() => !isFetching && !isLoading && refetch()}
            disabled={isFetching || isLoading}
          >
            <RefreshCcwIcon className={cn('w-4 h-4', (isFetching || isLoading) && 'animate-spin-reverse')} />
          </Button>
        </div>
      </div>

      <AuditLogFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hoạt động ({meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLogTable data={auditLogs} isLoading={isLoading} isFilterLoading={isFetching} />
        </CardContent>
      </Card>

      {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
    </div>
  )
}
