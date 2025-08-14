import ComboboxFacultyDepartment from '@/features/faculty-departments/components/ComboboxFacultyDepartment'
import { useGetModulePermissions, useGetPermissionByModule } from '@/features/permissions/api/PermissionService'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Separator } from '@/shared/components/ui/separator'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn, getMethodBadgeVariant, translateModule } from '@/shared/lib/utils'
import type { PermissionType } from '@/shared/validations/PermissionSchema'
import {
  CreateRoleSchema,
  UpdateRoleSchema,
  type CreateRoleType,
  type RoleType,
  type UpdateRoleType
} from '@/shared/validations/RoleSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

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

  const ModulePermissionItem = ({ module }: { module: string }) => {
    const isExpanded = expandedModules.includes(module)
    const { data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissionByModule(module, isExpanded)
    const permissions = permissionsData?.data || []

    const selectedCount = permissions.filter((p) => selectedPermissions.includes(p.id)).length
    const allSelected = selectedCount === permissions.length && permissions.length > 0
    const someSelected = selectedCount > 0 && selectedCount < permissions.length

    return (
      <AccordionItem value={module} key={module}>
        <AccordionTrigger className='hover:no-underline p-3 items-center'>
          <div className='flex items-center justify-between w-full mr-2'>
            <div className='flex items-center gap-2'>
              <Shield className='h-4 w-4 text-primary' />
              <div className='text-left'>
                <h3 className='font-medium text-sm'>{translateModule(module)}</h3>
                <p className='text-xs text-muted-foreground'>
                  {isExpanded && permissions.length > 0
                    ? `${selectedCount}/${permissions.length} quyền đã chọn`
                    : 'Click để xem quyền'}
                </p>
              </div>
            </div>
            {selectedCount > 0 && (
              <Badge variant='secondary' className='mr-2 text-xs px-1.5 py-0.5'>
                {selectedCount}
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className='pl-6 space-y-3'>
            {isLoadingPermissions ? (
              <div className='py-3 flex items-center justify-center'>
                <LoadingSpinner isLoading={true} className='py-6' />
              </div>
            ) : permissions.length === 0 ? (
              <p className='text-muted-foreground py-3 text-sm'>Không có quyền nào trong module này</p>
            ) : (
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id={`module-${module}`}
                    checked={allSelected}
                    ref={(el) => {
                      if (el) (el as any).indeterminate = someSelected
                    }}
                    onCheckedChange={(checked) => handleSelectAll(permissions, checked as boolean)}
                  />
                  <label htmlFor={`module-${module}`} className='text-xs font-medium cursor-pointer'>
                    Chọn tất cả ({permissions.length} quyền)
                  </label>
                </div>
                <Separator />
                <div className='grid grid-cols-3 gap-1.5 max-h-60 overflow-y-auto'>
                  {permissions.map((permission) => (
                    <div key={permission.id} className='flex items-start gap-2 p-2 rounded border hover:bg-muted/50'>
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                        className='mt-0.5'
                      />
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-1.5 mb-0.5'>
                          <label htmlFor={permission.id} className='font-medium cursor-pointer text-xs'>
                            {permission.name}
                          </label>
                          <Badge variant={getMethodBadgeVariant(permission.method)} className='text-[10px] px-1 py-0'>
                            {permission.method}
                          </Badge>
                        </div>
                        <p className='text-[10px] text-muted-foreground mb-0.5 line-clamp-1'>
                          {permission.description || 'Không có mô tả'}
                        </p>
                        <code className='text-[10px] bg-muted px-1 py-0.5 rounded font-mono'>{permission.path}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
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
                  <ModulePermissionItem key={module} module={module} />
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
