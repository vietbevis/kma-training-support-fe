import { useCreateRole, useGetRoleById } from '@/features/roles/api/RoleService'
import { RoleForm } from '@/features/roles/components'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import ROUTES from '@/shared/lib/routes'
import type { UpdateRoleType } from '@/shared/validations/RoleSchema'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

export const RoleCreatePage = () => {
  const { mutateAsync: createRole, isPending: isCreatingRole } = useCreateRole()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const duplicateRoleId = searchParams.get('duplicate')
  const isDuplicating = !!duplicateRoleId
  const { data: roleToDuplicate, isLoading: isLoadingDuplicateRole } = useGetRoleById(duplicateRoleId || '', {
    enabled: !!duplicateRoleId
  })

  const handleSubmit = async (formData: UpdateRoleType) => {
    await createRole(formData)
    const successMessage = isDuplicating ? 'Nhân bản vai trò thành công' : 'Tạo vai trò thành công'
    toast.success(successMessage)
    navigate(ROUTES.ROLES.url)
  }

  const handleBack = () => {
    navigate(ROUTES.ROLES.url)
  }

  if (isCreatingRole || (duplicateRoleId && isLoadingDuplicateRole)) {
    return (
      <div className='flex justify-center items-center py-20'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  const initialData = isDuplicating ? roleToDuplicate?.data : undefined
  const initialPermissions = isDuplicating ? roleToDuplicate?.data?.permissions : undefined
  const pageTitle = isDuplicating ? 'Nhân bản vai trò' : 'Tạo vai trò'
  const pageDescription = isDuplicating
    ? 'Nhân bản vai trò và chỉnh sửa thông tin cần thiết'
    : 'Tạo vai trò mới cho nhân viên trong hệ thống'

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={handleBack}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{pageTitle}</h1>
          <p className='text-muted-foreground'>{pageDescription}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleForm
            mode='create'
            onSubmit={handleSubmit}
            isLoading={isCreatingRole}
            initialData={initialData}
            initialPermissions={initialPermissions}
          />
        </CardContent>
      </Card>
    </div>
  )
}
