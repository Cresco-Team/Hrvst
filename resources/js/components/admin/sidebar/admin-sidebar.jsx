
import NavHeader from "@/components/sidebar/nav-header";
import NavUser from "@/components/sidebar/nav-user";

import { usePage } from "@inertiajs/react";
import { AdminPages } from "@/components/admin/sidebar/admin-pages";
import {
    Sprout,
    LayoutDashboard,
    MapPinned,
    ChartBarBig,
    ChartCandlestick,
    ChartNoAxesCombined,
} from "lucide-react";
import { SquareUser } from "lucide-react";
import { 
    Sidebar,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";

const groups = [
    {
        title: "Vegetables Dashboard",
        pages: [
            {
                title: 'Dashboard Overview',
                url: 'admin.dashboard',
                icon: LayoutDashboard,
            }, {
                title: 'Vegetable Spreadsheet',
                url: 'admin.crops.index',
                icon: Sprout,
            }, {
                title: 'Prices Insights',
                url: 'admin.prices.index',
                icon: ChartCandlestick,
            }, {
                title: 'Price Trends',
                url: 'admin.price-trends',
                icon: ChartNoAxesCombined,
            }, 
        ]
    }, {
        title: "Farmers Dashboard",
        pages: [
            {
                title: 'Spreadsheet',
                url: 'admin.farmers.index',
                icon: SquareUser,
            }, {
                title: 'Geolocation',
                url: 'admin.gis.index',
                icon: MapPinned,
            }, {
                title: 'Demographics',
                url: 'admin.demo.index',
                icon: ChartBarBig,
            },
        ]
    }
]

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