import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import {
  UpdatePermissionSchema,
  type PermissionType,
  type UpdatePermission
} from '@/shared/validations/PermissionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface PermissionFormProps {
  initialData?: PermissionType
  onSubmit: (data: UpdatePermission) => void
  isLoading: boolean
}

export const PermissionForm = ({ initialData, onSubmit, isLoading }: PermissionFormProps) => {
  const form = useForm<UpdatePermission>({
    resolver: zodResolver(UpdatePermissionSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  })

  const handleSubmit = (data: UpdatePermission) => {
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
              <FormLabel>Tên quyền *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên quyền' {...field} />
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
                <Textarea placeholder='Nhập mô tả quyền' className='resize-none' rows={3} {...field} />
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
            {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
