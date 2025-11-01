import { z } from 'zod'

export const StandardLectureHoursSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lectureHours: z.string(),
  excessHours: z.string(),
  researchHours: z.string()
})

export const UpdateStandardLectureHoursSchema = z.object({
  lectureHours: z.coerce
    .number({
      error: 'Số tiết giảng dạy là bắt buộc',
      message: 'Số tiết giảng dạy phải là số'
    })
    .int({ message: 'Số tiết giảng dạy phải là số nguyên' })
    .positive({ message: 'Số tiết giảng dạy phải lớn hơn 0' }),
  excessHours: z.coerce
    .number({
      error: 'Số tiết vượt giờ là bắt buộc',
      message: 'Số tiết vượt giờ phải là số'
    })
    .int({ message: 'Số tiết vượt giờ phải là số nguyên' })
    .nonnegative({ message: 'Số tiết vượt giờ phải lớn hơn hoặc bằng 0' }),
  researchHours: z.coerce
    .number({
      error: 'Số tiết NCKH là bắt buộc',
      message: 'Số tiết NCKH phải là số'
    })
    .int({ message: 'Số tiết NCKH phải là số nguyên' })
    .nonnegative({ message: 'Số tiết NCKH phải lớn hơn hoặc bằng 0' })
})

export type StandardLectureHoursDto = z.infer<typeof StandardLectureHoursSchema>
export type UpdateStandardLectureHoursDto = z.infer<typeof UpdateStandardLectureHoursSchema>
