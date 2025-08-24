/* eslint-disable react-hooks/exhaustive-deps */
import {
  useGetModulePermissions,
  useGetPermissionByModule,
  useUpdatePermission
} from '@/features/permissions/api/PermissionService'
import { PermissionFilters, PermissionForm, PermissionTable } from '@/features/permissions/components'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { translateModule } from '@/shared/lib/utils'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { PermissionType, UpdatePermission } from '@/shared/validations/PermissionSchema'
import { Shield } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

const PermissionsPageComponent = () => {
  const { openDialog, closeDialog } = useDialogStore()
  const [searchParams] = useSearchParams()
  const [moduleSelected, setModuleSelected] = useState<string | null>(null)

  const { data: modulesData, isLoading: isLoadingModules } = useGetModulePermissions()
  const modules = modulesData?.data || []

  const { mutateAsync: updatePermission, isPending: isUpdatingPermission } = useUpdatePermission()

  const handleEdit = (permission: PermissionType) => {
    openDialog({
      type: 'custom',
      title: 'Chỉnh sửa quyền',
      description: 'Chỉnh sửa thông tin quyền đã tồn tại',
      content: (
        <PermissionForm
          initialData={permission}
          onSubmit={(formData) => handleFormSubmit(formData, permission.id)}
          isLoading={isUpdatingPermission}
        />
      )
    })
  }

  const handleFormSubmit = async (formData: UpdatePermission, permissionId: string) => {
    await updatePermission({ id: permissionId, ...formData })
    closeDialog()
  }

  const ModuleAccordionItem = ({ module }: { module: string }) => {
    const { data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissionByModule(
      module,
      moduleSelected === module
    )
    const permissions = permissionsData?.data || []

    const search = searchParams.get('search')?.toLowerCase() || ''
    const filteredPermissions = useMemo(() => {
      if (!search) return permissions

      return permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(search) || permission.description.toLowerCase().includes(search)
      )
    }, [permissions, search])

    return (
      <AccordionItem value={module} key={module}>
        <AccordionTrigger className='hover:no-underline' onClick={() => setModuleSelected(module)}>
          <div className='flex items-center gap-3'>
            <Shield className='h-5 w-5 text-primary' />
            <div className='text-left'>
              <h3 className='font-semibold'>{translateModule(module)}</h3>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className='pl-8 space-y-4'>
            <PermissionTable permissions={filteredPermissions} onEdit={handleEdit} isLoading={isLoadingPermissions} />
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Quản lý quyền hệ thống</h1>
          <p className='text-muted-foreground'>Xem và chỉnh sửa quyền theo từng module trong hệ thống</p>
        </div>
      </div>

      <PermissionFilters />

      <Card className='gap-0 pb-0'>
        <CardHeader>
          <CardTitle>Danh sách module và quyền ({modules.length} modules)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingModules ? (
            <div className='flex justify-center items-center py-20'>
              <LoadingSpinner isLoading={true} className='relative py-20' />
            </div>
          ) : modules.length === 0 ? (
            <div className='flex h-24 items-center justify-center text-muted-foreground'>Không có module nào</div>
          ) : (
            <Accordion type='multiple' className='w-full'>
              {modules.map((module) => (
                <ModuleAccordionItem key={module} module={module} />
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Apply permission guard
export const PermissionsPage = withPermissionGuard(PermissionsPageComponent, PERMISSIONS.PERMISSIONS.LIST)
