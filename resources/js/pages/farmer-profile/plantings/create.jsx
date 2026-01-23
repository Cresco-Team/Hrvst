import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AuthLayout from "@/layouts/auth-layout"
import { Link, router, useForm } from "@inertiajs/react"
import { PlusIcon } from "lucide-react"
import { useEffect } from "react"


const CreatePlantings = ({ availableCrops, today }) => {
    const { data, setData, processing, errors, reset } = useForm({
        crop_id: '',
        date_planted: today,
        expected_harvest_date: '',
        yield_kg: '',
    })
    
    const selectedCrop = availableCrops.find(crop => crop.id === parseInt(data.crop_id))

    useEffect(() => {
        if (selectedCrop && data.date_planted) {
            const plantDate = new Date(data.date_planted)
            const harvestDate = new Date(plantDate)
            harvestDate.setDate(harvestDate.getDate() + (selectedCrop.crop_weeks * 7))
            
            const year = harvestDate.getFullYear()
            const month = String(harvestDate.getMonth() + 1).padStart(2, '0')
            const day = String(harvestDate.getDate()).padStart(2, '0')
            
            setData('expected_harvest_date', `${year}-${month}-${day}`)
        }
    }, [data.crop_id, data.date_planted])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        router.post(route('farmer.plantings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
            },
        })
    }

    return (
        <AuthLayout title={'Create Plantings'}>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Add Plants</h1>
                        <p className="text-muted-foreground">Add new vegetables for sale</p>
                    </div>
                </div>
                
                <Card className="overflow-hidden p-0 mx-10">
                    <CardContent className="grid p-0 grid-cols-4">
                        <form onSubmit={handleSubmit} className="col-span-3 p-8">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="crop_id">Crop</FieldLabel>
                                    <Select
                                        value={data.crop_id.toString()}
                                        onValueChange={(value) => setData('crop_id', value)}
                                    >
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder='Select a crop...' />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {availableCrops.map((crop) => (
                                                <SelectItem key={crop.id} value={crop.id.toString()} className="cursor-pointer">
                                                    {crop.name} ({crop.category}) - {crop.crop_weeks} weeks
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <Field className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="date_planted">Date Planted</FieldLabel>
                                            <Input 
                                                id="date_planted"
                                                type="date"
                                                value={data.date_planted}
                                                onChange={(e) => setData('date_planted', e.target.value)}
                                                max={today}
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="expected_harvest_date">Expected Harvest Date</FieldLabel>
                                            <Input 
                                                id="expected_harvest_date"
                                                type="date"
                                                value={data.expected_harvest_date}
                                                onChange={(e) => setData('expected_harvest_date')}
                                                min={data.date_planted}
                                            />
                                        </Field>
                                    </Field>
                                    {selectedCrop && (
                                        <p className="text-xs text-muted-foreground">
                                            Auto-calculated based on {selectedCrop.crop_weeks} weeks growth cycle
                                        </p>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="yield_kg">Expected Yield (kg)</FieldLabel>
                                    <Input 
                                        id="yield_kg"
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g., 150.5"
                                        value={data.yield_kg}
                                        onChange={(e) => setData('yield_kg', e.target.value)}
                                    />
                                </Field>

                                <Field>
                                    <div className="flex justify-end gap-3 w-full pr-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            onClick={() => router.get(route('farmer.plantings.index'))}
                                            disabled={processing}
                                            className="cursor-pointer"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            size="lg"
                                            disabled={processing}
                                            className="cursor-pointer"
                                        >
                                            {processing ? 'Adding...' : 'Add Planting'}
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </form>

                        <div className="bg-green-300 relative block" />
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    )
}
export default CreatePlantings
