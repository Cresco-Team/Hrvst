import { Link, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import AuthLayout from "@/layouts/auth-layout"

const CreateCrop = ({ categories }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: '',
        category_id: '',
        image_path: '',
        crop_weeks: '',
        price_min: '',
        price_max: '',
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('admin.crops.store'))
    }

    return (
        <AuthLayout title={"New Vegetable"}>
            <form onSubmit={submit}>
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
                                        onChange={(e) => setData('image_path', e.target.files?.[0] ?? null)}
                                        type="file"
                                    ></Input>
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
                                <Field>
                                    <FieldLabel htmlFor="crop">Minimum Price</FieldLabel>
                                    <Input
                                        id="crop"
                                        value={data.price_min}
                                        onChange={(e) => setData('price_min', e.target.value)}
                                        placeholder="00.00"
                                    ></Input>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="crop">Maximum Price</FieldLabel>
                                    <Input
                                        id="crop"
                                        value={data.price_max}
                                        onChange={(e) => setData('price_max', e.target.value)}
                                        placeholder="00.00"
                                    ></Input>
                                </Field>
                            </FieldGroup>
                        </Card>
                    </div>
                    <div className="flex justify-end gap-5">
                        <Button asChild variant="destructive">
                            <Link
                                href={route('admin.crops.store')}
                            >
                                Cancel
                            </Link>
                        </Button>
                        
                        <Button className="cursor-pointer">
                                <PlusIcon />Save Crop
                        </Button>
                    </div>
                </FieldSet>
            </form>
        </AuthLayout>
    )
}
export default CreateCrop
