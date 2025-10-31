import { ComboboxAcademicYear } from '@/features/academic-years/components'
import { ComboboxCourse } from '@/features/courses/components'
import { Button } from '@/shared/components/ui/button'
import {
  DateField,
  DateFieldDays,
  DateFieldMonths,
  DateFieldSeparator,
  DateFieldYears
} from '@/shared/components/ui/date-field'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { KyHoc } from '@/shared/lib/enum'
import { cn } from '@/shared/lib/utils'
import { UpdateStandardSchema } from '@/shared/validations/StandardSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface StandardFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  initialData?: any
}

export const StandardForm = ({ onSubmit, isLoading, initialData }: StandardFormProps) => {
  const [standardHours, setStandardHours] = useState(parseFloat(initialData?.standardHours || '0'))
  const [crowdClassCoefficient, setCrowdClassCoefficient] = useState(
    parseFloat(initialData?.crowdClassCoefficient || '1')
  )

  const form = useForm({
    resolver: zodResolver(UpdateStandardSchema),
    defaultValues: {
      className: initialData?.className || '',
      semester: initialData?.semester || '',
      classType: initialData?.classType || null,
      studentCount: initialData?.studentCount || 0,
      theoryHours: initialData?.theoryHours || 0,
      actualHours: initialData?.actualHours || 0,
      overtimeCoefficient: initialData?.overtimeCoefficient || '1',
      crowdClassCoefficient: initialData?.crowdClassCoefficient || '1',
      standardHours: initialData?.standardHours || '0',
      startDate: initialData?.startDate || null,
      endDate: initialData?.endDate || null,
      lecturerName: initialData?.lecturerName || '',
      courseId: initialData?.course?.id || null,
      academicYearId: initialData?.academicYear?.id || ''
    }
  })

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        crowdClassCoefficient: crowdClassCoefficient.toString(),
        standardHours: standardHours.toString()
      }
      onSubmit(payload)
    } catch (error) {
      toast.error('Lỗi khi cập nhật quy chuẩn')
    }
  }

  useEffect(() => {
    const actualHours = form.watch('actualHours') || 0
    const overtimeCoefficient = parseFloat(form.watch('overtimeCoefficient') || '1')
    const calculated = parseFloat((actualHours * overtimeCoefficient * crowdClassCoefficient).toFixed(2))
    setStandardHours(calculated)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crowdClassCoefficient, form.watch('actualHours'), form.watch('overtimeCoefficient')])

  const handleChangeStudentCount = (studentCount: number) => {
    let coefficient = 1
    switch (true) {
      case studentCount >= 101:
        coefficient = 1.5
        break
      case studentCount >= 81:
        coefficient = 1.4
        break
      case studentCount >= 66:
        coefficient = 1.3
        break
      case studentCount >= 51:
        coefficient = 1.2
        break
      case studentCount >= 41:
        coefficient = 1.1
        break
    }
    setCrowdClassCoefficient(coefficient)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='className'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên lớp học phần</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập tên lớp học phần' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='semester'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kỳ học</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Chọn kỳ học' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(KyHoc).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='classType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình thức học</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập hình thức học' {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lecturerName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên giảng viên</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập tên giảng viên' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='studentCount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng sinh viên</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Nhập số lượng sinh viên'
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value) || 0)
                      handleChangeStudentCount(parseInt(e.target.value) || 0)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='theoryHours'
            render={({ field }) => (
              <FormItem>
                <FormLabel>LL</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={0}
                    step={1}
                    placeholder='Nhập LL'
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-2'>
            <Label>HS lớp đông</Label>
            <Input type='number' disabled defaultValue={crowdClassCoefficient} value={crowdClassCoefficient} />
          </div>

          <FormField
            control={form.control}
            name='actualHours'
            render={({ field }) => (
              <FormItem>
                <FormLabel>LL thực</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={0}
                    step={1}
                    placeholder='Nhập LL thực'
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='overtimeCoefficient'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hệ số ngoài giờ</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    step={0.1}
                    placeholder='Nhập hệ số ngoài giờ'
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-2'>
            <Label>QC</Label>
            <Input type='number' disabled defaultValue={standardHours} value={standardHours} />
          </div>

          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <DateField
                    value={field.value ? new Date(field.value as string) : null}
                    onValueChange={(value) => field.onChange(value ? value.toISOString() : null)}
                  >
                    <DateFieldDays placeholder='dd' />
                    <DateFieldSeparator />
                    <DateFieldMonths placeholder='mm' />
                    <DateFieldSeparator />
                    <DateFieldYears placeholder='yyyy' />
                  </DateField>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <DateField
                    value={field.value ? new Date(field.value as string) : null}
                    onValueChange={(value) => field.onChange(value ? value.toISOString() : null)}
                  >
                    <DateFieldDays placeholder='dd' />
                    <DateFieldSeparator />
                    <DateFieldMonths placeholder='mm' />
                    <DateFieldSeparator />
                    <DateFieldYears placeholder='yyyy' />
                  </DateField>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='courseId'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Học phần</FormLabel>
                <FormControl>
                  <ComboboxCourse value={form.watch('courseId') || ''} onValueChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='academicYearId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm học</FormLabel>
                <FormControl>
                  <ComboboxAcademicYear value={form.watch('academicYearId')} onValueChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className={cn('cursor-pointer', isLoading && 'cursor-not-allowed')} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Cập nhật quy chuẩn'}
        </Button>
      </form>
    </Form>
  )
}

