import { PaginationComponent } from '@/shared/components/Pagination'
import { PermissionButton } from '@/shared/components/PermissionButton'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { useSearchParamsManager } from '@/shared/hooks/useSearchParamsManager'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  Building,
  CreateBuildingSchemaType as CreateBuilding,
  UpdateBuildingSchemaType as UpdateBuilding
} from '@/shared/validations/BuildingSchema'
import { Plus } from 'lucide-react'
import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useGetBuildingsQuery,
  useUpdateBuildingMutation
} from '../api/BuildingService'
import { BuildingFilters, BuildingForm, BuildingTable } from '../components'

const BuildingsPageComponent = () => {
  const dialogStore = useDialogStore()

  const { filters, resetFilters, setFilters } = useSearchParamsManager({
    page: '',
    limit: '10',
    search: ''
  })

  const { data, isLoading, isFetching } = useGetBuildingsQuery(filters)

  const buildings = data?.data.data || []
  const meta = data?.data.meta

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateBuildingMutation()
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteBuildingMutation()
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateBuildingMutation()

  const handleDelete = (id: string) => {
    dialogStore.openDialog({
      type: 'confirm',
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa tòa nhà này? Hành động này không thể hoàn tác.',
      loading: isDeleting,
      onConfirm: async () => {
        dialogStore.setLoading?.(true)
        try {
          await deleteMutation(id)
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
        } finally {
          dialogStore.setLoading?.(false)
        }
      }
    })
  }

  const handleOpenCreate = () => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Thêm tòa nhà mới',
      description: 'Thêm tòa nhà mới vào hệ thống',
      content: (
        <BuildingForm
          mode='create'
          onSubmit={(formData) => handleFormSubmit(formData, 'create')}
          isLoading={isCreating}
        />
      )
    })
  }

  const handleEdit = (building: Building) => {
    dialogStore.openDialog({
      type: 'custom',
      title: 'Chỉnh sửa tòa nhà',
      description: 'Chỉnh sửa thông tin tòa nhà đã tồn tại',
      content: (
        <BuildingForm
          mode='edit'
          initialData={building}
          onSubmit={(formData) => handleFormSubmit(formData, 'edit', building.id)}
          isLoading={isUpdating}
        />
      )
    })
  }

  const handleFormSubmit = async (
    formData: CreateBuilding | UpdateBuilding,
    formMode: 'create' | 'edit',
    editingId?: string
  ) => {
    if (formMode === 'create') {
      await createMutation(formData as CreateBuilding)
    } else if (formMode === 'edit' && editingId) {
      await updateMutation({ id: editingId, data: formData as UpdateBuilding })
    }
    dialogStore.closeDialog()
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý tòa nhà</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các tòa nhà trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <PermissionButton onClick={handleOpenCreate} requiredPermission={PERMISSIONS.BUILDINGS.CREATE}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm tòa nhà
          </PermissionButton>
        </div>
      </div>

      {/* Filters */}
      <BuildingFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tòa nhà ({meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <BuildingTable
            data={buildings}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isFilterLoading={isFetching}
          />
        </CardContent>
      </Card>

      {meta && <PaginationComponent meta={meta} setFilter={setFilters} />}
    </div>
  )
}

// Apply permission guard
export const BuildingsPage = withPermissionGuard(BuildingsPageComponent, PERMISSIONS.BUILDINGS.LIST)
