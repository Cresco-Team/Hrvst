
import NavHeader from "@/components/sidebar/nav-header";
import NavUser from "@/components/sidebar/nav-user";

import { usePage } from "@inertiajs/react";
import { AdminPages } from "@/components/admin/sidebar/admin-pages";
import { Sprout, PhilippinePeso } from "lucide-react";
import { SquareUser } from "lucide-react";
import { 
    Sidebar,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";

const groups = [
    {
        title: "Trade Data",
        pages: [
            {
                title: 'Vegetables Dashboard',
                url: '/admin/crops',
                icon: Sprout,
            },
        ]
    }, {
        title: "Farmers Info",
        pages: [
            {
                title: 'Farmers Dashboard',
                url: '/admin/farmers',
                icon: SquareUser,
            },
        ]
    }
]
const pages = [{
    title: "Crops Dashboard",
    url: "/admin/crops",
    icon: Sprout,
    isActive: true
}, {
    title: "Farmers Dashboard",
    url: "/admin/farmers",
    icon: SquareUser,
}]

export default function AdminSidebar({
    user,
    ...props
 }) {
    const { auth } = usePage().props

    return (
        <Sidebar collapsible="icon" {...props} variant="inset">
            <SidebarHeader>
                <NavHeader link={'admin'} />
            </SidebarHeader>

            <AdminPages groups={groups} />

            <SidebarFooter>
                <NavUser user={auth?.user} />
            </SidebarFooter>
        </Sidebar>
    )
}