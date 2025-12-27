
import { Link } from "@inertiajs/react"
import { MoreHorizontal, ArrowUpDown, ChartArea, SquarePen, Trash } from "lucide-react"
import CropActions from "./crop-actions"

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
        accessorKey: "name",
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
        accessorKey: "category.name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Category
                <ArrowUpDown />
            </Button>
        )
    }, {
        accessorKey: "crop_weeks",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Week Span
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const number = row.getValue("crop_weeks")
            return <div>{number} weeks</div>
        }
    }, {
        id: "price_range",
        header: "Price Range",
        enableSorting: false,
        cell: ({ row }) => `₱${row.original.latest_price.price_min} - ₱${row.original.latest_price.price_max}`
    }, {
        accessorKey: "recorded_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date Updated
                <ArrowUpDown />
            </Button>
        )
    }, {
        id: "actions",
        cell: ({ row }) => (
            <CropActions crop = {row.original} />
        )
    }
]
