import { useGetModulePermissions, useUpdatePermission } from '@/features/permissions/api/PermissionService'
import { PermissionFilters, PermissionForm } from '@/features/permissions/components'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Accordion } from '@/shared/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type { PermissionType, UpdatePermission } from '@/shared/validations/PermissionSchema'
import { useState } from 'react'
import ModuleAccordionItem from '../components/ModuleAccordionItem'

const PermissionsPageComponent = () => {
  const { openDialog, closeDialog } = useDialogStore()
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
                <ModuleAccordionItem
                  key={module}
                  module={module}
                  moduleSelected={moduleSelected}
                  setModuleSelected={setModuleSelected}
                  handleEdit={handleEdit}
                />
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
