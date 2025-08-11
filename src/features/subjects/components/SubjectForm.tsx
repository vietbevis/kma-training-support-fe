import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import {
  CreateSubjectSchema,
  UpdateSubjectSchema,
  type CreateSubjectSchemaType,
  type SubjectSchemaType,
  type UpdateSubjectSchemaType
} from '@/shared/validations/SubjectsSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface SubjectFormProps {
  initialData?: SubjectSchemaType
  onSubmit: (data: CreateSubjectSchemaType | UpdateSubjectSchemaType) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const SubjectForm = ({ initialData, onSubmit, isLoading, mode }: SubjectFormProps) => {
  const schema = mode === 'create' ? CreateSubjectSchema : UpdateSubjectSchema

  const form = useForm<CreateSubjectSchemaType | UpdateSubjectSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      facultyDepartmentId: initialData?.facultyDepartment?.id || undefined,
      headOfDepartmentId: initialData?.headOfDepartment?.id || undefined
    }
  })

  const handleSubmit = (data: CreateSubjectSchemaType | UpdateSubjectSchemaType) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên bộ môn *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên bộ môn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã bộ môn *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập mã bộ môn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='facultyDepartmentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khoa *</FormLabel>
              <FormControl>
                <ComboboxFacultyDepartment
                  value={form.watch('facultyDepartmentId')}
                  onValueChange={field.onChange}
                  placeholder='Chọn khoa'
                  disabled={isLoading}
                  width='100%'
                  isFaculty
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='headOfDepartmentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trưởng bộ môn</FormLabel>
              <FormControl>
                {/* <ComboboxUser
                  value={form.watch('headOfDepartmentId') ? String(form.watch('headOfDepartmentId')) : undefined}
                  onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  placeholder='Chọn trưởng bộ môn'
                  disabled={isLoading}
                  width='100%'
                /> */}
                <Input placeholder='Nhập tên trưởng bộ môn' {...field} />
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
                <Textarea placeholder='Nhập mô tả về bộ môn' className='resize-none' rows={3} {...field} />
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
