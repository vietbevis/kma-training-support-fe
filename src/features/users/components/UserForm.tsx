import { ComboboxAcademicCredential } from '@/features/academic-credentails'
import { ComboboxExemptionPercentage } from '@/features/exemption-percentages'
import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { ComboboxSubjects } from '@/features/subjects'
import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Separator } from '@/shared/components/ui/separator'
import { Switch } from '@/shared/components/ui/switch'
import { FileTypeGroups, Gender } from '@/shared/lib/enum'
import { cn } from '@/shared/lib/utils'
import { CreateUserSchema, type CreateUser, type UpdateUser, type User } from '@/shared/validations/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { FileUpload } from './FileUpload'

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
      fullName: user?.fullName || '',
      gender: user?.gender || Gender.OTHER,
      phone: user?.phone || '',
      email: user?.email || '',
      citizenId: user?.citizenId || '',
      citizenIdFront: user?.citizenIdFront || '',
      citizenIdBack: user?.citizenIdBack || '',
      citizenIdIssuePlace: user?.citizenIdIssuePlace || '',
      citizenIdAddress: user?.citizenIdAddress || '',
      currentAddress: user?.currentAddress || '',
      workplace: user?.workplace || '',
      taxCode: user?.taxCode || '',
      bankAccount: user?.bankAccount || '',
      bankName: user?.bankName || '',
      bankBranch: user?.bankBranch || '',
      salaryCoefficient: user?.salaryCoefficient || 0,
      salary: user?.salary || 0,
      profileFile: user?.profileFile || '',
      areTeaching: user?.areTeaching || false,
      facultyDepartmentId: user?.facultyDepartment?.id || '',
      academicCredentialId: user?.academicCredential?.id || '',
      exemptionPercentageId: user?.exemptionPercentage?.id || '',
      subjectId: user?.subject?.id || '',
      dateOfBirth: user?.dateOfBirth || '',
      citizenIdIssueDate: user?.citizenIdIssueDate || '',
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
          {mode === 'create' ? '👤 Thêm nhân viên mới' : '✏️ Chỉnh sửa nhân viên'}
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
                          <FormItem className='flex flex-col'>
                            <FormLabel className='text-sm font-medium'>Ngày sinh</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày sinh</span>}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0' align='start'>
                                <Calendar
                                  mode='single'
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                  captionLayout='dropdown'
                                  locale={vi}
                                />
                              </PopoverContent>
                            </Popover>
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
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày cấp</span>}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0' align='start'>
                                <Calendar
                                  mode='single'
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                  captionLayout='dropdown'
                                  locale={vi}
                                />
                              </PopoverContent>
                            </Popover>
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
                                onValueChange={field.onChange}
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
                        name='workplace'
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
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            label='File lý lịch cá nhân'
                            description='Tải lên file lý lịch cá nhân'
                            acceptedFileTypes={FileTypeGroups.PROFILE_FILES}
                            maxFiles={1}
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
            <div className='flex justify-end'>
              <Button type='submit' disabled={isLoading}>
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
