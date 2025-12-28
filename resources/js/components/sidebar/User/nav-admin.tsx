
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    UserCog,
    LayoutDashboard
  } from "lucide-react"

  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from '@/components/ui/avatar'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu'
  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from '@/components/ui/sidebar'

  export function NavAdmin({ user }) {
    const { isMobile } = useSidebar()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg"><UserCog /></AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user.name}</span>
                        <span className="truncate font-medium">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.image_path} alt={user.name} />
                            <AvatarFallback className="rounded-lg"><UserCog /></AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route('admin.index')}
                                method="get"
                                className="w-full"
                            >
                                <LayoutDashboard/>
                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link 
                                href={route('logout')} 
                                method="post"
                                className="w-full"
                            >
                                <LogOut />
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
  }