import { useCreateRole } from '@/features/roles/api/RoleService'
import { RoleForm } from '@/features/roles/components'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import ROUTES from '@/shared/lib/routes'
import type { UpdateRoleType } from '@/shared/validations/RoleSchema'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

export const RoleCreatePage = () => {
  const { mutateAsync: createRole, isPending: isCreatingRole } = useCreateRole()
  const navigate = useNavigate()

  const handleSubmit = async (formData: UpdateRoleType) => {
    await createRole(formData)
    toast.success('Tạo vai trò thành công')
    navigate(ROUTES.ROLES.url)
  }

  const handleBack = () => {
    navigate(ROUTES.ROLES.url)
  }

  if (isCreatingRole) {
    return (
      <div className='flex justify-center items-center py-20'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={handleBack}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Tạo vai trò</h1>
          <p className='text-muted-foreground'>Tạo vai trò mới cho người dùng trong hệ thống</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Tạo vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleForm mode='create' onSubmit={handleSubmit} isLoading={isCreatingRole} />
        </CardContent>
      </Card>
    </div>
  )
}
