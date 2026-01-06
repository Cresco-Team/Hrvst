
import { Link } from "@inertiajs/react"
import { useState } from "react"

import AdminLayout from "@/layouts/admin-layout"
import { columns } from "@/components/admin/crops/columns"
import DataTable from "@/components/admin/data-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Search } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function Crops({ crops }) {
    const [globalFilter, setGlobalFilter] = useState('')
    return (
        <AdminLayout
            title="Crops Dashboard"
        >
            <Card className="h-95 overflow-hidden p-2">
                <DataTable
                    columns={columns}
                    data={crops}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    toolbar={
                        <>
                            <div>
                                <Label htmlFor="search" className="text-xs">
                                    Search <Search size={15} />
                                </Label>
                                <Input
                                    placeholder="Search for vegetable..."
                                    value={globalFilter}
                                    id="search"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                            
                            <Link href={route('admin.crops.create')}>
                                <Button>
                                    <Plus />Add Crop
                                </Button>
                            </Link>
                        </>
                    }
                />
            </Card>
        </AdminLayout>
    )
}
