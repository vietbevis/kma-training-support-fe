import * as React from 'react'

import { useGetAccountDetailQuery } from '@/features/accounts/api/AccountService'
import { useAuthStore } from '@/features/auth'
import { useGetPermissionByUserId } from '@/features/permissions'
import { NavMain } from '@/shared/components/nav-main'
import { NavUser } from '@/shared/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/shared/components/ui/sidebar'
import navMain from '../lib/nav-main'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userId } = useAuthStore()
  const { data: user } = useGetAccountDetailQuery(userId || '')
  const { data: permissions } = useGetPermissionByUserId(userId || '')

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
                <img src='/actvn_big_icon.png' className='w-full h-full' alt='logo' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>Học viện Kỹ thuật mật mã</span>
                <span className='truncate text-xs'>Academic Of Cryptography Techniques</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} permissions={permissions?.data || []} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user?.data} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
