
import Stats from "@/components/admin/dashboard/stats";
import Market from "@/components/admin/dashboard/market";
import Volatility from "@/components/admin/dashboard/volatility";
import TopMunicipality from "@/components/admin/dashboard/top-municipality";
import AuthLayout from "@/layouts/auth-layout";

export default function Dashboard({ 
    stats,
    ranks,
    frequency,
    marketVolatility,
    topMunicipality,
}) {

    return (
        <AuthLayout title={"Dashboard"}>
            <div className="h-95 overflow-y-auto">
                <div className="grid grid-cols-8 grid-rows-6 gap-2">
                    <Stats stats={stats} />
                    <Market ranks={ranks} frequency={frequency} />
                    <Volatility marketVolatility={marketVolatility} />
                    <TopMunicipality topMunicipality={topMunicipality} /> 
                </div>
            </div>
        </AuthLayout>
    )
}