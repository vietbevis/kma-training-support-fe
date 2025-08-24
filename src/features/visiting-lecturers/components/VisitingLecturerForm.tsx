import { ComboboxAcademicCredential } from '@/features/academic-credentails'
import { ComboboxExemptionPercentage } from '@/features/exemption-percentages'
import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { ComboboxSubjects } from '@/features/subjects'
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
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Separator } from '@/shared/components/ui/separator'
import { Switch } from '@/shared/components/ui/switch'
import { Gender } from '@/shared/lib/enum'
import { cn } from '@/shared/lib/utils'
import UploadFiles from '@/shared/upload-files/UploadFiles'
import {
  CreateVisitingLecturerSchema,
  type CreateVisitingLecturer,
  type UpdateVisitingLecturer,
  type VisitingLecturer
} from '@/shared/validations/VisitingLecturerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface VisitingLecturerFormProps {
  visitingLecturer?: VisitingLecturer
  onSubmit: (data: CreateVisitingLecturer | UpdateVisitingLecturer) => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export const VisitingLecturerForm = ({ visitingLecturer, onSubmit, isLoading, mode }: VisitingLecturerFormProps) => {
  const form = useForm<CreateVisitingLecturer>({
    resolver: zodResolver(CreateVisitingLecturerSchema) as any,
    defaultValues: {
      code: visitingLecturer?.code || undefined,
      fullName: visitingLecturer?.fullName || undefined,
      position: visitingLecturer?.position || undefined,
      gender: visitingLecturer?.gender || Gender.OTHER,
      phone: visitingLecturer?.phone || undefined,
      email: visitingLecturer?.email || undefined,
      citizenId: visitingLecturer?.citizenId || undefined,
      citizenIdFront: visitingLecturer?.citizenIdFront || undefined,
      citizenIdBack: visitingLecturer?.citizenIdBack || undefined,
      citizenIdIssuePlace: visitingLecturer?.citizenIdIssuePlace || undefined,
      highestDegree: visitingLecturer?.highestDegree || undefined,
      qrCode: visitingLecturer?.qrCode || undefined,
      citizenIdAddress: visitingLecturer?.citizenIdAddress || undefined,
      currentAddress: visitingLecturer?.currentAddress || undefined,
      workPlace: visitingLecturer?.workPlace || undefined,
      taxCode: visitingLecturer?.taxCode || undefined,
      bankAccount: visitingLecturer?.bankAccount || undefined,
      bankName: visitingLecturer?.bankName || undefined,
      bankBranch: visitingLecturer?.bankBranch || undefined,
      salaryCoefficient: visitingLecturer?.salaryCoefficient || 0,
      salary: visitingLecturer?.salary || 0,
      profileFile: visitingLecturer?.profileFile || undefined,
      areTeaching: visitingLecturer?.areTeaching || false,
      facultyDepartmentId: visitingLecturer?.facultyDepartment?.id || undefined,
      academicCredentialId: visitingLecturer?.academicCredential?.id || undefined,
      exemptionPercentageId: visitingLecturer?.exemptionPercentage?.id || undefined,
      subjectId: visitingLecturer?.subject?.id || undefined,
      dateOfBirth: visitingLecturer?.dateOfBirth || undefined,
      citizenIdIssueDate: visitingLecturer?.citizenIdIssueDate || undefined
    }
  })

  const handleSubmit = (data: CreateVisitingLecturer) => {
    onSubmit(data)
  }

  return (
    <Card className='py-0'>
      <CardHeader className='sr-only'>
        <CardTitle className='flex items-center gap-2 text-2xl'>
          {mode === 'create' ? 'Thêm giảng viên mời mới' : 'Chỉnh sửa giảng viên mời'}
        </CardTitle>
        <CardDescription className='text-base'>
          {mode === 'create'
            ? 'Điền đầy đủ thông tin để tạo hồ sơ giảng viên mời mới trong hệ thống'
            : 'Cập nhật thông tin chi tiết của giảng viên mời'}
        </CardDescription>
      </CardHeader>

      <CardContent className='p-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
            {/* Row 1: Thông tin cơ bản và Thông tin liên hệ */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
              {/* Cột trái: Thông tin cơ bản */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin cơ bản</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <div className='space-y-4'>
                        <FormField
                          control={form.control}
                          name='fullName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm font-medium'>Họ và tên *</FormLabel>
                              <FormControl>
                                <Input placeholder='Nhập họ và tên đầy đủ' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='academicCredentialId'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm font-medium'>Học hàm/học vị *</FormLabel>
                              <FormControl>
                                <ComboboxAcademicCredential
                                  value={form.watch('academicCredentialId')}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='gender'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm font-medium'>Giới tính</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Chọn giới tính' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={Gender.MALE}>Nam</SelectItem>
                                  <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                                  <SelectItem value={Gender.OTHER}>Khác</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='dateOfBirth'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm font-medium'>Ngày sinh</FormLabel>
                              <DateField
                                value={field.value ? new Date(field.value) : undefined}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <DateFieldDays />
                                </FormControl>
                                <DateFieldSeparator />
                                <DateFieldMonths />
                                <DateFieldSeparator />
                                <DateFieldYears />
                              </DateField>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name='highestDegree'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Bằng cấp cao nhất</FormLabel>
                            <FormControl>
                              <UploadFiles
                                value={field.value || undefined}
                                onChange={(value) => (value ? field.onChange(value) : field.onChange(null))}
                                fileType='image'
                                multiple={false}
                                showPreview={true}
                                placeholder='Chọn ảnh bằng cấp cao nhất'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải: Thông tin liên hệ */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin liên hệ</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Email</FormLabel>
                            <FormControl>
                              <Input type='email' placeholder='example@email.com' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input placeholder='0987654321' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='currentAddress'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm font-medium'>Địa chỉ hiện tại</FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập địa chỉ hiện tại' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className='my-8' />

            {/* Row 2: Thông tin CCCD và Công việc */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
              {/* Cột trái: Thông tin CCCD */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin căn cước công dân</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='citizenId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Số CCCD</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập số căn cước công dân' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='citizenIdAddress'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Địa chỉ trên CCCD</FormLabel>
                            <FormControl>
                              <Input placeholder='Địa chỉ ghi trên căn cước công dân' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='citizenIdIssueDate'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='text-sm font-medium'>Ngày cấp</FormLabel>
                            <DateField
                              value={field.value ? new Date(field.value) : undefined}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <DateFieldDays />
                              </FormControl>
                              <DateFieldSeparator />
                              <DateFieldMonths />
                              <DateFieldSeparator />
                              <DateFieldYears />
                            </DateField>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='citizenIdIssuePlace'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Nơi cấp</FormLabel>
                            <FormControl>
                              <Input placeholder='CA Hà Nội' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='citizenIdFront'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Ảnh CCCD trước</FormLabel>
                            <FormControl>
                              <UploadFiles
                                value={field.value || undefined}
                                onChange={(value) => (value ? field.onChange(value) : field.onChange(null))}
                                fileType='image'
                                multiple={false}
                                showPreview={true}
                                placeholder='Chọn ảnh CCCD mặt trước'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='citizenIdBack'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Ảnh CCCD sau</FormLabel>
                            <FormControl>
                              <UploadFiles
                                value={field.value || undefined}
                                onChange={(value) => (value ? field.onChange(value) : field.onChange(null))}
                                fileType='image'
                                multiple={false}
                                showPreview={true}
                                placeholder='Chọn ảnh CCCD mặt sau'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải: Thông tin công việc */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin công việc</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='facultyDepartmentId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Khoa/Phòng ban *</FormLabel>
                            <FormControl>
                              <ComboboxFacultyDepartment
                                value={form.watch('facultyDepartmentId')}
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  form.setValue('subjectId', undefined)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='subjectId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Bộ môn</FormLabel>
                            <FormControl>
                              <ComboboxSubjects
                                value={form.watch('subjectId')}
                                onValueChange={field.onChange}
                                disabled={form.watch('facultyDepartmentId') === ''}
                                facultyDepartmentId={form.watch('facultyDepartmentId')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='position'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Chức vụ</FormLabel>
                            <FormControl>
                              <Input placeholder='Chức vụ' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='workPlace'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Nơi công tác</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập nơi công tác hiện tại' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='areTeaching'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex items-center justify-between px-4 py-3 border rounded-lg bg-muted/30'>
                            <FormLabel className='text-sm font-medium flex items-start gap-0.5 flex-col'>
                              Trạng thái giảng dạy
                              <p className='text-xs text-muted-foreground font-normal'>
                                {field.value
                                  ? 'Giảng viên mời này đang giảng dạy'
                                  : 'Giảng viên mời này đã ngừng giảng dạy'}
                              </p>
                            </FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin mã giảng viên</h3>
                  </div>

                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='code'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm font-medium'>Mã giảng viên mời *</FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập mã giảng viên mời' {...field} disabled={mode === 'edit'} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className='my-8' />

            {/* Row 3: Thông tin tài chính và File đính kèm */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
              {/* Cột trái: Thông tin tài chính */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin tài chính</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='taxCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Mã số thuế</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập mã số thuế cá nhân' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='exemptionPercentageId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Phần trăm miễn giảm *</FormLabel>
                            <FormControl>
                              <ComboboxExemptionPercentage
                                value={form.watch('exemptionPercentageId')}
                                onValueChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='salaryCoefficient'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Hệ số lương</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                step='0.1'
                                placeholder='2.34'
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='salary'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Mức lương</FormLabel>
                            <FormControl>
                              <Input placeholder='15,000,000' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4 items-start'>
                      <FormField
                        control={form.control}
                        name='bankAccount'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Số tài khoản ngân hàng</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập số tài khoản' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='bankName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Tên ngân hàng</FormLabel>
                            <FormControl>
                              <Input placeholder='Vietcombank' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='bankBranch'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm font-medium'>Chi nhánh</FormLabel>
                          <FormControl>
                            <Input placeholder='Hà Nội' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Cột phải: File đính kèm */}
              <div className='grid grid-cols-2 gap-4 items-start'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>File QR code</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name='qrCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <UploadFiles
                            value={field.value || undefined}
                            onChange={(value) => (value ? field.onChange(value) : field.onChange(null))}
                            fileType='image'
                            multiple={false}
                            showPreview={true}
                            placeholder='Chọn file QR code'
                            square={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>File bổ sung</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name='profileFile'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <UploadFiles
                            value={field.value || undefined}
                            onChange={(value) => (value ? field.onChange(value) : field.onChange(null))}
                            fileType='document'
                            multiple={false}
                            showPreview={false}
                            placeholder='Chọn file lý lịch cá nhân'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator className='my-8' />

            {/* Submit Button */}
            <div
              className={cn(
                'flex justify-end',
                form.formState.isDirty && 'sticky bottom-0 bg-background border rounded-lg border-input p-4'
              )}
            >
              <Button
                type='submit'
                disabled={isLoading || !form.formState.isDirty}
                className={cn('cursor-pointer', !form.formState.isDirty && 'pointer-events-none')}
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Đang xử lý...
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    {mode === 'create' ? 'Thêm giảng viên mời' : 'Cập nhật thông tin'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
