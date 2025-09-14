import { BackupStatus, BackupType, FileType } from '@/shared/lib/enum'
import { z } from 'zod'

// ---------- CreateBackupDto ----------
export const CreateBackupSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any(), z.any()).optional()
})
export type CreateBackupDto = z.infer<typeof CreateBackupSchema>

// ---------- RestoreFromUploadDto ----------
export const RestoreFromUploadSchema = z.object({
  backupFile: z.instanceof(File).refine((file) => file.type === FileType.ZIP, {
    message: 'File phải có định dạng ZIP'
  })
})
export type RestoreFromUploadDto = z.infer<typeof RestoreFromUploadSchema>

// ---------- RestoreBackupDto ----------
export const RestoreBackupSchema = z.object({
  backupId: z.string(),
  restoreOptions: z
    .object({
      dropExisting: z.coerce.boolean().optional(),
      restoreFiles: z.coerce.boolean().optional()
    })
    .optional()
})
export type RestoreBackupDto = z.infer<typeof RestoreBackupSchema>

// ---------- QueryBackupDto ----------
export const QueryBackupSchema = z.object({
  status: z.enum(BackupStatus).optional(),
  type: z.enum(BackupType).optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).default(10).optional(),
  search: z.string().optional()
})
export type QueryBackupDto = z.infer<typeof QueryBackupSchema>

// ---------- BackupStatisticsDto ----------
export const BackupStatisticsResponseSchema = z.object({
  summary: z.object({
    totalBackups: z.number(),
    completedBackups: z.number(),
    failedBackups: z.number(),
    pendingBackups: z.number(),
    manualBackups: z.number(),
    scheduledBackups: z.number(),
    totalSize: z.number(),
    averageSize: z.number()
  }),
  latestBackup: z
    .object({
      id: z.string(),
      name: z.string(),
      completedAt: z.coerce.date(),
      fileSize: z.number()
    })
    .nullable()
})
export type BackupStatisticsResponseDto = z.infer<typeof BackupStatisticsResponseSchema>

// ---------- ForceCleanupResponseDto ----------
export const ForceCleanupResponseSchema = z.object({
  message: z.string(),
  deletedCount: z.number(),
  errors: z.array(z.string())
})
export type ForceCleanupResponseDto = z.infer<typeof ForceCleanupResponseSchema>
