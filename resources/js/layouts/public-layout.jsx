
import { Head } from "@inertiajs/react";
import NavBar from "@/components/navigation/nav-bar";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import PublicSidebar from "@/components/sidebars/public-sidebar";

const PublicLayout = ({ children, title, sidebarHeader, sidebarContent }) => {
    return (
        <div className="min-h-screen flex flex-col [--header-height:calc(--spacing(14))]">
            <Head title={title} />

            <SidebarProvider className="flex flex-col">
                <NavBar />

                <div className="flex flex-1">

                    <PublicSidebar 
                        header={sidebarHeader}
                        content={sidebarContent}
                        className={'top-(--header-height) h-[calc(100svh-var(--header-height))]!'}
                    />

                    <SidebarInset className="flex-1">
                        <main className="relative h-full">
                            {children}
                        </main>
                    </SidebarInset>

                </div>
            </SidebarProvider>
        </div>
    )
}
export default PublicLayout