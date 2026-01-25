import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, MessageSquareIcon, PackageIcon, PhoneIcon, UserIcon } from "lucide-react"


const PlantingCard = ({ planting, onContactFarmer }) => {
    const getStatusColor = () => {
        if (planting.status_badge === 'Overdue') return 'destructive'
        if (planting.status_badge === 'Growing') return 'default'
        return 'secondary'
    }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="relative pb-0">
                {planting.crop.image && (
                    <div className="aspect-video rounded-md overflow-hidden mb-4">
                        <img
                            src={planting.crop.image.startsWith('http')
                                ? planting.crop.image
                                : `/storage/${planting.crop.image}`}
                            alt={planting.crop.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">{planting.crop.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{planting.crop.category}</p>
                        </div>
                        <Badge variant={getStatusColor()}>{planting.status_badge}</Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                {/* Farmer Info */}
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{planting.farmer.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                {planting.farmer.barangay}, {planting.farmer.municipality}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{planting.farmer.phone}</span>
                    </div>
                </div>

                {/* Harvest Timeline */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            Planted
                        </p>
                        <p className="font-medium">{planting.date_planted}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            Expected Harvest
                        </p>
                        <p className="font-medium">{planting.expected_harvest_date || 'Not set'}</p>
                    </div>
                </div>

                {/* Yield Info */}
                {planting.yield_kg && (
                    <div className="flex items-center gap-2 text-sm">
                        <PackageIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <span className="text-muted-foreground">Expected Yield: </span>
                            <span className="font-medium">{planting.yield_kg} kg</span>
                        </div>
                    </div>
                )}

                {/* Days Until Harvest */}
                {planting.days_until_harvest !== null && (
                    <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                            {planting.days_until_harvest >= 0
                                ? `Ready in ${planting.days_until_harvest} days`
                                : `${Math.abs(planting.days_until_harvest)} days overdue`}
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <Button 
                    onClick={() => onContactFarmer(planting.farmer.id, planting.id)} 
                    className="w-full"
                >
                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                    Contact Farmer
                </Button>
            </CardFooter>
        </Card>
    )
}
export default PlantingCard