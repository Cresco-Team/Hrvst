import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@/utils/leafletSetup';

function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        // Only recenter when both coordinates are valid finite numbers
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            map.setView([lat, lng], 14, { animate: true });
        }
    }, [lat, lng, map]);
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
    const [barangays, setBarangays] = useState([]);
    
    const [locating, setLocating] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [tempLat, setTempLat] = useState(null);
    const [tempLng, setTempLng] = useState(null);
    const [municipalityName, setMunicipalityName] = useState('');
    const [barangayName, setBarangayName] = useState('');

    const handleMunicipalityChange = async (municipalityId) => {
        setData({ ...data, municipality_id: municipalityId, barangay_id: '' });
        setBarangays([]);
        if (!municipalityId) return;
        
        try {
            const response = await fetch(`/api/barangays?municipality_id=${municipalityId}`);
            const result = await response.json();
            setBarangays(result);

            const m = municipalities.find(m => String(m.id) === String(municipalityId));
            setMunicipalityName(m ? m.name : '');

            if (m?.latitude && m?.longitude) {
                setTempLat(m.latitude);
                setTempLng(m.longitude);
            }
        } catch (error) {
            console.error('Error fetching barangays:', error);
        }
    };

    const handleBarangayChange = (barangayId) => {
        setData({ ...data, barangay_id: barangayId });

        const b = barangays.find(b => String(b.id) === String(barangayId));
        setBarangayName(b ? b.name : '');
    };

    const handleCropToggle = (cropId) => {
        const currentCrops = data.crops;
        if (currentCrops.includes(cropId)) {
            setData('crops', currentCrops.filter(id => id !== cropId));
        } else if (currentCrops.length < 5) {
            setData('crops', [...currentCrops, cropId]);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const openMapModal = () => {
        // Prefer explicit user-selected coordinates, then temp values, then municipality coords, then defaults
        let lat = data.latitude || null;
        let lng = data.longitude || null;

        if (!lat || !lng) {
            if (tempLat && tempLng) {
                lat = tempLat;
                lng = tempLng;
            } else if (data.municipality_id) {
                const m = municipalities.find((mm) => String(mm.id) === String(data.municipality_id));
                lat = m?.latitude ?? '16.4';
                lng = m?.longitude ?? '120.6';
            } else {
                lat = '16.4';
                lng = '120.6';
            }
        }

        setTempLat(String(lat));
        setTempLng(String(lng));
        setIsMapOpen(true);
    };

    const confirmLocation = () => {
        if (tempLat && tempLng) {
            setData('latitude', String(tempLat));
            setData('longitude', String(tempLng));
        }
        setIsMapOpen(false);
    };

    function ClickCapture() {
        useMapEvents({
            click(e) {
                setTempLat(e.latlng.lat.toFixed(6));
                setTempLng(e.latlng.lng.toFixed(6));
            },
        });
        return null;
    }

    return (
        <>
            <Head title="Register" />
            
            <div className="flex min-h-screen">
                {/* Left Side - Dark Background */}
                <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center p-12">
                    <div className="max-w-md text-center">
                        <div className="flex justify-center mb-8">
                            <img src="/logo.png" alt="Hrvst Logo" className="w-24 h-24" />
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

                            {/* Municipality/Barangay Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900">Municipality/Barangay</h3>
                                
                                {/* Municipality */}
                                <div>
                                    <select
                                        value={data.municipality_id}
                                        onChange={(e) => handleMunicipalityChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Municipality</option>
                                        {municipalities.map((municipality) => (
                                            <option key={municipality.id} value={municipality.id}>
                                                {municipality.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.municipality_id} className="mt-2" />
                                </div>

                                {/* Barangay */}
                                <div>
                                    <select
                                        value={data.barangay_id}
                                        onChange={(e) => handleBarangayChange(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white"
                                        required
                                        disabled={!data.municipality_id}
                                    >
                                        <option value="">Barangay</option>
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
                                    onClick={openMapModal}
                                    disabled={locating}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {locating ? 'Locating...' : 'Locate your Address'}
                                </button>
                                {data.latitude && data.longitude && (
                                    <p className="text-xs text-gray-500 text-center">
                                        Location: {parseFloat(data.latitude).toFixed(6)}, {parseFloat(data.longitude).toFixed(6)}
                                    </p>
                                )}
                                <InputError message={errors.latitude || errors.longitude} className="mt-2" />
                            </div>

                            {/* Crops Selection */}
                            {crops.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Select Crops (1-5) <span className="text-gray-500">- {data.crops.length} selected</span>
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
                                                    onChange={() => handleCropToggle(crop.id)}
                                                    className="mr-2"
                                                    disabled={!data.crops.includes(crop.id) && data.crops.length >= 5}
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

                            {/* Terms and Privacy */}
                            {/* <div className="flex items-start gap-2 pt-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 rounded border-gray-300"
                                />

                                
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I've read and agree with the{' '}
                                    <a href="#" className="text-gray-900 font-medium hover:underline">
                                        Terms and Conditions
                                    </a>
                                    {' '}and the{' '}
                                    <a href="#" className="text-gray-900 font-medium hover:underline">
                                        Privacy Policy
                                    </a>
                                    .
                                </label>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>
            <Modal show={isMapOpen} onClose={() => setIsMapOpen(false)} maxWidth="2xl">
                <div className="bg-white rounded-lg p-6">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">Locate your Farm!</h3>
                        <p className="text-sm text-gray-600">{municipalityName || 'Municipality'}, {barangayName || 'Barangay'}</p>
                    </div>
                    <div className="w-full h-72 rounded-md overflow-hidden border">
                        <MapContainer 
                            center={[parseFloat(tempLat || '16.4'), parseFloat(tempLng || '120.6')]} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <RecenterMap lat={parseFloat(tempLat)} lng={parseFloat(tempLng)} />
                            <ClickCapture />
                            {(tempLat && tempLng) && (
                                <Marker position={[parseFloat(tempLat), parseFloat(tempLng)]} />
                            )}
                        </MapContainer>
                    </div>
                    <div className="mt-4">
                        <button onClick={confirmLocation} className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">Confirm</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}