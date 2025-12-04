import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@/utils/leafletSetup';

// Function to Recenter the Map
function RecenterMap({ lat, lng, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], zoom || 14, { animate: true });
        }
    }, [lat, lng, zoom, map]);
    return null;
}

function ClickCapture({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.lat.toFixed(6), e.lng.toFixed(6));
        },
    });
    return null;
}

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
        crops: [],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [barangays, setBarangays] = useState([]); // For Listing Brangays belonging to a Selected Municipality
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [tempLat, setTempLat] = useState(16.4);
    const [tempLng, setTempLng] = useState(120.6);
    const [mapZoom, setMapZoom] = useState(10);
    const [municipalityName, setMunicipalityName] = useState('');
    const [barangayName, setBarangayName] = useState('');
    const [showPendingModal, setShowPendingModal] = useState(false);

    console.log('barangay_id:', data.barangay_id);
    console.log('latitude:', data.latitude);
    console.log('longitude:', data.longitude);
    console.log('tempLat:', tempLat);
    console.log('tempLng:', tempLng);

    // --------------------------------------------------------
    // Asynchronus Function to Handle Event when a User Selects or Changes a Municipality
    // --------------------------------------------------------
    const handleMunicipalityChange = async (municipalityId) => {
        // Initial Municipality State Update and Clearing the Barangay for the New Municipality
        setData({ ...data, municipality_id: municipalityId, barangay_id: '' });
        setBarangays([]);
        
        if (!municipalityId) { // If no Municipality Selected:
            // Resets the Municipality and Sets Temporary Lattitude & Longitude
            setMunicipalityName('');
            setTempLat(16.4);
            setTempLng(120.6);
            return;
        } // Else, a Municipality is Selected
        
        try {
            // Fetches List of Barangays Belonging to the Selected Municipality.
            const response = await fetch(`/api/barangays?municipality_id=${municipalityId}`);
            const result = await response.json(); // API List response is parsed as JSON
            setBarangays(result);

            // Searches a Local List of Muicipalities
            const municipality = municipalities.find(m => String(m.id) === String(municipalityId));
            
            if (municipality) { // If Municipality is Found:
                // Sets the Name, Latitude & Longitude
                setMunicipalityName(municipality.name);
                setTempLat(String(municipality.latitude));
                setTempLng(String(municipality.longitude));
            }
        } catch (error) { // Handles and Logs any Errors that Occur during Fetch Operation
            console.error('Error fetching barangays:', error);
        }
    };
    
    // --------------------------------------------------------
    // Synchronus Function to Handle Event when a User Selects or Changes a Barangay
    // --------------------------------------------------------
    const handleBarangayChange = (barangayId) => {
        // Setting the Barangay to the New Value
        setData({ ...data, barangay_id: barangayId });

        // Searches a Local List of Barangays
        const barangay = barangays.find(b => String(b.id) === String(barangayId));

        if (barangay) { // If Barangay is Found:
            setBarangayName(barangay.name); // Sets the Name
        }
    };

    // --------------------------------------------------------
    // Synchronus Function to Handle Event when a User Selects or Changes a Barangay
    // --------------------------------------------------------
    const handleCropToggle = (cropId) => {
        const currentCrops = data.crops;

        if (currentCrops.includes(cropId)) { // Deselecting an Already Selected Crop
            setData('crops', currentCrops.filter(id => id !== cropId));
        } else if (currentCrops.length < 3) { // Selecting a New Crop
            setData('crops', [...currentCrops, cropId]);
        }
    };

    // --------------------------------------------------------
    // Synchronus Function to Locate an Address on a Map Interface
    // --------------------------------------------------------
    const openMapModal = () => {
        // Sets the Coordinates || If user has not yet set a Location, it Falls back to tempLat & tempLng
        setTempLat(data.latitude || tempLat); // const [tempLat, setTempLat] = useState('16.4');
        setTempLng(data.longitude || tempLng); // const [tempLng, setTempLng] = useState('120.6');
        setMapZoom(12);
        setIsMapOpen(true);
    };

    const handleMapClick = (lat, lng) => {
        setTempLat(lat);
        setTempLng(lng);
    };

    const confirmLocation = () => {
        if (tempLat && tempLng) {
            // Validate if within Benguet boundaries (approximate)
            const lat = parseFloat(tempLat);
            const lng = parseFloat(tempLng);
            
            const withinBenguet = (lat >= 16.0 && lat <= 16.9) && (lng >= 120.3 && lng <= 120.9);
            
            if (!withinBenguet) {
                if (!confirm('Warning: This location appears to be outside Benguet Province. Continue anyway?')) {
                    return;
                }
            }
            
            setData('latitude', String(tempLat));
            setData('longitude', String(tempLng));
        }
        setIsMapOpen(false);
    };

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
            <Head title="Register" />
            
            <div className="flex min-h-screen">
                {/* Left Side - Dark Background */}
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
                        {/* Already have an account link */}
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
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@email.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Create a password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showPasswordConfirmation ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm your Password"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="+63 912 345 6789"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                    required
                                />
                                <InputError message={errors.phone_number} className="mt-2" />
                            </div>

                            {/* Municipality & Barangay Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">Municipality/Barangay</h3>
                                
                                {/* Municipality Dropdown */}
                                <div>
                                    <select
                                        value={data.municipality_id} // Binds the Selected Municipality ID to the Form's State Data
                                        onChange={(e) => handleMunicipalityChange(e.target.value)} // When Municipality is Selected, the Function is called with the Selected Municipality ID
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Municipality</option>
                                        {/* Iterates over the Municipalities List & Creates Option for Each */}
                                        {municipalities.map((municipality) => (
                                            <option key={municipality.id} value={municipality.id}>
                                                {municipality.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.municipality_id} className="mt-2" />
                                </div>

                                {/* Barangay Dropdown */}
                                <div>
                                    <select
                                        value={data.barangay_id} // Binds the Selected Barangay ID to the Form's State Data
                                        onChange={(e) => handleBarangayChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        required
                                        disabled={!data.municipality_id}
                                    >
                                        <option value="">Barangay</option>
                                        {/* Iterates over the Barangays List & Creates Option for Each */}
                                        {barangays.map((barangay) => (
                                            <option key={barangay.id} value={barangay.id}>
                                                {barangay.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.barangay_id} className="mt-2" />
                                </div>
                            </div>

                            {/* Geolocation Section */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Geolocation</h3>
                                <button
                                    type="button"
                                    onClick={openMapModal} // Calls the Modal Function
                                    disabled={!data.barangay_id}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Locate your Address
                                </button>
                                {data.latitude && data.longitude && (
                                    <p className="text-xs text-green-600 text-center font-medium">
                                        ✓ Location set successfully
                                    </p>
                                )}
                                <InputError message={errors.latitude || errors.longitude} className="mt-2" />
                            </div>

                            {/* Crops Selection */}
                            {crops.length > 0 && ( // If Crops List Options has More than 0 Item:
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Select Crops <span className="text-gray-500">- {data.crops.length}/3 selected</span>
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                                        {crops.map((crop) => (
                                            <label
                                                key={crop.id}
                                                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                                    data.crops.includes(crop.id)
                                                        ? 'bg-green-100 border-2 border-green-600'
                                                        : 'bg-gray-50 border border-gray-300 hover:bg-gray-100'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.crops.includes(crop.id)}
                                                    onChange={() => handleCropToggle(crop.id)} // Calls the Function which either Adds / Removes the Crop from the Array    
                                                    className="mr-2"
                                                    disabled={!data.crops.includes(crop.id) && data.crops.length >= 3}
                                                />
                                                <span className="text-sm">{crop.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.crops} className="mt-2" />
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            <Modal show={isMapOpen} onClose={() => setIsMapOpen(false)} maxWidth="2xl">
                <div className="bg-white rounded-lg p-6">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">Locate your Farm!</h3>
                        <p className="text-sm text-gray-600">
                            {municipalityName}{barangayName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Click on the map to set your exact farm location</p>
                    </div>
                    <div className="w-full h-96 rounded-md overflow-hidden border">
                        <MapContainer 
                            center={[parseFloat(tempLat), parseFloat(tempLng)]} // Initially Centers on the Coordinates
                            zoom={mapZoom} 
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer // Renders the Base Map Images(Tiles)
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <RecenterMap lat={parseFloat(tempLat)} lng={parseFloat(tempLng)} zoom={mapZoom} />
                            <ClickCapture onLocationSelect={handleMapClick} />
                            {(tempLat && tempLng) && (
                                <Marker position={[parseFloat(tempLat), parseFloat(tempLng)]} />
                            )}
                        </MapContainer>
                    </div>
                    {tempLat && tempLng && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Selected: {parseFloat(tempLat).toFixed(6)}, {parseFloat(tempLng).toFixed(6)}
                        </p>
                    )}
                    <div className="mt-4 flex gap-2">
                        <button 
                            onClick={() => setIsMapOpen(false)} 
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmLocation} 
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
                        >
                            Confirm Location
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Pending Account Modal */}
            {showPendingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Account Pending Approval
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Your farmer account has been submitted and is awaiting administrator approval.
                        </p>
                        <button
                            onClick={handlePendingModalClose}
                            className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}