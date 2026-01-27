import { Link, useForm } from "@inertiajs/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import AppLayout from "@/layouts/app-layout"

const EditCrop = ({ crop, categories }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: crop.name,
        category_id: String(crop.category_id),
        image_path: null,
        crop_weeks: crop.crop_weeks,
    })

    const [imagePreview, setImagePreview] = useState(
        crop.image_path ? `/storage/${crop.image_path}` : null
    )

    return (
        <AppLayout title={'Edit Vegetable'}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    data._method = 'PUT',
                    post(route('admin.crops.update', crop.id), {
                        forceFormData: true,
                    })
                }}
            >
                <FieldSet>
                    <FieldLegend>Add Vegetable</FieldLegend>

                    <div className="flex flex-col md:flex-row gap-3">
                        <Card className="flex-3 px-4">
                            <FieldGroup className="gap-3">
                                <Field orientation="horizontal">
                                    <FieldLabel htmlFor="crop">Vegetable Name</FieldLabel>
                                    <Input
                                        id="crop"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Name of the vegetable..."
                                    ></Input>
                                </Field>
                                <Field orientation="horizontal">
                                    <FieldLabel htmlFor="category">Category</FieldLabel>
                                    <Select
                                        id="category"
                                        value={data.category_id}
                                        onValueChange={(value) => {
                                            setData('category_id', value)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field orientation="horizontal">
                                    <FieldLabel htmlFor="picture">Picture</FieldLabel>
                                    <Input
                                        id="picture"
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null
                                            setData('image_path', file)

                                            if(file) {
                                                setImagePreview(URL.createObjectURL(file))
                                            }
                                        }}
                                    ></Input>
                                    {crop.image_path && (
                                        <img
                                            src={imagePreview}
                                            alt={crop.name}
                                            className="h-32 w-32 object-cover rounded-md border"
                                        />
                                    )}
                                </Field>
                            </FieldGroup>
                        </Card>

                        <Card className="flex-2 p-3 rounded-lg border">
                        <FieldGroup className="gap-3">
                                <Field>
                                    <FieldLabel htmlFor="crop">Week span</FieldLabel>
                                    <Input
                                        id="crop"
                                        value={data.crop_weeks}
                                        onChange={(e) => setData('crop_weeks', e.target.value)}
                                        placeholder="Number of weeks unil harvest..."
                                    ></Input>
                                </Field>
                            </FieldGroup>
                        </Card>
                    </div>
                    <div className="flex justify-end gap-5">
                        <Link
                            href={route('admin.crops.index')}
                        >
                            <Button type="button" variant="destructive">Cancel</Button>
                        </Link>
                        
                        <Button type="submit"><PlusIcon />Update Crop</Button>
                    </div>
                </FieldSet>
            </form>
        </AppLayout>
    )
}
export default EditCrop
