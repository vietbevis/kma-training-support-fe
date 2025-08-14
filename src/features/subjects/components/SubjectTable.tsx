import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import type { SubjectSchemaType } from '@/shared/validations/SubjectsSchema'
import { Edit, Trash2 } from 'lucide-react'

interface SubjectTableProps {
  subjects: SubjectSchemaType[]
  onEdit?: (subject: SubjectSchemaType) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
  isFilterLoading?: boolean
}

export const SubjectTable = ({ subjects, onEdit, onDelete, isLoading, isFilterLoading }: SubjectTableProps) => {
  if (isLoading && subjects.length === 0) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (subjects.length === 0) {
    return (
      <div className='flex h-24 items-center justify-center text-muted-foreground'>Không có dữ liệu bộ môn nào</div>
    )
  }

  return (
    <div className='relative'>
      {isFilterLoading && (
        <div className='absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex justify-center items-center'>
          <LoadingSpinner isLoading={true} className='relative py-20' />
        </div>
      )}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên bộ môn</TableHead>
              <TableHead>Mã bộ môn</TableHead>
              <TableHead>Khoa</TableHead>
              <TableHead>Trưởng bộ môn</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className='font-medium'>{subject.name}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{subject.code}</Badge>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{subject.facultyDepartment.name}</span>
                    <span className='text-sm text-muted-foreground'>{subject.facultyDepartment.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {subject.headOfDepartment ? (
                    <Badge variant='secondary'>{subject.headOfDepartment.fullName}</Badge>
                  ) : (
                    <span className='text-muted-foreground'>Chưa có</span>
                  )}
                </TableCell>
                <TableCell className='max-w-[200px] truncate' title={subject.description}>
                  {subject.description || <span className='text-muted-foreground'>Không có mô tả</span>}
                </TableCell>
                <TableCell className='text-right w-20'>
                  <div className='flex justify-end gap-2'>
                    {onEdit && (
                      <Button variant='outline' size='icon' onClick={() => onEdit(subject)}>
                        <Edit className='h-4 w-4' />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant='outline' size='icon' onClick={() => onDelete(subject.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
