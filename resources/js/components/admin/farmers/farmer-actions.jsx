
import { Link } from "@inertiajs/react"
import { router } from "@inertiajs/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontal,
    ArrowUpDown,
    ChartArea,
    SquarePen,
    Trash
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FarmerActions({ farmer }) {
    const handleDelete = () => {
        if (!confirm("Delete this Account? This action is irreversible." - farmer.user.name)) return

        router.delete(route("admin.farmers.destroy", farmer.id))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link
                        /* href={route('admin.farmers.show', farmer.id)} */
                    >
                        <ChartArea />
                        Details
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        onClick={handleDelete}
                        className="flex text-destructive focus:text-destructive/70"
                    >
                        <Trash className="text-destructive" />
                        Delete Account
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}