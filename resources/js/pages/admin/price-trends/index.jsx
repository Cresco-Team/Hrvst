
import { CropTrends } from "@/components/admin/price-trends/crop-trends"
import { VolatilityAlert } from "@/components/admin/price-trends/cards/volatility-alert"
import { MarketPulse } from "@/components/admin/price-trends/cards/market-pulse"
import {
    Chart as ChartJS,
    LineElement,
    ArcElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    Colors,
} from "chart.js"
import "chartjs-adapter-date-fns"
import {  Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import AuthLayout from "@/layouts/auth-layout"

ChartJS.register(
    LineElement,
    ArcElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    Colors,
  )
  

const PriceTrends = ({ trends, marketMovers, volatilityAlert, marketPulse }) => {
    return(
        <AuthLayout title={'Price Trends'}>
            <div className="grid grid-cols-10 row-cols-3 gap-4 h-full">

                {/* Market Movers */}
                <Card className="col-span-10 gap-0 py-4">
                    <CardHeader>
                        <CardTitle>Market Movers</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="grid grid-cols-3 gap-4">
                        {marketMovers.map((crop, index) => (
                            <div
                                key={crop.crop_id}
                                className="flex gap-x-4 col-span-1 items-center"
                            >
                                <div>
                                    <h3 className="text-xs text-muted-foreground">Vegetable: {crop.crop_name}</h3>
                                    <p>
                                        <span className="font-bold">PHP {crop.current_price} </span>
                                        <span className="text-primary text-xs bg-primary/10">+{crop.percent_change}%</span>
                                    </p>
                                </div>
                                <div>
                                    <Avatar className="rounded-sm">
                                        <AvatarImage src={crop.crop_image}></AvatarImage>
                                        <AvatarFallback>CC</AvatarFallback>
                                    </Avatar>
                                </div>
                                {index < marketMovers.length - 1 && <Separator orientation="vertical" />}
                            </div>
                        ))}
                    </CardContent>
                        
                </Card>

                {/* Volatility */}
                <Card className="col-span-3 row-span-1">
                    <CardHeader>
                        <CardTitle>High Volatility</CardTitle>
                        <CardDescription>Vegetable with wide price gap</CardDescription>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                    <VolatilityAlert alert={volatilityAlert} />
                </Card>
                    
                <Card className="col-span-7 row-span-2 h-full">
                    <h2 className="mb-2 h-full">Price Trends</h2>

                    <CropTrends trendsData={trends} />
                </Card>

                <Card className="col-span-3 row-span-1">
                    <MarketPulse pulse={marketPulse} />
                </Card>
                
            </div>
        </AuthLayout>
    )
}
export default PriceTrends
