
import { Link } from "@inertiajs/react"
import { MoreHorizontal, ArrowUpDown, ChartArea, SquarePen, Trash } from "lucide-react"
import FarmerActions from "./farmer-actions"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export const columns = [
    {
        accessorKey: "user.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown />
            </Button>
        )
    }, {
        accessorKey: "user.email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown />
            </Button>
        )
    }, {
        accessorKey: "user.phone_number",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Phone Number
                <ArrowUpDown />
            </Button>
        )
    }, {
        accessorKey: "municipality.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Municipality
                <ArrowUpDown />
            </Button>
        )
    }, {
        accessorKey: "barangay.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Barangay
                <ArrowUpDown />
            </Button>
        )
    }, {
        accessorKey: "image_path",
        header: "Image",
        enableSorting: false,
        cell: ({ row }) => {
            const raw = row.getValue("image_path");
            const src = raw
                ? (String(raw).startsWith('http') ? raw : `/storage/${raw}`)
                : null;
            return (
                <img
                    src={src || ''}
                    alt=""
                    className="h-6 w-10 rounded-md object-cover"
                />
            );
        }
    }, {
        id: "actions",
        cell: ({ row }) => (
            <FarmerActions farmer = {row.original} />
        )
    }
]
