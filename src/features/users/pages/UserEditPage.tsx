import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import ROUTES from '@/shared/lib/routes'
import type { UpdateUser } from '@/shared/validations/UserSchema'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { useGetUserDetailQuery, useUpdateUserMutation } from '../api/UserService'
import { UserForm } from '../components'

const UserEditPageComponent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: userResponse, isLoading } = useGetUserDetailQuery(id)
  const updateUserMutation = useUpdateUserMutation(id || '')

  const handleSubmit = async (data: UpdateUser) => {
    await updateUserMutation.mutateAsync(data)
    navigate(ROUTES.USERS_ACTIVE.url)
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8 absolute inset-0 bg-background/80 backdrop-blur-sm z-10'>
        <LoadingSpinner isLoading={true} className='relative py-20' />
      </div>
    )
  }

  if (!userResponse) {
    return (
      <>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>Không tìm thấy nhân viên</p>
          <Button className='mt-4' onClick={() => navigate(-1)}>
            <ArrowLeft className='h-4 w-4' />
            Quay lại
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' onClick={() => navigate(-1)}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa nhân viên</h1>
            <p className='text-muted-foreground'>Cập nhật thông tin nhân viên: {userResponse.data.fullName}</p>
          </div>
        </div>

        <UserForm
          mode='edit'
          user={userResponse.data}
          onSubmit={handleSubmit}
          isLoading={updateUserMutation.isPending}
        />
      </div>
    </>
  )
}

// Apply permission guard
export const UserEditPage = withPermissionGuard(UserEditPageComponent, PERMISSIONS.USERS.UPDATE)
