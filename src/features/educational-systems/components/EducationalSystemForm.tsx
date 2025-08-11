import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'
import {
  CreateEducationalSystemSchema,
  EducationLevels,
  Tuitions,
  UpdateEducationalSystemSchema,
  type CreateEducationalSystem,
  type EducationalSystem,
  type UpdateEducationalSystem
} from '@/shared/validations/EducationalSystemSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface EducationalSystemFormProps {
  initialData?: EducationalSystem
  onSubmit: (data: CreateEducationalSystem | UpdateEducationalSystem) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const EducationalSystemForm = ({ initialData, onSubmit, isLoading, mode }: EducationalSystemFormProps) => {
  const schema = mode === 'create' ? CreateEducationalSystemSchema : UpdateEducationalSystemSchema

  const form = useForm<CreateEducationalSystem | UpdateEducationalSystem>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: initialData?.code || '',
      nameClass: initialData?.nameClass || '',
      educationLevels: (initialData?.educationLevels as any) || undefined,
      tuitions: (initialData?.tuitions as any) || undefined,
      studentCategory: initialData?.studentCategory || ''
    }
  })

  const handleSubmit = (data: CreateEducationalSystem | UpdateEducationalSystem) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Viết tắt (VD: A) *</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập viết tắt' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='nameClass'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên lớp ví dụ (VD: Lớp A10) *</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập tên lớp ví dụ' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='educationLevels'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bậc đào tạo *</FormLabel>
                <Select value={field.value as any} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn bậc đào tạo' />
                  </SelectTrigger>
                  <SelectContent>
                    {EducationLevels.options.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tuitions'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Học phí *</FormLabel>
                <Select value={field.value as any} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn học phí' />
                  </SelectTrigger>
                  <SelectContent>
                    {Tuitions.options.map((tuition) => (
                      <SelectItem key={tuition} value={tuition}>
                        {tuition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='studentCategory'
            render={({ field }) => (
              <FormItem className='md:col-span-2 col-span-1'>
                <FormLabel>Đối tượng * (VD: Đóng HP, Việt Nam, ...)</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập đối tượng' {...field} className='w-full md:col-span-2 col-span-1' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
