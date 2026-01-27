
import { Link, router, usePage } from "@inertiajs/react"
import { ChevronsUpDown, ExternalLink, LayoutDashboardIcon, LogOut, MessagesSquareIcon, SproutIcon, StoreIcon, UserCircleIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarFooter, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'

const AppSidebarFooter = () => {
    const { isMobile } = useSidebar()
    const { auth } = usePage().props

    return (
        <SidebarFooter>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                    >
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={auth.user.image_path} />
                            <AvatarFallback className="rounded-lg">HR</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{auth.user.name}</span>
                            <span className="truncate font-medium">{auth.user.email}</span>
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
                                <AvatarImage src={auth.user?.image_path} alt={auth.user.name} />
                                <AvatarFallback className="rounded-lg">HR</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{auth.user.name}</span>
                                <span className="truncate text-xs">{auth.user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => router.get(route('profile', auth.user))}
                        >
                            <UserCircleIcon />
                            My Profile
                        </DropdownMenuItem>

                        {auth.user.roles.includes('dealer') ? (
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={() => router.get(route('dealer.messages.index'))}
                            >
                                <MessagesSquareIcon />
                                Chats
                            </DropdownMenuItem>
                        ) : (auth.user.roles.includes('farmer') ? (
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={() => router.get(route('farmer.messages.index'))}>
                                <MessagesSquareIcon />
                                Chats
                            </DropdownMenuItem>
                        ) : null)}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => router.post(route('logout'))}
                    >
                        <LogOut />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
    )
  }
  export default AppSidebarFooter