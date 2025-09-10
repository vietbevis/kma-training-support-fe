import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { FileType } from '@/shared/lib/enum'
import { cn } from '@/shared/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUploadTimetableExcelMutation } from '../api/TimetableService'

const uploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => {
      return [FileType.XLS, FileType.XLSX].includes(file.type as any)
    },
    {
      message: 'File phải có định dạng Excel (.xls, .xlsx)'
    }
  )
})

type UploadFormValues = z.infer<typeof uploadSchema>

interface TimetableUploadFormProps {
  onSubmit: () => void
}

export const TimetableUploadForm = ({ onSubmit }: TimetableUploadFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { mutateAsync: uploadExcelMutation, isPending: isUploading } = useUploadTimetableExcelMutation()

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {}
  })

  const handleSubmit = async (values: UploadFormValues) => {
    if (isUploading) return
    const formData = new FormData()
    formData.append('file', values.file)
    await uploadExcelMutation(formData)
    onSubmit()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='file'
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File Excel</FormLabel>
              <FormControl>
                <div className='flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50'>
                  <input
                    type='file'
                    id='file-upload'
                    className='hidden'
                    accept='.xlsx,.xls'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        onChange(file)
                        setPreviewUrl('/excel-icon.png')
                      }
                    }}
                    {...fieldProps}
                  />
                  <label htmlFor='file-upload' className='cursor-pointer w-full text-center'>
                    {previewUrl ? (
                      <div className='flex flex-col items-center'>
                        <UploadCloud className='h-10 w-10 text-muted-foreground mb-2' />
                        <p className='text-sm text-muted-foreground'>
                          {(form.watch('file') as File)?.name || 'File được chọn'}
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>Nhấp để thay đổi file</p>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center'>
                        <UploadCloud className='h-10 w-10 text-muted-foreground mb-2' />
                        <p className='text-sm text-muted-foreground'>Kéo thả hoặc nhấp để tải lên file Excel</p>
                        <p className='text-xs text-muted-foreground mt-1'>Hỗ trợ: .xlsx, .xls</p>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className={cn('w-full', isUploading && 'cursor-not-allowed')}
          disabled={isUploading || !form.watch('file')}
        >
          {isUploading ? 'Đang tải lên...' : 'Tải lên'}
        </Button>
      </form>
    </Form>
  )
}
