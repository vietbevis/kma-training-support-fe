import { useGetPermissionByModule } from '@/features/permissions'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Separator } from '@/shared/components/ui/separator'
import { getMethodBadgeVariant, translateModule } from '@/shared/lib/utils'
import type { PermissionType } from '@/shared/validations/PermissionSchema'
import { Shield } from 'lucide-react'

interface ModulePermissionItemProps {
  module: string
  expandedModules: string[]
  selectedPermissions: string[]
  handleSelectAll: (permissions: PermissionType[], checked: boolean) => void
  handlePermissionToggle: (permissionId: string, checked: boolean) => void
}

const ModulePermissionItem = ({
  module,
  expandedModules,
  selectedPermissions,
  handleSelectAll,
  handlePermissionToggle
}: ModulePermissionItemProps) => {
  const isExpanded = expandedModules.includes(module)
  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissionByModule(module, isExpanded)
  const permissions = permissionsData?.data || []

  const selectedCount = permissions.filter((p) => selectedPermissions.includes(p.id)).length
  const allSelected = selectedCount === permissions.length && permissions.length > 0
  const someSelected = selectedCount > 0 && selectedCount < permissions.length

  return (
    <AccordionItem value={module} key={module}>
      <AccordionTrigger className='hover:no-underline p-3 items-center'>
        <div className='flex items-center justify-between w-full mr-2'>
          <div className='flex items-center gap-2'>
            <Shield className='h-4 w-4 text-primary' />
            <div className='text-left'>
              <h3 className='font-medium text-sm'>{translateModule(module)}</h3>
              <p className='text-xs text-muted-foreground'>
                {isExpanded && permissions.length > 0
                  ? `${selectedCount}/${permissions.length} quyền đã chọn`
                  : 'Click để xem quyền'}
              </p>
            </div>
          </div>
          {selectedCount > 0 && (
            <Badge variant='secondary' className='mr-2 text-xs px-1.5 py-0.5'>
              {selectedCount}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className='pl-6 space-y-3'>
          {isLoadingPermissions ? (
            <div className='py-3 flex items-center justify-center'>
              <LoadingSpinner isLoading={true} className='py-6' />
            </div>
          ) : permissions.length === 0 ? (
            <p className='text-muted-foreground py-3 text-sm'>Không có quyền nào trong module này</p>
          ) : (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id={`module-${module}`}
                  checked={allSelected}
                  ref={(el) => {
                    if (el) (el as any).indeterminate = someSelected
                  }}
                  onCheckedChange={(checked) => handleSelectAll(permissions, checked as boolean)}
                />
                <label htmlFor={`module-${module}`} className='text-xs font-medium cursor-pointer'>
                  Chọn tất cả ({permissions.length} quyền)
                </label>
              </div>
              <Separator />
              <div className='grid grid-cols-3 gap-1.5 max-h-60 overflow-y-auto'>
                {permissions.map((permission) => (
                  <div key={permission.id} className='flex items-start gap-2 p-2 rounded border hover:bg-muted/50'>
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                      className='mt-0.5'
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-1.5 mb-0.5'>
                        <label htmlFor={permission.id} className='font-medium cursor-pointer text-xs'>
                          {permission.name}
                        </label>
                        <Badge variant={getMethodBadgeVariant(permission.method)} className='text-[10px] px-1 py-0'>
                          {permission.method}
                        </Badge>
                      </div>
                      <p className='text-[10px] text-muted-foreground mb-0.5 line-clamp-1'>
                        {permission.description || 'Không có mô tả'}
                      </p>
                      <code className='text-[10px] bg-muted px-1 py-0.5 rounded font-mono'>{permission.path}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default ModulePermissionItem
