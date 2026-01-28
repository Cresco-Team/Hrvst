
import { Link } from "@inertiajs/react"
import { SidebarFooter, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"

const GuestSidebarFooter = () => {
    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex space-x-3 ">
                        <Link href={route('login')} className="">
                            <Button variant="outline">Log in</Button>
                        </Link>
                        
                        <Link href={route('register')}>
                            <Button>Sign up</Button>
                        </Link>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
  }
  export default GuestSidebarFooter