import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import API_ROUTES from '../lib/api-routes'

export interface FileResponseType {
  originalName: string
  fileName: string
  url: string
  size: number
  mimeType: string
  fileType: string
  uploadedAt: string
}

export interface UploadFilesResponse {
  files: FileResponseType[]
  totalFiles: number
  totalSize: number
}

export const useUploadFilesMutation = (endpoint?: string, headers?: Record<string, string>) => {
  return useMutation({
    mutationFn: async (files: File[]): Promise<UploadFilesResponse> => {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))

      const response = await api.post<UploadFilesResponse>(endpoint || API_ROUTES.UPLOAD_FILES, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        }
      })
      return response.data
    }
  })
}
