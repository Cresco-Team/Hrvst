
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

export default function CropActions({ crop }) {
    const handleDelete = () => {
        if (!confirm("Delete this crop? This action is irreversible." - crop.name)) return

        router.delete(route("crops.destroy", crop.id))
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
                        onClick={() => router.visit(route("crops.edit", crop.id))}
                    >
                        <SquarePen />
                        Edit
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        onClick={handleDelete}
                        className="flex text-destructive focus:text-destructive/70"
                    >
                        <Trash className="text-destructive" />
                        Delete
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}