import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { Button } from '@/shared/components/ui/button'
import ROUTES from '@/shared/lib/routes'
import type { UpdateUser } from '@/shared/validations/UserSchema'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { useGetUserDetailQuery, useUpdateUserMutation } from '../api/UserService'
import { UserForm } from '../components'

export const UserEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: userResponse, isLoading } = useGetUserDetailQuery(id)
  const updateUserMutation = useUpdateUserMutation(id || '')

  const handleSubmit = async (data: UpdateUser) => {
    await updateUserMutation.mutateAsync(data)
    navigate(ROUTES.USERS.url)
  }

  if (isLoading) {
    return <LoadingSpinner isLoading={true} className='py-20' />
  }

  if (!userResponse) {
    return (
      <>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>Không tìm thấy nhân viên</p>
          <Button className='mt-4' asChild>
            <Link to={ROUTES.USERS.url}>Quay lại danh sách</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' asChild>
            <Link to={ROUTES.USERS.url}>
              <ArrowLeft className='h-4 w-4' />
            </Link>
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
