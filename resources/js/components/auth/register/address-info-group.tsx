import { router } from "@inertiajs/react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ResponsiveOverlay from "@/components/responsive/responsiveOverlay"
import MapDialog from "./MapDialog"

const AddressInfoGroup = ({data, setData, municipalities, barangays}) => {
    const [mapOpen, setMapOpen] = useState(false)
    const [markerPosition, setMarkerPosition] = useState(null)
    
    const selectedMunicipality = municipalities.find(m => String(m.id) === String(data.municipalityId))
    const mapCenter = selectedMunicipality 
        ? [parseFloat(selectedMunicipality.latitude), parseFloat(selectedMunicipality.longitude)]
        : [16.4586, 120.5812]
    const mapZoom = 13

    const handleMapClick = (lat, lng) => {
        setMarkerPosition([lat, lng])
    }

    const saveData = () => {
        if (markerPosition) {
            setData('latitude', markerPosition[0])
            setData('longitude', markerPosition[1])
        }
    }

    return (
        <FieldGroup>
            <Field>
                <FieldLabel htmlFor="municipality">Municipality</FieldLabel>
                <Select
                    name="municipality"
                    value={data.municipalityId}
                    onValueChange={value => {
                        setData('municipalityId', value)
                        setData('barangayId', '')
                        router.get(
                            route('register'),
                            { municipalityId: value },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                                only: ['barangays']
                            }
                        )
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select your Municipality" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {municipalities.map((municipality: { id: number | string; name: string; latitude: string; longitude: string }) => (
                                <SelectItem
                                    key={municipality.id}
                                    value={String(municipality.id)}
                                >
                                    {municipality.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>

            <Field>
                <FieldLabel htmlFor="barangay">Barangay</FieldLabel>
                <Select
                    name="barangay"
                    disabled={!data.municipalityId}
                    value={data.barangayId}
                    onValueChange={(value) =>
                        setData('barangayId', value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select your Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {barangays.map((barangay: { id:number | string; name: string }) => (
                                <SelectItem
                                    key={barangay.id}
                                    value={String(barangay.id)}
                                >
                                    {barangay.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>

            <Field>
                <FieldLabel htmlFor="button">Geolocation</FieldLabel>
                <Button
                    type="button"
                    disabled={!data.barangayId}
                    onClick={() => {
                        setMapOpen(true)
                        if (data.latitude && data.longitude) {
                            setMarkerPosition([parseFloat(data.latitude), parseFloat(data.longitude)])
                        }
                    }}
                    variant="outline"
                >
                    Set Geolocation
                </Button>

                <ResponsiveOverlay
                    open={mapOpen}
                    onOpenChange={setMapOpen}
                    title="Set Geolocation"
                    description='Click on the map to set your location'
                >
                    <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerMove={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                    >
                        <MapDialog
                            center={mapCenter}
                            zoom={mapZoom}
                            onSelect={handleMapClick}
                            markerPosition={markerPosition}
                        />
                    </div>
                    <div className='flex w-full gap-4'>
                        <Button type="button" onClick={() => setMapOpen(false)} variant='outline' className='flex-1'>Cancel</Button>
                        <Button type="button" onClick={() => {saveData(); setMapOpen(false);}} className='flex-1'>Save</Button>
                    </div>
                </ResponsiveOverlay>
            </Field>
        </FieldGroup>
    )
}
export default AddressInfoGroup