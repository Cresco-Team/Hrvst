import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditPlantingDialog({ open, onOpenChange, planting, today }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        date_planted: '',
        expected_harvest_date: '',
        yield_kg: '',
    });

    useEffect(() => {
        if (planting && open) {
            setData({
                date_planted: planting.date_planted || '',
                expected_harvest_date: planting.expected_harvest_date || '',
                yield_kg: planting.yield_kg || '',
            });
        }
    }, [planting, open]);

    const handleSubmit = () => {
        patch(route('farmer.plantings.update', planting.id), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    if (!planting) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Planting: {planting.crop_name}</DialogTitle>
                    <DialogDescription>
                        Update planting details. Only active plantings can be edited.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit_date_planted">Date Planted</Label>
                        <Input
                            id="edit_date_planted"
                            type="date"
                            value={data.date_planted}
                            onChange={(e) => setData('date_planted', e.target.value)}
                            max={today}
                        />
                        {errors.date_planted && (
                            <p className="text-sm text-destructive">{errors.date_planted}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_expected_harvest_date">Expected Harvest Date</Label>
                        <Input
                            id="edit_expected_harvest_date"
                            type="date"
                            value={data.expected_harvest_date}
                            onChange={(e) => setData('expected_harvest_date', e.target.value)}
                            min={data.date_planted}
                        />
                        {errors.expected_harvest_date && (
                            <p className="text-sm text-destructive">{errors.expected_harvest_date}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_yield_kg">Expected Yield (kg)</Label>
                        <Input
                            id="edit_yield_kg"
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}