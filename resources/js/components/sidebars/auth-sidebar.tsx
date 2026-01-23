import { router, usePage } from "@inertiajs/react"
import AuthSidebarContent from "./sidebar-content/auth-sidebar-content"
import NavHeader from "./sidebar-header/app-sidebar-header"
import AuthSidebarFooter from "./sidebar-footer/auth-sidebar-footer"
import { Sidebar, SidebarFooter, SidebarHeader } from "../ui/sidebar"
import { PageProps } from "@/types"
import adminPages from "@/services/AuthPages/admin-pages"
import dealerPages from "@/services/AuthPages/dealer-pages"
import farmerPages from "@/services/AuthPages/farmer-pages"
import AppSidebarHeader from "./sidebar-header/app-sidebar-header"

const AuthSidebar = ({...props}) => {
    const { auth } = usePage<PageProps>().props
    const roles = auth.user.roles

    return (
        <Sidebar collapsible="icon" {...props} variant="inset">
            <AppSidebarHeader />

            <AuthSidebarContent
                sidebarContents = {
                    roles.includes('admin') ? adminPages
                    : roles.includes('dealer') ? dealerPages
                    : roles.includes('farmer') ? farmerPages
                    : null
                }
            />

            <SidebarFooter>
                <AuthSidebarFooter user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
export default AuthSidebar