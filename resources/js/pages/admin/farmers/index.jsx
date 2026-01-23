import DataTable from "@/components/admin/data-table"
import { columns as columnsApproved } from "@/components/admin/farmers/columns/columns-approved"
import { columns as columnsPending } from "@/components/admin/farmers/columns/columns-pending"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import AuthLayout from "@/layouts/auth-layout"


const Farmers = ({ approvedFarmers, pendingFarmers }) => {
    const [globalFilter, setGlobalFilter] = useState('')

    return(
        <AuthLayout title={'Farmers Spreadsheet'}>
            <div className="h-95 p-0 space-y-5 overflow-y-auto">
                <Card>
                    <CardContent>
                        <DataTable
                        columns={columnsApproved}
                        data={approvedFarmers}
                        globalFilter={globalFilter}
                        onGlobalFilterChange={setGlobalFilter}
                        className={'text-xs min-h-50'}
                        toolbar={
                            <div className="w-full flex justify-between items-center">
                                <h3>Approved Farmers</h3>

                                <Input
                                    placeholder="Search approved farmers..."
                                    value={globalFilter}
                                    id="search"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="max-w-3xs"
                                />
                            </div>
                        }
                    />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent>
                        <DataTable
                            columns={columnsPending}
                            data={pendingFarmers}
                            globalFilter={globalFilter}
                            onGlobalFilterChange={setGlobalFilter}
                            className={'text-xs'}
                            toolbar={
                                <div className="w-full flex justify-between items-center">
                                    <h3>Pending Farmers</h3>

                                    <Input
                                        placeholder="Search pending farmers..."
                                        value={globalFilter}
                                        id="search"
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="max-w-3xs"
                                    />
                                </div>
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    )
}
export default Farmers
