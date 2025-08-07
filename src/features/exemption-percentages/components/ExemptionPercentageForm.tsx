import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  CreateExemptionPercentageSchema,
  UpdateExemptionPercentageSchema,
  type CreateExemptionPercentage,
  type ExemptionPercentage,
  type UpdateExemptionPercentage
} from '@/shared/validations/ExemptionPercentageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface ExemptionPercentageFormProps {
  initialData?: ExemptionPercentage
  onSubmit: (data: CreateExemptionPercentage | UpdateExemptionPercentage) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const ExemptionPercentageForm = ({ initialData, onSubmit, isLoading, mode }: ExemptionPercentageFormProps) => {
  const schema = mode === 'create' ? CreateExemptionPercentageSchema : UpdateExemptionPercentageSchema

  const form = useForm<CreateExemptionPercentage | UpdateExemptionPercentage>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: initialData?.reason || '',
      percentage: initialData?.percentage || 0
    }
  })

  const handleSubmit = (data: CreateExemptionPercentage | UpdateExemptionPercentage) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='reason'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lý do miễn giảm *</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập lý do miễn giảm' rows={3} className='resize-none' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='percentage'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phần trăm miễn giảm (%) *</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Nhập phần trăm miễn giảm'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-2'>
          <Button type='submit' disabled={isLoading} className='cursor-pointer'>
            {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
