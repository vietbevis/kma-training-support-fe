import { withPermissionGuard } from '@/shared/components/PermissionGuard'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import ROUTES from '@/shared/lib/routes'
import type { CreateUser } from '@/shared/validations/UserSchema'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useCreateUserMutation } from '../api/UserService'
import { UserForm } from '../components'

const UserCreatePageComponent = () => {
  const createUserMutation = useCreateUserMutation()
  const navigate = useNavigate()

  const handleSubmit = async (data: CreateUser) => {
    await createUserMutation.mutateAsync(data)
    navigate(ROUTES.USERS.url)
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
            <h1 className='text-3xl font-bold tracking-tight'>Thêm nhân viên mới</h1>
            <p className='text-muted-foreground'>Điền thông tin để tạo nhân viên mới trong hệ thống</p>
          </div>
        </div>

        <UserForm mode='create' onSubmit={handleSubmit} isLoading={createUserMutation.isPending} />
      </div>
    </>
  )
}

// Apply permission guard
export const UserCreatePage = withPermissionGuard(UserCreatePageComponent, PERMISSIONS.USERS.CREATE)
