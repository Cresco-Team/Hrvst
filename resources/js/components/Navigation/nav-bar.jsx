import { Link } from "@inertiajs/react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

export default function NavBar () {
    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <nav className="flex h-(--header-height) w-full items-center gap-2 px-4">
                <SidebarTrigger/>

                <Separator orientation="vertical" />

                <div className="flex justify-between w-full">
                    <Link
                        href={route('home')}
                        className="flex items-center"
                    >
                        <img 
                            src="assets/hrvst.svg" 
                            alt="Hrvst.Inc"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-lg font-bold">Hrvst</span>
                    </Link>
                    
                    <div>
                        <Link href={route('farmers.index')}>
                            <Button variant="ghost">Farmers</Button>
                        </Link>
                        <Link href={route('crops.index')}>
                            <Button variant="ghost">Crops</Button>
                        </Link>
                    </div>

                    <div>
                        Navigation
                    </div>
                </div>
            </nav>
        </header>
    )
}