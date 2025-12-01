import AuthenticatedLayout from '@/Layouts/BaseLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../../../utils/leafletSetup';

// Use State Hook
export default function Index({ approvedFarmers, pendingFarmers, municipalities, filters }) {
    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');
    const [selectedSitio, setSelectedSitio] = useState(filters.sitio_id || '');
    const [barangays, setBarangays] = useState([]);
    const [sitios, setSitios] = useState([]);
    const [isPendingSidebarOpen, setIsPendingSidebarOpen] = useState(false);
    const [viewLocationFarmer, setViewLocationFarmer] = useState(null);
    const [viewDetailFarmer, setViewDetailFarmer] = useState(null);

// --------------------------------------------------------
// For Fetching Address (Municipality, Barangay, Sitio)
// --------------------------------------------------------
    useEffect(() => {
        if (selectedMunicipality) {
            fetch(route('admin.api.barangays', { municipality_id: selectedMunicipality }))
                .then(res => res.json())
                .then(data => setBarangays(data));
        } else {
            setBarangays([]);
            setSelectedBarangay('');
        }
    }, [selectedMunicipality]);
    useEffect(() => {
        if (selectedBarangay) {
            fetch(route('admin.api.sitios', { barangay_id: selectedBarangay }))
                .then(res => res.json())
                .then(data => setSitios(data));
        } else {
            setSitios([]);
            setSelectedSitio('');
        }
    }, [selectedBarangay]);

    // Auto-submit filters on change
    useEffect(() => {
        const params = {};
        if (selectedMunicipality) params.municipality_id = selectedMunicipality;
        if (selectedBarangay) params.barangay_id = selectedBarangay;
        if (selectedSitio) params.sitio_id = selectedSitio;

        router.get(route('admin.farmers.index'), params, {
            preserveState: true,
            replace: true,
        });
    }, [selectedMunicipality, selectedBarangay, selectedSitio]);

    // Calculate map center and zoom based on filters
    const getMapCenterAndZoom = () => {
        if (approvedFarmers.length === 0) {
            return { center: [16.4, 120.6], zoom: 10 };
        }

        if (selectedSitio || selectedBarangay || selectedMunicipality) {
            const filtered = approvedFarmers;
            const avgLat = filtered.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / filtered.length;
            const avgLng = filtered.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / filtered.length;
            return { center: [avgLat, avgLng], zoom: 13 };
        }

        return { center: [16.4, 120.6], zoom: 10 };
    };

    const { center, zoom } = getMapCenterAndZoom();

// --------------------------------------------------------
// For Pending Farmers
// --------------------------------------------------------
    const handleApprove = (userId) => {
        if (confirm('Approve this farmer account?')) {
            router.post(route('admin.farmers.approve', userId));
        }
    };

    const handleReject = (userId) => {
        if (confirm('Reject and permanently delete this farmer account? This cannot be undone.')) {
            router.post(route('admin.farmers.reject', userId));
        }
    };

    const handleViewLocation = (farmer) => {
        setViewLocationFarmer(farmer);
    };

    const handleMarkerClick = (farmer) => {
        setViewDetailFarmer(farmer);
    };

// --------------------------------------------------------
// React Frontend
// --------------------------------------------------------
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manage Farmers
                    </h2>
                    <button
                        onClick={() => setIsPendingSidebarOpen(!isPendingSidebarOpen)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        Pending Accounts ({pendingFarmers.length})
                    </button>
                </div>
            }
        >
            <Head title="Manage Farmers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex">
                            {/* Left Sidebar - Filters */}
                            <div className="w-64 p-6 border-r border-gray-200 bg-green-50">
                                <h3 className="text-lg font-semibold mb-4">Address</h3>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Municipality
                                    </label>
                                    <select
                                        value={selectedMunicipality}
                                        onChange={(e) => setSelectedMunicipality(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="">All Municipalities</option>
                                        {municipalities.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Barangay
                                    </label>
                                    <select
                                        value={selectedBarangay}
                                        onChange={(e) => setSelectedBarangay(e.target.value)}
                                        disabled={!selectedMunicipality}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
                                    >
                                        <option value="">All Barangays</option>
                                        {barangays.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sitio
                                    </label>
                                    <select
                                        value={selectedSitio}
                                        onChange={(e) => setSelectedSitio(e.target.value)}
                                        disabled={!selectedBarangay}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
                                    >
                                        <option value="">All Sitios</option>
                                        {sitios.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Main Map Area */}
                            <div className="flex-1 h-[600px]">
                                <MapContainer
                                    center={center}
                                    zoom={zoom}
                                    style={{ height: '100%', width: '100%' }}
                                    key={`${center[0]}-${center[1]}-${zoom}`}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {approvedFarmers.map(farmer => (
                                        <Marker
                                            key={farmer.id}
                                            position={[parseFloat(farmer.latitude), parseFloat(farmer.longitude)]}
                                            eventHandlers={{
                                                click: () => handleMarkerClick(farmer)
                                            }}
                                        >
                                            <Popup>
                                                <div className="text-center">
                                                    <strong>{farmer.user.name}</strong>
                                                    <div className="flex gap-1 mt-2 justify-center">
                                                        {farmer.crops.slice(0, 3).map(crop => (
                                                            <div key={crop.id} className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                                                                {crop.name.charAt(0)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Pending Farmers */}
            {isPendingSidebarOpen && (
                <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Pending Accounts</h3>
                            <button
                                onClick={() => setIsPendingSidebarOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {pendingFarmers.length === 0 ? (
                            <p className="text-gray-500 text-center">No pending farmers</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingFarmers.map(farmer => (
                                    <div key={farmer.id} className="bg-gray-100 p-4 rounded-lg">
                                        <div className="font-semibold">{farmer.user.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {farmer.municipality.name}, {farmer.barangay.name}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleViewLocation(farmer)}
                                                className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                            >
                                                View Location
                                            </button>
                                            <button
                                                onClick={() => handleApprove(farmer.user.id)}
                                                className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(farmer.user.id)}
                                                className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* View Location Modal (Pending Farmer) */}
            {viewLocationFarmer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{viewLocationFarmer.user.name}'s Location</h3>
                            <button
                                onClick={() => setViewLocationFarmer(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="h-96">
                            <MapContainer
                                center={[parseFloat(viewLocationFarmer.latitude), parseFloat(viewLocationFarmer.longitude)]}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[parseFloat(viewLocationFarmer.latitude), parseFloat(viewLocationFarmer.longitude)]}>
                                    <Popup>{viewLocationFarmer.user.name}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* View Detail Modal (Approved Farmer) */}
            {viewDetailFarmer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Farmer Details</h3>
                            <button
                                onClick={() => setViewDetailFarmer(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Name</label>
                                <p className="text-gray-800">{viewDetailFarmer.user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-gray-800">{viewDetailFarmer.phone_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Address</label>
                                <p className="text-gray-800">
                                    {viewDetailFarmer.sitio.name}, {viewDetailFarmer.barangay.name}, {viewDetailFarmer.municipality.name}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Crops</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {viewDetailFarmer.crops.map(crop => (
                                        <span key={crop.id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {crop.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}