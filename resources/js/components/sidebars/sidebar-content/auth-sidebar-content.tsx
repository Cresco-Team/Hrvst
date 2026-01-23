import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react"


const AuthSidebarContent = ({ sidebarContents }) => {

    return (
        <SidebarContent className="gap-0">
              {sidebarContents?.map(group => (
                <SidebarGroup key={group.title} className="py-1">
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.pages.map((page: any) => (
                          <SidebarMenuItem key={page.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={route().current(page.url)}
                          >
                            <Link href={route(page.url)}>
                              <page.icon />
                              {page.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
    )
}
export default AuthSidebarContent