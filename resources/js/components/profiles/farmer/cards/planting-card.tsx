import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
    MoreVertical, 
    Edit, 
    CheckCircle, 
    Trash2, 
    Calendar,
    Clock
} from 'lucide-react';
import EditPlantingDialog from '../dialogs/edit-planting-dialog';

export default function PlantingCard({ planting, availableCrops, today }) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    const handleHarvest = () => {
        if (!confirm('Mark this crop as harvested?')) return;
        
        router.post(
            route('farmer.plantings.harvest', planting.id),
            {},
            { preserveScroll: true }
        );
    };

    const handleDelete = () => {
        if (!confirm(`Delete planting record for ${planting.crop_name}? This cannot be undone.`)) return;
        
        router.delete(route('farmer.plantings.destroy', planting.id), {
            preserveScroll: true,
        });
    };

    const getProgressPercentage = () => {
        if (planting.days_until_harvest === null) return 0;
        if (planting.days_until_harvest < 0) return 100;
        
        const totalDays = Math.abs(planting.days_until_harvest);
        return Math.min(100, Math.max(0, 100 - (planting.days_until_harvest / totalDays) * 100));
    };

    const getStatusColor = () => {
        if (planting.status_badge === 'Overdue') return 'destructive';
        if (planting.status_badge === 'Growing') return 'default';
        return 'secondary';
    };

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="relative pb-0">
                    {planting.crop_image && (
                        <div className="aspect-video rounded-md overflow-hidden mb-4">
                            <img
                                src={planting.crop_image.startsWith('http') 
                                    ? planting.crop_image 
                                    : `/storage/${planting.crop_image}`}
                                alt={planting.crop_name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">{planting.crop_name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{planting.category}</p>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleHarvest}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Harvested
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleDelete}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
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
                                <Clock className="mr-1 h-4 w-4" />
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
                                <Calendar className="mr-1 h-4 w-4" />
                                {planting.date_planted_display}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Expected Harvest</p>
                            <p className="font-medium flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
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

            <EditPlantingDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                planting={planting}
                today={today}
            />
        </>
    );
}