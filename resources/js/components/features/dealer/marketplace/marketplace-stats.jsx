import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, PackageIcon, TrendingUpIcon, UsersIcon } from "lucide-react"

const MarketplaceStats = ({ stats }) => {
    const statCards = [
        {
            title: 'Active Farmers',
            value: stats.total_farmers,
            icon: UsersIcon,
        },
        {
            title: 'Active Plantings',
            value: stats.active_plantings,
            icon: PackageIcon,
        },
        {
            title: 'Total Yield',
            value: stats.total_yield_kg ? `${stats.total_yield_kg.toFixed(0)} kg` : '—',
            icon: TrendingUpIcon,
        },
        {
            title: 'Avg Days to Harvest',
            value: stats.avg_days_to_harvest ? Math.round(stats.avg_days_to_harvest) : '—',
            icon: CalendarIcon,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
export default MarketplaceStats