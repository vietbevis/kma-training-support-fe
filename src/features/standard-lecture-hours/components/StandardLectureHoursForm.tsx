import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import type {
  StandardLectureHoursDto,
  UpdateStandardLectureHoursDto
} from '@/shared/validations/StandardLectureHoursSchema'
import { UpdateStandardLectureHoursSchema } from '@/shared/validations/StandardLectureHoursSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface StandardLectureHoursFormProps {
  initialData?: StandardLectureHoursDto
  onSubmit: (data: UpdateStandardLectureHoursDto) => void
  isLoading?: boolean
}

export const StandardLectureHoursForm = ({ initialData, onSubmit, isLoading }: StandardLectureHoursFormProps) => {
  const form = useForm({
    resolver: zodResolver(UpdateStandardLectureHoursSchema),
    defaultValues: {
      lectureHours: initialData ? Number(initialData.lectureHours) : 0,
      excessHours: initialData ? Number(initialData.excessHours) : 0,
      researchHours: initialData ? Number(initialData.researchHours) : 0
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col gap-6'>
          <FormField
            control={form.control}
            name='lectureHours'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số tiết giảng dạy <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Nhập số tiết giảng dạy' {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='excessHours'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số tiết vượt giờ <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Nhập số tiết vượt giờ' {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='researchHours'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số tiết NCKH <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Nhập số tiết NCKH' {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
