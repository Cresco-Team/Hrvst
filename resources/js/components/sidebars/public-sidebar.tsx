
import { Link, usePage } from "@inertiajs/react";
import AuthSidebarFooter from "@/components/sidebars/sidebar-footer/auth-sidebar-footer";
import { Button } from "@/components/ui/button";
import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarHeader 
} from "@/components/ui/sidebar";
import { PageProps } from "@/types";

const PublicSidebar = ({ header, content, ...props }) => {
    const { auth } = usePage<PageProps>().props

    return (
        <Sidebar
            {...props}
        >
            <SidebarHeader>
                {header}
            </SidebarHeader>

            <SidebarContent className="gap-0">
                {content}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {auth.user
                            ? <AuthSidebarFooter user={auth.user} />
                            : <div className="flex space-x-3  ">
                                <Link href={route('login')}>
                                    <Button variant="outline">Log in</Button>
                                </Link>
                                
                                <Link href={route('register')}>
                                    <Button>Sign up</Button>
                                </Link>
                            </div>
                        }
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
export default PublicSidebar