import { z } from 'zod'
import { BaseEntityDTO, BaseResponseSchema, createPaginationQuerySchema, MetaPagination } from './CommonSchema'

export const CreateClassroomSchema = z
  .object({
    name: z.string().min(1, 'Tên phòng học không được để trống'),
    description: z.string().optional(),
    type: z.string().min(1, 'Loại phòng học không được để trống'),
    buildingId: z.string({ message: 'Phòng học phải thuộc 1 tòa nhà nào đó' }).min(1, 'Tòa nhà không hợp lệ')
  })
  .strict()
  .strip()

export const UpdateClassroomSchema = CreateClassroomSchema

export const ClassroomSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string().nullable().optional(),
  type: z.string(),
  building: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable().optional().default('')
    })
    .nullable()
    .default(null)
}).strip()

export const ClassroomResponseSchema = ClassroomSchema

export const PaginationClassroomSchema = createPaginationQuerySchema()

export const ClassroomQuerySchema = PaginationClassroomSchema.extend({
  name: z.string().optional(),
  buildingId: z.coerce.number().optional()
})

export const PaginatedClassroomsSchema = z
  .object({
    data: z.array(ClassroomSchema),
    meta: MetaPagination
  })
  .strip()

export const ClassroomsResponseSchema = z
  .object({
    data: z.array(ClassroomSchema),
    meta: MetaPagination
  })
  .strip()

export const DeleteClassroomSchema = BaseResponseSchema.extend({
  data: z.object({
    id: z.number().min(1, 'ID phòng học không hợp lệ')
  })
}).strip()

export type Classroom = z.infer<typeof ClassroomSchema>
export type Classrooms = z.infer<typeof PaginatedClassroomsSchema>
export type ClassroomResponse = z.infer<typeof ClassroomResponseSchema>
export type ClassroomsResponse = z.infer<typeof ClassroomsResponseSchema>
export type PaginationClassroom = z.infer<typeof PaginationClassroomSchema>
export type PaginatedClassrooms = z.infer<typeof PaginatedClassroomsSchema>
export type CreateClassroomSchemaType = z.infer<typeof CreateClassroomSchema>
export type UpdateClassroomSchemaType = z.infer<typeof UpdateClassroomSchema>
export type ClassroomQuery = z.infer<typeof ClassroomQuerySchema>
export type DeleteClassroom = z.infer<typeof DeleteClassroomSchema>
