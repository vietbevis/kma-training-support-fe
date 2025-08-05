import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDialogStore } from '@/shared/stores/dialogStore'
import type {
  Building,
  CreateBuildingSchemaType as CreateBuilding,
  UpdateBuildingSchemaType as UpdateBuilding
} from '@/shared/validations/BuildingSchema'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useGetBuildingsQuery,
  useUpdateBuildingMutation
} from '../api/BuildingService'
import { BuildingFilters, BuildingForm, BuildingTable } from '../components'

export const BuildingsPage = () => {
  const dialogStore = useDialogStore()

  const [searchParams] = useSearchParams()
  const { data, isLoading } = useGetBuildingsQuery({
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10
  })

  const buildings = data?.data.data || []

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
        try {
          await deleteMutation(id)
          dialogStore.closeDialog()
        } catch (error) {
          console.error(error)
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
    try {
      if (formMode === 'create') {
        await createMutation(formData as CreateBuilding)
      } else if (formMode === 'edit' && editingId) {
        await updateMutation({ id: editingId, data: formData as UpdateBuilding })
      }
      dialogStore.closeDialog()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Quản lý tòa nhà</h1>
          <p className='text-muted-foreground'>Quản lý danh sách các tòa nhà trong hệ thống</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={handleOpenCreate}>
            <Plus className='h-4 w-4 mr-2' />
            Thêm tòa nhà
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BuildingFilters />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tòa nhà ({buildings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <BuildingTable data={buildings} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  )
}
