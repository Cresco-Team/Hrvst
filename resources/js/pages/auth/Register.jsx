import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

import PersonalInfoFields from '@/components/Registration/PersonalInfoFields';
import LocationFields from '@/components/Registration/LocationFields';
import GeolocationBtn from '@/components/Buttons/GeolocationBtn';
import CropSelection from '@/components/Registration/CropSelectionFields';
import MapModal from '@/components/Modals/Maps/MapModal';
import PendingModal from '@/components/Modals/Alerts/PendingModal';
import Button from '@/components/Buttons/Button';

// Municipality coordinates for Benguet Province
const MUNICIPALITY_COORDS = {
    '1': { lat: 16.4120, lng: 120.5960 },
    '2': { lat: 16.4565, lng: 120.5897 },
    '3': { lat: 16.3719, lng: 120.6869 },
    '4': { lat: 16.4823, lng: 120.5432 },
    '5': { lat: 16.3108, lng: 120.5869 },
    '6': { lat: 16.5300, lng: 120.6200 },
    '7': { lat: 16.5800, lng: 120.6900 },
    '8': { lat: 16.7800, lng: 120.6700 },
    '9': { lat: 16.5200, lng: 120.8300 },
    '10': { lat: 16.6700, lng: 120.8400 },
    '11': { lat: 16.4700, lng: 120.8600 },
    '12': { lat: 16.5500, lng: 120.5900 },
    '13': { lat: 16.6900, lng: 120.6500 },
    '14': { lat: 16.8700, lng: 120.7800 },
};

export default function Register({ municipalities = [], crops = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        municipality_id: '',
        barangay_id: '',
        latitude: '',
        longitude: '',
        image_path: null,
        crops: [],
    });

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);

    // Map State
    const [mapCenter, setMapCenter] = useState([16.4, 120.6]);
    const [mapZoom, setMapZoom] = useState(10);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [municipalityName, setMunicipalityName] = useState('');
    const [barangayName, setBarangayName] = useState('');

    // Image State
    const [imagePreview, setImagePreview] = useState(null);

    // Municipality Change Handler
    const handleMunicipalityChange = async (municipalityId) => {
        setData({ ...data, municipality_id: municipalityId, barangay_id: '' });
        setBarangays([]);
        setBarangayName('');
        
        if (!municipalityId) {
            setMunicipalityName('');
            setMapCenter([16.4, 120.6]);
            setMapZoom(10);
            return;
        }
        
        try {
            // Fetch barangays
            const response = await fetch(`/api/barangays?municipality_id=${municipalityId}`);
            const result = await response.json();
            setBarangays(result);

            // Get municipality info
            const municipality = municipalities.find(m => String(m.id) === String(municipalityId));
            if (municipality) {
                setMunicipalityName(municipality.name);
                
                // Update map center
                const coords = MUNICIPALITY_COORDS[municipalityId];
                if (coords) {
                    setMapCenter([coords.lat, coords.lng]);
                    setMapZoom(12);
                }
            }
        } catch (error) {
            console.error('Error fetching barangays:', error);
        }
    };

    // Barangay Change Handler
    const handleBarangayChange = (barangayId) => {
        setData({ ...data, barangay_id: barangayId });

        const barangay = barangays.find(b => String(b.id) === String(barangayId));
        if (barangay) {
            setBarangayName(barangay.name);
            setMapZoom(14);
        }
    };

    // Map Handlers
    const openMapModal = () => {
        if (!data.barangay_id) {
            alert('Please select a barangay first');
            return;
        }
        
        // Set marker to existing location or map center
        if (data.latitude && data.longitude) {
            setMarkerPosition([parseFloat(data.latitude), parseFloat(data.longitude)]);
        } else {
            setMarkerPosition(null);
        }
        
        setIsMapOpen(true);
    };

    const handleMapClick = (lat, lng) => {
        setMarkerPosition([lat, lng]);
    };

    const confirmLocation = () => {
        if (!markerPosition) {
            alert('Please click on the map to set your location');
            return;
        }

        const [lat, lng] = markerPosition;
        
        // Validate within Benguet boundaries
        const withinBenguet = (lat >= 16.0 && lat <= 16.9) && (lng >= 120.3 && lng <= 120.9);
        
        if (!withinBenguet) {
            if (!confirm('Warning: This location appears to be outside Benguet Province. Continue anyway?')) {
                return;
            }
        }
        
        setData('latitude', String(lat));
        setData('longitude', String(lng));
        setIsMapOpen(false);
    };

    // Image Change Handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image_path', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Crop Toggle Handler
    const handleCropToggle = (cropId) => {
        const currentCrops = data.crops;
        if (currentCrops.includes(cropId)) {
            setData('crops', currentCrops.filter(id => id !== cropId));
        } else if (currentCrops.length < 5) {
            setData('crops', [...currentCrops, cropId]);
        }
    };

    // Form Submit Handler
    const submit = (e) => {
        e.preventDefault();

        if (!data.latitude || !data.longitude) {
            alert('Please set your farm location on the map');
            return;
        }

        post(route('register'), {
            onSuccess: () => {
                setShowPendingModal(true);
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handlePendingModalClose = () => {
        setShowPendingModal(false);
        window.location.href = '/';
    };

    return (
        <>
            {/* STEP 1 : Personal Information*/}
            {/* Full name */}
            {/* Email address */}
            {/* Password */}
            {/* Phone number */}

            {/* STEP 2 : Address & Location */}
            {/* Municipality */}
            {/* Barangay */}
            {/* Geolocation */}

            {/* STEP 3 : Crops Planted */}
            {/* Crops */}

            <Head title="Register" />
            
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
                <div className='w-full max-w-sm md:max-w-4xl'>
                    <div className={cn("flex flex-col gap-6")}>
                        <Card className="overflow-hidden p-0">
                            <CardContent className="grid p-0 md:grid-cols-2">
                                
                            </CardContent>
                        </Card>
                    </div>
                
                    <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12">
                        <div className="max-w-md text-center">
                            <div className="flex justify-center mb-8">
                                <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                                </svg>
                            </div>
                            <h1 className="text-5xl font-bold text-white mb-6">
                                Create your free account
                            </h1>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                        <div className="w-full max-w-md">
                            {/* Already have account link */}
                            <div className="text-right mb-8">
                                <span className="text-gray-600">Already have an account?</span>
                                {' '}
                                <Link
                                    href={route('login')}
                                    className="text-gray-900 font-medium hover:underline"
                                >
                                    Sign In →
                                </Link>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <PersonalInfoFields
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    showPasswordConfirmation={showPasswordConfirmation}
                                    setShowPasswordConfirmation={setShowPasswordConfirmation}
                                />

                                <LocationFields
                                    data={data}
                                    municipalities={municipalities}
                                    barangays={barangays}
                                    onMunicipalityChange={handleMunicipalityChange}
                                    onBarangayChange={handleBarangayChange}
                                    errors={errors}
                                />

                                <GeolocationBtn
                                    hasLocation={!!(data.latitude && data.longitude)}
                                    onOpenMap={openMapModal}
                                    errors={errors}
                                />

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {errors.image_path && <p className="text-red-600 text-sm mt-1">{errors.image_path}</p>}
                                    <div className="mt-3">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-md border border-gray-200"
                                        />
                                    </div>
                                </div>

                                {crops.length > 0 && (
                                    <CropSelection
                                        crops={crops}
                                        selectedCrops={data.crops}
                                        onCropToggle={handleCropToggle}
                                        errors={errors}
                                    />
                                )}

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    size="lg" 
                                    fullWidth 
                                    disabled={processing}
                                >
                                    {processing ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                center={mapCenter}
                zoom={mapZoom}
                markerPosition={markerPosition}
                municipalityName={municipalityName}
                barangayName={barangayName}
                onLocationSelect={handleMapClick}
                onConfirm={confirmLocation}
            />

            {/* Pending Modal */}
            <PendingModal
                isOpen={showPendingModal}
                onClose={handlePendingModalClose}
            />
        </>
    );
}