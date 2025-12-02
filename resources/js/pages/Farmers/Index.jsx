import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import AppLayout from '@/Layouts/AppLayout';
import FarmerSidebar from '@/Components/FarmerSidebar';
import AdminSidebar from '@/Components/AdminSidebar';
import '../../utils/leafletSetup';

function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

export default function Index({ farmers, municipalities, barangays: initialBarangays, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user?.isAdmin;
    const isApprovedFarmer = auth.user && !auth.user.isAdmin && auth.user.isApproved;

    const [selectedMunicipality, setSelectedMunicipality] = useState(filters.municipality_id || '');
    const [selectedBarangay, setSelectedBarangay] = useState(filters.barangay_id || '');
    const [barangays, setBarangays] = useState(initialBarangays || []);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Update barangays from props when they change
    useEffect(() => {
        setBarangays(initialBarangays || []);
    }, [initialBarangays]);

    const handleMunicipalityChange = (municipalityId) => {
        setSelectedMunicipality(municipalityId);
        setSelectedBarangay('');
        
        const params = {};
        if (municipalityId) params.municipality_id = municipalityId;
        
        router.get(route('farmers.index'), params, {
            preserveState: false,
            replace: true,
        });
    };

    const handleBarangayChange = (barangayId) => {
        setSelectedBarangay(barangayId);
        
        const params = {};
        if (selectedMunicipality) params.municipality_id = selectedMunicipality;
        if (barangayId) params.barangay_id = barangayId;
        
        router.get(route('farmers.index'), params, {
            preserveState: false,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSelectedMunicipality('');
        setSelectedBarangay('');
        
        router.get(route('farmers.index'), {}, {
            preserveState: false,
            replace: true,
        });
    };

    // Calculate map center and zoom based on filters and farmers
    const getMapCenterAndZoom = () => {
        if (farmers.length === 0) {
            // No farmers - show Benguet Province overview
            return { center: [16.4, 120.6], zoom: 10 };
        }

        // Calculate center from available farmers
        const avgLat = farmers.reduce((sum, f) => sum + parseFloat(f.latitude), 0) / farmers.length;
        const avgLng = farmers.reduce((sum, f) => sum + parseFloat(f.longitude), 0) / farmers.length;
        
        // Determine zoom based on filter level
        let zoom = 10;
        if (selectedBarangay) zoom = 13;
        else if (selectedMunicipality) zoom = 11;
        
        return { center: [avgLat, avgLng], zoom };
    };

    const { center, zoom } = getMapCenterAndZoom();

    const handleMarkerClick = async (farmerId) => {
        try {
            const response = await fetch(route('api.farmers.show', farmerId));
            const farmerData = await response.json();
            setSelectedFarmer(farmerData);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error('Error fetching farmer details:', error);
        }
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedFarmer(null);
    };

    // Determine which sidebar to show
    const rightSidebar = isAdmin ? (
        <AdminSidebar />
    ) : isApprovedFarmer ? (
        <FarmerSidebar />
    ) : null;

    return (
        <AppLayout rightSidebar={rightSidebar}>
            <Head title="Farmers" />

            <div className="flex">
                {/* Left Sidebar - Address Filters */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Address</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Municipality
                            </label>
                            <select
                                value={selectedMunicipality}
                                onChange={(e) => handleMunicipalityChange(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                            >
                                <option value="">All Municipalities</option>
                                {municipalities.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Barangay
                            </label>
                            <select
                                value={selectedBarangay}
                                onChange={(e) => handleBarangayChange(e.target.value)}
                                disabled={!selectedMunicipality || barangays.length === 0}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
                            >
                                <option value="">All Barangays</option>
                                {barangays.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        {(selectedMunicipality || selectedBarangay) && (
                            <button
                                onClick={handleClearFilters}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content - Map */}
                <div className="flex-1">
                    <div className="h-screen">
                        <MapContainer
                            center={center}
                            zoom={zoom}
                            style={{ height: '100%', width: '100%' }}
                            key={`${center[0]}-${center[1]}-${zoom}-${farmers.length}`}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapUpdater center={center} zoom={zoom} />
                            
                            {farmers.map(farmer => (
                                <Marker
                                    key={farmer.id}
                                    position={[parseFloat(farmer.latitude), parseFloat(farmer.longitude)]}
                                    eventHandlers={{
                                        click: () => handleMarkerClick(farmer.id)
                                    }}
                                >
                                    <Popup>
                                        <div className="text-center min-w-[150px]">
                                            <strong className="text-base">{farmer.user.name}</strong>
                                            <div className="flex gap-1 mt-2 justify-center flex-wrap">
                                                {farmer.crops.slice(0, 3).map(crop => (
                                                    <div 
                                                        key={crop.id} 
                                                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                                        title={crop.name}
                                                    >
                                                        {crop.name.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleMarkerClick(farmer.id);
                                                }}
                                                className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                                            >
                                                View Details →
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Overlay message if no farmers */}
                        {farmers.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
                                <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
                                    <p className="text-gray-600 text-lg">No farmers found in this area.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Farmer Detail Modal */}
            {isDetailModalOpen && selectedFarmer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Farmer Details</h3>
                            <button
                                onClick={closeDetailModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Name</label>
                                <p className="text-gray-800 font-medium">{selectedFarmer.user.name}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-gray-800">{selectedFarmer.phone_number}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Address</label>
                                <p className="text-gray-800">
                                    {selectedFarmer.barangay.name}, {selectedFarmer.municipality.name}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-2 block">Crops</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFarmer.crops.map(crop => (
                                        <span 
                                            key={crop.id} 
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                        >
                                            {crop.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={closeDetailModal}
                            className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}