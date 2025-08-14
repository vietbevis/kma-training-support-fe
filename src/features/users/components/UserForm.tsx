import { ComboboxAcademicCredential } from '@/features/academic-credentails'
import { ComboboxExemptionPercentage } from '@/features/exemption-percentages'
import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { ComboboxRole } from '@/features/roles'
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
import { PasswordInput, PasswordInputAdornmentToggle, PasswordInputInput } from '@/shared/components/ui/password-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Separator } from '@/shared/components/ui/separator'
import { Switch } from '@/shared/components/ui/switch'
import { Gender } from '@/shared/lib/enum'
import { cn } from '@/shared/lib/utils'
import UploadFiles from '@/shared/upload-files/UploadFiles'
import { CreateUserSchema, type CreateUser, type UpdateUser, type User } from '@/shared/validations/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface UserFormProps {
  user?: User
  onSubmit: (data: CreateUser | UpdateUser) => void
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export const UserForm = ({ user, onSubmit, isLoading, mode }: UserFormProps) => {
  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema) as any,
    defaultValues: {
      code: user?.code || undefined,
      fullName: user?.fullName || undefined,
      username: mode === 'edit' ? user?.username || undefined : undefined,
      password: mode === 'edit' ? undefined : '1',
      position: user?.position || undefined,
      gender: user?.gender || Gender.OTHER,
      phone: user?.phone || undefined,
      email: user?.email || undefined,
      citizenId: user?.citizenId || undefined,
      citizenIdFront: user?.citizenIdFront || undefined,
      citizenIdBack: user?.citizenIdBack || undefined,
      citizenIdIssuePlace: user?.citizenIdIssuePlace || undefined,
      citizenIdAddress: user?.citizenIdAddress || undefined,
      currentAddress: user?.currentAddress || undefined,
      workPlace: user?.workPlace || undefined,
      taxCode: user?.taxCode || undefined,
      bankAccount: user?.bankAccount || undefined,
      bankName: user?.bankName || undefined,
      bankBranch: user?.bankBranch || undefined,
      salaryCoefficient: user?.salaryCoefficient || 0,
      salary: user?.salary || 0,
      profileFile: user?.profileFile || undefined,
      areTeaching: user?.areTeaching || false,
      facultyDepartmentId: user?.facultyDepartment?.id || undefined,
      academicCredentialId: user?.academicCredential?.id || undefined,
      exemptionPercentageId: user?.exemptionPercentage?.id || undefined,
      subjectId: user?.subject?.id || undefined,
      dateOfBirth: user?.dateOfBirth || undefined,
      citizenIdIssueDate: user?.citizenIdIssueDate || undefined,
      roleIds: user?.roles?.map((role) => role.id) || []
    }
  })

  const handleSubmit = (data: CreateUser) => {
    onSubmit(data)
  }

  return (
    <Card className='py-0'>
      <CardHeader className='sr-only'>
        <CardTitle className='flex items-center gap-2 text-2xl'>
          {mode === 'create' ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên'}
        </CardTitle>
        <CardDescription className='text-base'>
          {mode === 'create'
            ? 'Điền đầy đủ thông tin để tạo tài khoản nhân viên mới trong hệ thống'
            : 'Cập nhật thông tin chi tiết của nhân viên'}
        </CardDescription>
      </CardHeader>

      <CardContent className='p-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
            {/* Row 1: Thông tin cơ bản và Thông tin liên hệ */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Cột trái: Thông tin cơ bản */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin cơ bản</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
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
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                    <div className='grid grid-cols-2 gap-4'>
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
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Cột trái: Thông tin CCCD */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin căn cước công dân</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
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
                    <div className='grid grid-cols-2 gap-4'>
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
                    <div className='grid grid-cols-2 gap-4'>
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
                    <div className='grid grid-cols-2 gap-4'>
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

                    <div className='grid grid-cols-2 gap-4'>
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
                                {field.value ? 'Nhân viên này đang giảng dạy' : 'Nhân viên này đã ngừng giảng dạy'}
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
                    <h3 className='text-lg font-semibold text-primary'>Thông tin tài khoản</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='code'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Mã nhân viên *</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập mã nhân viên' {...field} disabled={mode === 'edit'} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Username *</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập username' {...field} disabled={mode === 'edit'} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm font-medium'>Mật khẩu</FormLabel>
                            <PasswordInput>
                              <FormControl>
                                <PasswordInputInput
                                  autoComplete='new-password'
                                  placeholder='Nhập mật khẩu'
                                  {...field}
                                />
                              </FormControl>
                              <PasswordInputAdornmentToggle />
                            </PasswordInput>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='roleIds'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm font-medium'>Vai trò *</FormLabel>
                          <FormControl>
                            <ComboboxRole
                              values={form.watch('roleIds')}
                              onValuesChange={field.onChange}
                              multiple={true}
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

            <Separator className='my-8' />

            {/* Row 3: Thông tin tài chính và File đính kèm */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Cột trái: Thông tin tài chính */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>Thông tin tài chính</h3>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
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
                            <FormLabel className='text-sm font-medium'>Phần trăm miễn giảm</FormLabel>
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

                    <div className='grid grid-cols-2 gap-4'>
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

                    <div className='grid grid-cols-2 gap-4'>
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
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-semibold text-primary'>File lý lịch cá nhân</h3>
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
                    {mode === 'create' ? 'Thêm nhân viên' : 'Cập nhật thông tin'}
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
