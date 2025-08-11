import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import ComboboxSubjects from '@/features/subjects/components/ComboboxSubjects'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { KyHoc } from '@/shared/lib/enum'
import { cn } from '@/shared/lib/utils'
import type { Course, CreateCourse, UpdateCourse } from '@/shared/validations/CourseSchema'
import { CreateCourseSchema, UpdateCourseSchema } from '@/shared/validations/CourseSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface CourseFormProps {
  initialData?: Course
  onSubmit: (data: CreateCourse | UpdateCourse) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const CourseForm = ({ initialData, onSubmit, isLoading, mode }: CourseFormProps) => {
  const schema = mode === 'create' ? CreateCourseSchema : UpdateCourseSchema

  const form = useForm<CreateCourse | UpdateCourse>({
    resolver: zodResolver(schema),
    defaultValues: {
      courseCode: initialData?.courseCode || '',
      courseName: initialData?.courseName || '',
      credits: (initialData?.credits as any) || 1,
      semester: (initialData?.semester as any) || undefined,
      description: (initialData?.description as any) || '',
      facultyDepartmentId: (initialData?.facultyDepartment as any)?.id || undefined,
      subjectId: (initialData?.subject as any)?.id || undefined
    }
  })

  const handleSubmit = (data: CreateCourse | UpdateCourse) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='courseCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã học phần *</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập mã học phần' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='courseName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên học phần *</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập tên học phần' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='credits'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tín chỉ *</FormLabel>
                <FormControl>
                  <Input type='number' min={1} max={10} placeholder='Số tín chỉ' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='semester'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kỳ học</FormLabel>
                <Select
                  value={field.value || 'all'}
                  onValueChange={(value) => field.onChange(value === 'all' ? '' : value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn kỳ học' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Kỳ học</SelectItem>
                    {Object.values(KyHoc).map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='facultyDepartmentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khoa/Bộ môn *</FormLabel>
              <FormControl>
                <ComboboxFacultyDepartment value={field.value as any} onValueChange={field.onChange} isFaculty />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='subjectId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bộ môn</FormLabel>
              <FormControl>
                <ComboboxSubjects
                  value={field.value as any}
                  onValueChange={field.onChange}
                  facultyDepartmentId={(form.watch('facultyDepartmentId') as any) || ''}
                  disabled={!form.watch('facultyDepartmentId')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Input placeholder='Nhập mô tả' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-2'>
          <Button
            type='submit'
            disabled={isLoading || !form.formState.isDirty}
            className={cn('cursor-pointer', !form.formState.isDirty && 'pointer-events-none')}
          >
            {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
