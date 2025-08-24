import { AlertCircle, Eye, FileText, Image, Trash2, Upload, X } from 'lucide-react'
import { forwardRef, useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip'
import envConfig from '../config/envConfig'
import { cn } from '../lib/utils'
import { type FileType } from '../validations/CommonSchema'
import { useUploadFilesMutation } from './api'

export type AcceptedFileType = 'image' | 'document' | 'mixed'

export interface UploadFilesProps {
  value?: FileType | FileType[]
  onChange?: (value: FileType | FileType[] | undefined) => void

  fileType?: AcceptedFileType
  multiple?: boolean
  maxFiles?: number
  maxSize?: number

  className?: string
  disabled?: boolean
  placeholder?: string

  showPreview?: boolean
  previewSize?: 'sm' | 'md' | 'lg'
  square?: boolean

  error?: string

  'aria-label'?: string
  'aria-describedby'?: string
}

const SUPPORTED_FILE_TYPES = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
  get mixed() {
    return [...this.image, ...this.document]
  }
}

const MIME_TYPE_MAP: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB

const UploadFiles = forwardRef<HTMLDivElement, UploadFilesProps>(
  (
    {
      fileType = 'mixed',
      multiple = false,
      maxFiles = 10,
      maxSize = DEFAULT_MAX_SIZE,
      className,
      disabled = false,
      placeholder = 'Kéo thả file vào đây hoặc click để chọn file',
      value,
      onChange,
      showPreview = true,
      previewSize = 'md',
      square = false,
      error,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy
    },
    ref
  ) => {
    const [uploadErrors, setUploadErrors] = useState<string[]>([])

    const uploadMutation = useUploadFilesMutation()
    const isImageFile = useCallback((file: FileType | File): boolean => {
      const mimeType = 'mimeType' in file ? file.mimeType : file.type
      return mimeType.startsWith('image/')
    }, [])

    const files = useMemo(() => {
      if (!value) return []
      return Array.isArray(value) ? value : [value]
    }, [value])

    const localFiles = useMemo(() => {
      return files.map((file) => ({
        ...file,
        id: file.fileName,
        name: file.originalName,
        size: file.size,
        type: file.mimeType,
        preview: isImageFile(file) ? file.url : undefined
      }))
    }, [files, isImageFile])

    const acceptedFileTypes = useMemo(() => {
      return SUPPORTED_FILE_TYPES[fileType]
    }, [fileType])

    const validateFile = useCallback(
      (file: File): string[] => {
        const errors: string[] = []

        if (file.size > maxSize) {
          errors.push(`File "${file.name}" quá lớn. Tối đa ${formatFileSize(maxSize)}`)
        }

        const fileExtension = '.' + file.name.toLowerCase().split('.').pop()
        const isValidExtension = acceptedFileTypes.includes(fileExtension)

        if (!isValidExtension) {
          errors.push(`File "${file.name}" không đúng định dạng. Chấp nhận: ${acceptedFileTypes.join(', ')}`)
        }

        return errors
      },
      [maxSize, acceptedFileTypes]
    )

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (file: any) => {
      if (isImageFile(file)) {
        return <Image className='w-4 h-4 text-blue-500' />
      }
      return <FileText className='w-4 h-4 text-green-500' />
    }

    const getFileTypeLabel = (file: any): string => {
      if (isImageFile(file)) return 'Hình ảnh'

      const ext = file.name?.toLowerCase().split('.').pop() || file.originalName?.toLowerCase().split('.').pop()
      switch (ext) {
        case 'pdf':
          return 'PDF'
        case 'doc':
        case 'docx':
          return 'Word'
        case 'xls':
        case 'xlsx':
          return 'Excel'
        case 'ppt':
        case 'pptx':
          return 'PowerPoint'
        default:
          return 'Tài liệu'
      }
    }

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        setUploadErrors([])

        const errors: string[] = []
        const validFiles: File[] = []

        acceptedFiles.forEach((file) => {
          const fileErrors = validateFile(file)
          if (fileErrors.length > 0) {
            errors.push(...fileErrors)
          } else {
            validFiles.push(file)
          }
        })

        if (errors.length > 0) {
          setUploadErrors(errors)
          return
        }

        const currentFiles = files
        if (!multiple && validFiles.length > 1) {
          validFiles.splice(1)
        } else if (multiple) {
          const totalFiles = currentFiles.length + validFiles.length
          if (totalFiles > maxFiles) {
            setUploadErrors([`Tối đa ${maxFiles} file`])
            return
          }
        }

        try {
          const uploadResponse = await uploadMutation.mutateAsync(validFiles)

          const uploadedFiles: FileType[] = uploadResponse.files

          if (!multiple) {
            onChange?.(uploadedFiles[0])
          } else {
            const newFiles = [...currentFiles, ...uploadedFiles]
            onChange?.(newFiles)
          }
        } catch (error: any) {
          console.error('Upload failed:', error)
          setUploadErrors(['Tải lên thất bại. Vui lòng thử lại.', error.message || ''])
        }
      },
      [files, multiple, maxFiles, validateFile, onChange, uploadMutation, setUploadErrors]
    )

    const removeFile = useCallback(
      (fileToRemove: FileType) => {
        const newFiles = files.filter((file) => file.fileName !== fileToRemove.fileName)
        const resultValue = multiple ? newFiles : newFiles.length > 0 ? newFiles[0] : undefined
        onChange?.(resultValue)
      },
      [files, multiple, onChange]
    )

    const isUploading = uploadMutation.isPending
    const isDisabled = disabled || isUploading

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: Object.entries(MIME_TYPE_MAP).reduce((acc, [mimeType, extensions]) => {
        const validExtensions = extensions.filter((ext) => acceptedFileTypes.includes(ext))
        if (validExtensions.length > 0) {
          acc[mimeType] = validExtensions
        }
        return acc
      }, {} as Record<string, string[]>),
      maxSize,
      multiple,
      disabled: isDisabled
    })

    const previewSizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-24 h-24',
      lg: 'w-32 h-32'
    }

    const renderSingleFilePreview = (file: FileType) => (
      <div className='flex flex-col items-center justify-center p-4 text-center relative'>
        <div className='relative mb-4'>
          {showPreview && file.url && isImageFile(file) ? (
            <div
              className={cn('max-w-72 rounded-lg overflow-hidden bg-muted border', square ? 'aspect-square' : 'h-32')}
            >
              <img
                src={`${envConfig.VITE_IMAGE_URL}${file.url}`}
                alt={file.originalName}
                className='w-full h-full object-cover'
              />
            </div>
          ) : (
            <div className='w-32 h-32 rounded-lg bg-muted flex items-center justify-center border'>
              <div className='text-center'>
                {getFileIcon(file)}
                <div className='mt-2 text-xs text-muted-foreground'>{getFileTypeLabel(file)}</div>
              </div>
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='destructive'
                size='sm'
                type='button'
                className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0'
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(file)
                }}
                disabled={isDisabled}
              >
                <X className='w-3 h-3' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xóa file</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className='space-y-1'>
          <p className='text-sm font-medium line-clamp-1 max-w-full overflow-hidden'>{file.originalName}</p>
          <p className='text-xs text-muted-foreground flex items-center gap-2 justify-center'>
            <Badge variant='secondary' className='text-xs'>
              {getFileTypeLabel(file)}
            </Badge>
            {formatFileSize(file.size)}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' type='button' size='sm' className='mt-4' disabled={isDisabled}>
            {isUploading ? 'Đang tải lên...' : 'Thay đổi file'}
          </Button>

          {file.url && (
            <Button
              variant='ghost'
              size='sm'
              type='button'
              className='mt-2'
              onClick={(e) => {
                e.stopPropagation()
                window.open(`${envConfig.VITE_IMAGE_URL}${file.url}`, '_blank')
              }}
              disabled={isDisabled}
            >
              <Eye className='w-4 h-4 mr-2' />
              Xem file
            </Button>
          )}
        </div>
      </div>
    )

    return (
      <TooltipProvider>
        <div ref={ref} className={cn('space-y-4', className)}>
          <Card
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed cursor-pointer transition-all duration-200 py-4',
              'hover:border-primary/50 hover:bg-muted/50',
              isDragActive && 'border-primary bg-primary/5 scale-[1.02]',
              isDisabled && 'opacity-50 cursor-not-allowed',
              error && 'border-destructive',
              !multiple && files.length > 0 && 'border-solid border-primary/20 bg-primary/5'
            )}
            role='button'
            aria-label={ariaLabel || `Upload ${fileType} files`}
            aria-describedby={ariaDescribedBy}
          >
            <input {...getInputProps()} />

            {!multiple && files.length > 0 ? (
              renderSingleFilePreview(files[0])
            ) : (
              <div className='flex flex-col items-center justify-center p-4 text-center'>
                <Upload
                  className={cn(
                    'w-12 h-12 mb-4 transition-colors',
                    isDragActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <p className='text-lg font-medium mb-2'>{isDragActive ? 'Thả file vào đây' : placeholder}</p>
                <div className='text-sm text-muted-foreground mb-4 space-y-1'>
                  <p>
                    {fileType === 'image' && 'Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF, WEBP, BMP, TIFF)'}
                    {fileType === 'document' && 'Chỉ chấp nhận file tài liệu (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)'}
                    {fileType === 'mixed' && 'Chấp nhận file hình ảnh và tài liệu'}
                  </p>
                  <p>
                    {multiple ? `Tối đa ${maxFiles} file` : 'Chỉ 1 file'} • Tối đa {formatFileSize(maxSize)}
                  </p>
                  <p className='text-xs'>Định dạng hỗ trợ: {acceptedFileTypes.join(', ')}</p>
                </div>
                <Button variant='outline' type='button' disabled={isDisabled} className='relative'>
                  {isUploading ? 'Đang tải lên...' : 'Chọn File'}
                </Button>
              </div>
            )}
          </Card>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadErrors.length > 0 && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                <div className='space-y-1'>
                  {uploadErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {multiple && localFiles.length > 0 && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-medium'>Files đã chọn ({localFiles.length})</h4>
                {localFiles.length > 1 && (
                  <Button
                    variant='outline'
                    type='button'
                    size='sm'
                    onClick={() => onChange?.(undefined)}
                    disabled={isDisabled}
                  >
                    <Trash2 className='w-4 h-4 mr-2' />
                    Xóa tất cả
                  </Button>
                )}
              </div>

              <div className='grid gap-3'>
                {files.map((file) => (
                  <Card key={file.fileName} className='p-4 transition-all'>
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 relative'>
                        {showPreview && file.url && isImageFile(file) ? (
                          <div
                            className={cn(
                              'rounded-lg overflow-hidden bg-muted border',
                              previewSizeClasses[previewSize]
                            )}
                          >
                            <img
                              src={`${envConfig.VITE_IMAGE_URL}${file.url}`}
                              alt={file.originalName}
                              className='w-full h-full object-cover'
                            />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              'rounded-lg bg-muted flex items-center justify-center border',
                              previewSizeClasses[previewSize]
                            )}
                          >
                            {getFileIcon(file)}
                          </div>
                        )}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='min-w-0 flex-1 space-y-1'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className='text-sm font-medium truncate cursor-default'>{file.originalName}</p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{file.originalName}</p>
                              </TooltipContent>
                            </Tooltip>

                            <p className='text-xs text-muted-foreground'>
                              {formatFileSize(file.size)} • {file.mimeType}
                            </p>

                            <div className='flex items-center gap-2 flex-wrap'>
                              <Badge variant='secondary' className='text-xs'>
                                {getFileTypeLabel(file)}
                              </Badge>
                            </div>
                          </div>

                          <div className='flex items-center gap-1'>
                            {file.url && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    type='button'
                                    onClick={() => window.open(`${envConfig.VITE_IMAGE_URL}${file.url}`, '_blank')}
                                    disabled={isDisabled}
                                  >
                                    <Eye className='w-4 h-4' />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xem file</p>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  type='button'
                                  onClick={() => removeFile(file)}
                                  disabled={isDisabled}
                                >
                                  <X className='w-4 h-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Xóa file</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    )
  }
)

UploadFiles.displayName = 'UploadFiles'

export default UploadFiles
