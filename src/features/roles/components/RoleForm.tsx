import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { useGetModulePermissions } from '@/features/permissions/api/PermissionService'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Accordion } from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import type { PermissionType } from '@/shared/validations/PermissionSchema'
import {
  CreateRoleSchema,
  UpdateRoleSchema,
  type CreateRoleType,
  type RoleType,
  type UpdateRoleType
} from '@/shared/validations/RoleSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ModulePermissionItem from './ModulePermissionItem'

interface RoleFormProps {
  initialData?: RoleType
  initialPermissions?: PermissionType[]
  onSubmit: (data: CreateRoleType | UpdateRoleType) => void
  isLoading: boolean
  mode: 'create' | 'edit'
}

export const RoleForm = ({ initialData, initialPermissions = [], onSubmit, isLoading, mode }: RoleFormProps) => {
  const schema = mode === 'create' ? CreateRoleSchema : UpdateRoleSchema
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions.map((p) => p.id))
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  const { data: modulesData, isLoading: isLoadingModules } = useGetModulePermissions()
  const modules = modulesData?.data || []

  const form = useForm<CreateRoleType | UpdateRoleType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      scopeFacultyDepartmentId: initialData?.scopeFacultyDepartment?.id || undefined,
      permissionIds: selectedPermissions
    }
  })

  const handleSubmit = (data: CreateRoleType | UpdateRoleType) => {
    onSubmit({
      ...data,
      permissionIds: selectedPermissions
    })
  }

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) {
      form.setValue('permissionIds', selectedPermissions, { shouldDirty: true })
    } else {
      setIsInitialized(true)
    }
  }, [selectedPermissions, form, isInitialized])

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const newPermissions = checked ? [...prev, permissionId] : prev.filter((id) => id !== permissionId)
      return newPermissions
    })
  }

  const handleSelectAll = (permissions: PermissionType[], checked: boolean) => {
    const permissionIds = permissions.map((p) => p.id)
    if (checked) {
      setSelectedPermissions((prev) => [...new Set([...prev, ...permissionIds])])
    } else {
      setSelectedPermissions((prev) => prev.filter((id) => !permissionIds.includes(id)))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} id='role-form' className='space-y-3'>
        <div className='grid grid-cols-2 gap-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>Tên vai trò *</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nhập tên vai trò'
                    disabled={mode === 'edit' && initialData?.isSystemRole}
                    {...field}
                    className='h-9'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='scopeFacultyDepartmentId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium'>Phạm vi khoa/phòng ban</FormLabel>
                <FormControl>
                  <ComboboxFacultyDepartment
                    value={form.watch('scopeFacultyDepartmentId')}
                    onValueChange={field.onChange}
                    placeholder='Chọn phạm vi khoa/phòng ban'
                    disabled={isLoading}
                    width='100%'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm font-medium'>Mô tả *</FormLabel>
              <FormControl>
                <Textarea placeholder='Nhập mô tả vai trò' className='resize-none min-h-[80px]' rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4'>
          <div className='flex items-center justify-between border-b pb-2'>
            <div>
              <FormLabel className='text-base font-semibold'>Phân quyền chi tiết</FormLabel>
              <p className='text-sm text-muted-foreground mt-1'>
                Chọn các quyền cụ thể cho vai trò này theo từng module
              </p>
            </div>
            <div className='text-right'>
              <Badge variant='default' className='text-sm px-3 py-1'>
                {selectedPermissions.length} quyền đã chọn
              </Badge>
              <p className='text-xs text-muted-foreground mt-1'>Tổng cộng {modules.length} module</p>
            </div>
          </div>

          {isLoadingModules ? (
            <div className='py-8 flex items-center justify-center'>
              <LoadingSpinner isLoading={true} className='py-12' />
            </div>
          ) : (
            <div className='border rounded-lg'>
              <Accordion type='multiple' className='w-full' onValueChange={(values) => setExpandedModules(values)}>
                {modules.map((module) => (
                  <ModulePermissionItem
                    key={module}
                    module={module}
                    expandedModules={expandedModules}
                    selectedPermissions={selectedPermissions}
                    handleSelectAll={handleSelectAll}
                    handlePermissionToggle={handlePermissionToggle}
                  />
                ))}
              </Accordion>
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex gap-2 pt-2',
            form.formState.isDirty && 'sticky bottom-0 bg-background border rounded-lg border-input p-4'
          )}
        >
          <Button
            type='submit'
            disabled={isLoading || !form.formState.isDirty}
            className={cn('cursor-pointer h-9', !form.formState.isDirty && 'pointer-events-none')}
          >
            {isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
