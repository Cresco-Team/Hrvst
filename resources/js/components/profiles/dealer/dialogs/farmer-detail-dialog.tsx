import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MailIcon, MapPinIcon, PackageIcon, PhoneIcon } from 'lucide-react'

const FarmerDetailDialog = ({ open, onOpenChange, farmerId }) => {
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && farmerId) {
            fetchFarmerDetails();
        }
    }, [open, farmerId]);

    const fetchFarmerDetails = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(route('dealer.farmers.show', farmerId));
            
            if (!response.ok) {
                throw new Error('Failed to load farmer details');
            }
            
            const data = await response.json();
            setFarmer(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setFarmer(null);
            setError(null);
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-150 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Farmer Details</DialogTitle>
                    <DialogDescription>
                        Complete information about this farmer and their active crops
                    </DialogDescription>
                </DialogHeader>

                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                )}

                {error && (
                    <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {farmer && !loading && (
                    <div className="space-y-6">
                        {/* Farmer Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">{farmer.name}</h3>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Location</p>
                                        <p className="text-muted-foreground">
                                            {farmer.location.barangay}, {farmer.location.municipality}
                                        </p>
                                    </div>
                                </div>

                                {farmer.phone && (
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Phone</p>
                                            <p className="text-muted-foreground">{farmer.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {farmer.email && (
                                    <div className="flex items-center gap-2">
                                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-muted-foreground">{farmer.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Crops */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <PackageIcon className="h-5 w-5" />
                                <h3 className="font-semibold">
                                    Active Crops ({farmer.active_crops.length})
                                </h3>
                            </div>

                            {farmer.active_crops.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No active crops at the moment
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {farmer.active_crops.map((crop, index) => (
                                        <div
                                            key={index}
                                            className="p-3 border rounded-md space-y-2 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{crop.crop_name}</p>
                                                    <Badge variant="secondary" className="mt-1">
                                                        {crop.category}
                                                    </Badge>
                                                </div>
                                                {crop.yield_kg && (
                                                    <div className="text-right">
                                                        <p className="text-sm text-muted-foreground">Expected Yield</p>
                                                        <p className="font-semibold">{crop.yield_kg} kg</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Planted</p>
                                                    <p>{crop.date_planted}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Expected Harvest</p>
                                                    <p>{crop.expected_harvest || '—'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
export default FarmerDetailDialog