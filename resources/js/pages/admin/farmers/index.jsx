import DataTable from "@/components/admin/data-table";
import { columns as columnsApproved } from "@/components/admin/farmers/columns/columns-approved";
import { columns as columnsPending } from "@/components/admin/farmers/columns/columns-pending";
import AdminLayout from "@/layouts/admin-layout";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Search } from "lucide-react";


export default function Farmers({ 
    approvedFarmers,
    pendingFarmers,
 }) {
    const [globalFilter, setGlobalFilter] = useState('')

    return(
        <AdminLayout
            title='Farmers Spreadsheet'
        >
            <div className="container mx-auto p-0">
                <DataTable
                    columns={columnsApproved}
                    data={approvedFarmers}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    toolbar={
                        <>
                            <div className="container">
                                <Label htmlFor="search" className="text-xs">
                                    Global Search <Search size={15} />
                                </Label>
                                <Input
                                    placeholder="Search for farmers..."
                                    value={globalFilter}
                                    id="search"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                        </>
                    }
                />

                <DataTable
                    columns={columnsPending}
                    data={pendingFarmers}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    toolbar={
                        <>
                            <div>
                                <Label htmlFor="search" className="text-xs">
                                    Global Search <Search size={15} />
                                </Label>
                                <Input
                                    placeholder="Search for farmers..."
                                    value={globalFilter}
                                    id="search"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                        </>
                    }
                />
            </div>
        </AdminLayout>
    )
}
