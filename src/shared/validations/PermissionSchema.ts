import { z } from 'zod'
import { BaseEntityDTO } from './CommonSchema'

export const UpdatePermissionSchema = z.object({
  name: z.string().min(1, { message: 'Tên quyền là bắt buộc' }),
  description: z.string()
})

export type UpdatePermission = z.infer<typeof UpdatePermissionSchema>

export const PermissionSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string(),
  path: z.string(),
  method: z.string(),
  module: z.string()
})

export type PermissionType = z.infer<typeof PermissionSchema>
