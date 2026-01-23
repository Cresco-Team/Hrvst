import DynamicBreadcrumbs from '@/components/navigation/dynamic-breadcrumb'
import AuthSidebar from '@/components/sidebars/auth-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { BreadcrumbItem } from '@/lib/breadcrumbs'
import { Head } from '@inertiajs/react'
import React from 'react'

interface AuthLayoutProps {
    children: React.ReactNode
    title: string

    breadcrumbs?: BreadcrumbItem[]
    breadcrumbParams?: Record<string, any>
    hideBreadcrumbs?: boolean
}

const AuthLayout = ({ 
    children, 
    title, 
    breadcrumbs, 
    breadcrumbParams,
    hideBreadcrumbs = false
}:  AuthLayoutProps) => {
    return (
        <SidebarProvider className="h-full overflow-hidden flex">
            <Head title={title} />

            <AuthSidebar />

            <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 px-3 sm:px-4 transition-[height] ease-linear">
                    <div className="flex items-center gap-2 w-full">
                        <SidebarTrigger className="size-9" />
                        <Separator orientation="vertical" className="mr-2 h4"/>

                        {!hideBreadcrumbs && (
                            <DynamicBreadcrumbs 
                                items={breadcrumbs}
                                params={breadcrumbParams}
                                className='hidden md:flex'
                            />
                        )}

                        {!hideBreadcrumbs && (
                            <h1 className="md:hidden font-semibold text-sm truncate">
                                {title}
                            </h1>
                        )}
                    </div>
                </header>

                <Separator />

                <main className="flex-1 overflow-y-auto">
                    <div className='flex flex-col gap-4 p-3 sm:p-4'>
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
export default AuthLayout
