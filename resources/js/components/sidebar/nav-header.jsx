import {
    SidebarMenu,
    SidebarMenuItem
} from "../ui/sidebar"
import { Link } from "@inertiajs/react"

export default function NavHeader({ link }) {
    return (
        <SidebarMenu>
            <SidebarMenuItem
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Link
                    href={route('home')}
                    className="flex data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <img
                        className="aspect-square size-8 rounded-lg"
                        src="/assets/hrvst.svg" 
                        alt="Hrvst"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Project Hrvst</span>
                        <span className="truncate text-xs">Powered by Team Cresco</span>
                    </div>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}