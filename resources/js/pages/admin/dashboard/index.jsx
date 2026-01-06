import AdminLayout from "@/layouts/admin-layout";
import Stats from "@/components/admin/dashboard/stats";
import Market from "@/components/admin/dashboard/market";
import Volatility from "@/components/admin/dashboard/volatility";
import TopMunicipality from "@/components/admin/dashboard/top-municipality";

export default function Dashboard({ 
    stats,
    ranks,
    frequency,
    marketVolatility,
    topMunicipality,
}) {
    console.log(topMunicipality)

    return (
        <AdminLayout>
            <div className="h-95 overflow-y-auto">
                <div className="grid grid-cols-8 grid-rows-6 gap-2">
                    <Stats stats={stats} />
                    <Market ranks={ranks} frequency={frequency} />
                    <Volatility marketVolatility={marketVolatility} />
                    <TopMunicipality topMunicipality={topMunicipality} /> 
                </div>
            </div>
        </AdminLayout>
    )
}