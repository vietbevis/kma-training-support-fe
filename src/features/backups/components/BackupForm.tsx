import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import type { CreateBackupDto } from '@/shared/validations/BackupSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle, File, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface BackupFormProps {
  onSubmit: (data: CreateBackupDto) => void
  isLoading: boolean
}

export const BackupForm = ({ onSubmit, isLoading }: BackupFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateBackupDto>({
    resolver: zodResolver(
      z.object({
        name: z.string().optional(),
        description: z.string().optional()
      })
    )
  })

  const onSubmitHandler = async (data: CreateBackupDto) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className='space-y-4 py-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Tên backup (tùy chọn)</Label>
          <Input id='name' placeholder='Nhập tên backup' {...register('name')} />
          {errors.name && <span className='text-destructive text-sm'>{errors.name.message}</span>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Mô tả (tùy chọn)</Label>
          <Textarea id='description' placeholder='Nhập mô tả cho backup này' {...register('description')} />
          {errors.description && <span className='text-destructive text-sm'>{errors.description.message}</span>}
        </div>
      </div>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Đang xử lý...' : 'Tạo backup'}
      </Button>
    </form>
  )
}

interface RestoreFromUploadFormProps {
  onSubmit: (data: FormData) => void
  isLoading: boolean
}

export const RestoreFromUploadForm = ({ onSubmit, isLoading }: RestoreFromUploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('')

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Chỉ chấp nhận file .zip')
      } else if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File quá lớn (tối đa 100MB)')
      } else {
        setError('File không hợp lệ')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: isLoading
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Vui lòng chọn file backup')
      return
    }

    const formData = new FormData()
    formData.append('backupFile', selectedFile)
    onSubmit(formData)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError('')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='file' className='text-sm font-medium'>
          File backup (.zip)
        </Label>

        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            isLoading && 'cursor-not-allowed opacity-50',
            error && 'border-destructive bg-destructive/5'
          )}
        >
          <input {...getInputProps()} />

          {!selectedFile ? (
            <div className='space-y-4'>
              <div className='mx-auto w-12 h-12 text-muted-foreground'>
                <Upload className='w-full h-full' />
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>
                  {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
                </p>
                <p className='text-xs text-muted-foreground'>Chỉ chấp nhận file .zip (tối đa 100MB)</p>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='mx-auto w-12 h-12 text-green-500'>
                <CheckCircle className='w-full h-full' />
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-green-600'>File đã được chọn</p>
                <div className='flex items-center justify-center gap-2 text-xs text-muted-foreground'>
                  <File className='w-4 h-4' />
                  <span>{selectedFile.name}</span>
                  <span>({formatFileSize(selectedFile.size)})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected File Display */}
        {selectedFile && (
          <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
            <div className='flex items-center gap-3'>
              <File className='w-5 h-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>{selectedFile.name}</p>
                <p className='text-xs text-muted-foreground'>{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={removeFile}
              disabled={isLoading}
              className='h-8 w-8 p-0'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className='flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
            <AlertCircle className='w-4 h-4 text-destructive' />
            <p className='text-sm text-destructive'>{error}</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button type='submit' disabled={isLoading || !selectedFile} variant='destructive' className='w-full'>
        {isLoading ? (
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            Đang xử lý...
          </div>
        ) : (
          'Khôi phục'
        )}
      </Button>
    </form>
  )
}
