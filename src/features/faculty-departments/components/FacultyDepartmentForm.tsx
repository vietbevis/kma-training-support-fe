import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import {
  CreateFacultyDepartmentSchema,
  UpdateFacultyDepartmentSchema,
  type CreateFacultyDepartmentSchemaType,
  type FacultyDepartmentSchemaType,
  type UpdateFacultyDepartmentSchemaType
} from '@/shared/validations/FacultyDepartmentSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface FacultyDepartmentFormProps {
  initialData?: FacultyDepartmentSchemaType
  onSubmit: (data: CreateFacultyDepartmentSchemaType | UpdateFacultyDepartmentSchemaType) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const FacultyDepartmentForm = ({ initialData, onSubmit, isLoading, mode }: FacultyDepartmentFormProps) => {
  const schema = mode === 'create' ? CreateFacultyDepartmentSchema : UpdateFacultyDepartmentSchema

  const form = useForm<CreateFacultyDepartmentSchemaType | UpdateFacultyDepartmentSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      isFaculty: initialData?.isFaculty || false,
      description: initialData?.description || ''
    }
  })

  const handleSubmit = (data: CreateFacultyDepartmentSchemaType | UpdateFacultyDepartmentSchemaType) => {
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
              <FormLabel>Tên khoa/phòng ban *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên khoa/phòng ban' {...field} />
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
              <FormLabel>Mã khoa/phòng ban *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập mã khoa/phòng ban' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isFaculty'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border py-3 px-3'>
              <div className='space-y-0.5'>
                <FormLabel>Loại đơn vị</FormLabel>
                <div className='text-xs text-muted-foreground mt-1'>
                  {field.value ? 'Đây là một khoa' : 'Đây là một phòng ban'}
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
                <Textarea placeholder='Nhập mô tả về khoa/phòng ban' className='resize-none' rows={3} {...field} />
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
