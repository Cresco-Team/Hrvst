
import { Link, router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVerticalIcon, EditIcon, CheckCircleIcon, Trash2Icon, CalendarIcon, ClockIcon } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

const PlantingCard = ({ planting }) => {
    const handleHarvest = () => {
        if (!confirm('Mark this crop as harvested?')) return
        
        router.post(
            route('farmer.plantings.harvest', planting.id),
            { preserveScroll: true }
        )
    }

    const handleDelete = () => {
        if (!confirm(`Delete planting record for ${planting.crop_name}? This cannot be undone.`)) return
        
        router.delete(route('farmer.plantings.destroy', planting.id), {
            preserveScroll: true,
        })
    }

    const getProgressPercentage = () => {
        if (planting.days_until_harvest === null) return 0
        if (planting.days_until_harvest < 0) return 100
        
        const totalDays = Math.abs(planting.days_until_harvest)
        return Math.min(100, Math.max(0, 100 - (planting.days_until_harvest / totalDays) * 100))
    }

    const getStatusColor = () => {
        if (planting.status_badge === 'Overdue') return 'destructive'
        if (planting.status_badge === 'Growing') return 'default'
        return 'secondary'
    }

    return (
        <Card className="pt-0 gap-2 overflow-hidden">
            <AspectRatio ratio={21/9}>
                <img
                    src={planting.crop_image.startsWith('http') 
                        ? planting.crop_image 
                        : `/storage/${planting.crop_image}`}
                    alt={planting.crop_name}
                    className="w-full h-full object-cover"
                />
            </AspectRatio>

            <CardHeader className="relative pb-0">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">{planting.crop_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{planting.category}</p>
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className='cursor-pointer'>
                                <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('farmer.plantings.edit', planting)}>
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleHarvest}>
                                <CheckCircleIcon className="mr-2 h-4 w-4" />
                                Mark as Harvested
                            </DropdownMenuItem>
                            <DropdownMenuSeparator></DropdownMenuSeparator>
                            <DropdownMenuItem 
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2Icon className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <Badge variant={getStatusColor()}>{planting.status_badge}</Badge>
                    {planting.days_until_harvest !== null && (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <ClockIcon className="mr-1 h-4 w-4" />
                            {planting.days_until_harvest >= 0 
                                ? `${planting.days_until_harvest} days left`
                                : `${Math.abs(planting.days_until_harvest)} days overdue`}
                        </div>
                    )}
                </div>

                {planting.days_until_harvest !== null && (
                    <div className="space-y-1">
                        <Progress value={getProgressPercentage()} />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Planted</p>
                        <p className="font-medium flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            {planting.date_planted_display}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Expected Harvest</p>
                        <p className="font-medium flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            {planting.expected_harvest_date_display || 'Not set'}
                        </p>
                    </div>
                </div>

                {planting.yield_kg && (
                    <div className="text-sm">
                        <p className="text-muted-foreground">Expected Yield</p>
                        <p className="font-medium">{planting.yield_kg} kg</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
export default PlantingCard