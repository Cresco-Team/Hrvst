
import { Link } from "@inertiajs/react"
import { useState } from "react"
import { columns } from "@/components/admin/crops/columns"
import DataTable from "@/components/admin/data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PlusIcon, SearchIcon } from "lucide-react"
import AppLayout from "@/layouts/app-layout"

const Crops = ({ crops }) => {
    const [globalFilter, setGlobalFilter] = useState('')
    return (
        <AppLayout
            title="Crops Dashboard"
        >
            <div className="h-95 overflow-y-auto">
                <DataTable
                    columns={columns}
                    data={crops}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    toolbar={
                        <>
                            <div>
                                <Label htmlFor="search" className="text-xs">
                                    Search <SearchIcon size={15} />
                                </Label>
                                <Input
                                    placeholder="Search for vegetable..."
                                    value={globalFilter}
                                    id="search"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                            
                            <Button asChild>
                                <Link href={route('admin.crops.create')} method="get">
                                    <PlusIcon /> Add Vegetable
                                </Link>
                            </Button>
                        </>
                    }
                />
            </div>
        </AppLayout>
    )
}
export default Crops
