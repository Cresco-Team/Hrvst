import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "@inertiajs/react"

const EditPLanting = ({ planting, today }) => {
    const { data, setData, patch, processing, errors, reset } = useForm({
            date_planted: planting.date_planted,
            expected_harvest_date: planting.expected_harvest_date,
            yield_kg: planting.yield_kg,
        })

    const handleSubmit = (e) => {
        e.preventDefault()

        patch(route('farmer.plantings.update', planting), {
            preventScroll: true,
            onSuccess: () => reset()
        })
    }

    return (
        <AppLayout title={`Edit ${planting.crop_name}`}>
            <div className="container mx-auto p-6 space-y-6">
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
                                    <FieldLabel>Crop</FieldLabel>
                                    <Select disabled defaultValue={planting.crop_name}>
                                        <SelectTrigger>
                                            <SelectValue></SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={planting.crop_name}>
                                                {planting.crop_name} ({planting.category})
                                            </SelectItem>
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
                                            {errors.date_planted && (
                                                <p className="text-sm text-destructive">{errors.date_planted}</p>
                                            )}
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
                                            {errors.expected_harvest_date && (
                                                <p className="text-sm text-destructive">{errors.expected_harvest_date}</p>
                                            )}
                                        </Field>
                                    </Field>
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
                                    {errors.yield_kg && (
                                        <p className="text-sm text-destructive">{errors.yield_kg}</p>
                                    )}
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
                                            {processing ? 'Saving...' : 'Save Planting'}
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </form>

                        <div className="relative block overflow-hidden h-full w-full">
                            <div style={{ backgroundImage: `url(${planting.crop_image})` }} className="absolute inset-0 bg-cover bg-center" />
                            <div className="absolute inset-0 bg-green-500/40" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
export default EditPLanting