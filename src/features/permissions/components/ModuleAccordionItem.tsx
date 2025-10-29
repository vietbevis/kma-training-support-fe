/* eslint-disable react-hooks/exhaustive-deps */
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { translateModule } from '@/shared/lib/utils'
import type { PermissionType } from '@/shared/validations/PermissionSchema'
import { Shield } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useGetPermissionByModule } from '../api/PermissionService'
import { PermissionTable } from './PermissionTable'

const ModuleAccordionItem = ({
  module,
  moduleSelected,
  setModuleSelected,
  handleEdit
}: {
  module: string
  moduleSelected: string | null
  setModuleSelected: (module: string) => void
  handleEdit: (permission: PermissionType) => void
}) => {
  const [searchParams] = useSearchParams()
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

export default ModuleAccordionItem
