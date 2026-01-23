import { router, usePage } from "@inertiajs/react"
import AuthSidebarContent from "./sidebar-content/auth-sidebar-content"
import NavHeader from "../sidebar/nav-header"
import NavUser from "../sidebar/nav-user"
import { Sidebar, SidebarFooter, SidebarHeader } from "../ui/sidebar"
import { PageProps } from "@/types"
import adminPages from "@/services/AuthPages/admin-pages"
import dealerPages from "@/services/AuthPages/dealer-pages"
import farmerPages from "@/services/AuthPages/farmer-pages"

const AuthSidebar = ({...props}) => {
    const { auth } = usePage<PageProps>().props
    const roles = auth.user.roles

    return (
        <Sidebar collapsible="icon" {...props} variant="inset">
            <SidebarHeader>
                <NavHeader link={route('home')} />
            </SidebarHeader>

            <AuthSidebarContent
                sidebarContents = {
                    roles.includes('admin') ? adminPages
                    : roles.includes('dealer') ? dealerPages
                    : roles.includes('farmer') ? farmerPages
                    : null
                }
            />

            <SidebarFooter>
                <NavUser user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
export default AuthSidebar