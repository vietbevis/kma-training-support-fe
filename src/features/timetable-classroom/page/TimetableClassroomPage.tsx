import { ComboboxBuilding } from '@/features/buildings/components'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  DateField,
  DateFieldDays,
  DateFieldMonths,
  DateFieldSeparator,
  DateFieldYears
} from '@/shared/components/ui/date-field'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGetClassroomAvailabilityQuery, useGetClassroomTimeslotsQuery } from '../api/TimetableClassroomService'
import { ClassroomAvailabilityDisplay } from '../components'

interface FilterFormValues {
  buildingId: string
  date: Date
  timeSlot: string
}

const TimetableClassroomPage = () => {
  const [filter, setFilter] = useState<{
    buildingId: string
    date: string
    timeSlot?: string
  } | null>(null)

  const { data: timeslots } = useGetClassroomTimeslotsQuery()
  const {
    data: availabilityData,
    isLoading: isLoadingAvailability,
    isError
  } = useGetClassroomAvailabilityQuery({
    buildingId: filter?.buildingId || '',
    date: filter?.date || '',
    timeSlot: filter?.timeSlot
  })

  const form = useForm<FilterFormValues>({
    mode: 'onChange',
    defaultValues: {
      buildingId: '',
      date: new Date(),
      timeSlot: ''
    }
  })

  const handleSubmit = (values: FilterFormValues) => {
    const formattedDate = values.date.toISOString().split('T')[0]
    setFilter({
      buildingId: values.buildingId,
      date: formattedDate,
      timeSlot: values.timeSlot || undefined
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Kiểm tra tình trạng phòng học</h1>
        <p className='text-gray-500'>Xem tình trạng và lịch sử dụng phòng học theo tòa nhà, ngày và ca học</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm phòng học</CardTitle>
          <CardDescription>Chọn tòa nhà, ngày và ca học để xem tình trạng phòng học</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
              <div className='flex flex-wrap gap-6'>
                <FormField
                  control={form.control}
                  name='buildingId'
                  render={({ field }) => (
                    <FormItem className='flex-1 max-w-md'>
                      <FormLabel>Tòa nhà</FormLabel>
                      <FormControl>
                        <ComboboxBuilding value={field.value} onValueChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem className='flex-1 max-w-md'>
                      <FormLabel>Ngày</FormLabel>
                      <FormControl>
                        <DateField value={field.value ? new Date(field.value) : null} onValueChange={field.onChange}>
                          <DateFieldDays placeholder='dd' />
                          <DateFieldSeparator />
                          <DateFieldMonths placeholder='mm' />
                          <DateFieldSeparator />
                          <DateFieldYears placeholder='yyyy' />
                        </DateField>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='timeSlot'
                  render={({ field }) => (
                    <FormItem className='flex-1 max-w-sm'>
                      <FormLabel>Ca học</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn ca học' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(timeslots?.data || [])?.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              Tiết {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end self-end'>
                  <Button type='submit' disabled={!form.formState.isValid}>
                    Tìm kiếm
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {filter && (
        <ClassroomAvailabilityDisplay
          data={availabilityData?.data}
          isLoading={isLoadingAvailability}
          date={filter.date}
          timeSlot={filter.timeSlot}
        />
      )}

      {isError && (
        <div className='rounded-md bg-destructive/15 p-4'>
          <div className='text-destructive font-medium'>Đã có lỗi xảy ra khi tải dữ liệu</div>
          <div className='text-destructive/80 text-sm mt-1'>Vui lòng kiểm tra thông tin đã nhập và thử lại</div>
        </div>
      )}
    </div>
  )
}

export default TimetableClassroomPage
