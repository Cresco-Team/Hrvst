import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function PlantingsTable({ plantings }) {
    const getStatusVariant = (status) => {
        switch (status) {
            case 'harvested':
                return 'default';
            case 'expired':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    if (plantings.length === 0) {
        return (
            <Card className="p-8 text-center text-muted-foreground">
                No archived plantings found
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            {/* Desktop View */}
            <div className="hidden md:block rounded-md border overflow-hidden">
                <div className="bg-muted">
                    <div className="grid grid-cols-7 gap-4 p-4 font-medium text-sm">
                        <div>Crop</div>
                        <div>Category</div>
                        <div>Date Planted</div>
                        <div>Expected Harvest</div>
                        <div>Date Harvested</div>
                        <div>Yield (kg)</div>
                        <div>Status</div>
                    </div>
                </div>
                <div className="divide-y">
                    {plantings.map((planting) => (
                        <div key={planting.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                                {planting.crop_image && (
                                    <img
                                        src={planting.crop_image.startsWith('http') 
                                            ? planting.crop_image 
                                            : `/storage/${planting.crop_image}`}
                                        alt={planting.crop_name}
                                        className="h-8 w-8 rounded object-cover"
                                    />
                                )}
                                <span className="font-medium">{planting.crop_name}</span>
                            </div>
                            <div>{planting.category}</div>
                            <div>{planting.date_planted_display}</div>
                            <div>{planting.expected_harvest_date_display || '—'}</div>
                            <div>{planting.date_harvested_display || '—'}</div>
                            <div>{planting.yield_kg || '—'}</div>
                            <div>
                                <Badge variant={getStatusVariant(planting.status)}>
                                    {planting.status_badge}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-2">
                {plantings.map((planting) => (
                    <Card key={planting.id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {planting.crop_image && (
                                    <img
                                        src={planting.crop_image.startsWith('http') 
                                            ? planting.crop_image 
                                            : `/storage/${planting.crop_image}`}
                                        alt={planting.crop_name}
                                        className="h-10 w-10 rounded object-cover"
                                    />
                                )}
                                <div>
                                    <p className="font-medium">{planting.crop_name}</p>
                                    <p className="text-sm text-muted-foreground">{planting.category}</p>
                                </div>
                            </div>
                            <Badge variant={getStatusVariant(planting.status)}>
                                {planting.status_badge}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="text-muted-foreground">Planted</p>
                                <p>{planting.date_planted_display}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Harvested</p>
                                <p>{planting.date_harvested_display || '—'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Expected</p>
                                <p>{planting.expected_harvest_date_display || '—'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Yield</p>
                                <p>{planting.yield_kg ? `${planting.yield_kg} kg` : '—'}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}