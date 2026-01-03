
import { ArrowUpDown } from "lucide-react"
import CropActions from "./crop-actions"

import { Button } from "@/components/ui/button"

export const columns = [
    {
        accessorKey: "imagePath",
        header: () => <div className="text-sm">Image</div>,
        enableSorting: false,
        cell: ({ row }) => {
            const raw = row.getValue("imagePath");
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
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown />
            </Button>
        )
    }, {
        accessorKey: "categoryName",
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
        accessorKey: "cropWeeks",
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
            const number = row.getValue("cropWeeks")
            return <div>{number} weeks</div>
        }
    }, {
        id: "priceRange",
        header: "Price Range",
        enableSorting: false,
        cell: ({ row }) => `₱ ${row.original.latestPrice.priceMin} - ${row.original.latestPrice.priceMax}`
    }, {
        accessorKey: "latestPrice.recordedAt",
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
