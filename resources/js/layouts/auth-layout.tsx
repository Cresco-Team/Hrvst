import AuthSidebar from '@/components/sidebars/auth-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head } from '@inertiajs/react';

const AuthLayout = ({ children, title, breadcrumbs = [] }) => {
    return (
        <SidebarProvider className="h-full overflow-hidden flex">
            <Head title={title} />

            <AuthSidebar />

            <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="size-9" />
                    <Separator orientation="vertical" className="h4" />

                    {breadcrumbs.length > 0 && (
                        <Breadcrumb className='hidden md:flex'>
                        
                        </Breadcrumb>
                    )}
                </header>

                <Separator />

                <main className="flex-1 overflow-y-auto">
                    <div className='flex flex-col gap-4 p-4'>
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};
export default AuthLayout;
