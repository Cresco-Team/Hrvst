import publicPages from "@/services/AuthPages/public-pages"
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react"


const AuthSidebarContent = ({ authContents }) => {

    return (
        <SidebarContent className="gap-0">
              {publicPages?.map(group => (
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

              {authContents?.map(group => (
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