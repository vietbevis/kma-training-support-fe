import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { type BackupStatisticsResponseDto } from '@/shared/validations/BackupSchema'
import { Database, HardDrive, Package, Percent } from 'lucide-react'

interface BackupStatisticsProps {
  data: BackupStatisticsResponseDto | undefined
  isLoading: boolean
}

export const BackupStatistics = ({ data, isLoading }: BackupStatisticsProps) => {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <StatisticSkeleton />
        <StatisticSkeleton />
        <StatisticSkeleton />
        <StatisticSkeleton />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      <StatisticCard
        title='Tổng số backup'
        value={data.summary.totalBackups.toString()}
        description={`${data.summary.completedBackups} thành công, ${data.summary.failedBackups} thất bại`}
        icon={<Database className='h-4 w-4 text-muted-foreground' />}
      />
      <StatisticCard
        title='Loại backup'
        value={`${data.summary.manualBackups} / ${data.summary.scheduledBackups}`}
        description={`Thủ công / Tự động`}
        icon={<Package className='h-4 w-4 text-muted-foreground' />}
      />
      <StatisticCard
        title='Tổng dung lượng'
        value={formatBytes(data.summary.totalSize)}
        description={`Trung bình: ${formatBytes(data.summary.averageSize)}`}
        icon={<HardDrive className='h-4 w-4 text-muted-foreground' />}
      />
      <StatisticCard
        title='Tỷ lệ thành công'
        value={
          data.summary.totalBackups > 0
            ? `${Math.round((data.summary.completedBackups / data.summary.totalBackups) * 100)}%`
            : '0%'
        }
        description={`${data.summary.completedBackups}/${data.summary.totalBackups} backup thành công`}
        icon={<Percent className='h-4 w-4 text-muted-foreground' />}
      />
    </div>
  )
}

interface StatisticCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}

const StatisticCard = ({ title, value, description, icon }: StatisticCardProps) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  )
}

const StatisticSkeleton = () => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-4 w-4' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-[80px] mb-1' />
        <Skeleton className='h-3 w-[140px]' />
      </CardContent>
    </Card>
  )
}
