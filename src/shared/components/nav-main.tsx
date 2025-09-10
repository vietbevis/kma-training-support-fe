import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/shared/components/ui/sidebar'
import { hasPermission, type UserPermission } from '@/shared/lib/utils'
import { Fragment, useMemo } from 'react'
import { NavLink } from 'react-router'
import type { NavItem } from '../lib/nav-main'
import type { PermissionType } from '../validations/PermissionSchema'

export function NavMain({ items, permissions }: { items: NavItem[]; permissions: PermissionType[] }) {
  // Chuyển đổi permissions thành format phù hợp
  const userPermissions: UserPermission[] = useMemo(() => {
    return permissions.map((p) => ({
      method: p.method,
      path: p.path
    }))
  }, [permissions])

  // Filter items dựa trên permissions
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Nếu item có sub-items, kiểm tra xem có ít nhất 1 sub-item được phép truy cập
        if (item.items && item.items.length > 0) {
          const allowedSubItems = item.items.filter((subItem) => {
            if (!subItem.requiredPermission) return true
            return hasPermission(userPermissions, subItem.requiredPermission)
          })
          return allowedSubItems.length > 0
        }

        // Nếu là single item, kiểm tra permission
        if (item.requiredPermission) {
          return hasPermission(userPermissions, item.requiredPermission)
        }

        // Nếu không có requiredPermission, cho phép hiển thị
        return true
      })
      .map((item) => {
        // Nếu có sub-items, filter sub-items theo permission
        if (item.items && item.items.length > 0) {
          return {
            ...item,
            items: item.items.filter((subItem) => {
              if (!subItem.requiredPermission) return true
              return hasPermission(userPermissions, subItem.requiredPermission)
            })
          }
        }
        return item
      })
  }, [items, userPermissions])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Hệ thống quản lý học viện</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <Fragment key={item.title}>
            {item.items && item.items.length > 0 ? (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={subItem.url}>
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
