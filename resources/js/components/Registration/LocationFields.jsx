import { useEffect, useState } from 'react';
import axios from 'axios';

import MapDialog from '@/components/Registration/MapDialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Spinner } from '@/components/ui/spinner';

import InputError from '@/components/InputError';
import { Button } from '@/components/ui/button';
import { MapPinned } from 'lucide-react';

export default function Location({ data, setData, errors, municipalities, }) {
    /* Address */
    const [barangays, setBarangays] = useState([]);
    const [loadingBarangays, setLoadingBarangays] = useState(false);
    /* Map */
    const [mapCenter, setMapCenter] = useState([16.4484, 120.5905]);
    const [mapZoom, setMapZoom] = useState(10);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [loadingCoordinates, setLoadingCoordinates] = useState(false);

    /* Fetches Barangay by Municipality */

    useEffect(() => {
        if (!data.municipality_id) {
            setBarangays([]);
            setData('barangay_id', '');
            setMapCenter([16.4484, 120.5905]);
            setMapZoom(10);
            return;
        }
        setLoadingBarangays(true);
        setLoadingCoordinates(true);

        axios
            .get(`/api/barangays?municipality_id=${data.municipality_id}`)
            .then((response) => {
                setBarangays(response.data);
            })
            .finally(() => setLoadingBarangays(false));
        
        axios
            .get(`/api/municipalities/${data.municipality_id}`)
            .then((response) => {
                const { latitude, longitude } = response.data;
                setMapCenter([latitude, longitude]);
                setMapZoom(12);
            })
            .finally(() => setLoadingCoordinates(false));
    }, [data.municipality_id]);

    const handleMapClick = (latitude, longitude) => {
        setMarkerPosition([latitude, longitude]);
    }

    const saveData = () => {
        if (!markerPosition) return;
        const [lat, lng] = markerPosition;
        setData('latitude', lat);
        setData('longitude', lng);
    }

    return (
        <>
            <div className="flex-0 flex flex-col items-center gap-2 text-center">
                <h1 className="inline-flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold gap-1 sm:gap-2">
                    <MapPinned size={20} className="sm:w-6 sm:h-6" />
                    Set your Farm Address!
                </h1>
            </div>

            <Field>
                <FieldLabel htmlFor="municipality" className="text-sm sm:text-base">Municipality</FieldLabel>
                <Select value={data.municipality_id}
                    onValueChange={(value) => {
                        setData('municipality_id', value);
                        setData('barangay_id', '');
                    }}
                >
                    <SelectTrigger className='w-full h-10 sm:h-11 text-sm sm:text-base'>
                        <SelectValue placeholder="Select your Municipality" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Benguet Municipalities</SelectLabel>
                            {municipalities?.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                    {m.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className='h-[16px]'>
                    <InputError message={errors.municipality_id} className="mt-2 text-right text-xs" />
                </div>
            </Field>

            <Field>
                <FieldLabel htmlFor="barangay" className="text-sm sm:text-base">Barangay</FieldLabel>
                <Select value={data.barangay_id} required disabled={!data.municipality_id || loadingBarangays}
                    onValueChange={(value) => setData('barangay_id', value)}
                >
                    <SelectTrigger className='w-full h-10 sm:h-11 text-sm sm:text-base'>
                        <SelectValue placeholder={loadingBarangays ? <Spinner/> : 'Select Barangay'}/>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Barangays</SelectLabel>
                            {barangays?.map((b) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                    {b.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className='h-[16px]'>
                    <InputError message={errors.barangay_id} className="mt-2 text-right text-xs" />
                </div>
            </Field>

            <Field className='flex-1'>
                <FieldLabel htmlFor='button'>Geolocation</FieldLabel>
                <Drawer>
                    <DrawerTrigger asChild disabled={!data.barangay_id || loadingCoordinates}>
                        <Button variant='secondary'>{loadingCoordinates ? 'Loading Geolocation' : 'Set Geolocation'}</Button>
                    </DrawerTrigger>

                    <DrawerContent>
                        <div className=' mx-auto w-full max-w-md gap-7'>
                            <DrawerHeader className='gap-4'>
                                <DrawerTitle>Set Geolocation</DrawerTitle>
                                <DrawerDescription>
                                    Set your farm&apos;s geolocation by selecting it on the map.
                                </DrawerDescription>
                            </DrawerHeader>

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

                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button variant='outline'>Cancel</Button>
                                </DrawerClose>
                                <DrawerClose asChild>
                                    <Button onClick={saveData}>Save</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
                <InputError message={[errors.latitude, errors.longitude]} className="mt-2" />
            </Field>
        </>
    );
}