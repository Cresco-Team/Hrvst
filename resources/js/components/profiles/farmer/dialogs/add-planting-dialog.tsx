import { useForm } from '@inertiajs/react'
import { useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns';

const AddPlantingDialog = ({ open, onOpenChange, availableCrops }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        crop_id: '',
        date_planted: format(new Date(), 'yyyy-MM-dd'),
        expected_harvest_date: '',
        yield_kg: '',
    });

    const selectedCrop = availableCrops.find(c => c.id === parseInt(data.crop_id));

    useEffect(() => {
        if (selectedCrop && data.date_planted) {
            const plantDate = new Date(data.date_planted);
            const harvestDate = new Date(plantDate);
            harvestDate.setDate(harvestDate.getDate() + (selectedCrop.crop_weeks * 7));
            setData('expected_harvest_date', format(harvestDate, 'yyyy-MM-dd'));
        }
    }, [data.crop_id, data.date_planted]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('farmer.plantings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Add New Planting</DialogTitle>
                    <DialogDescription>
                        Record a new crop that you've planted. Expected harvest date will be auto-calculated.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="crop_id">
                            Crop <span className="text-destructive">*</span>
                        </Label>
                        <Select 
                            value={data.crop_id.toString()} 
                            onValueChange={(value) => setData('crop_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a crop..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCrops.map((crop) => (
                                    <SelectItem key={crop.id} value={crop.id.toString()}>
                                        {crop.name} ({crop.category}) - {crop.crop_weeks} weeks
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.crop_id && (
                            <p className="text-sm text-destructive">{errors.crop_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date_planted">
                            Date Planted <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="date_planted"
                            type="date"
                            value={data.date_planted}
                            onChange={(e) => setData('date_planted', e.target.value)}
                            max={format(new Date(), 'yyyy-MM-dd')}
                        />
                        {errors.date_planted && (
                            <p className="text-sm text-destructive">{errors.date_planted}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expected_harvest_date">
                            Expected Harvest Date
                        </Label>
                        <Input
                            id="expected_harvest_date"
                            type="date"
                            value={data.expected_harvest_date}
                            onChange={(e) => setData('expected_harvest_date', e.target.value)}
                            min={data.date_planted}
                        />
                        {selectedCrop && (
                            <p className="text-xs text-muted-foreground">
                                Auto-calculated based on {selectedCrop.crop_weeks} weeks growth cycle
                            </p>
                        )}
                        {errors.expected_harvest_date && (
                            <p className="text-sm text-destructive">{errors.expected_harvest_date}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="yield_kg">Expected Yield (kg)</Label>
                        <Input
                            id="yield_kg"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 150.5"
                            value={data.yield_kg}
                            onChange={(e) => setData('yield_kg', e.target.value)}
                        />
                        {errors.yield_kg && (
                            <p className="text-sm text-destructive">{errors.yield_kg}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            {processing ? 'Adding...' : 'Add Planting'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default AddPlantingDialog