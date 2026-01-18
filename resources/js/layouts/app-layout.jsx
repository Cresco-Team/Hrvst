
import { Head } from "@inertiajs/react";
import NavBar from "@/components/navigation/nav-bar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AppLayout (
    { 
        children,
        title,
        sidebarHeader,
        sidebarContent,
    }
) {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <Head title={title} />

            <SidebarProvider defaultOpen={false} className="flex flex-col">
                <NavBar />
                <div className="flex flex-1">

                    <AppSidebar 
                        header={sidebarHeader}
                        content={sidebarContent}
                        variant="inset"
                    />

                    <SidebarInset className="flex">
                        <main className="flex-1 relative">
                            {children}
                        </main>
                    </SidebarInset>

                </div>
            </SidebarProvider>
        </div>
    )
}