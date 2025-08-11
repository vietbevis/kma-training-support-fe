import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import {
  type AcademicCredential,
  CreateAcademicCredentialSchema,
  type CreateAcademicCredentialSchemaType,
  UpdateAcademicCredentialSchema,
  type UpdateAcademicCredentialSchemaType
} from '@/shared/validations/AcademicCredentialSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface AcademicCredentialFormProps {
  initialData?: AcademicCredential
  onSubmit: (data: CreateAcademicCredentialSchemaType | UpdateAcademicCredentialSchemaType) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const AcademicCredentialForm = ({ initialData, onSubmit, isLoading, mode }: AcademicCredentialFormProps) => {
  const schema = mode === 'create' ? CreateAcademicCredentialSchema : UpdateAcademicCredentialSchema

  const form = useForm<CreateAcademicCredentialSchemaType | UpdateAcademicCredentialSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  })

  const handleSubmit = (data: CreateAcademicCredentialSchemaType | UpdateAcademicCredentialSchemaType) => {
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
              <FormLabel>Tên học hàm/học vị *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên học hàm/học vị' {...field} />
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
                <Textarea placeholder='Mô tả học hàm/học vị' rows={3} className='resize-none' {...field} />
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
