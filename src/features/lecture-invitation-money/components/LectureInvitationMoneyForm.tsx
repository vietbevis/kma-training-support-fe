import { ComboboxAcademicCredential } from '@/features/academic-credentails'
import { ComboboxEducationalSystem } from '@/features/educational-systems'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  type CreateLectureInvitationMoney,
  CreateLectureInvitationMoneySchema,
  type LectureInvitationMoney,
  type UpdateLectureInvitationMoney,
  UpdateLectureInvitationMoneySchema
} from '@/shared/validations/LectureInvitationMoneySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface LectureInvitationMoneyFormProps {
  initialData?: LectureInvitationMoney
  onSubmit: (data: CreateLectureInvitationMoney | UpdateLectureInvitationMoney) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const LectureInvitationMoneyForm = ({
  initialData,
  onSubmit,
  isLoading,
  mode
}: LectureInvitationMoneyFormProps) => {
  const schema = mode === 'create' ? CreateLectureInvitationMoneySchema : UpdateLectureInvitationMoneySchema

  const form = useForm<CreateLectureInvitationMoney | UpdateLectureInvitationMoney>({
    resolver: zodResolver(schema),
    defaultValues: {
      money: initialData?.money || '',
      educationalSystem: initialData?.educationalSystem || '',
      academicCredentialId: (initialData?.academicCredential as any)?.id || ''
    }
  })

  const handleSubmit = (data: CreateLectureInvitationMoney | UpdateLectureInvitationMoney) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='money'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập số tiền' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='educationalSystem'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hệ đào tạo *</FormLabel>
              <FormControl>
                <ComboboxEducationalSystem value={field.value as any} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='academicCredentialId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Học hàm/học vị *</FormLabel>
              <FormControl>
                <ComboboxAcademicCredential value={field.value as any} onValueChange={field.onChange} />
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
